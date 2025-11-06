
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
import { Info, ChevronLeft, ChevronRight, Pencil, Upload } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { WilayahSelector } from './wilayah-selector';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useFormState, useFormStatus } from 'react-dom';
import { saveSppg, type SppgFormState } from '@/app/actions/sppg';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
  penerimamanfaat: number;
  nama_ka_sppg: string;
  nama_akuntan: string;
  ahli_gizi: string;
  asisten_lapangan: string;
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

const yayasanLogos: Record<string, string> = {
    "Yayasan Bisukma Bangun Bangsa": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413828035_Bisukma%20Bangun%20Bangsa.png",
    "Yayasan Patriot Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413871003_Patriot%20Generasi%20Emas%20Indonesia.png",
    "Yayasan Bisukma Hita Mangula": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413915579_Bisukma%20Hita%20Mangula.png",
    "Yayasan Bisukma Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413958140_Bisukma%20Generasi%20Emas%20Indonesia.png"
};

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
    );
};


const SppgForm = ({ sppg, onSaveSuccess }: { sppg?: SppgData | null, onSaveSuccess: () => void }) => {
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    
    const [selectedYayasan, setSelectedYayasan] = useState(sppg?.yayasan || '');
    const [logoUrl, setLogoUrl] = useState<string | null>(sppg?.logo_url || null);
    const [wilayah, setWilayah] = useState(sppg?.wilayah || {});
    
    const initialState: SppgFormState = { message: '', errors: {} };
    const [state, dispatch] = useFormState(saveSppg, initialState);

    useEffect(() => {
        setSelectedYayasan(sppg?.yayasan || '');
        setLogoUrl(sppg?.logo_url || null);
        setWilayah(sppg?.wilayah || {});
    }, [sppg]);
    
    useEffect(() => {
        if (state.message) {
            if (state.errors) {
                toast({
                    variant: "destructive",
                    title: "Gagal Menyimpan",
                    description: state.message,
                });
            } else {
                toast({
                    title: "Sukses!",
                    description: state.message,
                });
                onSaveSuccess();
                router.refresh();
                formRef.current?.reset();
            }
        }
    }, [state, toast, onSaveSuccess, router]);


    const handleYayasanChange = (yayasan: string) => {
        setSelectedYayasan(yayasan);
        setLogoUrl(yayasanLogos[yayasan] || null);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('logos')
            .upload(fileName, file);

        if (error) {
            console.error('Error uploading file:', error);
            toast({
                variant: 'destructive',
                title: 'Gagal Unggah Logo',
                description: error.message
            });
        } else {
            const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName);
            setLogoUrl(publicUrl);
            toast({
                title: 'Logo Berhasil Diunggah',
                description: 'URL logo telah diperbarui.'
            });
        }
    };
    

    return (
        <form ref={formRef} action={dispatch}>
            <input type="hidden" name="id" value={sppg?.id || ''} />
            <input type="hidden" name="logo_url" value={logoUrl || ''} />
            <input type="hidden" name="wilayah.province" value={wilayah?.province || ''} />
            <input type="hidden" name="wilayah.regency" value={wilayah?.regency || ''} />
            <input type="hidden" name="wilayah.district" value={wilayah?.district || ''} />
            <input type="hidden" name="wilayah.village" value={wilayah?.village || ''} />

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
                        <Input id="nama-sppg" name="nama" placeholder="Contoh: SPPG Sejahtera" defaultValue={sppg?.nama} />
                        {state.errors?.nama && <p className="text-sm text-destructive">{state.errors.nama[0]}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label>Wilayah</Label>
                        <WilayahSelector onWilayahChange={setWilayah} initialData={sppg?.wilayah} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="alamat">Alamat Detail</Label>
                        <Input id="alamat" name="alamat" placeholder="Contoh: Jl. Pembangunan No. 123" defaultValue={sppg?.alamat} />
                        {state.errors?.alamat && <p className="text-sm text-destructive">{state.errors.alamat[0]}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="yayasan">Yayasan</Label>
                        <Select name="yayasan" value={selectedYayasan} onValueChange={handleYayasanChange}>
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
                        {state.errors?.yayasan && <p className="text-sm text-destructive">{state.errors.yayasan[0]}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label>Logo Yayasan</Label>
                        <div className="relative flex items-center justify-center w-full h-40 border rounded-lg bg-muted/20">
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt="Logo yayasan"
                                    fill
                                    className="p-2 object-contain rounded-md"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground text-sm">
                                    Logo akan tampil di sini setelah memilih yayasan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Separator orientation="vertical" className="h-auto hidden md:block" />

                {/* Right Segment */}
                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                    Data Personel
                    </h3>
                    <div className="grid gap-2">
                    <Label htmlFor="nama_ka_sppg">Nama Ka. SPPG</Label>
                    <Input id="nama_ka_sppg" name="nama_ka_sppg" placeholder="Contoh: Budi Santoso" defaultValue={sppg?.nama_ka_sppg} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="nama_akuntan">Nama Akuntan</Label>
                    <Input id="nama_akuntan" name="nama_akuntan" placeholder="Contoh: Siti Aminah" defaultValue={sppg?.nama_akuntan} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="ahli_gizi">Ahli Gizi</Label>
                    <Input id="ahli_gizi" name="ahli_gizi" placeholder="Contoh: Dr. Ani" defaultValue={sppg?.ahli_gizi} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="asisten_lapangan">Asisten Lapangan</Label>
                    <Input id="asisten_lapangan" name="asisten_lapangan" placeholder="Contoh: Joko" defaultValue={sppg?.asisten_lapangan} />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <SubmitButton />
            </DialogFooter>
        </form>
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
            <div className="overflow-x-auto">
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
                      <TableCell>{sppg.penerimamanfaat}</TableCell>
                    </TableRow>
                  ))}
                   {paginatedSppg.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center h-24">
                              Belum ada data SPPG.
                          </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Selanjutnya</span>
            </Button>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => !open ? handleCloseDialogs() : setIsAddOpen(true)}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedSppg(null); setIsAddOpen(true); }}>Tambah SPPG</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tambah SPPG Baru</DialogTitle>
              </DialogHeader>
              <SppgForm onSaveSuccess={handleCloseDialogs} />
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
                            <DetailItem label="Penerima Manfaat" value={selectedSppg.penerimamanfaat} />
                        </dl>
                    </div>

                    <Separator />
                    
                    {/* Data Personel */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Data Personel</h3>
                        <dl className="grid gap-2">
                            <DetailItem label="Nama Ka. SPPG" value={selectedSppg.nama_ka_sppg} />
                            <DetailItem label="Nama Akuntan" value={selectedSppg.nama_akuntan} />
                            <DetailItem label="Ahli Gizi" value={selectedSppg.ahli_gizi} />
                            <DetailItem label="Asisten Lapangan" value={selectedSppg.asisten_lapangan} />
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
              <SppgForm sppg={selectedSppg} onSaveSuccess={handleCloseDialogs} />
            </DialogContent>
         </Dialog>
       )}
    </>
  );
}
