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
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-10 sm:px-10">
        <p className="text-sm tracking-wide text-moss">catálogo</p>
        <h1 className="mt-1 font-display text-4xl text-ink sm:text-5xl">
          Nossas peças
        </h1>
      </header>

      <section className="px-6 py-10 sm:px-10">
        {produtos.length === 0 ? (
          <p className="text-ink/70">
            Nenhum produto cadastrado ainda. Assim que o catálogo for
            preenchido no painel, as peças aparecem aqui.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <article key={produto.id} className="group">
                <div className="aspect-[4/5] w-full overflow-hidden bg-line">
                  {produto.imagem_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-ink/40">
                      sem foto
                    </div>
                  )}
                </div>
                <h2 className="mt-3 font-display text-lg text-ink">
                  {produto.nome}
                </h2>
                {produto.descricao && (
                  <p className="mt-1 text-sm text-ink/60">
                    {produto.descricao}
                  </p>
                )}
                <p className="mt-2 text-base text-clay">
                  {formatarPreco(produto.preco)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
