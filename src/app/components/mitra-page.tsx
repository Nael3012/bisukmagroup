
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
import { useState, useRef, useEffect } from 'react';

type Sekolah = {
  nama: string;
  alamat: string;
  jenjang: string;
  jumlahPM: number;
  sppg: string;
};

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
  const [selectedSppg, setSelectedSppg] = useState('');
  const [filteredSekolah, setFilteredSekolah] = useState<Sekolah[]>([]);

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
    const filtered = semuaDaftarSekolah.filter((sekolah) => sekolah.sppg === value);
    setFilteredSekolah(filtered);
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
              <div className="w-full max-w-xs">
                <Select onValueChange={handleSppgChange} value={selectedSppg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih SPPG" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sppg-al-ikhlas">SPPG Al-Ikhlas</SelectItem>
                    <SelectItem value="sppg-bina-umat">SPPG Bina Umat</SelectItem>
                    <SelectItem value="sppg-nurul-hidayah">SPPG Nurul Hidayah</SelectItem>
                  </SelectContent>
                </Select>
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
                  {selectedSppg ? (
                    filteredSekolah.length > 0 ? (
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
                    )
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Silakan pilih SPPG untuk melihat daftar sekolah.
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
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
