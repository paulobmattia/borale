# Guia de Configuração: Google OAuth 2.0 no Boralê

Este guia descreve o passo a passo exato para habilitar a autenticação com Google no Boralê via Supabase Auth.

---

## 1. Configuração no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto ou selecione um existente (ex: `borale-app`).
3. No menu lateral, acesse **APIs e Serviços > Tela de consentimento OAuth**:
   - Tipo de usuário: **Externo** (para qualquer leitor com conta Google).
   - Nome do app: `Boralê`.
   - E-mail de suporte ao usuário: seu e-mail.
   - E-mail de contato do desenvolvedor: seu e-mail.
   - Escopos necessários: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
4. No menu lateral, acesse **Credenciais > Criar Credenciais > ID do cliente OAuth**:
   - Tipo de aplicativo: **Aplicativo da Web**.
   - Nome: `Boralê Web Client`.
   - **Origens JavaScript autorizadas:**
     - `http://localhost:3000` (Ambiente local de desenvolvimento)
   - **URIs de redirecionamento autorizados:**
     - `https://fugrbgdykghkyswiwpir.supabase.co/auth/v1/callback`
5. Copie o **ID do cliente** e a **Chave secreta do cliente**.

---

## 2. Configuração no Painel do Supabase

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard/project/fugrbgdykghkyswiwpir).
2. No menu lateral esquerdo, vá em **Authentication > Providers**:
   - Localize o provedor **Google** e clique para expandir.
   - Ative a chave **Enable Google provider**.
   - No campo **Client ID (for OAuth)**: cole o ID do cliente copiado do Google.
   - No campo **Client Secret (for OAuth)**: cole a Chave secreta do cliente copiada do Google.
   - Clique em **Save**.
3. No menu **Authentication > URL Configuration**:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**:
     - `http://localhost:3000/**`

---

## 3. Variáveis de Ambiente Necessárias no Boralê

No seu arquivo `.env.local` na raiz do projeto:

```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fugrbgdykghkyswiwpir.supabase.co

# Chave anônima pública (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# URL base da sua aplicação (usada pelo signInWithGoogle para origin do callback)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 4. Como o Fluxo Funciona na Aplicação

1. O leitor clica no botão **"Continuar com Google"** em `/login` ou `/cadastro`.
2. A Server Action `signInWithGoogle` ([`app/actions/auth.ts`](file:///c:/Users/paulo/Documents/boral%C3%AA/app/actions/auth.ts)) invoca `supabase.auth.signInWithOAuth`.
3. O leitor faz login na tela segura do Google.
4. O Google redireciona para o endpoint de autenticação do Supabase (`/auth/v1/callback`).
5. O Supabase cria o usuário no `auth.users` e dispara a trigger automática `on_auth_user_created`, que cria o perfil do leitor em `public.profiles`.
6. O Supabase redireciona o leitor de volta para o handler Next.js ([`app/(auth)/callback/route.ts`](file:///c:/Users/paulo/Documents/boral%C3%AA/app/%28auth%29/callback/route.ts)).
7. A sessão segura de cookies é estabelecida e o leitor é levado ao `/dashboard`.
