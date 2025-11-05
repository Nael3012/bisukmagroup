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

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white">
        <Sidebar collapsible="none" className="border-r">
          <SidebarHeader>
            <div className="h-16 flex items-center px-4">
              {/* Placeholder for Logo */}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>SPPG</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Mitra</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Menu</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Keuangan</SidebarMenuButton>
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
            <div>{/* Placeholder for user menu or other header items */}</div>
          </header>
          <main className="flex-1 p-6">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-4xl font-bold">Hello, World!</h1>
              <p>Ini adalah tombol dengan warna aksen baru Anda.</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
