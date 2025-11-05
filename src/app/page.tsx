
'use client';
import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import SppgPage from './components/sppg-page';
import MitraPage from './components/mitra-page';

type Menu = 'Dashboard' | 'SPPG' | 'Mitra' | 'Menu' | 'Keuangan';

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<Menu>('Dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'SPPG':
        return <SppgPage />;
      case 'Mitra':
        return <MitraPage />;
      case 'Dashboard':
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold">Hello, World!</h1>
            <p>Ini adalah tombol dengan warna aksen baru Anda.</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar collapsible="none" className="border-r">
          <SidebarHeader>
            <div className="h-16 flex items-center px-4">
              {/* Placeholder for Logo */}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('Dashboard')} isActive={activeMenu === 'Dashboard'}>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('SPPG')} isActive={activeMenu === 'SPPG'}>SPPG</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('Mitra')} isActive={activeMenu === 'Mitra'}>Mitra</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('Menu')} isActive={activeMenu === 'Menu'}>Menu</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('Keuangan')} isActive={activeMenu === 'Keuangan'}>Keuangan</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b h-16">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <h1 className="text-xl font-semibold">{activeMenu}</h1>
            <div>{/* Placeholder for user menu or other header items */}</div>
          </header>
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
