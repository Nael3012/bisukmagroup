
'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

type SppgData = {
  nama: string;
  yayasan: string;
  alamat: string;
  penerimaManfaat: number;
};

const sppgList: SppgData[] = [
  {
    nama: 'SPPG Al-Ikhlas',
    yayasan: 'Yayasan Al-Ikhlas',
    alamat: 'Jl. Merdeka No. 1, Jakarta',
    penerimaManfaat: 150,
  },
  {
    nama: 'SPPG Bina Umat',
    yayasan: 'Yayasan Bina Umat',
    alamat: 'Jl. Pahlawan No. 10, Surabaya',
    penerimaManfaat: 200,
  },
  {
    nama: 'SPPG Nurul Hidayah',
    yayasan: 'Yayasan Nurul Hidayah',
    alamat: 'Jl. Sudirman No. 5, Bandung',
    penerimaManfaat: 120,
  },
];

export default function SppgPage() {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const paginatedSppg = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sppgList.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sppgList.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar SPPG</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama SPPG</TableHead>
                <TableHead>Yayasan</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Penerima Manfaat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSppg.map((sppg, index) => (
                <TableRow key={index}>
                  <TableCell>{sppg.nama}</TableCell>
                  <TableCell>{sppg.yayasan}</TableCell>
                  <TableCell>{sppg.alamat}</TableCell>
                  <TableCell>{sppg.penerimaManfaat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2">
            <Label htmlFor="items-per-page-sppg">Tampilkan</Label>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger id="items-per-page-sppg" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Sebelumnya</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Selanjutnya</span>
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Tambah SPPG</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tambah SPPG Baru</DialogTitle>
            </DialogHeader>
            <div className="flex gap-8 py-4">
              {/* Left Segment */}
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Data Umum
                </h3>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Pastikan data umum yang Anda masukkan di sini sudah sesuai dengan informasi yang terdaftar pada akun Mitra BGN Anda untuk memastikan sinkronisasi dan validasi data yang lancar.
                  </AlertDescription>
                </Alert>
                <div className="grid gap-2">
                  <Label htmlFor="nama-sppg">Nama SPPG</Label>
                  <Input id="nama-sppg" placeholder="Contoh: SPPG Sejahtera" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input id="alamat" placeholder="Contoh: Jl. Pembangunan No. 123" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yayasan">Yayasan</Label>
                  <Input id="yayasan" placeholder="Contoh: Yayasan Harapan Bangsa" />
                </div>
              </div>

              <Separator orientation="vertical" className="h-auto" />

              {/* Right Segment */}
              <div className="flex-1 space-y-4">
                 <h3 className="text-lg font-semibold text-muted-foreground">
                  Data Personel
                </h3>
                <div className="grid gap-2">
                  <Label htmlFor="nama-ka-sppg">Nama Ka. SPPG</Label>
                  <Input id="nama-ka-sppg" placeholder="Contoh: Budi Santoso" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nama-akuntan">Nama Akuntan</Label>
                  <Input id="nama-akuntan" placeholder="Contoh: Siti Aminah" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ahli-gizi">Ahli Gizi</Label>
                  <Input id="ahli-gizi" placeholder="Contoh: Dr. Ani" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="asisten-lapangan">Asisten Lapangan</Label>
                  <Input id="asisten-lapangan" placeholder="Contoh: Joko" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

    