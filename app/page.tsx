import { createServerSupabaseClient } from "@/lib/supabaseServer";
import CatalogoClient from "./CatalogoClient";

export const revalidate = 0; // sempre busca os preços mais atuais, sem cache

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

async function getProdutos(): Promise<Produto[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("produtos")
    .select(
      "id, nome, descricao, preco, imagem_url, categoria, selo, disponivel"
    )
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }
  return data ?? [];
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

      <CatalogoClient produtos={produtos} />

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
