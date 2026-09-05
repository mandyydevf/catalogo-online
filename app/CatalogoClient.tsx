"use client";

import { useMemo, useState } from "react";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem_url: string | null;
  categoria: string | null;
  selo: string | null;
  disponivel: boolean;
};

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Troque pelo número real da confeitaria (com DDI+DDD, só números).
// Pode ser configurado também pela variável NEXT_PUBLIC_WHATSAPP_NUMBER.
const NUMERO_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5500000000000";

function linkPedido(produto: Produto) {
  const mensagem = encodeURIComponent(
    `Olá! Gostaria de pedir: ${produto.nome} (${formatarPreco(produto.preco)})`
  );
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${mensagem}`;
}

export default function CatalogoClient({ produtos }: { produtos: Produto[] }) {
  const categorias = useMemo(() => {
    const unicas = Array.from(
      new Set(
        produtos
          .map((p) => p.categoria)
          .filter((c): c is string => Boolean(c && c.trim()))
      )
    );
    return unicas.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [produtos]);

  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todos");

  const produtosFiltrados =
    categoriaAtiva === "todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva);

  return (
    <section className="bg-surface px-6 py-14 sm:px-10">
      {categorias.length > 0 && (
        <div
          className="mx-auto mb-10 flex max-w-5xl flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filtrar por categoria"
        >
          <button
            type="button"
            onClick={() => setCategoriaAtiva("todos")}
            aria-pressed={categoriaAtiva === "todos"}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              categoriaAtiva === "todos"
                ? "bg-pink text-white"
                : "bg-white text-ink/70 hover:bg-bg"
            }`}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaAtiva(categoria)}
              aria-pressed={categoriaAtiva === categoria}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                categoriaAtiva === categoria
                  ? "bg-pink text-white"
                  : "bg-white text-ink/70 hover:bg-bg"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      )}

      {produtosFiltrados.length === 0 ? (
        <p className="mx-auto max-w-sm text-center text-ink/60">
          {produtos.length === 0
            ? "Nenhum doce cadastrado ainda. Assim que o cardápio for preenchido no painel, as delícias aparecem aqui."
            : "Nenhum doce encontrado nessa categoria."}
        </p>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {produtosFiltrados.map((produto) => (
            <article
              key={produto.id}
              id={`produto-${produto.id}`}
              className="group scroll-mt-6 overflow-hidden rounded-[28px] border border-sand/50 bg-white shadow-sm transition duration-300 hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-bg">
                {produto.selo === "novidade" && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-olive px-3 py-1 text-xs font-bold text-white">
                    Novidade
                  </span>
                )}
                {produto.selo === "mais_pedido" && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-pink px-3 py-1 text-xs font-bold text-white">
                    Mais pedido
                  </span>
                )}
                {!produto.disponivel && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-white">
                    Esgotado
                  </span>
                )}

                {produto.imagem_url ? (
                  <a
                    href={`#foto-${produto.id}`}
                    className={`block h-full w-full ${
                      produto.disponivel ? "cursor-zoom-in" : ""
                    }`}
                    aria-label={`Ver foto ampliada de ${produto.nome}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.04] ${
                        !produto.disponivel ? "grayscale" : ""
                      }`}
                    />
                  </a>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-ink/40">
                    sem foto
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {produto.nome}
                </h2>
                {produto.descricao && (
                  <p className="mt-1 text-sm text-ink/60">
                    {produto.descricao}
                  </p>
                )}
                <span className="mt-3 inline-block rounded-full bg-pink px-3 py-1 text-sm font-bold text-white">
                  {formatarPreco(produto.preco)}
                </span>

                {produto.disponivel && (
                  <a
                    href={linkPedido(produto)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block rounded-full border border-olive px-3 py-2 text-center text-sm font-semibold text-olive transition hover:bg-olive hover:text-white"
                  >
                    Pedir pelo WhatsApp
                  </a>
                )}
              </div>

              {/* Foto ampliada, exibida ao clicar na imagem acima */}
              {produto.imagem_url && (
                <div id={`foto-${produto.id}`} className="lightbox">
                  <a
                    href={`#produto-${produto.id}`}
                    className="lightbox-backdrop"
                    aria-label="Fechar foto ampliada"
                  />
                  <div className="lightbox-content">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={produto.imagem_url} alt={produto.nome} />
                    <a
                      href={`#produto-${produto.id}`}
                      className="lightbox-close"
                      aria-label="Fechar foto ampliada"
                    >
                      ×
                    </a>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
