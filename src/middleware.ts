import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Jika pengguna sudah login dan mencoba mengakses halaman login,
  // alihkan ke halaman utama.
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Jika pengguna belum login dan mencoba mengakses halaman selain login atau callback,
  // alihkan ke halaman login. Ini sudah ditangani oleh middleware redirect di page.tsx,
  // tapi ini sebagai lapisan keamanan tambahan.
  if (!session && pathname !== '/login' && pathname !== '/auth/callback') {
    // Kita bisa biarkan `page.tsx` menangani ini untuk menghindari redirect loop,
    // atau redirect dari sini. Untuk sekarang, kita fokus pada masalah login.
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
     * - auth/callback (Supabase auth callback, dikecualikan di logika di atas)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
