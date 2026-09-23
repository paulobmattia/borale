"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string | null;
  success?: boolean;
}

/**
 * Autentica o usuário com email e senha
 */
export async function signIn(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Informe e-mail e senha para entrar." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo);
}

/**
 * Cadastra um novo leitor com metadados para criação automática de perfil
 */
export async function signUp(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !email || !password) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  if (password.length < 6) {
    return { error: "A senha deve conter no mínimo 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        user_name: username.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase(),
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

/**
 * Encerra a sessão do leitor
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Inicia o fluxo de autenticação com o Google OAuth 2.0
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}
