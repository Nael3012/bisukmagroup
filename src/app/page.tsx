import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Hello, World!</h1>
        <p>Ini adalah tombol dengan warna aksen baru Anda.</p>
        <Button>Tombol Keren</Button>
      </div>
    </main>
  );
}
