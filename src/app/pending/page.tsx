
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle, LogOut } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export default function PendingPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleContactAdmin = () => {
    // Replace with the actual admin's WhatsApp number
    const adminPhoneNumber = '6281234567890';
    const message = "Halo Admin, akun saya belum mendapatkan penempatan SPPG. Mohon bantuannya.";
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
          <CardTitle className="mt-4">Akun Menunggu Penempatan</CardTitle>
          <CardDescription>
            Akun Anda telah berhasil dibuat, namun saat ini sedang menunggu penempatan SPPG oleh Admin Pusat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-muted-foreground">
            Silakan hubungi admin untuk mempercepat proses penempatan. Setelah akun Anda ditempatkan, Anda akan dapat mengakses dasbor.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={handleContactAdmin}>
            <WhatsAppIcon className="mr-2 h-4 w-4" />
            Hubungi Admin
          </Button>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Kembali ke Halaman Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
