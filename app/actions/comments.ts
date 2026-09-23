"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/types/database";

export interface AddCommentInput {
  groupId: string;
  content: string;
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
 * Adiciona uma nota na margem com validação e proteção anti-spoiler
 */
export async function addComment(input: AddCommentInput) {
  const content = input.content?.trim();

  if (!input.groupId) {
    throw new Error("Mesa não informada.");
  }

  if (!content || content.length < 1) {
    throw new Error("O conteúdo da nota não pode estar vazio.");
  }

  if (content.length > 5000) {
    throw new Error("A nota deve ter no máximo 5000 caracteres.");
  }

  const chapterRef =
    input.chapterRef != null && !isNaN(input.chapterRef) && input.chapterRef >= 0
      ? Math.floor(input.chapterRef)
      : null;

  const pageRef =
    input.pageRef != null && !isNaN(input.pageRef) && input.pageRef >= 0
      ? Math.floor(input.pageRef)
      : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar logado para publicar uma nota.");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      group_id: input.groupId,
      user_id: user.id,
      content,
      chapter_ref: chapterRef,
      page_ref: pageRef,
      has_spoiler: Boolean(input.hasSpoiler),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Erro ao publicar nota: ${error.message}`);
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
 * Busca todos os comentários da mesa com perfis e contadores de reações
 */
export async function getMesaComments(groupId: string) {
  if (!groupId) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Busca comentários e autor
  const { data: comments, error } = await supabase
    .from("comments")
    .select(`
      id,
      group_id,
      user_id,
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
    .order("created_at", { ascending: false });

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

  return comments.map((c: any) => {
    const commentReactions = reactionsByComment.get(c.id) || [];

    // Agrupa contadores de reações
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
}
