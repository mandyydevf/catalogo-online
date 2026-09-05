-- ============================================================
-- Migração — adiciona categoria, selo e disponibilidade
-- Rode isto no Supabase: SQL Editor > New query
-- (a tabela "produtos" já existe, isso só adiciona as colunas novas)
-- ============================================================

alter table produtos
  add column if not exists categoria text;

alter table produtos
  add column if not exists selo text
  check (selo in ('novidade', 'mais_pedido'));

alter table produtos
  add column if not exists disponivel boolean not null default true;
