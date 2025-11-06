
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

const yayasanLogos: Record<string, string> = {
    "Yayasan Bisukma Bangun Bangsa": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413828035_Bisukma%20Bangun%20Bangsa.png",
    "Yayasan Patriot Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413871003_Patriot%20Generasi%20Emas%20Indonesia.png",
    "Yayasan Bisukma Hita Mangula": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413915579_Bisukma%20Hita%20Mangula.png",
    "Yayasan Bisukma Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413958140_Bisukma%20Generasi%20Emas%20Indonesia.png"
};

const menuDataBySppg: any = {}; // This will be populated by props

type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
};

type SppgId = string;

type KeuanganPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
    sppgList: SppgData[];
}

export default function KeuanganPage({ userRole, userSppgId, sppgList }: KeuanganPageProps) {
  const defaultSppg = userRole === 'SPPG' && userSppgId ? userSppgId : (sppgList[0]?.id || '');
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
    return sppgList.find(option => option.id === selectedSppg);
  }, [selectedSppg, sppgList]);

  const handleDownloadLogo = async () => {
    const yayasan = selectedSppgDetails?.yayasan;
    if (yayasan && yayasanLogos[yayasan]) {
      try {
        const response = await fetch(yayasanLogos[yayasan]);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${yayasan.replace(/ /g, '_')}-logo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
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
    <div className='space-y-6'>
      <Card>
          <CardHeader>
              <CardTitle>Laporan Keuangan</CardTitle>
              <CardDescription>Pilih SPPG dan tanggal untuk membuat laporan keuangan harian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="flex flex-col md:flex-row gap-4 items-end">
                {userRole === 'Admin Pusat' && (
                    <div className="grid gap-2 w-full md:flex-1">
                        <Label htmlFor="sppg-select">Pilih SPPG</Label>
                        <div className="flex items-center gap-2">
                            <Select onValueChange={(v) => setSelectedSppg(v as SppgId)} value={selectedSppg}>
                            <SelectTrigger id="sppg-select">
                                <SelectValue placeholder="Pilih SPPG" />
                            </SelectTrigger>
                            <SelectContent>
                                {sppgList.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    <div>
                                    <p className="font-medium">{option.nama}</p>
                                    {option.alamat && <p className="text-xs text-muted-foreground">{option.alamat}</p>}
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
            <div className="grid gap-2 w-full md:flex-1">
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
          </CardContent>
          <CardFooter className="justify-end">
             <Button onClick={handleBuatLaporanClick} className="w-full sm:w-auto">
                <FilePlus className="mr-2 h-4 w-4" />
                Buat Laporan Keuangan Hari Ini
             </Button>
          </CardFooter>
      </Card>
      
      {showPorsiInput && (
          <Card>
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
                  <Button className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Laporan
                  </Button>
              </CardFooter>
          </Card>
      )}
    </div>
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
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama SPPG</TableHead>
                            <TableHead className="w-[180px]">Jumlah Porsi Besar</TableHead>
                            <TableHead className="w-[180px]">Jumlah Porsi Kecil</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sppgList.map(sppg => (
                            <TableRow key={sppg.id}>
                                <TableCell className="font-medium">{sppg.nama}</TableCell>
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
            </div>
        </CardContent>
        <CardFooter className="justify-end">
            <Button className="w-full sm:w-auto">
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
