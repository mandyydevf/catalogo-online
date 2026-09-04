import { createBrowserClient } from "@supabase/ssr";

// Este cliente usa a chave "anon" (pública). Isso é seguro por design:
// a chave anon SÓ PODE fazer o que as políticas de segurança (RLS) do
// banco permitirem — configuradas em supabase/schema.sql.
// Nunca coloque a "service_role key" aqui nem em nenhum arquivo do frontend.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
