
'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const sppgOptions = [
  { value: 'all', label: 'Semua SPPG' },
  { value: 'sppg-al-ikhlas', label: 'SPPG Al-Ikhlas', address: 'Jl. Merdeka No. 1, Jakarta' },
  { value: 'sppg-bina-umat', label: 'SPPG Bina Umat', address: 'Jl. Pahlawan No. 10, Surabaya' },
  { value: 'sppg-nurul-hidayah', label: 'SPPG Nurul Hidayah', address: 'Jl. Sudirman No. 5, Bandung' },
];

type SppgId = 'all' | 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

export default function KeuanganPage() {
  const [selectedSppg, setSelectedSppg] = useState<SppgId>('all');
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Laporan Keuangan</h2>
            <p className="text-muted-foreground">
                Pilih SPPG dan tanggal untuk membuat laporan keuangan harian.
            </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="sppg-select">Pilih SPPG</Label>
            <Select onValueChange={(v) => setSelectedSppg(v as SppgId)} value={selectedSppg}>
              <SelectTrigger id="sppg-select">
                <SelectValue placeholder="Pilih SPPG" />
              </SelectTrigger>
              <SelectContent>
                {sppgOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      {option.address && <p className="text-xs text-muted-foreground">{option.address}</p>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Pilih Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d LLL y", { locale: id }) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>
            Buat Laporan Keuangan Hari Ini
          </Button>
        </div>
    </div>
  );
}
