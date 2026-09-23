"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  favoriteGenres?: string[];
  avatarUrl?: string;
}

/**
 * Busca perfil do leitor por username com tratamento de erros
 */
export async function getProfile(username: string) {
  if (!username) return null;

  const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", cleanUsername)
    .single();

  if (error || !profile) {
    return null;
  }

  // Estatísticas agregadas do leitor
  const { count: activeGroups } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { count: totalNotes } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  return {
    profile,
    stats: {
      activeGroups: activeGroups || 0,
      completedBooks: 0,
      totalNotes: totalNotes || 0,
      pagesRead: 0,
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
      avatar_url: input.avatarUrl || null,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Erro ao atualizar perfil: ${error.message}`);
  }

  revalidatePath(`/perfil/${user.id}`);
}
