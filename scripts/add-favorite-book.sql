-- Script para adicionar a coluna favorite_book na tabela public.profiles
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/fugrbgdykghkyswiwpir/sql

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS favorite_book TEXT;

COMMENT ON COLUMN public.profiles.favorite_book IS 'Obra favorita da vida declarada pelo leitor por extenso';
