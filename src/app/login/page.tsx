
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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.82 2.04-5.82 0-9.46-4.82-9.46-9.46s3.64-9.46 9.46-9.46c2.86 0 4.82 1.2 5.9 2.22l2.42-2.42C20.2 1.62 17.1.6 12.48.6c-6.94 0-12.48 5.54-12.48 12.48s5.54 12.48 12.48 12.48c6.94 0 12.48-5.54 12.48-12.48 0-1.02-.12-1.84-.24-2.62h-12z" />
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
                placeholder="masukkan e-mail"
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
                placeholder="masukkan sandi"
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
      <div className="hidden bg-gradient-to-br from-blue-500 to-purple-600 lg:flex flex-col items-center justify-center p-8 gap-6 text-center text-white animate-gradient bg-[length:200%_200%]">
        <div>
            <h1 className="text-7xl font-bold tracking-tighter">
                BETA
            </h1>
            <p className="text-4xl font-light tracking-wide">report</p>
        </div>
        <p className="text-lg text-blue-100 max-w-md">
            Aplikasi pelaporan terpusat untuk memonitor dan mengelola data program gizi dari semua SPPG secara efisien.
        </p>
      </div>
    </div>
  );
}
