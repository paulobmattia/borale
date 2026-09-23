-- ==============================================================================
-- BORALÊ — ESQUEMA COMPLETO E IDEMPOTENTE DO BANCO DE DADOS (SUPABASE POSTGRESQL)
-- Plataforma de Leitura Social & Síncrona
-- Ordem de execução rigorosamente segura para execução no SQL Editor do Supabase.
-- ==============================================================================

-- 1. EXTENSÕES & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type') THEN
    CREATE TYPE reaction_type AS ENUM (
      'LIKE',
      'AGREE',
      'INSIGHT',
      'MIND_BLOWN',
      'ANGRY',
      'LOVE'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
    CREATE TYPE member_role AS ENUM (
      'admin',
      'member'
    );
  END IF;
END$$;

-- 2. TABELAS PRINCIPAIS (Com integridade referencial e constraints de validação)

-- 2.1 Perfis de Usuários (vinculados à tabela auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CONSTRAINT chk_profiles_username CHECK (char_length(trim(username)) >= 3 AND char_length(username) <= 30),
  display_name TEXT NOT NULL CONSTRAINT chk_profiles_display_name CHECK (char_length(trim(display_name)) >= 1 AND char_length(display_name) <= 80),
  avatar_url TEXT,
  bio TEXT CONSTRAINT chk_profiles_bio CHECK (bio IS NULL OR char_length(bio) <= 500),
  favorite_genres TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Mesas de Leitura (Reading Groups)
CREATE TABLE IF NOT EXISTS public.reading_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CONSTRAINT chk_reading_groups_title CHECK (char_length(trim(title)) >= 2 AND char_length(title) <= 120),
  book_title TEXT NOT NULL CONSTRAINT chk_reading_groups_book_title CHECK (char_length(trim(book_title)) >= 1 AND char_length(book_title) <= 200),
  book_author TEXT NOT NULL CONSTRAINT chk_reading_groups_book_author CHECK (char_length(trim(book_author)) >= 1 AND char_length(book_author) <= 150),
  book_cover_url TEXT,
  is_private BOOLEAN DEFAULT false NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Membros da Mesa
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role member_role DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (group_id, user_id)
);

-- 2.4 Metas / Marcos da Mesa (Milestones)
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  title TEXT CONSTRAINT chk_milestones_title CHECK (title IS NULL OR char_length(title) <= 120),
  target_chapter INTEGER CONSTRAINT chk_milestones_chapter CHECK (target_chapter IS NULL OR target_chapter >= 0),
  target_page INTEGER CONSTRAINT chk_milestones_page CHECK (target_page IS NULL OR target_page >= 0),
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Progresso Individual do Leitor na Mesa
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0 NOT NULL CONSTRAINT chk_user_progress_page CHECK (current_page >= 0),
  current_chapter INTEGER DEFAULT 0 NOT NULL CONSTRAINT chk_user_progress_chapter CHECK (current_chapter >= 0),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (group_id, user_id)
);

-- 2.6 Comentários & Notas de Margem com Proteção Anti-Spoiler e Respostas
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  chapter_ref INTEGER CONSTRAINT chk_comments_chapter CHECK (chapter_ref IS NULL OR chapter_ref >= 0),
  page_ref INTEGER CONSTRAINT chk_comments_page CHECK (page_ref IS NULL OR page_ref >= 0),
  content TEXT NOT NULL CONSTRAINT chk_comments_content CHECK (char_length(trim(content)) >= 1 AND char_length(content) <= 5000),
  has_spoiler BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.7 Reações Expressivas
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (comment_id, user_id, reaction_type)
);

