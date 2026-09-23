import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Assegura que o perfil do usuário existe (fallback seguro)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) {
          const rawMeta = user.user_metadata || {};
          const emailPrefix = user.email ? user.email.split("@")[0] : `leitor_${user.id.slice(0, 6)}`;
          const baseUsername = (rawMeta.username || emailPrefix)
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "");
          const username = baseUsername.length >= 3 ? baseUsername : `leitor_${user.id.slice(0, 6)}`;
          const displayName = rawMeta.full_name || rawMeta.name || emailPrefix || "Leitor Boralê";
          const avatarUrl = rawMeta.avatar_url || rawMeta.picture || null;

          await supabase.from("profiles").upsert(
            {
              id: user.id,
              username,
              display_name: displayName,
              avatar_url: avatarUrl,
            },
            { onConflict: "id" }
          );
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Redireciona para página de erro de autenticação caso o código falhe
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
