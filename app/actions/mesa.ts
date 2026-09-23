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

export interface DashboardMesaItem {
  id: string;
  title: string;
  book_title: string;
  book_author: string;
  book_cover_url?: string | null;
  members_count: number;
  current_page: number;
  total_pages?: number;
  target_milestone?: string;
  is_member?: boolean;
}

/**
 * Busca mesas reais para o dashboard:
 * - myMesas: mesas em que o usuário participa ou criou
 * - publicMesas: mesas públicas da comunidade para explorar e ingressar
 */
export async function getDashboardMesas(): Promise<{
  myMesas: DashboardMesaItem[];
  publicMesas: DashboardMesaItem[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { myMesas: [], publicMesas: [] };
  }

  // 1. Mesas em que o leitor é membro
  const { data: memberRows } = await supabase
    .from("group_members")
    .select(`
      group_id,
      reading_groups (
        id,
        title,
        book_title,
        book_author,
        book_cover_url,
        is_private
      )
    `)
    .eq("user_id", user.id);

  const myGroupIds = (memberRows || [])
    .map((r: any) => r.reading_groups?.id)
    .filter(Boolean);

  // Progresso do leitor nessas mesas
  const { data: myProgress } = await supabase
    .from("user_progress")
    .select("group_id, current_page, current_chapter")
    .eq("user_id", user.id);

  const progressMap = new Map((myProgress || []).map((p) => [p.group_id, p]));

  // Contagem de membros por grupo
  const { data: allMembers } = await supabase
    .from("group_members")
    .select("group_id");

  const memberCounts = new Map<string, number>();
  (allMembers || []).forEach((m) => {
    memberCounts.set(m.group_id, (memberCounts.get(m.group_id) || 0) + 1);
  });

  // Metas mais próximas
  const { data: milestones } = await supabase
    .from("milestones")
    .select("group_id, title, target_chapter, target_page, due_date")
    .order("due_date", { ascending: true });

  const nextMilestoneMap = new Map<string, string>();
  (milestones || []).forEach((m) => {
    if (!nextMilestoneMap.has(m.group_id)) {
      const parts = [];
      if (m.target_chapter) parts.push(`Cap. ${m.target_chapter}`);
      if (m.target_page) parts.push(`Até Pág. ${m.target_page}`);
      nextMilestoneMap.set(
        m.group_id,
        parts.join(" · ") || m.title || "Meta definida"
      );
    }
  });

  const myMesas: DashboardMesaItem[] = (memberRows || [])
    .filter((r: any) => r.reading_groups)
    .map((r: any) => {
      const rg = r.reading_groups;
      const prog = progressMap.get(rg.id);
      return {
        id: rg.id,
        title: rg.title,
        book_title: rg.book_title,
        book_author: rg.book_author,
        book_cover_url: rg.book_cover_url,
        members_count: memberCounts.get(rg.id) || 1,
        current_page: prog?.current_page || 0,
        total_pages: 0,
        target_milestone: nextMilestoneMap.get(rg.id),
        is_member: true,
      };
    });

  // 2. Mesas públicas abertas da comunidade
  const { data: publicGroups } = await supabase
    .from("reading_groups")
    .select("*")
    .eq("is_private", false)
    .order("created_at", { ascending: false })
    .limit(30);

  const publicMesas: DashboardMesaItem[] = (publicGroups || []).map((rg) => ({
    id: rg.id,
    title: rg.title,
    book_title: rg.book_title,
    book_author: rg.book_author,
    book_cover_url: rg.book_cover_url,
    members_count: memberCounts.get(rg.id) || 1,
    current_page: progressMap.get(rg.id)?.current_page || 0,
    total_pages: 0,
    target_milestone: nextMilestoneMap.get(rg.id),
    is_member: myGroupIds.includes(rg.id),
  }));

  return { myMesas, publicMesas };
}

export interface UpdateMesaInput {
  title?: string;
  book_title?: string;
  book_author?: string;
  book_cover_url?: string | null;
  is_private?: boolean;
}

/**
 * Atualiza os dados ou capa de uma Mesa de Leitura (somente criador ou admin)
 */
export async function updateMesa(
  groupId: string,
  input: UpdateMesaInput
) {
  if (!groupId) throw new Error("ID da mesa inválido.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado para editar uma mesa.");
  }

  // Verifica permissão (criador ou admin da mesa)
  const { data: mesa } = await supabase
    .from("reading_groups")
    .select("created_by")
    .eq("id", groupId)
    .single();

  const { data: memberRole } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  const isCreator = mesa?.created_by === user.id;
  const isAdmin = memberRole?.role === "admin";

  if (!isCreator && !isAdmin) {
    throw new Error(
      "Apenas o criador ou administrador da mesa pode editá-la."
    );
  }

  const updates: {
    title?: string;
    book_title?: string;
    book_author?: string;
    book_cover_url?: string | null;
    is_private?: boolean;
  } = {};
  if (input.title) updates.title = input.title.trim();
  if (input.book_title) updates.book_title = input.book_title.trim();
  if (input.book_author) updates.book_author = input.book_author.trim();
  if (input.book_cover_url !== undefined)
    updates.book_cover_url = input.book_cover_url?.trim() || null;
  if (input.is_private !== undefined) updates.is_private = input.is_private;

  const { error } = await supabase
    .from("reading_groups")
    .update(updates)
    .eq("id", groupId);

  if (error) {
    throw new Error(`Erro ao atualizar mesa: ${error.message}`);
  }

  revalidatePath(`/mesa/${groupId}`);
  revalidatePath("/dashboard");
}
