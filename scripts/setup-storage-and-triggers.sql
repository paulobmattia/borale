-- ==============================================================================
-- BORALÊ — STORAGE BUCKETS & TRIGGER DE CRIAÇÃO AUTOMÁTICA DE PERFIL
-- Execute este script no SQL Editor do Supabase (projeto: fugrbgdykghkyswiwpir)
-- ==============================================================================

-- 1. CRIAÇÃO DOS BUCKETS PÚBLICOS DE ARMAZENAMENTO (STORAGE)
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICAS DE SEGURANÇA (RLS) PARA O STORAGE

-- Leitura pública de capas e avatares
DROP POLICY IF EXISTS "Capas de livros sao públicas" ON storage.objects;
CREATE POLICY "Capas de livros sao públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Avatares de usuarios sao públicos" ON storage.objects;
CREATE POLICY "Avatares de usuarios sao públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Upload por usuários autenticados
DROP POLICY IF EXISTS "Usuarios autenticados podem enviar capas" ON storage.objects;
CREATE POLICY "Usuarios autenticados podem enviar capas"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers' AND
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Usuarios autenticados podem enviar avatares" ON storage.objects;
CREATE POLICY "Usuarios autenticados podem enviar avatares"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- Atualização e exclusão de arquivos próprios
DROP POLICY IF EXISTS "Usuarios podem atualizar proprios arquivos em covers" ON storage.objects;
CREATE POLICY "Usuarios podem atualizar proprios arquivos em covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios podem atualizar proprios arquivos em avatars" ON storage.objects;
CREATE POLICY "Usuarios podem atualizar proprios arquivos em avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios podem excluir proprias capas" ON storage.objects;
CREATE POLICY "Usuarios podem excluir proprias capas"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios podem excluir proprios avatares" ON storage.objects;
CREATE POLICY "Usuarios podem excluir proprios avatares"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 3. TRIGGER AUTOMÁTICO DE CRIAÇÃO DE PERFIL AO CADASTRAR OU LOGAR COM GOOGLE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username text;
  clean_username text;
  display_name_val text;
  avatar_val text;
BEGIN
  -- Extrair nome de exibição
  display_name_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1),
    'Leitor Boralê'
  );

  -- Gerar username limpo (mínimo 3 caracteres, sem espaços ou símbolos)
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );
  clean_username := LOWER(REGEXP_REPLACE(base_username, '[^a-zA-Z0-9_]', '', 'g'));
  
  IF char_length(clean_username) < 3 THEN
    clean_username := 'leitor_' || SUBSTRING(NEW.id::text FROM 1 FOR 6);
  END IF;

  -- Se o username já existir para outro ID, adiciona sufixo
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = clean_username AND id <> NEW.id) THEN
    clean_username := clean_username || '_' || SUBSTRING(NEW.id::text FROM 1 FOR 4);
  END IF;

  -- Extrair avatar do Google se existir
  avatar_val := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  -- Inserir ou atualizar perfil
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

-- Associar o trigger ao auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar usuários existentes no auth.users que ainda não tenham perfil
DO $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN SELECT * FROM auth.users LOOP
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
      u.id,
      COALESCE(
        u.raw_user_meta_data->>'username',
        LOWER(REGEXP_REPLACE(SPLIT_PART(u.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')),
        'leitor_' || SUBSTRING(u.id::text FROM 1 FOR 6)
      ),
      COALESCE(
        u.raw_user_meta_data->>'full_name',
        u.raw_user_meta_data->>'name',
        SPLIT_PART(u.email, '@', 1),
        'Leitor Boralê'
      ),
      COALESCE(
        u.raw_user_meta_data->>'avatar_url',
        u.raw_user_meta_data->>'picture'
      )
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END$$;
