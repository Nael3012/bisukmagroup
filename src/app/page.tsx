
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SppgPage from './components/sppg-page';
import MitraPage from './components/mitra-page';
import MenuPage from './components/menu-page';
import DashboardPage from './components/dashboard-page';
import { cn } from '@/lib/utils';
import { PanelLeft } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';


type Menu = 'Dashboard' | 'SPPG' | 'Mitra' | 'Menu' | 'Keuangan';

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<Menu>('Dashboard');

  const handleMenuClick = (menu: Menu) => {
    setActiveMenu(menu);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'SPPG':
        return <SppgPage />;
      case 'Mitra':
        return <MitraPage />;
      case 'Menu':
        return <MenuPage />;
      case 'Dashboard':
      default:
        return <DashboardPage />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-4 border-b">
        {/* Placeholder for Logo */}
        <h1 className="text-xl font-semibold">Nama Aplikasi</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex w-full min-w-0 flex-col gap-1">
          <li>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", activeMenu === 'Dashboard' && "bg-accent text-accent-foreground")}
              onClick={() => handleMenuClick('Dashboard')}
            >
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", activeMenu === 'SPPG' && "bg-accent text-accent-foreground")}
              onClick={() => handleMenuClick('SPPG')}
            >
              SPPG
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", activeMenu === 'Mitra' && "bg-accent text-accent-foreground")}
              onClick={() => handleMenuClick('Mitra')}
            >
              Mitra
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", activeMenu === 'Menu' && "bg-accent text-accent-foreground")}
              onClick={() => handleMenuClick('Menu')}
            >
              Menu
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", activeMenu === 'Keuangan' && "bg-accent text-accent-foreground")}
              onClick={() => handleMenuClick('Keuangan')}
            >
              Keuangan
            </Button>
          </li>
        </ul>
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
          <div>{/* Placeholder for user menu or other header items */}</div>
        </header>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
