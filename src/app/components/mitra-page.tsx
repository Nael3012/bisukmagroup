
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect } from 'react';

type Sekolah = {
  nama: string;
  alamat: string;
  jenjang: string;
  jumlahPM: number;
  sppg: string;
};

type Jenjang = 'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | '';


const semuaDaftarSekolah: Sekolah[] = [
  {
    nama: 'SDN Merdeka 1',
    alamat: 'Jl. Kemerdekaan No. 10, Jakarta',
    jenjang: 'SD',
    jumlahPM: 50,
    sppg: 'sppg-al-ikhlas',
  },
  {
    nama: 'SMP Juara',
    alamat: 'Jl. Kemenangan No. 5, Jakarta',
    jenjang: 'SMP',
    jumlahPM: 60,
    sppg: 'sppg-al-ikhlas',
  },
  {
    nama: 'SMP Bina Bangsa',
    alamat: 'Jl. Pendidikan No. 25, Bandung',
    jenjang: 'SMP',
    jumlahPM: 75,
    sppg: 'sppg-bina-umat',
  },
  {
    nama: 'SMK Bisa',
    alamat: 'Jl. Industri No. 1, Bandung',
    jenjang: 'SMK',
    jumlahPM: 90,
    sppg: 'sppg-bina-umat',
  },
  {
    nama: 'SMA Cendekia',
    alamat: 'Jl. Pelajar No. 5, Surabaya',
    jenjang: 'SMA',
    jumlahPM: 100,
    sppg: 'sppg-nurul-hidayah',
  },
   {
    nama: 'SD Pelita Harapan',
    alamat: 'Jl. Ilmu No. 15, Surabaya',
    jenjang: 'SD',
    jumlahPM: 45,
    sppg: 'sppg-nurul-hidayah',
  },
];


export default function MitraPage() {
  const [activeTab, setActiveTab] = useState('sekolah');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedSppg, setSelectedSppg] = useState('all');
  const [filteredSekolah, setFilteredSekolah] = useState<Sekolah[]>(semuaDaftarSekolah);
  const [selectedJenjang, setSelectedJenjang] = useState<Jenjang>('');


  useEffect(() => {
    const activeTabIndex = tabsRef.current.findIndex(
      (tab) => tab?.dataset.value === activeTab
    );
    const activeTabElement = tabsRef.current[activeTabIndex];

    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleSppgChange = (value: string) => {
    setSelectedSppg(value);
    if (value === 'all') {
      setFilteredSekolah(semuaDaftarSekolah);
    } else {
      const filtered = semuaDaftarSekolah.filter((sekolah) => sekolah.sppg === value);
      setFilteredSekolah(filtered);
    }
  };

  const renderPorsiInputs = () => {
    switch (selectedJenjang) {
      case 'PAUD':
      case 'TK':
        return (
          <div className="grid gap-2">
            <Label htmlFor="porsi-kecil">Jumlah Porsi Kecil</Label>
            <Input id="porsi-kecil" type="number" placeholder="Contoh: 50" />
          </div>
        );
      case 'SD':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="porsi-kecil">Jumlah Porsi Kecil (Kelas 1-3)</Label>
              <Input id="porsi-kecil" type="number" placeholder="Contoh: 30" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="porsi-besar">Jumlah Porsi Besar (Kelas 4-6)</Label>
              <Input id="porsi-besar" type="number" placeholder="Contoh: 20" />
            </div>
          </>
        );
      case 'SMP':
      case 'SMA':
        return (
          <div className="grid gap-2">
            <Label htmlFor="porsi-besar">Jumlah Porsi Besar</Label>
            <Input id="porsi-besar" type="number" placeholder="Contoh: 80" />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitra</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sekolah" onValueChange={setActiveTab} className="relative">
          <TabsList>
            <TabsTrigger
              value="sekolah"
              ref={(el) => (tabsRef.current[0] = el)}
              data-value="sekolah"
            >
              Sekolah Penerima Manfaat
            </TabsTrigger>
            <TabsTrigger
              value="b3"
              ref={(el) => (tabsRef.current[1] = el)}
              data-value="b3"
            >
              B3 Penerima Manfaat
            </TabsTrigger>
             <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
          </TabsList>
          <TabsContent value="sekolah">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-full max-w-xs">
                  <Select onValueChange={handleSppgChange} value={selectedSppg}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih SPPG" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua SPPG</SelectItem>
                      <SelectItem value="sppg-al-ikhlas">SPPG Al-Ikhlas</SelectItem>
                      <SelectItem value="sppg-bina-umat">SPPG Bina Umat</SelectItem>
                      <SelectItem value="sppg-nurul-hidayah">SPPG Nurul Hidayah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Sekolah</TableHead>
                    <TableHead>Alamat Sekolah</TableHead>
                    <TableHead>Jenjang</TableHead>
                    <TableHead>Jumlah PM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSekolah.length > 0 ? (
                    filteredSekolah.map((sekolah, index) => (
                      <TableRow key={index}>
                        <TableCell>{sekolah.nama}</TableCell>
                        <TableCell>{sekolah.alamat}</TableCell>
                        <TableCell>{sekolah.jenjang}</TableCell>
                        <TableCell>{sekolah.jumlahPM}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Tidak ada data sekolah untuk SPPG ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-start pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Tambah Sekolah</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Sekolah Penerima Manfaat</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-8 py-4">
                      {/* Left Segment */}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          Data Umum
                        </h3>
                        <div className="grid gap-2">
                          <Label htmlFor="nama-sekolah">Nama Sekolah</Label>
                          <Input id="nama-sekolah" placeholder="Contoh: SD Negeri 1" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="alamat-sekolah">Alamat Sekolah</Label>
                          <Input id="alamat-sekolah" placeholder="Contoh: Jl. Pendidikan No. 1" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="jenjang">Jenjang</Label>
                           <Select onValueChange={(value) => setSelectedJenjang(value as Jenjang)} value={selectedJenjang}>
                            <SelectTrigger id="jenjang">
                              <SelectValue placeholder="Pilih Jenjang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PAUD">PAUD</SelectItem>
                              <SelectItem value="TK">TK</SelectItem>
                              <SelectItem value="SD">SD</SelectItem>
                              <SelectItem value="SMP">SMP</SelectItem>
                              <SelectItem value="SMA">SMA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-auto" />

                      {/* Right Segment */}
                      <div className="flex-1 space-y-4">
                         <h3 className="text-lg font-semibold text-muted-foreground">
                          Data Personel & Porsi
                        </h3>
                        <div className="grid gap-2">
                          <Label htmlFor="nama-kepala-sekolah">Nama Kepala Sekolah</Label>
                          <Input id="nama-kepala-sekolah" placeholder="Contoh: Budi Santoso" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="nama-pic">Nama PIC</Label>
                          <Input id="nama-pic" placeholder="Contoh: Siti Aminah" />
                        </div>
                        {renderPorsiInputs()}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Simpan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="b3">
            <div className="p-4">
              <p>Konten untuk B3 Penerima Manfaat akan ditampilkan di sini.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
