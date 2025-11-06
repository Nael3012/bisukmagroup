import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Jika pengguna belum login dan mencoba mengakses halaman selain yang ada di matcher,
  // mereka akan dialihkan oleh logika di page.tsx, jadi middleware bisa fokus pada
  // penyegaran token.
  if (!session) {
    // Jika tidak ada sesi dan pengguna bukan di halaman login, biarkan Next.js
    // yang menangani redirect ke /login melalui komponen server.
    // Ini menghindari loop redirect di middleware.
    if (pathname !== '/login') {
       // Untuk halaman selain login, biarkan penanganan redirect di level halaman (page.tsx)
    }
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login, alihkan.
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (halaman login)
     * - /auth/callback (Supabase auth callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|auth/callback).*)',
  ],
}
