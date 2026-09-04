"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem_url: string | null;
};

const PRODUTO_VAZIO = { nome: "", descricao: "", preco: "", imagem: null as File | null };

export default function DashboardClient({
  produtosIniciais,
}: {
  produtosIniciais: Produto[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(PRODUTO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function iniciarEdicao(produto: Produto) {
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao ?? "",
      preco: String(produto.preco),
      imagem: null,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(PRODUTO_VAZIO);
    setErro(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const precoNumerico = Number(form.preco.replace(",", "."));
    if (!form.nome.trim()) {
      setErro("O nome do produto é obrigatório.");
      return;
    }
    if (Number.isNaN(precoNumerico) || precoNumerico < 0) {
      setErro("Informe um preço válido (ex: 89.90).");
      return;
    }

    setSalvando(true);

    // 1. Se uma imagem nova foi escolhida, sobe pro Supabase Storage primeiro.
    let imagemUrl: string | undefined;
    if (form.imagem) {
      const nomeArquivo = `${Date.now()}-${form.imagem.name}`;
      const { error: uploadError } = await supabase.storage
        .from("produtos")
        .upload(nomeArquivo, form.imagem);

      if (uploadError) {
        setErro("Não foi possível enviar a imagem: " + uploadError.message);
        setSalvando(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("produtos")
        .getPublicUrl(nomeArquivo);
      imagemUrl = publicUrlData.publicUrl;
    }

    // 2. Cria ou atualiza o registro do produto no banco.
    if (editandoId) {
      const { data, error } = await supabase
        .from("produtos")
        .update({
          nome: form.nome,
          descricao: form.descricao || null,
          preco: precoNumerico,
          ...(imagemUrl ? { imagem_url: imagemUrl } : {}),
        })
        .eq("id", editandoId)
        .select()
        .single();

      if (error) {
        setErro("Erro ao salvar alterações: " + error.message);
        setSalvando(false);
        return;
      }

      setProdutos((atuais) =>
        atuais.map((p) => (p.id === editandoId ? (data as Produto) : p))
      );
    } else {
      const { data, error } = await supabase
        .from("produtos")
        .insert({
          nome: form.nome,
          descricao: form.descricao || null,
          preco: precoNumerico,
          imagem_url: imagemUrl ?? null,
        })
        .select()
        .single();

      if (error) {
        setErro("Erro ao cadastrar produto: " + error.message);
        setSalvando(false);
        return;
      }

      setProdutos((atuais) => [data as Produto, ...atuais]);
    }

    setSalvando(false);
    cancelarEdicao();
  }

  async function handleExcluir(id: string) {
    const confirmar = window.confirm("Excluir este produto do catálogo?");
    if (!confirmar) return;

    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    setProdutos((atuais) => atuais.filter((p) => p.id !== id));
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between border-b border-line pb-6">
        <div>
          <p className="text-sm tracking-wide text-moss">painel administrativo</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Meus produtos</h1>
        </div>
        <button
          onClick={handleLogout}
          className="border border-ink px-4 py-2 text-sm text-ink transition hover:bg-ink hover:text-paper"
        >
          Sair
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* Formulário de cadastro/edição */}
        <section>
          <h2 className="font-display text-xl text-ink">
            {editandoId ? "Editar produto" : "Novo produto"}
          </h2>

          <form onSubmit={handleSalvar} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-ink/70">Nome</label>
              <input
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="mt-1 w-full border border-line bg-white px-3 py-2 text-ink outline-none"
                placeholder="Ex: Camisa Polo Azul"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/70">Descrição (opcional)</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="mt-1 w-full border border-line bg-white px-3 py-2 text-ink outline-none"
                rows={3}
                placeholder="Ex: Tamanhos P ao GG, 100% algodão"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/70">Preço (R$)</label>
              <input
                required
                inputMode="decimal"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
                className="mt-1 w-full border border-line bg-white px-3 py-2 text-ink outline-none"
                placeholder="Ex: 89.90"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/70">
                Foto do produto {editandoId && "(deixe em branco pra manter a atual)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, imagem: e.target.files?.[0] ?? null })
                }
                className="mt-1 w-full text-sm text-ink/70"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-700" role="alert">
                {erro}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={salvando}
                className="bg-ink px-4 py-2 text-paper transition hover:bg-ink/90 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar produto"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="border border-line px-4 py-2 text-ink/70"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Lista de produtos cadastrados */}
        <section>
          <h2 className="font-display text-xl text-ink">
            Cadastrados ({produtos.length})
          </h2>

          {produtos.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">
              Nenhum produto cadastrado ainda. Use o formulário ao lado para
              adicionar o primeiro.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {produtos.map((produto) => (
                <li key={produto.id} className="flex items-center gap-4 py-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-line">
                    {produto.imagem_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={produto.imagem_url}
                        alt={produto.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-ink">{produto.nome}</p>
                    <p className="text-sm text-clay">
                      {produto.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => iniciarEdicao(produto)}
                    className="text-sm text-moss underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(produto.id)}
                    className="text-sm text-red-700 underline"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
