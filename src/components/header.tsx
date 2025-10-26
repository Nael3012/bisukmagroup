import { Utensils } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center gap-3 px-4 py-4">
        <Utensils className="h-7 w-7" />
        <h1 className="font-headline text-2xl font-bold">MenuSnap Nutrition</h1>
      </div>
    </header>
  );
}
