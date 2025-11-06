
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

const yayasanLogos = [
    { name: "Bisukma Bangun Bangsa", url: "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413828035_Bisukma%20Bangun%20Bangsa.png"},
    { name: "Patriot Generasi Emas Indonesia", url: "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413871003_Patriot%20Generasi%20Emas%20Indonesia.png"},
    { name: "Bisukma Hita Mangula", url: "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413915579_Bisukma%20Hita%20Mangula.png"},
    { name: "Bisukma Generasi Emas Indonesia", url: "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413958140_Bisukma%20Generasi%20Emas%20Indonesia.png"}
];

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#34A853" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.002-0.002l6.19,5.238C39.463,34.32,44,27.935,44,20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FBBC05" d="M28.09,36.571l-6.19-5.238C20.62,32.09,19.01,33,17,33c-3.537,0-6.463-2.866-6.463-6.4s2.926-6.4,6.463-6.4c1.845,0,3.44,0.782,4.628,2.022l6.19-5.238C30.422,13.682,26.064,11,21,11c-7.18,0-13,5.82-13,13s5.82,13,13,13C24.08,37,26.434,36.953,28.09,36.571z" transform="rotate(-30 21 24)"/>
    <path fill="#EA4335" d="M21,11v6l10,6-10,6v6c5.064,0,9.422-2.682,11.81-6.761l-6.19-5.238C26.491,25.422,23.94,26,21,26c-2.01,0-3.62-0.91-4.81-2.429l-6.19,5.238C12.537,33.818,16.463,37,21,37v-6l10-6-10-6V11z" transform="rotate(45 21 24)"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh(); // Refresh the page to get the new auth state on the server
    }
    setLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
     if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <h1 className="text-3xl font-bold">
                <span className="font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                    BETA
                </span>
                <span className="text-2xl font-light text-slate-600 dark:text-slate-300">report</span>
            </h1>
            <p className="text-balance text-muted-foreground">
              Masukkan email dan password Anda untuk masuk
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* Optional: Add Forgot Password link here */}
                {/* <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

             {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Login Gagal</AlertTitle>
                    <AlertDescription>
                        {error.includes('Invalid login credentials') ? 'Email atau password salah.' : 'Terjadi kesalahan. Silakan coba lagi.'}
                    </AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
           <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Atau lanjutkan dengan
                    </span>
                </div>
            </div>
             <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-8 gap-10">
        <div className="text-center">
            <h1 className="text-7xl font-bold tracking-tighter">
                <span className="animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto]">
                    BETA
                </span>
            </h1>
            <p className="text-4xl font-light tracking-wide">report</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-8 flex-wrap">
            {yayasanLogos.map((logo) => (
                <div key={logo.name} className="relative h-12 w-24">
                    <Image
                        src={logo.url}
                        alt={logo.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

    