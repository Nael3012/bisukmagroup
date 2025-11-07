
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
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect, useMemo, useActionState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { WilayahSelector } from './wilayah-selector';
import type { SppgData, Sekolah, B3Data } from '../client-page';
import { useFormStatus } from 'react-dom';
import { saveSekolah, saveB3, type MitraFormState } from '@/app/actions/mitra';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type Jenjang = 'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | '';
type SortableKeysSekolah = keyof Omit<Sekolah, 'id' | 'sppg_id' | 'wilayah'>;
type SortableKeysB3 = keyof Omit<B3Data, 'id' | 'jenis' | 'sppg_id' | 'wilayah'>;
type SppgId = 'all' | string;

type MitraPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
    semuaDaftarSekolah: Sekolah[];
    semuaDaftarB3: B3Data[];
    sppgList: SppgData[];
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2 text-sm">
    <dt className="text-muted-foreground col-span-1">{label}</dt>
    <dd className="font-medium col-span-2">{value || '-'}</dd>
  </div>
);

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan'}
        </Button>
    );
};

const SekolahForm = ({ 
    sekolah, 
    sppgList, 
    userRole, 
    userSppgId, 
    onSaveSuccess 
}: { 
    sekolah?: Sekolah | null,
    sppgList: SppgData[],
    userRole: 'Admin Pusat' | 'SPPG',
    userSppgId?: SppgId,
    onSaveSuccess: () => void 
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const initialState: MitraFormState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(saveSekolah, initialState);
  
  const [selectedJenjang, setSelectedJenjang] = useState<Jenjang>((sekolah?.jenjang as Jenjang) || '');
  const [wilayah, setWilayah] = useState(sekolah?.wilayah || {});
  
  useEffect(() => {
    if (state.message) {
        if (state.errors) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: state.message });
        } else {
            toast({ title: "Sukses!", description: state.message });
            onSaveSuccess();
            router.refresh();
        }
    }
  }, [state, toast, onSaveSuccess, router]);

  useEffect(() => {
    if (!sekolah) {
        formRef.current?.reset();
        setSelectedJenjang('');
        setWilayah({});
    } else {
        setSelectedJenjang(sekolah.jenjang as Jenjang);
        setWilayah(sekolah.wilayah);
    }
  }, [sekolah]);

  return (
    <form ref={formRef} action={dispatch}>
      <input type="hidden" name="id" value={sekolah?.id || ''} />
      <input type="hidden" name="wilayah_province" value={wilayah?.province || ''} />
      <input type="hidden" name="wilayah_regency" value={wilayah?.regency || ''} />
      <input type="hidden" name="wilayah_district" value={wilayah?.district || ''} />
      <input type="hidden" name="wilayah_village" value={wilayah?.village || ''} />

      <div className="flex flex-col md:flex-row gap-6 py-4">
        <div className="flex-1 space-y-3">
          <h3 className="text-base font-semibold text-muted-foreground">
            Data Umum
          </h3>
           {userRole === 'Admin Pusat' && (
                <div className="grid gap-1.5">
                    <Label htmlFor="sppg_id" className="text-xs">SPPG Penanggung Jawab</Label>
                    <Select name="sppg_id" defaultValue={sekolah?.sppg_id}>
                        <SelectTrigger id="sppg_id" className="text-xs h-9">
                            <SelectValue placeholder="Pilih SPPG" />
                        </SelectTrigger>
                        <SelectContent>
                            {sppgList.map(s => <SelectItem key={s.id} value={s.id} className="text-xs">{s.nama}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {userRole === 'SPPG' && userSppgId && <input type="hidden" name="sppg_id" value={userSppgId} />}
          <div className="grid gap-1.5">
            <Label htmlFor="nama-sekolah" className="text-xs">Nama Sekolah</Label>
            <Input name="nama" id="nama-sekolah" placeholder="Contoh: SD Negeri 1" defaultValue={sekolah?.nama} className="text-xs h-9" />
          </div>
          <WilayahSelector onWilayahChange={setWilayah} initialData={sekolah?.wilayah} />
          <div className="grid gap-1.5">
            <Label htmlFor="alamat-sekolah" className="text-xs">Alamat Detail</Label>
            <Input name="alamat" id="alamat-sekolah" placeholder="Contoh: Jl. Pendidikan No. 1" defaultValue={sekolah?.alamat} className="text-xs h-9" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="jenjang" className="text-xs">Jenjang</Label>
            <Select name="jenjang" onValueChange={(value) => setSelectedJenjang(value as Jenjang)} value={selectedJenjang}>
              <SelectTrigger id="jenjang" className="text-xs h-9">
                <SelectValue placeholder="Pilih Jenjang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAUD" className="text-xs">PAUD</SelectItem>
                <SelectItem value="TK" className="text-xs">TK</SelectItem>
                <SelectItem value="SD" className="text-xs">SD</SelectItem>
                <SelectItem value="SMP" className="text-xs">SMP</SelectItem>
                <SelectItem value="SMA" className="text-xs">SMA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator orientation="vertical" className="h-auto hidden md:block" />
        <div className="flex-1 space-y-3">
          <h3 className="text-base font-semibold text-muted-foreground">
            Data Personel &amp; Penerima Manfaat
          </h3>
          <div className="grid gap-1.5">
            <Label htmlFor="nama-kepala-sekolah" className="text-xs">Nama Kepala Sekolah</Label>
            <Input name="nama_kepala_sekolah" id="nama-kepala-sekolah" placeholder="Contoh: Budi Santoso" defaultValue={sekolah?.nama_kepala_sekolah || ''} className="text-xs h-9" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="nama-pic" className="text-xs">Nama PIC</Label>
            <Input name="nama_pic" id="nama-pic" placeholder="Contoh: Siti Aminah" defaultValue={sekolah?.nama_pic || ''} className="text-xs h-9" />
          </div>
          <div className="grid gap-1.5">
              <Label htmlFor="telp-pic" className="text-xs">Nomor Telepon PIC</Label>
              <Input name="telepon_pic" id="telp-pic" type="tel" placeholder="0812..." defaultValue={sekolah?.telepon_pic || ''} className="text-xs h-9" />
          </div>
            <div className="grid gap-1.5">
                <Label htmlFor="jumlahpm" className="text-xs">Total Penerima Manfaat</Label>
                <Input name="jumlahpm" id="jumlahpm" type="number" placeholder="0" defaultValue={sekolah?.jumlahpm || ''} className="text-xs h-9" />
            </div>
        </div>
      </div>
      <DialogFooter>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
};

const B3Form = ({ b3, sppgList, userRole, userSppgId, onSaveSuccess }: { 
    b3?: B3Data | null,
    sppgList: SppgData[],
    userRole: 'Admin Pusat' | 'SPPG',
    userSppgId?: SppgId,
    onSaveSuccess: () => void
}) => {
    const { toast } = useToast();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    
    const initialState: MitraFormState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(saveB3, initialState);
    const [wilayah, setWilayah] = useState(b3?.wilayah || {});

    useEffect(() => {
        if (state.message) {
            if (state.errors) {
                toast({ variant: "destructive", title: "Gagal Menyimpan", description: state.message });
            } else {
                toast({ title: "Sukses!", description: state.message });
                onSaveSuccess();
                router.refresh();
            }
        }
    }, [state, toast, onSaveSuccess, router]);

    useEffect(() => {
        if (!b3) {
            formRef.current?.reset();
            setWilayah({});
        } else {
            setWilayah(b3.wilayah);
        }
    }, [b3]);

    return (
        <form ref={formRef} action={dispatch}>
            <input type="hidden" name="id" value={b3?.id || ''} />
            <input type="hidden" name="wilayah_province" value={wilayah?.province || ''} />
            <input type="hidden" name="wilayah_regency" value={wilayah?.regency || ''} />
            <input type="hidden" name="wilayah_district" value={wilayah?.district || ''} />
            <input type="hidden" name="wilayah_village" value={wilayah?.village || ''} />
            
            <div className="flex flex-col md:flex-row gap-6 py-4">
                <div className="flex-1 space-y-3">
                    <h3 className="text-base font-semibold text-muted-foreground">
                        Data Umum
                    </h3>
                    {userRole === 'Admin Pusat' && (
                        <div className="grid gap-1.5">
                            <Label htmlFor="sppg_id_b3" className="text-xs">SPPG Penanggung Jawab</Label>
                            <Select name="sppg_id" defaultValue={b3?.sppg_id}>
                                <SelectTrigger id="sppg_id_b3" className="text-xs h-9">
                                    <SelectValue placeholder="Pilih SPPG" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sppgList.map(s => <SelectItem key={s.id} value={s.id} className="text-xs">{s.nama}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {userRole === 'SPPG' && userSppgId && <input type="hidden" name="sppg_id" value={userSppgId} />}

                    <div className="grid gap-1.5">
                        <Label htmlFor="nama-desa" className="text-xs">Nama Posyandu/Puskesmas</Label>
                        <Input name="namadesa" id="nama-desa" placeholder="Contoh: Posyandu Melati" defaultValue={b3?.namadesa} className="text-xs h-9" />
                    </div>
                    <WilayahSelector onWilayahChange={setWilayah} initialData={b3?.wilayah} />
                    <div className="grid gap-1.5">
                        <Label htmlFor="alamat-b3" className="text-xs">Alamat Detail</Label>
                        <Input name="alamat" id="alamat-b3" placeholder="Contoh: Jl. Sejahtera No. 1" defaultValue={b3?.alamat} className="text-xs h-9" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="nama-pic-b3" className="text-xs">Nama PIC</Label>
                        <Input name="nama_pic" id="nama-pic-b3" placeholder="Contoh: Dewi Lestari" defaultValue={b3?.nama_pic || ''} className="text-xs h-9" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="telp-pic-b3" className="text-xs">Nomor Telepon PIC</Label>
                        <Input name="telepon_pic" id="telp-pic-b3" type="tel" placeholder="0812..." defaultValue={b3?.telepon_pic || ''} className="text-xs h-9" />
                    </div>
                </div>
                <Separator orientation="vertical" className="h-auto hidden md:block" />
                <div className="flex-1 space-y-3">
                    <h3 className="text-base font-semibold text-muted-foreground">
                        Data Penerima Manfaat
                    </h3>
                    <div className="grid gap-1.5">
                        <Label htmlFor="jumlah-bumil" className="text-xs">Ibu Hamil (Bumil)</Label>
                        <Input name="bumil" id="jumlah-bumil" type="number" placeholder="0" defaultValue={b3?.jenis.bumil} className="text-xs h-9" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="jumlah-busui" className="text-xs">Ibu Menyusui (Busui)</Label>
                        <Input name="busui" id="jumlah-busui" type="number" placeholder="0" defaultValue={b3?.jenis.busui} className="text-xs h-9" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="jumlah-balita" className="text-xs">Balita</Label>
                        <Input name="balita" id="jumlah-balita" type="number" placeholder="0" defaultValue={b3?.jenis.balita} className="text-xs h-9" />
                    </div>
                </div>
            </div>
             <DialogFooter>
                <SubmitButton />
            </DialogFooter>
        </form>
    );
}

export default function MitraPage({ userRole, userSppgId, semuaDaftarSekolah, semuaDaftarB3, sppgList }: MitraPageProps) {
  const [activeTab, setActiveTab] = useState('sekolah');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // State for SPPG selection
  const [selectedSppg, setSelectedSppg] = useState<SppgId>(userRole === 'Admin Pusat' ? 'all' : userSppgId || 'all');
  
  // State for Sekolah tab
  const [sortConfigSekolah, setSortConfigSekolah] = useState<{ key: SortableKeysSekolah; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPerPageSekolah, setItemsPerPageSekolah] = useState(15);
  const [currentPageSekolah, setCurrentPageSekolah] = useState(1);
  const [selectedSekolah, setSelectedSekolah] = useState<Sekolah | null>(null);
  const [isDetailSekolahOpen, setIsDetailSekolahOpen] = useState(false);
  const [isFormSekolahOpen, setIsFormSekolahOpen] = useState(false);
  
  // State for B3 tab
  const [sortConfigB3, setSortConfigB3] = useState<{ key: SortableKeysB3; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPerPageB3, setItemsPerPageB3] = useState(15);
  const [currentPageB3, setCurrentPageB3] = useState(1);
  const [selectedB3, setSelectedB3] = useState<B3Data | null>(null);
  const [isDetailB3Open, setIsDetailB3Open] = useState(false);
  const [isFormB3Open, setIsFormB3Open] = useState(false);


  useEffect(() => {
    if (userRole === 'SPPG' && userSppgId) {
        setSelectedSppg(userSppgId);
    }
  }, [userRole, userSppgId]);


  const selectedSppgDetails = useMemo(() => {
    if (selectedSppg === 'all') return null;
    return sppgList.find(option => option.id === selectedSppg);
  }, [selectedSppg, sppgList]);

  useEffect(() => {
    const activeTabElement = tabsRef.current.find(tab => tab?.dataset.value === activeTab);
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleSppgChange = (value: string) => {
    setSelectedSppg(value as SppgId);
    setCurrentPageSekolah(1);
    setCurrentPageB3(1);
  };
  
  // Memoized filtered data for both tabs
  const filteredSekolah = useMemo(() => {
    if (selectedSppg === 'all') return semuaDaftarSekolah;
    return semuaDaftarSekolah.filter((sekolah) => sekolah.sppg_id === selectedSppg);
  }, [selectedSppg, semuaDaftarSekolah]);
  
  const filteredB3 = useMemo(() => {
    if (selectedSppg === 'all') return semuaDaftarB3;
    return semuaDaftarB3.filter((b3) => b3.sppg_id === selectedSppg);
  }, [selectedSppg, semuaDaftarB3]);

  // Effects and handlers for Sekolah
  useEffect(() => {
    setCurrentPageSekolah(1);
  }, [itemsPerPageSekolah]);

  const sortedSekolah = useMemo(() => {
    let sortableItems = [...filteredSekolah];
    if (sortConfigSekolah !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfigSekolah.key] < b[sortConfigSekolah.key]) {
          return sortConfigSekolah.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfigSekolah.key] > b[sortConfigSekolah.key]) {
          return sortConfigSekolah.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredSekolah, sortConfigSekolah]);

  const requestSortSekolah = (key: SortableKeysSekolah) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfigSekolah && sortConfigSekolah.key === key && sortConfigSekolah.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfigSekolah({ key, direction });
  };
  
  const getSortIndicatorSekolah = (key: SortableKeysSekolah) => {
    if (!sortConfigSekolah || sortConfigSekolah.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if(sortConfigSekolah.direction === 'ascending'){
        return <ArrowUpDown className="ml-2 h-4 w-4" />; // Replace with up arrow
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />; // Replace with down arrow
  };
  
  const paginatedSekolah = useMemo(() => {
    const startIndex = (currentPageSekolah - 1) * itemsPerPageSekolah;
    return sortedSekolah.slice(startIndex, startIndex + itemsPerPageSekolah);
  }, [sortedSekolah, currentPageSekolah, itemsPerPageSekolah]);

  const totalPagesSekolah = Math.ceil(sortedSekolah.length / itemsPerPageSekolah);
  
  const handleSekolahRowClick = (sekolah: Sekolah) => {
    setSelectedSekolah(sekolah);
    setIsDetailSekolahOpen(true);
  }

  const handleEditSekolahClick = () => {
    setIsDetailSekolahOpen(false);
    setIsFormSekolahOpen(true);
  }

  const handleAddSekolahClick = () => {
    setSelectedSekolah(null);
    setIsFormSekolahOpen(true);
  }

  // Effects and handlers for B3
  useEffect(() => {
    setCurrentPageB3(1);
  }, [itemsPerPageB3]);
  
  const sortedB3 = useMemo(() => {
    let sortableItems = [...filteredB3];
    if (sortConfigB3 !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfigB3.key];
        const valB = b[sortConfigB3.key];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfigB3.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (valA < valB) {
          return sortConfigB3.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfigB3.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredB3, sortConfigB3]);

  const requestSortB3 = (key: SortableKeysB3) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfigB3 && sortConfigB3.key === key && sortConfigB3.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfigB3({ key, direction });
  };

  const getSortIndicatorB3 = (key: SortableKeysB3) => {
    if (!sortConfigB3 || sortConfigB3.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };
  
  const paginatedB3 = useMemo(() => {
    const startIndex = (currentPageB3 - 1) * itemsPerPageB3;
    return sortedB3.slice(startIndex, startIndex + itemsPerPageB3);
  }, [sortedB3, currentPageB3, itemsPerPageB3]);

  const totalPagesB3 = Math.ceil(sortedB3.length / itemsPerPageB3);

  const handleB3RowClick = (b3: B3Data) => {
    setSelectedB3(b3);
    setIsDetailB3Open(true);
  }

  const handleEditB3Click = () => {
    setIsDetailB3Open(false);
    setIsFormB3Open(true);
  }
  
  const handleAddB3Click = () => {
      setSelectedB3(null);
      setIsFormB3Open(true);
  }
  
  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Mitra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userRole === 'Admin Pusat' && (
            <div className="w-full max-w-xs">
            <Select onValueChange={handleSppgChange} value={selectedSppg}>
                <SelectTrigger>
                    <SelectValue placeholder="Pilih SPPG">{selectedSppg === 'all' ? 'Semua SPPG' : (selectedSppgDetails?.nama || 'Pilih SPPG')}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        <div>
                            <p className="font-medium">Semua SPPG</p>
                        </div>
                    </SelectItem>
                    {sppgList.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                        <div>
                            <p className="font-medium">{option.nama}</p>
                            <p className="text-xs text-muted-foreground">{option.alamat}</p>
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>
        )}

        <Tabs defaultValue="sekolah" onValueChange={setActiveTab} className="relative">
          <TabsList ref={el => {
              if (!el) return;
              tabsRef.current = Array.from(el.children) as HTMLButtonElement[];
          }}>
            <TabsTrigger
              value="sekolah"
              data-value="sekolah"
            >
              Sekolah Penerima Manfaat
            </TabsTrigger>
            <TabsTrigger
              value="b3"
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
            <div className="px-1 sm:px-4 pb-4 pt-6 space-y-4">
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSortSekolah('nama')}>
                          Nama Sekolah
                          {getSortIndicatorSekolah('nama')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSortSekolah('alamat')}>
                          Alamat Sekolah
                          {getSortIndicatorSekolah('alamat')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSortSekolah('jenjang')}>
                          Jenjang
                          {getSortIndicatorSekolah('jenjang')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSortSekolah('jumlahpm')}>
                          Jumlah PM
                          {getSortIndicatorSekolah('jumlahpm')}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSekolah.length > 0 ? (
                      paginatedSekolah.map((sekolah) => (
                        <TableRow key={sekolah.id} onClick={() => handleSekolahRowClick(sekolah)} className="cursor-pointer">
                          <TableCell>{sekolah.nama}</TableCell>
                          <TableCell>{sekolah.alamat}</TableCell>
                          <TableCell>{sekolah.jenjang}</TableCell>
                          <TableCell>{sekolah.jumlahpm}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          Tidak ada data sekolah untuk SPPG ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                 <div className="flex items-center gap-2">
                    <Label htmlFor="items-per-page-sekolah">Tampilkan</Label>
                    <Select
                      value={String(itemsPerPageSekolah)}
                      onValueChange={(value) => setItemsPerPageSekolah(Number(value))}
                    >
                      <SelectTrigger id="items-per-page-sekolah" className="w-20">
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
                      onClick={() => setCurrentPageSekolah((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPageSekolah === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                       <span className="sr-only">Sebelumnya</span>
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Halaman {currentPageSekolah} dari {totalPagesSekolah || 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentPageSekolah((prev) => Math.min(prev + 1, totalPagesSekolah))}
                      disabled={currentPageSekolah === totalPagesSekolah || totalPagesSekolah === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                       <span className="sr-only">Selanjutnya</span>
                    </Button>
                  </div>
                
                <Button className="w-full sm:w-auto" onClick={handleAddSekolahClick}>Tambah Sekolah</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="b3">
             <div className="px-1 sm:px-4 pb-4 pt-6 space-y-4">
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>
                          <Button variant="ghost" onClick={() => requestSortB3('namadesa')}>
                            Nama Desa/Kelurahan
                            {getSortIndicatorB3('namadesa')}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => requestSortB3('alamat')}>
                            Alamat
                            {getSortIndicatorB3('alamat')}
                          </Button>
                        </TableHead>
                        <TableHead>
                          Jenis
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => requestSortB3('jumlah')}>
                            Jumlah
                            {getSortIndicatorB3('jumlah')}
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedB3.length > 0 ? (
                        paginatedB3.map((item) => (
                          <TableRow key={item.id} onClick={() => handleB3RowClick(item)} className="cursor-pointer">
                            <TableCell>{item.namadesa}</TableCell>
                            <TableCell>{item.alamat}</TableCell>
                            <TableCell>
                              <div>Bumil: {item.jenis.bumil}</div>
                              <div>Busui: {item.jenis.busui}</div>
                              <div>Balita: {item.jenis.balita}</div>
                            </TableCell>
                            <TableCell>{item.jumlah}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24">
                            Tidak ada data B3 untuk SPPG ini.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="items-per-page-b3">Tampilkan</Label>
                    <Select
                      value={String(itemsPerPageB3)}
                      onValueChange={(value) => setItemsPerPageB3(Number(value))}
                    >
                      <SelectTrigger id="items-per-page-b3" className="w-20">
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
                      onClick={() => setCurrentPageB3((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPageB3 === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                       <span className="sr-only">Sebelumnya</span>
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Halaman {currentPageB3} dari {totalPagesB3 || 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentPageB3((prev) => Math.min(prev + 1, totalPagesB3))}
                      disabled={currentPageB3 === totalPagesB3 || totalPagesB3 === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Selanjutnya</span>
                    </Button>
                  </div>
                  <Button className="w-full sm:w-auto" onClick={handleAddB3Click}>Tambah B3</Button>
                </div>
              </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    {/* Dialogs for Sekolah */}
    {selectedSekolah && (
        <Dialog open={isDetailSekolahOpen} onOpenChange={setIsDetailSekolahOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{selectedSekolah.nama}</DialogTitle>
                    <DialogDescription>{selectedSekolah.jenjang}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Data Sekolah</h3>
                        <dl className="grid gap-2">
                            <DetailItem label="Alamat" value={selectedSekolah.alamat} />
                            <DetailItem label="Jumlah PM" value={selectedSekolah.jumlahpm} />
                            <DetailItem label="SPPG" value={sppgList.find(opt => opt.id === selectedSekolah.sppg_id)?.nama} />
                             <DetailItem label="Kepala Sekolah" value={selectedSekolah.nama_kepala_sekolah} />
                            <DetailItem label="PIC" value={selectedSekolah.nama_pic} />
                            <DetailItem label="Telepon PIC" value={selectedSekolah.telepon_pic} />
                        </dl>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleEditSekolahClick}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}
    
    <Dialog open={isFormSekolahOpen} onOpenChange={setIsFormSekolahOpen}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>{selectedSekolah ? 'Edit Data Sekolah' : 'Tambah Sekolah Penerima Manfaat'}</DialogTitle>
                 {selectedSekolah && <DialogDescription>Ubah data untuk {selectedSekolah.nama}.</DialogDescription>}
            </DialogHeader>
            <SekolahForm 
                sekolah={selectedSekolah} 
                sppgList={sppgList}
                userRole={userRole}
                userSppgId={userSppgId}
                onSaveSuccess={() => setIsFormSekolahOpen(false)}
            />
        </DialogContent>
    </Dialog>


    {/* Dialogs for B3 */}
    {selectedB3 && (
        <Dialog open={isDetailB3Open} onOpenChange={setIsDetailB3Open}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{selectedB3.namadesa}</DialogTitle>
                    <DialogDescription>{selectedB3.alamat}</DialogDescription>
                </DialogHeader>
                 <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Data B3</h3>
                        <dl className="grid gap-2">
                            <DetailItem label="Jumlah" value={selectedB3.jumlah} />
                            <DetailItem label="Ibu Hamil" value={b3?.jenis.bumil} />
                            <DetailItem label="Ibu Menyusui" value={b3?.jenis.busui} />
                            <DetailItem label="Balita" value={b3?.jenis.balita} />
                            <DetailItem label="SPPG" value={sppgList.find(opt => opt.id === selectedB3.sppg_id)?.nama} />
                            <DetailItem label="PIC" value={selectedB3.nama_pic} />
                            <DetailItem label="Telepon PIC" value={selectedB3.telepon_pic} />
                        </dl>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleEditB3Click}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}
     
    <Dialog open={isFormB3Open} onOpenChange={setIsFormB3Open}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>{selectedB3 ? 'Edit Data B3' : 'Tambah B3 Penerima Manfaat'}</DialogTitle>
                {selectedB3 && <DialogDescription>Ubah data untuk {selectedB3.namadesa}.</DialogDescription>}
            </DialogHeader>
            <B3Form 
                b3={selectedB3}
                sppgList={sppgList}
                userRole={userRole}
                userSppgId={userSppgId}
                onSaveSuccess={() => setIsFormB3Open(false)}
            />
        </DialogContent>
    </Dialog>
    </>
  );
}
