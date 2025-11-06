
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
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import type { SppgData } from '../data/mock';
import { getSppgListWithDynamicPM } from '../data/mock';


const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2 text-sm">
        <dt className="text-muted-foreground col-span-1">{label}</dt>
        <dd className="font-medium col-span-2">{value || '-'}</dd>
    </div>
);

const SppgForm = ({ sppg }: { sppg?: SppgData | null }) => {
    return (
        <div className="flex flex-col md:flex-row gap-8 py-4">
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
                <Input id="nama-sppg" placeholder="Contoh: SPPG Sejahtera" defaultValue={sppg?.nama} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input id="alamat" placeholder="Contoh: Jl. Pembangunan No. 123" defaultValue={sppg?.alamat} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="yayasan">Yayasan</Label>
                <Input id="yayasan" placeholder="Contoh: Yayasan Harapan Bangsa" defaultValue={sppg?.yayasan} />
                </div>
            </div>

            <Separator orientation="vertical" className="h-auto hidden md:block" />

            {/* Right Segment */}
            <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">
                Data Personel
                </h3>
                <div className="grid gap-2">
                <Label htmlFor="nama-ka-sppg">Nama Ka. SPPG</Label>
                <Input id="nama-ka-sppg" placeholder="Contoh: Budi Santoso" defaultValue={sppg?.namaKaSppg} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="nama-akuntan">Nama Akuntan</Label>
                <Input id="nama-akuntan" placeholder="Contoh: Siti Aminah" defaultValue={sppg?.namaAkuntan} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="ahli-gizi">Ahli Gizi</Label>
                <Input id="ahli-gizi" placeholder="Contoh: Dr. Ani" defaultValue={sppg?.ahliGizi} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="asisten-lapangan">Asisten Lapangan</Label>
                <Input id="asisten-lapangan" placeholder="Contoh: Joko" defaultValue={sppg?.asistenLapangan} />
                </div>
            </div>
        </div>
    );
};


export default function SppgPage() {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSppg, setSelectedSppg] = useState<SppgData | null>(null);

  const sppgList = useMemo(() => getSppgListWithDynamicPM(), []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const paginatedSppg = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sppgList.slice(startIndex, endIndex);
  }, [sppgList, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sppgList.length / itemsPerPage);
  
  const handleRowClick = (sppg: SppgData) => {
    setSelectedSppg(sppg);
    setIsDetailOpen(true);
  }

  const handleEditClick = () => {
    setIsDetailOpen(false);
    setIsEditOpen(true);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daftar SPPG</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nama SPPG</TableHead>
                  <TableHead>Yayasan</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Penerima Manfaat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSppg.map((sppg) => (
                  <TableRow 
                    key={sppg.id} 
                    onClick={() => handleRowClick(sppg)}
                    className="cursor-pointer"
                  >
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
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Tambah SPPG</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tambah SPPG Baru</DialogTitle>
              </DialogHeader>
              <SppgForm />
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Detail Dialog */}
      {selectedSppg && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{selectedSppg.nama}</DialogTitle>
                    <DialogDescription>{selectedSppg.yayasan}</DialogDescription>
                </DialogHeader>
                 <div className="grid gap-6 py-4">
                    {/* Data Umum */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Data Umum</h3>
                        <dl className="grid gap-2">
                            <DetailItem label="Alamat" value={selectedSppg.alamat} />
                            <DetailItem label="Penerima Manfaat" value={selectedSppg.penerimaManfaat} />
                        </dl>
                    </div>

                    <Separator />
                    
                    {/* Data Personel */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Data Personel</h3>
                        <dl className="grid gap-2">
                            <DetailItem label="Nama Ka. SPPG" value={selectedSppg.namaKaSppg} />
                            <DetailItem label="Nama Akuntan" value={selectedSppg.namaAkuntan} />
                            <DetailItem label="Ahli Gizi" value={selectedSppg.ahliGizi} />
                            <DetailItem label="Asisten Lapangan" value={selectedSppg.asistenLapangan} />
                        </dl>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={handleEditClick}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
       {selectedSppg && (
         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Data SPPG</DialogTitle>
                <DialogDescription>
                  Ubah data untuk {selectedSppg.nama}. Klik simpan jika sudah selesai.
                </DialogDescription>
              </DialogHeader>
              <SppgForm sppg={selectedSppg} />
              <DialogFooter>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </DialogContent>
         </Dialog>
       )}
    </>
  );
}
