
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
};

const daftarSekolah: Sekolah[] = [
  {
    nama: 'SDN Merdeka 1',
    alamat: 'Jl. Kemerdekaan No. 10, Jakarta',
    jenjang: 'SD',
    jumlahPM: 50,
  },
  {
    nama: 'SMP Bina Bangsa',
    alamat: 'Jl. Pendidikan No. 25, Bandung',
    jenjang: 'SMP',
    jumlahPM: 75,
  },
  {
    nama: 'SMA Cendekia',
    alamat: 'Jl. Pelajar No. 5, Surabaya',
    jenjang: 'SMA',
    jumlahPM: 100,
  },
];


export default function MitraPage() {
  const [activeTab, setActiveTab] = useState('sekolah');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

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
                <Select>
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
                  {daftarSekolah.map((sekolah, index) => (
                    <TableRow key={index}>
                      <TableCell>{sekolah.nama}</TableCell>
                      <TableCell>{sekolah.alamat}</TableCell>
                      <TableCell>{sekolah.jenjang}</TableCell>
                      <TableCell>{sekolah.jumlahPM}</TableCell>
                    </TableRow>
                  ))}
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
