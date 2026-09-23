-- ==============================================================================
-- BORALÊ — ADIÇÃO DE RESPOSTAS EM THREAD NAS NOTAS DA MARGEM
-- Execute este script no SQL Editor do Supabase (projeto: fugrbgdykghkyswiwpir)
-- ==============================================================================

-- 1. Adicionar coluna parent_id na tabela comments (auto-relacionamento com deleção em cascata)
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- 2. Criar índice de performance para busca das respostas de cada comentário
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
