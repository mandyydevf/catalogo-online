import { createServerSupabaseClient } from "@/lib/supabaseServer";

export const revalidate = 0; // sempre busca os preços mais atuais, sem cache

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem_url: string | null;
};

async function getProdutos(): Promise<Produto[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, imagem_url")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }
  return data ?? [];
}

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function CatalogoPage() {
  const produtos = await getProdutos();

  return (
    <main className="min-h-screen bg-bg">
      <header className="relative px-6 pb-16 pt-16 text-center sm:px-10 sm:pb-20 sm:pt-20">
        <p className="text-sm font-semibold tracking-wide text-coral">
          catálogo de doces
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold text-ink sm:text-6xl">
          Korukoo Doceria
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-balance text-ink/70">
          Doces feitos com carinho, prontos pra adoçar o seu dia.
        </p>
      </header>

      {/* Borda ondulada, como a aba de uma caixinha de doces */}
      <svg
        viewBox="0 0 400 20"
        preserveAspectRatio="none"
        className="block h-4 w-full text-surface sm:h-5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,0 C10,20 30,20 40,0 C50,20 70,20 80,0 C90,20 110,20 120,0 C130,20 150,20 160,0 C170,20 190,20 200,0 C210,20 230,20 240,0 C250,20 270,20 280,0 C290,20 310,20 320,0 C330,20 350,20 360,0 C370,20 390,20 400,0 L400,20 L0,20 Z" />
      </svg>

      <section className="bg-surface px-6 py-14 sm:px-10">
        {produtos.length === 0 ? (
          <p className="mx-auto max-w-sm text-center text-ink/60">
            Nenhum doce cadastrado ainda. Assim que o cardápio for
            preenchido no painel, as delícias aparecem aqui.
          </p>
        ) : (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <article
                key={produto.id}
                className="group overflow-hidden rounded-[28px] border border-sand/50 bg-white shadow-sm transition duration-300 hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-bg">
                  {produto.imagem_url ? (
                    <a
                      href={`#foto-${produto.id}`}
                      className="block h-full w-full cursor-zoom-in"
                      aria-label={`Ver foto ampliada de ${produto.nome}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={produto.imagem_url}
                        alt={produto.nome}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
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
                </div>

                {/* Foto ampliada, exibida ao clicar na imagem acima */}
                {produto.imagem_url && (
                  <div id={`foto-${produto.id}`} className="lightbox">
                    <a
                      href="#"
                      className="lightbox-backdrop"
                      aria-label="Fechar foto ampliada"
                    />
                    <div className="lightbox-content">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={produto.imagem_url} alt={produto.nome} />
                      <a
                        href="#"
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

      <footer className="bg-bg px-6 py-12 text-center sm:px-10">
        <p className="font-display text-lg font-bold text-ink">
          Korukoo Doceria
        </p>
        <p className="mt-2 text-sm text-ink/70">
          Rua Exemplo, 123 — Bairro, Cidade/UF
        </p>
        <p className="mt-1 text-sm text-ink/70">
          <a
            href="https://wa.me/5500000000000"
            className="underline decoration-coral underline-offset-2"
          >
            (00) 00000-0000
          </a>
          {" · "}
          <a
            href="https://instagram.com/korukoodoceria"
            className="underline decoration-coral underline-offset-2"
          >
            @korukoodoceria
          </a>
        </p>
        <p className="mt-6 text-xs text-ink/40">
          © {new Date().getFullYear()} Korukoo Doceria
        </p>
      </footer>
    </main>
  );
}
