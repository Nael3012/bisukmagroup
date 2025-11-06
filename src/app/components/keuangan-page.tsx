
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { CalendarIcon, FilePlus, Info, Save, Download } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const sppgOptions = [
  { value: 'sppg-al-ikhlas', label: 'SPPG Al-Ikhlas', address: 'Jl. Merdeka No. 1, Jakarta', yayasan: "Yayasan Bisukma Bangun Bangsa" },
  { value: 'sppg-bina-umat', label: 'SPPG Bina Umat', address: 'Jl. Pahlawan No. 10, Surabaya', yayasan: "Yayasan Patriot Generasi Emas Indonesia" },
  { value: 'sppg-nurul-hidayah', label: 'SPPG Nurul Hidayah', address: 'Jl. Sudirman No. 5, Bandung', yayasan: "Yayasan Bisukma Hita Mangula" },
];

const yayasanLogos: Record<string, string> = {
    "Yayasan Bisukma Bangun Bangsa": "/logos/1762413828035_Bisukma_Bangun_Bangsa.png",
    "Yayasan Patriot Generasi Emas Indonesia": "/logos/1762413871003_Patriot_Generasi_Emas_Indonesia.png",
    "Yayasan Bisukma Hita Mangula": "/logos/1762413915579_Bisukma_Hita_Mangula.png",
    "Yayasan Bisukma Generasi Emas Indonesia": "/logos/1762413958140_Bisukma_Generasi_Emas_Indonesia.png"
};

const menuDataBySppg: any = {}; // This will be populated by props

type SppgId = 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

type KeuanganPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
}

export default function KeuanganPage({ userRole, userSppgId }: KeuanganPageProps) {
  const defaultSppg = userRole === 'SPPG' && userSppgId ? userSppgId : 'sppg-al-ikhlas';
  const [selectedSppg, setSelectedSppg] = useState<SppgId>(defaultSppg);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showPorsiInput, setShowPorsiInput] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  useEffect(() => {
    if (userRole === 'SPPG' && userSppgId) {
        setSelectedSppg(userSppgId);
    }
  }, [userRole, userSppgId]);


  const handleBuatLaporanClick = () => {
    setShowPorsiInput(true);
  }

  const selectedSppgDetails = useMemo(() => {
    return sppgOptions.find(option => option.value === selectedSppg);
  }, [selectedSppg]);

  const handleDownloadLogo = () => {
    if (selectedSppgDetails && selectedSppgDetails.yayasan && yayasanLogos[selectedSppgDetails.yayasan]) {
      const link = document.createElement('a');
      link.href = yayasanLogos[selectedSppgDetails.yayasan];
      link.download = `${selectedSppgDetails.yayasan.replace(/ /g, '_')}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const missingMenuDays = useMemo(() => {
    if (!selectedSppg || !menuDataBySppg[selectedSppg]) {
        return [];
    }

    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const weekStatus = menuDataBySppg[selectedSppg].weekStatus;
    const missingDays: { day: string; date: string }[] = [];

    (Object.keys(weekStatus) as (keyof typeof weekStatus)[]).forEach((day, index) => {
        if (!weekStatus[day]) {
            const dateOfDay = addDays(currentWeekStart, index);
            missingDays.push({
                day: String(day),
                date: format(dateOfDay, 'd MMMM yyyy', { locale: id }),
            });
        }
    });

    return missingDays;
  }, [selectedSppg]);


  const renderRegularMode = () => (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Laporan Keuangan</h2>
        <p className="text-muted-foreground">
          Pilih SPPG dan tanggal untuk membuat laporan keuangan harian.
        </p>
      </div>

       {missingMenuDays.length > 0 && (
         <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Data Menu Belum Lengkap</AlertTitle>
            <AlertDescription>
                Terdapat data menu yang belum diinput untuk SPPG ini pada minggu ini. Harap lengkapi data untuk hari berikut:
                <ul className="list-disc pl-5 mt-2">
                    {missingMenuDays.map(item => (
                        <li key={item.day}>
                           <span className="font-semibold">{item.day}</span>, {item.date}
                        </li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
       )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            {userRole === 'Admin Pusat' && (
                <div className="grid gap-2 flex-1">
                    <Label htmlFor="sppg-select">Pilih SPPG</Label>
                    <div className="flex items-center gap-2">
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
                        <Button variant="outline" size="icon" onClick={handleDownloadLogo} disabled={!selectedSppgDetails?.yayasan}>
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download Logo</span>
                        </Button>
                    </div>
                </div>
            )}
          <div className="grid gap-2 flex-1">
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
      </div>
      <div className="flex justify-end">
        <Button onClick={handleBuatLaporanClick}>
          <FilePlus className="mr-2 h-4 w-4" />
          Buat Laporan Keuangan Hari Ini
        </Button>
      </div>
      
      {showPorsiInput && (
          <Card className="mt-6">
              <CardHeader>
                  <CardTitle>Input Porsi Hari Ini</CardTitle>
                  <CardDescription>
                      Masukkan jumlah porsi besar dan kecil yang disalurkan hari ini.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                          <Label htmlFor="porsi-besar">Jumlah Porsi Besar</Label>
                          <Input id="porsi-besar" type="number" placeholder="Contoh: 50" />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="porsi-kecil">Jumlah Porsi Kecil</Label>
                          <Input id="porsi-kecil" type="number" placeholder="Contoh: 30" />
                      </div>
                  </div>
              </CardContent>
              <CardFooter className="justify-end">
                  <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Laporan
                  </Button>
              </CardFooter>
          </Card>
      )}
    </>
  );

  const renderAdminMode = () => (
    <Card>
        <CardHeader>
            <CardTitle>Input Porsi Harian (Admin Mode)</CardTitle>
            <CardDescription>
                Masukkan jumlah porsi harian untuk setiap SPPG secara langsung.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama SPPG</TableHead>
                        <TableHead className="w-[180px]">Jumlah Porsi Besar</TableHead>
                        <TableHead className="w-[180px]">Jumlah Porsi Kecil</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sppgOptions.map(sppg => (
                        <TableRow key={sppg.value}>
                            <TableCell className="font-medium">{sppg.label}</TableCell>
                            <TableCell>
                                <Input type="number" placeholder="0" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" placeholder="0" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="justify-end">
            <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Semua
            </Button>
        </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        {userRole === 'Admin Pusat' && (
            <div className="flex items-center space-x-2 justify-end">
                <Label htmlFor="admin-mode-switch">Admin Mode</Label>
                <Switch
                    id="admin-mode-switch"
                    checked={isAdminMode}
                    onCheckedChange={setIsAdminMode}
                />
            </div>
        )}
        {isAdminMode && userRole === 'Admin Pusat' ? renderAdminMode() : renderRegularMode()}
    </div>
  );
}
