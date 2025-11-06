
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SppgPage from './components/sppg-page';
import MitraPage from './components/mitra-page';
import MenuPage from './components/menu-page';
import DashboardPage from './components/dashboard-page';
import AccountsPage from './components/accounts-page';
import ReportsPage from './components/reports-page';
import { cn } from '@/lib/utils';
import { LogOut, PanelLeft, UserCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import KeuanganPage from './components/keuangan-page';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Menu = 'Dashboard' | 'SPPG' | 'Mitra' | 'Menu' | 'Keuangan' | 'Laporan' | 'Kelola Penanggung Jawab';

const allMenuItems: Menu[] = ['Dashboard', 'SPPG', 'Mitra', 'Menu', 'Keuangan', 'Laporan', 'Kelola Penanggung Jawab'];

// NOTE: This logic will need to be updated to use actual user roles from the database
const adminOnlyMenus: Menu[] = ['SPPG', 'Laporan', 'Kelola Penanggung Jawab'];

type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
  penerimaManfaat: number;
  namaKaSppg: string;
  namaAkuntan: string;
  ahliGizi: string;
  asistenLapangan: string;
  wilayah: any;
  logo_url: string | null;
};

type Sekolah = {
  id: string;
  nama: string;
  alamat: string;
  jenjang: string;
  jumlahPM: number;
  sppgId: string;
  wilayah: any;
};

type B3Data = {
  id: string;
  namaDesa: string;
  alamat: string;
  jenis: { bumil: number; busui: number; balita: number };
  jumlah: number;
  sppgId: string;
  wilayah: any;
};

type ClientPageProps = {
  user: User;
  sppgList: SppgData[];
  sekolahList: Sekolah[];
  b3List: B3Data[];
}

export default function ClientPage({ user, sppgList, sekolahList, b3List }: ClientPageProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<Menu>('Dashboard');

  // This is a placeholder for actual role management
  const userRole = user.email?.includes('admin') ? 'Admin Pusat' : 'SPPG';
  const userSppgId = user.user_metadata?.sppgId;
  const userName = user.user_metadata?.full_name || user.email;
  const userAvatar = user.user_metadata?.avatar_url;

  const handleMenuClick = (menu: Menu) => {
    setActiveMenu(menu);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const availableMenus = allMenuItems.filter(menu => {
    if (userRole === 'SPPG' && adminOnlyMenus.includes(menu)) {
        return false;
    }
    return true;
  });

  const renderContent = () => {
    const props = {
        userRole: userRole,
        userSppgId: userSppgId,
    };

    switch (activeMenu) {
      case 'SPPG':
        return <SppgPage sppgList={sppgList} />;
      case 'Mitra':
        return <MitraPage {...props} semuaDaftarSekolah={sekolahList} semuaDaftarB3={b3List} />;
      case 'Menu':
        return <MenuPage {...props} />;
      case 'Keuangan':
        return <KeuanganPage {...props} />;
      case 'Laporan':
        return <ReportsPage {...props} />;
      case 'Kelola Penanggung Jawab':
        return <AccountsPage />;
      case 'Dashboard':
      default:
        return <DashboardPage {...props} />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-4">
        <h1 className="text-2xl">
          <span className="font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            BETA
          </span>
          <span className="text-xl font-light text-slate-600">report</span>
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex w-full min-w-0 flex-col gap-1">
          {availableMenus.map((menu) => (
             <li key={menu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start", 
                    activeMenu === menu 
                        ? "bg-accent text-accent-foreground font-semibold" 
                        : "text-muted-foreground font-normal"
                  )}
                  onClick={() => handleMenuClick(menu)}
                >
                  {menu}
                </Button>
              </li>
          ))}
        </ul>
      </div>
       <div className="mt-auto p-4 border-t">
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Static Sidebar for Desktop */}
      <div className="border-r w-64 hidden md:flex flex-col">
        {sidebarContent}
      </div>

      <div className="flex flex-col flex-1 overflow-auto">
        <header className="flex items-center justify-between p-4 border-b h-16 sticky top-0 bg-background z-10">
           <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <PanelLeft />
                  <span className="sr-only">Buka Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu Utama</SheetTitle>
                </SheetHeader>
                {sidebarContent}
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">{activeMenu}</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-3 px-2">
                    <div className='text-right hidden sm:block'>
                        <p className='text-sm font-medium'>{userName}</p>
                        <p className='text-xs text-muted-foreground'>{userRole}</p>
                    </div>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={userAvatar} alt={`@${userName}`} />
                        <AvatarFallback>
                            <UserCircle />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
