
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.528-3.108-11.283-7.481l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.778,31.627,44,27.999,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
      // Menggunakan router.push() dan biarkan middleware menangani redirect
      router.push('/');
      router.refresh(); // Memastikan server components dimuat ulang
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
            <h1 className="text-3xl flex items-center justify-center">
                <span className="font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                    BETA
                </span>
                <span className="text-3xl font-light text-slate-600 dark:text-slate-300">report</span>
            </h1>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs text-left">
                    Masukkan email dan password jika sudah memiliki akun, dan login dengan akun, atau login dengan akun Google
                </AlertDescription>
            </Alert>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="masukkan e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={cn(error && "border-destructive animate-shake")}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="masukkan sandi"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={cn(error && "border-destructive animate-shake")}
              />
            </div>

             {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>
                        {error.includes('Invalid login credentials') ? 'Email atau password salah.' : 'Terjadi kesalahan. Silakan coba lagi.'}
                    </span>
                </div>
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
                <GoogleIcon className="mr-2" />
                Google
            </Button>
            <div className="mt-4 text-center text-sm">
                Punya masalah dengan login?{' '}
                <Link href="#" className="underline">
                    Hubungi admin
                </Link>
            </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center p-8 gap-6 text-center text-white bg-batik-gradient animate-gradient bg-[length:200%_200%]">
        <div>
            <h1 className="text-5xl tracking-tighter">
                <span className="font-bold">BETA</span>
                <span className="font-light">report</span>
            </h1>
        </div>
        <p className="text-lg text-blue-100 max-w-md">
            Aplikasi pelaporan terpusat untuk memonitor dan mengelola data program gizi dari semua SPPG secara efisien.
        </p>
      </div>
    </div>
  );
}
