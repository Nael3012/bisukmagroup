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
import { Info, ChevronLeft, ChevronRight, Pencil, Upload, X } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { WilayahSelector } from './wilayah-selector';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';


type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
  penerimaManfaat: number;
  namaKaSppg: string;
  namaAkuntan: string;
  ahliGizi: string;
  asistenLapangan: string;
  wilayah: any;
  logo_url: string | null;
};


const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2 text-sm">
        <dt className="text-muted-foreground col-span-1">{label}</dt>
        <dd className="font-medium col-span-2">{value || '-'}</dd>
    </div>
);

const yayasanOptions = [
    "Yayasan Bisukma Bangun Bangsa",
    "Yayasan Patriot Generasi Emas Indonesia",
    "Yayasan Bisukma Hita Mangula",
    "Yayasan Bisukma Generasi Emas Indonesia"
];

const SppgForm = ({ sppg, onSave }: { sppg?: SppgData | null, onSave: () => void }) => {
    const [selectedYayasan, setSelectedYayasan] = useState(sppg?.yayasan || '');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(sppg?.logo_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSelectedYayasan(sppg?.yayasan || '');
        setImagePreview(sppg?.logo_url || null);
        setLogoFile(null);
    }, [sppg]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = async () => {
        let logoUrlToSave = sppg?.logo_url || null;

        if (logoFile) {
            const fileName = `${Date.now()}_${logoFile.name}`;
            const { data, error } = await supabase.storage
                .from('logos') // Pastikan bucket 'logos' ada di Supabase Storage
                .upload(fileName, logoFile);

            if (error) {
                console.error('Error uploading logo:', error);
                // Tambahkan notifikasi error jika perlu
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('logos')
                .getPublicUrl(data.path);
            
            logoUrlToSave = publicUrl;
        }

        // Logika untuk menyimpan data sppg ke database (termasuk logoUrlToSave)
        // ...
        // Misalnya:
        // const { error } = await supabase.from('sppg').update({ logo_url: logoUrlToSave }).eq('id', sppg.id);
        
        console.log("URL to save:", logoUrlToSave);
        onSave(); // Panggil onSave untuk menutup dialog
    }

    return (
        <>
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
                  <Label>Wilayah</Label>
                  <WilayahSelector onWilayahChange={() => {}} initialData={sppg?.wilayah} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="alamat">Alamat Detail</Label>
                <Input id="alamat" placeholder="Contoh: Jl. Pembangunan No. 123" defaultValue={sppg?.alamat} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="yayasan">Yayasan</Label>
                    <Select value={selectedYayasan} onValueChange={setSelectedYayasan}>
                        <SelectTrigger id="yayasan">
                            <SelectValue placeholder="Pilih Yayasan" />
                        </SelectTrigger>
                        <SelectContent>
                            {yayasanOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                 <div className="grid gap-2">
                  <Label htmlFor="logo-upload">Logo Yayasan</Label>
                  <div 
                    className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                     {imagePreview ? (
                          <>
                          <Image
                            src={imagePreview}
                            alt="Pratinjau logo"
                            fill
                            className="p-2 object-contain rounded-md"
                          />
                          <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setImagePreview(null);
                                  setLogoFile(null);
                                  if (fileInputRef.current) {
                                      fileInputRef.current.value = '';
                                  }
                              }}
                              className="absolute top-1 right-1 h-6 w-6"
                          >
                              <X className="h-4 w-4" />
                          </Button>
                          </>
                     ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Upload className="w-8 h-8 mb-2" />
                            <p className="mb-1 text-xs">
                              <span className="font-semibold">Klik untuk mengunggah</span>
                            </p>
                            <p className="text-xs">PNG, JPG (MAX. 2MB)</p>
                        </div>
                     )}
                     <Input 
                        ref={fileInputRef}
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                     />
                  </div>
                </div>
            </div>
        </div>
        <DialogFooter>
            <Button type="button" onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
        </>
    );
};

type SppgPageProps = {
  sppgList: SppgData[];
}

export default function SppgPage({ sppgList }: SppgPageProps) {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSppg, setSelectedSppg] = useState<SppgData | null>(null);

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

  const handleCloseDialogs = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDetailOpen(false);
    setSelectedSppg(null);
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
          
          <Dialog open={isAddOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddOpen(true)}>Tambah SPPG</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tambah SPPG Baru</DialogTitle>
              </DialogHeader>
              <SppgForm onSave={handleCloseDialogs} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Detail Dialog */}
      {selectedSppg && (
        <Dialog open={isDetailOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
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
                            {selectedSppg.logo_url && (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border my-2">
                                    <Image src={selectedSppg.logo_url} alt={`Logo ${selectedSppg.yayasan}`} fill className="object-contain" />
                                </div>
                            )}
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
         <Dialog open={isEditOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Data SPPG</DialogTitle>
                <DialogDescription>
                  Ubah data untuk {selectedSppg.nama}. Klik simpan jika sudah selesai.
                </DialogDescription>
              </DialogHeader>
              <SppgForm sppg={selectedSppg} onSave={handleCloseDialogs} />
            </DialogContent>
         </Dialog>
       )}
    </>
  );
}
