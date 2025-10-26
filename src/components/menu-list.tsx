import type { MenuItem } from '@/lib/types';
import MenuItemCard from './menu-item-card';

type MenuListProps = {
  items: MenuItem[];
};

export default function MenuList({ items }: MenuListProps) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">Belum ada menu</h2>
        <p className="text-muted-foreground">Tekan tombol + untuk menambahkan menu baru.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
