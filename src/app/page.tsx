'use client';

import { useState } from 'react';
import {
  Users,
  LayoutDashboard,
  Building,
  Handshake,
  Utensils,
  Wallet,
  ScrollText,
  LogOut,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Import Page Components
import DashboardPage from './components/dashboard-page';
import SppgPage from './components/sppg-page';
import MitraPage from './components/mitra-page';
import MenuPage from './components/menu-page';
import KeuanganPage from './components/keuangan-page';
import ReportsPage from './components/reports-page';
import AccountsPage from './components/accounts-page';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ReactNode;
  roles: ('Admin Pusat' | 'SPPG')[];
};

type UserRole = 'Admin Pusat' | 'SPPG';
type SppgId = 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

const user: { role: UserRole; sppgId?: SppgId, name: string, email: string } = {
  role: 'Admin Pusat',
  // role: 'SPPG',
  // sppgId: 'sppg-al-ikhlas',
  name: 'Admin BGN',
  email: 'admin.bgn@gmail.com'
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: <DashboardPage userRole={user.role} userSppgId={user.sppgId} />, roles: ['Admin Pusat', 'SPPG'] },
  { id: 'sppg', label: 'SPPG', icon: Building, component: <SppgPage />, roles: ['Admin Pusat'] },
  { id: 'mitra', label: 'Mitra', icon: Handshake, component: <MitraPage userRole={user.role} userSppgId={user.sppgId} />, roles: ['Admin Pusat', 'SPPG'] },
  { id: 'menu', label: 'Menu', icon: Utensils, component: <MenuPage userRole={user.role} userSppgId={user.sppgId} />, roles: ['Admin Pusat', 'SPPG'] },
  { id: 'keuangan', label: 'Keuangan', icon: Wallet, component: <KeuanganPage userRole={user.role} userSppgId={user.sppgId} />, roles: ['Admin Pusat', 'SPPG'] },
  { id: 'laporan', label: 'Laporan', icon: ScrollText, component: <ReportsPage userRole={user.role} userSppgId={user.sppgId} />, roles: ['Admin Pusat'] },
  { id: 'akun', label: 'Kelola Penanggung Jawab', icon: Users, component: <AccountsPage />, roles: ['Admin Pusat'] },
];

const renderContent = (activePage: string) => {
  const item = navItems.find((item) => item.id === activePage);
  return item ? item.component : <div>Pilih halaman</div>;
};

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard');
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    if(isMobile) {
      setIsSidebarOpen(false);
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center px-6">
        <Image src="https://placehold.co/150x50/000000/FFFFFF/png?text=BGN" width={150} height={50} alt="Logo" data-ai-hint="logo" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 text-sm font-medium">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                activePage === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
           <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{navItems.find(item => item.id === activePage)?.label}</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">{renderContent(activePage)}</main>
      </div>
    );
  }


  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card text-card-foreground lg:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
           <h1 className="text-3xl font-bold mb-6">{navItems.find(item => item.id === activePage)?.label}</h1>
          {renderContent(activePage)}
        </main>
      </div>
    </div>
  );
}
