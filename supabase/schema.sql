-- ============================================================
-- Script de configuração do banco de dados — Catálogo Online
-- Rode este arquivo inteiro no Supabase: SQL Editor > New query
-- ============================================================

-- 1) Tabela de produtos
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco numeric(10, 2) not null check (preco >= 0),
  imagem_url text,
  criado_em timestamptz not null default now()
);

-- 2) Ativa Row Level Security (RLS).
-- Isso é ESSENCIAL: sem isso, qualquer pessoa com a chave pública
-- (que fica exposta no site) poderia ler, editar ou apagar os dados.
-- Com RLS ativado, só as regras abaixo decidem o que é permitido.
alter table produtos enable row level security;

-- 3) Qualquer visitante (mesmo sem login) pode LER os produtos.
-- Necessário pro catálogo público funcionar.
create policy "Qualquer pessoa pode ver os produtos"
  on produtos for select
  using (true);

-- 4) Só usuários LOGADOS (o dono da loja) podem criar produtos.
create policy "Usuários logados podem criar produtos"
  on produtos for insert
  to authenticated
  with check (true);

-- 5) Só usuários LOGADOS podem editar produtos.
create policy "Usuários logados podem editar produtos"
  on produtos for update
  to authenticated
  using (true);

-- 6) Só usuários LOGADOS podem excluir produtos.
create policy "Usuários logados podem excluir produtos"
  on produtos for delete
  to authenticated
  using (true);


-- ============================================================
-- 7) Bucket de armazenamento para as fotos dos produtos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode VER as imagens (necessário pro catálogo público)
create policy "Imagens de produtos são públicas"
  on storage.objects for select
  using (bucket_id = 'produtos');

-- Só usuários logados podem enviar novas imagens
create policy "Usuários logados podem enviar imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos');

-- Só usuários logados podem apagar imagens
create policy "Usuários logados podem apagar imagens"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos');
