import { createServerSupabaseClient } from "@/lib/supabaseServer";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const { data: produtos } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, imagem_url")
    .order("criado_em", { ascending: false });

  return <DashboardClient produtosIniciais={produtos ?? []} />;
}
