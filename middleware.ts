import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Este middleware roda ANTES de qualquer página ser exibida.
// Ele confere se existe uma sessão de login válida antes de liberar
// acesso a qualquer rota dentro de /admin/dashboard.
// Isso impede que alguém acesse o painel só digitando a URL direto.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/admin/dashboard");

  if (isDashboardRoute && !session) {
    // Sem sessão -> manda pra tela de login, não deixa nem carregar o painel.
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
