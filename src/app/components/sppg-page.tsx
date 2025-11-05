
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
        <Button>Tambah SPPG</Button>
      </div>
    </div>
  );
}
