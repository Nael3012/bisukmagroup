import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';

type MenuItemCardProps = {
  item: MenuItem;
};

const NutrientDisplay = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
}) => (
  <div className="flex items-center gap-3 rounded-md bg-secondary/50 p-2">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">
        {value} {unit}
      </p>
    </div>
  </div>
);

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card className="group overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={item.imageHint || 'food meal'}
          />
        </div>
        <div className="p-4">
          <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          <NutrientDisplay icon={<Flame size={20} />} label="Kalori" value={item.nutrients.calories} unit="kcal" />
          <NutrientDisplay icon={<Beef size={20} />} label="Protein" value={item.nutrients.protein} unit="g" />
          <NutrientDisplay icon={<Wheat size={20} />} label="Karbo" value={item.nutrients.carbs} unit="g" />
          <NutrientDisplay icon={<Droplets size={20} />} label="Lemak" value={item.nutrients.fat} unit="g" />
        </div>
      </CardContent>
    </Card>
  );
}
