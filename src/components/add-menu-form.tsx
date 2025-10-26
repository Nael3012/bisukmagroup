'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SheetFooter } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama menu minimal 2 karakter.' }),
  calories: z.coerce.number().min(0, { message: 'Kalori harus angka positif.' }),
  protein: z.coerce.number().min(0, { message: 'Protein harus angka positif.' }),
  carbs: z.coerce.number().min(0, { message: 'Karbohidrat harus angka positif.' }),
  fat: z.coerce.number().min(0, { message: 'Lemak harus angka positif.' }),
  image: z.any().refine((files) => files?.length > 0, 'Foto menu wajib diunggah.'),
});

type AddMenuFormProps = {
  onSubmit: (data: Omit<MenuItem, 'id' | 'imageHint'>) => void;
};

export default function AddMenuForm({ onSubmit }: AddMenuFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'Ukuran file terlalu besar',
          description: 'Maksimal ukuran file adalah 4MB.',
        });
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (!previewImage) return;
    onSubmit({
      name: values.name,
      image: previewImage,
      nutrients: {
        calories: values.calories,
        protein: values.protein,
        carbs: values.carbs,
        fat: values.fat,
      },
    });
    form.reset();
    setPreviewImage(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="mx-auto max-w-lg space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Menu</FormLabel>
              <FormControl>
                <Input placeholder="cth: Nasi Goreng Spesial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto Menu</FormLabel>
              <FormControl>
                <div className="relative flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary">
                  <Input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleImageChange(e);
                    }}
                  />
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Pratinjau gambar"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-10 w-10" />
                      <p>Ambil atau unggah foto</p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm font-medium">Angka Kecukupan Gizi (AKG)</p>
        <div className="grid grid-cols-2 gap-4">
          {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => (
            <FormField
              key={nutrient}
              control={form.control}
              name={nutrient as 'calories' | 'protein' | 'carbs' | 'fat'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {nutrient === 'calories' ? 'Kalori (kcal)' : `${nutrient} (g)`}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <SheetFooter className="pt-4">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Simpan Menu
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