-- 3. ÍNDICES DE PERFORMANCE (Otimização de consultas críticas)
CREATE INDEX IF NOT EXISTS idx_reading_groups_created_by ON public.reading_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_group_id ON public.milestones(group_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_group_id ON public.user_progress(group_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_group_id ON public.comments(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_location ON public.comments(group_id, chapter_ref, page_ref);
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON public.reactions(comment_id);

-- 4. FUNÇÕES DE SUPORTE SECURITY DEFINER (Previne recursão circular de RLS no Postgres)

CREATE OR REPLACE FUNCTION public.is_member_of_group(lookup_group_id UUID, lookup_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF lookup_user_id IS NULL OR lookup_group_id IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = lookup_group_id AND user_id = lookup_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_of_group(lookup_group_id UUID, lookup_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF lookup_user_id IS NULL OR lookup_group_id IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = lookup_group_id AND user_id = lookup_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4.1 Criação automática de perfil ao cadastrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  user_display TEXT;
  counter INTEGER := 0;
BEGIN
  user_display := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  base_username := lower(regexp_replace(COALESCE(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)), '[^a-zA-Z0-9_]', '', 'g'));
  IF base_username = '' OR length(base_username) < 3 THEN
    base_username := 'leitor_' || substr(md5(random()::text), 1, 6);
  END IF;

  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name, avatar_url, bio)
  VALUES (
    new.id,
    final_username,
    user_display,
    new.raw_user_meta_data->>'avatar_url',
    'Leitor no Boralê'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.2 Auto-adicionar criador da mesa como Admin em group_members
CREATE OR REPLACE FUNCTION public.handle_new_reading_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');

  INSERT INTO public.user_progress (group_id, user_id, current_page, current_chapter)
  VALUES (NEW.id, NEW.created_by, 0, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_reading_group_created ON public.reading_groups;
CREATE TRIGGER on_reading_group_created
  AFTER INSERT ON public.reading_groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_reading_group();

-- 4.3 Atualizar updated_at do progresso
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS touch_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER touch_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. ROW LEVEL SECURITY (RLS) - POLÍTICAS IDEMPOTENTES E SEGURAS

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles
DROP POLICY IF EXISTS "Perfis visíveis publicamente" ON public.profiles;
CREATE POLICY "Perfis visíveis publicamente"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5.2 Reading Groups
DROP POLICY IF EXISTS "Mesas públicas ou onde o usuário é membro" ON public.reading_groups;
CREATE POLICY "Mesas públicas ou onde o usuário é membro"
  ON public.reading_groups FOR SELECT
  USING (
    is_private = false OR
    auth.uid() = created_by OR
    public.is_member_of_group(id, auth.uid())
  );

DROP POLICY IF EXISTS "Usuários autenticados podem criar mesas" ON public.reading_groups;
CREATE POLICY "Usuários autenticados podem criar mesas"
  ON public.reading_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Criador ou admin pode atualizar a mesa" ON public.reading_groups;
CREATE POLICY "Criador ou admin pode atualizar a mesa"
  ON public.reading_groups FOR UPDATE
  USING (
    auth.uid() = created_by OR
    public.is_admin_of_group(id, auth.uid())
  );

DROP POLICY IF EXISTS "Criador pode excluir a mesa" ON public.reading_groups;
CREATE POLICY "Criador pode excluir a mesa"
  ON public.reading_groups FOR DELETE
  USING (auth.uid() = created_by);

-- 5.3 Group Members
DROP POLICY IF EXISTS "Membros visíveis para participantes ou em mesas públicas" ON public.group_members;
CREATE POLICY "Membros visíveis para participantes ou em mesas públicas"
  ON public.group_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    public.is_member_of_group(group_id, auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.reading_groups rg
      WHERE rg.id = group_members.group_id AND rg.is_private = false
    )
  );

DROP POLICY IF EXISTS "Usuários podem ingressar em mesas públicas ou via admin" ON public.group_members;
CREATE POLICY "Usuários podem ingressar em mesas públicas ou via admin"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    public.is_admin_of_group(group_id, auth.uid())
  );

DROP POLICY IF EXISTS "Usuário pode sair ou admin pode remover membro" ON public.group_members;
CREATE POLICY "Usuário pode sair ou admin pode remover membro"
  ON public.group_members FOR DELETE
  USING (
    auth.uid() = user_id OR
    public.is_admin_of_group(group_id, auth.uid())
  );

-- 5.4 Milestones
DROP POLICY IF EXISTS "Marcos visíveis aos membros da mesa" ON public.milestones;
CREATE POLICY "Marcos visíveis aos membros da mesa"
  ON public.milestones FOR SELECT
  USING (
    public.is_member_of_group(group_id, auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.reading_groups rg
      WHERE rg.id = milestones.group_id AND rg.is_private = false
    )
  );

DROP POLICY IF EXISTS "Admins podem gerenciar marcos" ON public.milestones;
CREATE POLICY "Admins podem gerenciar marcos"
  ON public.milestones FOR ALL
  USING (
    public.is_admin_of_group(group_id, auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.reading_groups rg
      WHERE rg.id = milestones.group_id AND rg.created_by = auth.uid()
    )
  );

-- 5.5 User Progress
DROP POLICY IF EXISTS "Progresso visível aos membros da mesa" ON public.user_progress;
CREATE POLICY "Progresso visível aos membros da mesa"
  ON public.user_progress FOR SELECT
  USING (
    public.is_member_of_group(group_id, auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.reading_groups rg
      WHERE rg.id = user_progress.group_id AND rg.is_private = false
    )
  );

DROP POLICY IF EXISTS "Usuário gerencia o próprio progresso" ON public.user_progress;
CREATE POLICY "Usuário gerencia o próprio progresso"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5.6 Comments
DROP POLICY IF EXISTS "Comentários visíveis para membros da mesa" ON public.comments;
CREATE POLICY "Comentários visíveis para membros da mesa"
  ON public.comments FOR SELECT
  USING (
    public.is_member_of_group(group_id, auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.reading_groups rg
      WHERE rg.id = comments.group_id AND rg.is_private = false
    )
  );

DROP POLICY IF EXISTS "Membros da mesa podem postar comentários" ON public.comments;
CREATE POLICY "Membros da mesa podem postar comentários"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    public.is_member_of_group(group_id, auth.uid())
  );

DROP POLICY IF EXISTS "Autor ou admin pode excluir comentários" ON public.comments;
CREATE POLICY "Autor ou admin pode excluir comentários"
  ON public.comments FOR DELETE
  USING (
    auth.uid() = user_id OR
    public.is_admin_of_group(group_id, auth.uid())
  );

-- 5.7 Reactions
DROP POLICY IF EXISTS "Reações visíveis a quem tem acesso à mesa" ON public.reactions;
CREATE POLICY "Reações visíveis a quem tem acesso à mesa"
  ON public.reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.comments c
      WHERE c.id = reactions.comment_id
      AND (
        public.is_member_of_group(c.group_id, auth.uid()) OR
        EXISTS (
          SELECT 1 FROM public.reading_groups rg
          WHERE rg.id = c.group_id AND rg.is_private = false
        )
      )
    )
  );

