# Catálogo Online — guia de configuração

Este projeto tem duas partes:
- **Catálogo público** (`/`) — qualquer visitante vê os produtos e preços
- **Painel administrativo** (`/admin/login` → `/admin/dashboard`) — só o dono, logado, consegue cadastrar/editar/excluir produtos

Segue o passo a passo na ordem. Não pule etapas de segurança.

---

## Passo 1 — Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (dá pra usar login do GitHub)
2. Clique em **New Project**
3. Escolha um nome, uma senha forte para o banco (guarde essa senha) e a região mais próxima (ex: São Paulo)
4. Aguarde alguns minutos até o projeto ficar pronto

## Passo 2 — Rodar o script do banco de dados

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o conteúdo e cole no editor
4. Clique em **Run**

Isso cria a tabela de produtos, o espaço de armazenamento das imagens, e — mais importante — as **regras de segurança** que definem quem pode ver, criar, editar ou excluir dados.

## Passo 3 — Criar o usuário do dono da loja (login do painel)

**Importante: não crie uma tela pública de cadastro.** O dono da loja deve ser o único usuário, criado manualmente por você:

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha o e-mail e uma senha forte (essa será a senha de login do painel)
4. Marque a opção para confirmar o e-mail automaticamente (senão ele vai precisar confirmar por e-mail)

Guarde essas credenciais com segurança — são elas que o dono vai usar pra entrar no painel.

## Passo 4 — Pegar as chaves de API

1. No Supabase, vá em **Project Settings** (ícone de engrenagem) → **API**
2. Copie a **Project URL** e a chave **anon public**

> ⚠️ Existe também uma chave chamada **service_role**. **Nunca** copie essa para o projeto — ela dá acesso total ao banco, ignorando todas as regras de segurança. Use somente a chave **anon public**.

## Passo 5 — Configurar as variáveis de ambiente localmente

1. Na raiz do projeto, duplique o arquivo `.env.local.example` e renomeie a cópia para `.env.local`
2. Preencha com os valores copiados no Passo 4:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

O arquivo `.env.local` já está no `.gitignore` — ele nunca será enviado ao GitHub.

## Passo 6 — Rodar o projeto localmente

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` — deve aparecer o catálogo (vazio ainda).
Abra `http://localhost:3000/admin/login` e entre com o e-mail/senha criados no Passo 3.
Cadastre um produto de teste e confira se ele aparece na página pública.

## Passo 7 — Subir pro GitHub

```bash
git init
git add .
git commit -m "Primeira versão do catálogo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

## Passo 8 — Publicar na Vercel

1. Acesse [vercel.com](https://vercel.com) e crie uma conta (login com GitHub)
2. Clique em **Add New** → **Project** e selecione o repositório que você acabou de subir
3. Antes de clicar em **Deploy**, adicione as variáveis de ambiente (mesmas do `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

Em poucos minutos o site estará no ar em um endereço tipo `seu-projeto.vercel.app`.

## Passo 9 — Conectar o domínio próprio

1. Registre o domínio `.com.br` em [registro.br](https://registro.br)
2. No painel da Vercel, vá em **Settings** → **Domains** no seu projeto e adicione o domínio
3. A Vercel vai te dar os registros DNS para configurar no registro.br
4. Configure esses registros no painel do registro.br (leva algumas horas para propagar)

---

## Resumo de segurança — o que já está garantido neste projeto

- ✅ **RLS (Row Level Security) ativado**: mesmo com a chave pública exposta no site (isso é normal e esperado), ninguém consegue alterar dados sem estar logado
- ✅ **Painel protegido por middleware**: acessar `/admin/dashboard` sem login redireciona automaticamente pro login
- ✅ **Sem cadastro público**: o único jeito de existir um usuário é você criar manualmente no Supabase
- ✅ **Segredos fora do Git**: `.env.local` nunca é enviado ao repositório
- ✅ **HTTPS automático**: a Vercel fornece certificado SSL automaticamente, inclusive pro domínio próprio

## O que fazer depois de publicado

- Troque a senha do usuário admin periodicamente (Supabase → Authentication → Users)
- Se desconfiar que a senha vazou, troque na hora
- Evite compartilhar a senha do painel por WhatsApp/e-mail sem necessidade — prefira comunicar por telefone
