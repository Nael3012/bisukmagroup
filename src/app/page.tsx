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
  SidebarInset,
} from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarHeader>
          <div className="h-8" />
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
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:justify-end">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div>{/* Placeholder for user menu or other header items */}</div>
        </header>
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-24">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold">Hello, World!</h1>
            <p>Ini adalah tombol dengan warna aksen baru Anda.</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
