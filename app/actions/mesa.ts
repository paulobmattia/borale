"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateMesaInput {
  title: string;
  book_title: string;
  book_author: string;
  book_cover_url?: string;
  is_private?: boolean;
}

/**
 * Cria uma nova Mesa de Leitura com validação rigorosa de dados
 */
export async function createMesa(input: CreateMesaInput) {
  const title = input.title?.trim();
  const bookTitle = input.book_title?.trim();
  const bookAuthor = input.book_author?.trim();

  if (!title || title.length < 2 || title.length > 120) {
    throw new Error("O nome da mesa deve ter entre 2 e 120 caracteres.");
  }

  if (!bookTitle || bookTitle.length < 1 || bookTitle.length > 200) {
    throw new Error("O título do livro é obrigatório (máximo 200 caracteres).");
  }

  if (!bookAuthor || bookAuthor.length < 1 || bookAuthor.length > 150) {
    throw new Error("O autor do livro é obrigatório (máximo 150 caracteres).");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado para criar uma mesa.");
  }

  const { data, error } = await supabase
    .from("reading_groups")
    .insert({
      title,
      book_title: bookTitle,
      book_author: bookAuthor,
      book_cover_url: input.book_cover_url?.trim() || null,
      is_private: input.is_private || false,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Erro ao criar mesa: ${error.message}`);
  }

  revalidatePath("/dashboard");
  return data;
}

/**
 * Entra como membro em uma Mesa de Leitura pública
 */
export async function joinMesa(groupId: string) {
  if (!groupId) {
    throw new Error("Identificador da mesa inválido.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado para entrar em uma mesa.");
  }

  // 1. Vincula o usuário como membro
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: user.id,
    role: "member",
  });

  if (memberError && !memberError.message.includes("duplicate key")) {
    throw new Error(`Erro ao entrar na mesa: ${memberError.message}`);
  }

  // 2. Inicializa o progresso de leitura
  await supabase.from("user_progress").upsert({
    group_id: groupId,
    user_id: user.id,
    current_page: 0,
    current_chapter: 0,
  });

  revalidatePath(`/mesa/${groupId}`);
  revalidatePath("/dashboard");
}

/**
 * Atualiza o progresso individual de leitura do usuário na mesa
 */
export async function updateReadingProgress(
  groupId: string,
  currentPage: number,
  currentChapter: number
) {
  if (!groupId) {
    throw new Error("Identificador da mesa inválido.");
  }

  if (isNaN(currentPage) || currentPage < 0) {
    throw new Error("Página atual inválida.");
  }

  if (isNaN(currentChapter) || currentChapter < 0) {
    throw new Error("Capítulo atual inválido.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado para atualizar o progresso.");
  }

  const { error } = await supabase.from("user_progress").upsert(
    {
      group_id: groupId,
      user_id: user.id,
      current_page: Math.floor(currentPage),
      current_chapter: Math.floor(currentChapter),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "group_id,user_id" }
  );

  if (error) {
    throw new Error(`Erro ao salvar progresso: ${error.message}`);
  }

  revalidatePath(`/mesa/${groupId}`);
  revalidatePath("/dashboard");
}

/**
 * Recupera os detalhes da mesa, membros, metas e progresso atual
 */
export async function getMesaDetails(groupId: string) {
  if (!groupId) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Busca dados da mesa
  const { data: mesa, error: mesaError } = await supabase
    .from("reading_groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (mesaError || !mesa) {
    return null;
  }

  // 2. Busca membros e seus perfis com progresso
  const { data: members } = await supabase
    .from("group_members")
    .select(`
      group_id,
      user_id,
      role,
      joined_at,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("group_id", groupId);

  // 3. Busca progresso dos membros
  const { data: progressList } = await supabase
    .from("user_progress")
    .select("user_id, current_page, current_chapter")
    .eq("group_id", groupId);

  const progressMap = new Map(
    (progressList || []).map((p) => [p.user_id, p])
  );

  // 4. Busca metas da mesa
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("group_id", groupId)
    .order("due_date", { ascending: true });

  // 5. Progresso do usuário logado
  const currentUserProgress = user ? progressMap.get(user.id) || null : null;

  return {
    mesa,
    members: (members || []).map((m: any) => ({
      id: m.user_id,
      username: m.profiles?.username || "leitor",
      display_name: m.profiles?.display_name || "Leitor",
      avatar_url: m.profiles?.avatar_url,
      role: m.role,
      joined_at: m.joined_at,
      current_page: progressMap.get(m.user_id)?.current_page ?? 0,
      current_chapter: progressMap.get(m.user_id)?.current_chapter ?? 0,
    })),
    milestones: milestones || [],
    currentUserProgress,
    currentUserId: user?.id || null,
  };
}
