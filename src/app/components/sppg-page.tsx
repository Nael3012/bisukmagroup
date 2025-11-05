
'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
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
import { Info } from 'lucide-react';

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
              {sppgList.map((sppg, index) => (
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
      <div className="flex justify-start">
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
