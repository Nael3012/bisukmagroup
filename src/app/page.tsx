'use client';

import { useState } from 'react';
import type { MenuItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';
import MenuList from '@/components/menu-list';
import AddMenuButton from '@/components/add-menu-button';

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Salad Buah Segar',
    image: PlaceHolderImages.find((p) => p.id === 'fruit-salad')?.imageUrl || '',
    imageHint: PlaceHolderImages.find((p) => p.id === 'fruit-salad')?.imageHint,
    nutrients: {
      calories: 150,
      protein: 5,
      carbs: 25,
      fat: 3,
    },
  },
  {
    id: '2',
    name: 'Ayam Bakar Madu',
    image: PlaceHolderImages.find((p) => p.id === 'grilled-chicken')?.imageUrl || '',
    imageHint: PlaceHolderImages.find((p) => p.id === 'grilled-chicken')?.imageHint,
    nutrients: {
      calories: 350,
      protein: 40,
      carbs: 10,
      fat: 18,
    },
  },
  {
    id: '3',
    name: 'Nasi Goreng',
    image: PlaceHolderImages.find((p) => p.id === 'fried-rice')?.imageUrl || '',
    imageHint: PlaceHolderImages.find((p) => p.id === 'fried-rice')?.imageHint,
    nutrients: {
      calories: 450,
      protein: 15,
      carbs: 60,
      fat: 18,
    },
  },
];

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const handleAddMenu = (newItem: Omit<MenuItem, 'id'>) => {
    setMenuItems((prevItems) => [
      { ...newItem, id: new Date().toISOString() },
      ...prevItems,
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-6">
        <MenuList items={menuItems} />
      </main>
      <AddMenuButton onAddMenu={handleAddMenu} />
    </div>
  );
}