DROP POLICY IF EXISTS "Membros da mesa podem reagir" ON public.reactions;
CREATE POLICY "Membros da mesa podem reagir"
  ON public.reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.comments c
      WHERE c.id = reactions.comment_id
      AND public.is_member_of_group(c.group_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Usuários podem remover sua própria reação" ON public.reactions;
CREATE POLICY "Usuários podem remover sua própria reação"
  ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

-- 6. HABILITAÇÃO DO REALTIME (Supabase Realtime)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;

-- 7. CONCESSÃO DE PERMISSÕES PARA ROLES DO SUPABASE (anon e authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- 8. STORAGE BUCKETS (covers e avatars)
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Capas de livros sao públicas" ON storage.objects;
CREATE POLICY "Capas de livros sao públicas" ON storage.objects FOR SELECT USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Avatares de usuarios sao públicos" ON storage.objects;
CREATE POLICY "Avatares de usuarios sao públicos" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Usuarios autenticados podem enviar capas" ON storage.objects;
CREATE POLICY "Usuarios autenticados podem enviar capas" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios autenticados podem enviar avatares" ON storage.objects;
CREATE POLICY "Usuarios autenticados podem enviar avatares" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios podem atualizar proprios arquivos em covers" ON storage.objects;
CREATE POLICY "Usuarios podem atualizar proprios arquivos em covers" ON storage.objects FOR UPDATE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios podem atualizar proprios arquivos em avatars" ON storage.objects;
CREATE POLICY "Usuarios podem atualizar proprios arquivos em avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 9. TRIGGER AUTOMÁTICO PARA CRIAÇÃO DE PERFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username text;
  clean_username text;
  display_name_val text;
  avatar_val text;
BEGIN
  display_name_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1),
    'Leitor Boralê'
  );

  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );
  clean_username := LOWER(REGEXP_REPLACE(base_username, '[^a-zA-Z0-9_]', '', 'g'));
  
  IF char_length(clean_username) < 3 THEN
    clean_username := 'leitor_' || SUBSTRING(NEW.id::text FROM 1 FOR 6);
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = clean_username AND id <> NEW.id) THEN
    clean_username := clean_username || '_' || SUBSTRING(NEW.id::text FROM 1 FOR 4);
  END IF;

  avatar_val := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (NEW.id, clean_username, display_name_val, avatar_val)
  ON CONFLICT (id) DO UPDATE SET
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    display_name = CASE 
      WHEN public.profiles.display_name IS NULL OR public.profiles.display_name = '' 
      THEN EXCLUDED.display_name 
      ELSE public.profiles.display_name 
    END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

