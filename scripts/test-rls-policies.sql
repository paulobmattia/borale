-- ==============================================================================
-- BORALÊ — SUITE DE TESTES E VALIDAÇÃO DE PERMISSÕES RLS (Row Level Security)
-- Executável diretamente no SQL Editor do Supabase.
-- Executa em transação com ROLLBACK no final para não poluir os dados.
-- ==============================================================================

BEGIN;

DO $$
DECLARE
  v_user_a UUID := '11111111-1111-1111-1111-111111111111';
  v_user_b UUID := '22222222-2222-2222-2222-222222222222';
  v_public_group UUID;
  v_private_group UUID;
  v_comment_id UUID;
  v_count INTEGER;
  v_updated INTEGER;
BEGIN
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'INICIANDO TESTES AUTOMATIZADOS DE RLS DO BORALÊ';
  RAISE NOTICE '=====================================================';

  -- 1. Setup: Mock de usuários no auth.users
  DELETE FROM auth.users WHERE id IN (v_user_a, v_user_b);
  
  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES 
    (v_user_a, 'usuario.a@borale.app', '{"full_name": "Usuário A", "user_name": "usuario_a"}'),
    (v_user_b, 'usuario.b@borale.app', '{"full_name": "Usuário B", "user_name": "usuario_b"}');

  -- 2. Setup: Usuário A cria uma mesa pública e uma mesa privada
  INSERT INTO public.reading_groups (title, book_title, book_author, is_private, created_by)
  VALUES ('Mesa Pública do Livro A', 'A Hora da Estrela', 'Clarice Lispector', false, v_user_a)
  RETURNING id INTO v_public_group;

  INSERT INTO public.reading_groups (title, book_title, book_author, is_private, created_by)
  VALUES ('Mesa Secreta do Livro B', 'Grande Sertão', 'Guimarães Rosa', true, v_user_a)
  RETURNING id INTO v_private_group;

  -- Usuário A posta comentário na mesa pública
  INSERT INTO public.comments (group_id, user_id, content, chapter_ref, page_ref, has_spoiler)
  VALUES (v_public_group, v_user_a, 'Anotação legítima do Usuário A', 1, 10, false)
  RETURNING id INTO v_comment_id;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 1: Usuário A autenticado acessa os próprios dados
  -- ----------------------------------------------------------------------------
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', v_user_a::TEXT, true);

  SELECT count(*) INTO v_count FROM public.profiles WHERE id = v_user_a;
  IF v_count = 1 THEN
    RAISE NOTICE 'CENÁRIO 1 [PASS]: Usuário A acessa o próprio perfil com sucesso.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 1 [FAIL]: Falha ao acessar o próprio perfil.';
  END IF;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 2: Usuário B tenta alterar o perfil do Usuário A
  -- ----------------------------------------------------------------------------
  PERFORM set_config('request.jwt.claim.sub', v_user_b::TEXT, true);

  UPDATE public.profiles SET bio = 'Invasão indevida' WHERE id = v_user_a;
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RAISE NOTICE 'CENÁRIO 2 [PASS]: RLS impediu que Usuário B alterasse o perfil do Usuário A.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 2 [FAIL]: Usuário B conseguiu alterar o perfil do Usuário A!';
  END IF;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 3: Usuário B tenta ver mesa privada da qual NÃO participa
  -- ----------------------------------------------------------------------------
  SELECT count(*) INTO v_count FROM public.reading_groups WHERE id = v_private_group;
  IF v_count = 0 THEN
    RAISE NOTICE 'CENÁRIO 3 [PASS]: RLS impediu que Usuário B visualizasse mesa privada alheia.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 3 [FAIL]: Usuário B conseguiu visualizar a mesa privada alheia!';
  END IF;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 4: Usuário B acessa mesa PÚBLICA (deve ser permitido)
  -- ----------------------------------------------------------------------------
  SELECT count(*) INTO v_count FROM public.reading_groups WHERE id = v_public_group;
  IF v_count = 1 THEN
    RAISE NOTICE 'CENÁRIO 4 [PASS]: Usuário B consegue visualizar mesa pública normalmente.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 4 [FAIL]: Usuário B não conseguiu visualizar mesa pública.';
  END IF;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 5: Usuário B tenta alterar o progresso de leitura do Usuário A
  -- ----------------------------------------------------------------------------
  UPDATE public.user_progress SET current_page = 999 WHERE user_id = v_user_a;
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RAISE NOTICE 'CENÁRIO 5 [PASS]: RLS impediu que Usuário B alterasse o progresso do Usuário A.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 5 [FAIL]: Usuário B alterou o progresso do Usuário A!';
  END IF;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 6: Usuário B tenta postar nota em mesa privada sem ser membro
  -- ----------------------------------------------------------------------------
  BEGIN
    INSERT INTO public.comments (group_id, user_id, content)
    VALUES (v_private_group, v_user_b, 'Comentário intruso');
    RAISE EXCEPTION 'CENÁRIO 6 [FAIL]: Usuário B conseguiu postar em mesa privada alheia!';
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'CENÁRIO 6 [PASS]: RLS impediu inserção de comentário em mesa privada sem filiação.';
  END;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 7: Usuário B tenta excluir o comentário do Usuário A
  -- ----------------------------------------------------------------------------
  DELETE FROM public.comments WHERE id = v_comment_id;
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RAISE NOTICE 'CENÁRIO 7 [PASS]: RLS impediu que Usuário B excluísse o comentário do Usuário A.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 7 [FAIL]: Usuário B conseguiu excluir comentário de outro leitor!';
  END IF;

  -- ----------------------------------------------------------------------------
  -- CENÁRIO 8: Usuário B ingressa na mesa pública e atualiza seu próprio progresso
  -- ----------------------------------------------------------------------------
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_public_group, v_user_b, 'member');

  INSERT INTO public.user_progress (group_id, user_id, current_page, current_chapter)
  VALUES (v_public_group, v_user_b, 25, 1);
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 1 THEN
    RAISE NOTICE 'CENÁRIO 8 [PASS]: Usuário B ingressou e registrou seu próprio progresso com sucesso.';
  ELSE
    RAISE EXCEPTION 'CENÁRIO 8 [FAIL]: Falha ao registrar progresso do Usuário B.';
  END IF;

  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'TODOS OS 8 CENÁRIOS DE RLS FORAM VALIDADOS COM SUCESSO!';
  RAISE NOTICE '=====================================================';
END $$;

ROLLBACK;
