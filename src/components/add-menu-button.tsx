'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AddMenuForm from './add-menu-form';

type AddMenuButtonProps = {
  onAddMenu: (newItem: Omit<MenuItem, 'id'>) => void;
};

export default function AddMenuButton({ onAddMenu }: AddMenuButtonProps) {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (newItem: Omit<MenuItem, 'id' | 'imageHint'>) => {
    onAddMenu(newItem);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent/90 focus:ring-accent"
          aria-label="Tambah Menu Baru"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-lg p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-center text-xl">Tambah Menu Baru</SheetTitle>
        </SheetHeader>
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <AddMenuForm onSubmit={handleFormSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
