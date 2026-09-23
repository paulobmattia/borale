"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/types/database";

export interface AddCommentInput {
  groupId: string;
  content: string;
  parentId?: string | null;
  chapterRef?: number;
  pageRef?: number;
  hasSpoiler?: boolean;
}

const VALID_REACTIONS: ReactionType[] = [
  "LIKE",
  "AGREE",
  "INSIGHT",
  "MIND_BLOWN",
  "ANGRY",
  "LOVE",
];

/**
 * Adiciona uma nota na margem ou resposta com validação e proteção anti-spoiler
 */
export async function addComment(input: AddCommentInput) {
  const content = input.content?.trim();

  if (!input.groupId) {
    throw new Error("Mesa não informada.");
  }

  if (!content || content.length < 1) {
    throw new Error("O conteúdo não pode estar vazio.");
  }

  if (content.length > 5000) {
    throw new Error("O conteúdo deve ter no máximo 5000 caracteres.");
  }

  let chapterRef =
    input.chapterRef != null && !isNaN(input.chapterRef) && input.chapterRef >= 0
      ? Math.floor(input.chapterRef)
      : null;

  let pageRef =
    input.pageRef != null && !isNaN(input.pageRef) && input.pageRef >= 0
      ? Math.floor(input.pageRef)
      : null;

  const parentId = input.parentId || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar logado para publicar.");
  }

  // Se for uma resposta, herda o capítulo e página do comentário pai caso não informados
  if (parentId) {
    const { data: parentComment } = await supabase
      .from("comments")
      .select("id, chapter_ref, page_ref")
      .eq("id", parentId)
      .single();

    if (parentComment) {
      if (chapterRef === null) chapterRef = parentComment.chapter_ref;
      if (pageRef === null) pageRef = parentComment.page_ref;
    }
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      group_id: input.groupId,
      user_id: user.id,
      parent_id: parentId,
      content,
      chapter_ref: chapterRef,
      page_ref: pageRef,
      has_spoiler: Boolean(input.hasSpoiler),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Erro ao publicar nota/resposta: ${error.message}`);
  }

  revalidatePath(`/mesa/${input.groupId}`);
  return data;
}

/**
 * Alterna reação expressiva com validação do enum
 */
export async function toggleReaction(
  groupId: string,
  commentId: string,
  reactionType: ReactionType
) {
  if (!commentId || !groupId) {
    throw new Error("Dados de reação incompletos.");
  }

  if (!VALID_REACTIONS.includes(reactionType)) {
    throw new Error("Tipo de reação inválido.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar logado para reagir.");
  }

  // Verifica se já reagiu com este tipo
  const { data: existing } = await supabase
    .from("reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .eq("reaction_type", reactionType)
    .maybeSingle();

  if (existing) {
    // Remove reação
    await supabase.from("reactions").delete().eq("id", existing.id);
  } else {
    // Adiciona reação
    await supabase.from("reactions").insert({
      comment_id: commentId,
      user_id: user.id,
      reaction_type: reactionType,
    });
  }

  revalidatePath(`/mesa/${groupId}`);
}

/**
 * Busca todos os comentários da mesa agrupados com suas respectivas respostas em thread
 */
export async function getMesaComments(groupId: string) {
  if (!groupId) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Busca todos os comentários da mesa com perfis de autor
  const { data: comments, error } = await supabase
    .from("comments")
    .select(`
      id,
      group_id,
      user_id,
      parent_id,
      chapter_ref,
      page_ref,
      content,
      has_spoiler,
      created_at,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  if (error || !comments) {
    return [];
  }

  // 2. Busca reações de todos os comentários da mesa
  const commentIds = comments.map((c) => c.id);
  if (commentIds.length === 0) return [];

  const { data: reactions } = await supabase
    .from("reactions")
    .select("id, comment_id, user_id, reaction_type")
    .in("comment_id", commentIds);

  // 3. Agrupa as reações por comentário
  const reactionsByComment = new Map<string, any[]>();
  (reactions || []).forEach((r) => {
    const list = reactionsByComment.get(r.comment_id) || [];
    list.push(r);
    reactionsByComment.set(r.comment_id, list);
  });

  // 4. Mapeia cada comentário com seus dados e reações
  const allFormatted = comments.map((c: any) => {
    const commentReactions = reactionsByComment.get(c.id) || [];

    const countsMap = new Map<ReactionType, { count: number; userReacted: boolean }>();
    commentReactions.forEach((r) => {
      const current = countsMap.get(r.reaction_type) || { count: 0, userReacted: false };
      current.count += 1;
      if (user && r.user_id === user.id) {
        current.userReacted = true;
      }
      countsMap.set(r.reaction_type, current);
    });

    const reactionCounts = Array.from(countsMap.entries()).map(([type, val]) => ({
      type,
      count: val.count,
      userReacted: val.userReacted,
    }));

    return {
      id: c.id,
      parent_id: c.parent_id,
      user_id: c.user_id,
      author_name: c.profiles?.display_name || "Leitor",
      author_username: c.profiles?.username || "leitor",
      author_avatar: c.profiles?.avatar_url,
      chapter_ref: c.chapter_ref,
      page_ref: c.page_ref,
      content: c.content,
      has_spoiler: c.has_spoiler,
      created_at: c.created_at,
      reactions: reactionCounts,
    };
  });

  // 5. Agrupa em árvore: Comentários Raiz e Respostas Aninhadas
  const rootComments: any[] = [];
  const repliesByParent = new Map<string, any[]>();

  allFormatted.forEach((item) => {
    if (item.parent_id) {
      const list = repliesByParent.get(item.parent_id) || [];
      list.push(item);
      repliesByParent.set(item.parent_id, list);
    } else {
      rootComments.push(item);
    }
  });

  // Comentários raiz: mais recentes primeiro
  rootComments.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Anexa as respostas em ordem cronológica a cada comentário raiz
  return rootComments.map((root) => ({
    ...root,
    replies: repliesByParent.get(root.id) || [],
  }));
}
