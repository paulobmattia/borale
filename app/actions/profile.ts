"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  favoriteGenres?: string[];
  avatarUrl?: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover_url?: string | null;
  status: "reading" | "completed" | "want_to_read";
  current_page?: number;
  total_pages?: number;
  mesa_id?: string;
}

/**
 * Busca perfil do leitor por username (ou perfil do usuário autenticado se username === "me")
 * com cálculo de estatísticas e estante de livros reais da base de dados.
 */
export async function getProfile(username: string) {
  if (!username) return null;

  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  let profile = null;
  let isCurrentUser = false;

  if (username === "me") {
    if (!currentUser) return null;
    isCurrentUser = true;

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (existingProfile) {
      profile = existingProfile;
    } else {
      // Fallback: criar perfil se ainda não existir
      const rawMeta = currentUser.user_metadata || {};
      const emailPrefix = currentUser.email
        ? currentUser.email.split("@")[0]
        : `leitor_${currentUser.id.slice(0, 6)}`;
      const baseUsername = (rawMeta.username || emailPrefix)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
      const cleanUsername =
        baseUsername.length >= 3 ? baseUsername : `leitor_${currentUser.id.slice(0, 6)}`;
      const displayName =
        rawMeta.full_name || rawMeta.name || emailPrefix || "Leitor Boralê";
      const avatarUrl = rawMeta.avatar_url || rawMeta.picture || null;

      const { data: newProfile } = await supabase
        .from("profiles")
        .upsert(
          {
            id: currentUser.id,
            username: cleanUsername,
            display_name: displayName,
            avatar_url: avatarUrl,
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      profile = newProfile;
    }
  } else {
    const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    const { data: foundProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", cleanUsername)
      .single();

    profile = foundProfile;
    isCurrentUser = !!currentUser && currentUser.id === profile?.id;
  }

  if (!profile) {
    return null;
  }

  // 1. Grupos de leitura reais em que o usuário ingressou
  const { data: memberGroups } = await supabase
    .from("group_members")
    .select(`
      group_id,
      reading_groups (
        id,
        title,
        book_title,
        book_author,
        book_cover_url
      )
    `)
    .eq("user_id", profile.id);

  // 2. Progresso de leitura em cada mesa
  const { data: progressList } = await supabase
    .from("user_progress")
    .select("group_id, current_page, current_chapter")
    .eq("user_id", profile.id);

  // 3. Contagem de notas publicadas
  const { count: totalNotes } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  // Calcular soma de páginas lidas
  const pagesRead = (progressList || []).reduce(
    (acc, curr) => acc + (curr.current_page || 0),
    0
  );

  // Construir a estante de livros reais
  const books: BookItem[] = (memberGroups || [])
    .filter((mg: any) => mg.reading_groups)
    .map((mg: any) => {
      const rg = mg.reading_groups;
      const prog = progressList?.find((p) => p.group_id === rg.id);
      return {
        id: rg.id,
        title: rg.book_title || "Sem título",
        author: rg.book_author || "Autor desconhecido",
        cover_url: rg.book_cover_url || null,
        status: "reading" as const,
        current_page: prog?.current_page || 0,
        mesa_id: rg.id,
      };
    });

  return {
    profile,
    isCurrentUser,
    books,
    stats: {
      activeGroups: memberGroups?.length || 0,
      completedBooks: 0,
      totalNotes: totalNotes || 0,
      pagesRead,
    },
  };
}

/**
 * Atualiza os dados do perfil do usuário autenticado com validação
 */
export async function updateProfile(input: UpdateProfileInput) {
  const displayName = input.displayName?.trim();
  const bio = input.bio?.trim();

  if (!displayName || displayName.length < 1 || displayName.length > 80) {
    throw new Error("O nome de exibição deve ter entre 1 e 80 caracteres.");
  }

  if (bio && bio.length > 500) {
    throw new Error("A biografia deve ter no máximo 500 caracteres.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado para atualizar o perfil.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio: bio || null,
      favorite_genres: input.favoriteGenres || [],
      avatar_url: input.avatarUrl !== undefined ? input.avatarUrl : null,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Erro ao atualizar perfil: ${error.message}`);
  }

  revalidatePath("/perfil/me");
  revalidatePath("/dashboard");
}
