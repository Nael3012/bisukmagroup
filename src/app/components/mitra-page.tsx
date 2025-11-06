
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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, Pencil } from 'lucide-react';
import { WilayahSelector } from './wilayah-selector';


type Sekolah = {
  id: string;
  nama: string;
  alamat: string;
  jenjang: string;
  jumlahPM: number;
  sppgId: string;
  wilayah: any;
};

type B3Data = {
  id: string;
  namaDesa: string;
  alamat: string;
  jenis: { bumil: number; busui: number; balita: number };
  jumlah: number;
  sppgId: string;
  wilayah: any;
};

type Jenjang = 'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | '';
type SortableKeysSekolah = keyof Omit<Sekolah, 'id' | 'sppgId'>;
type SortableKeysB3 = keyof Omit<B3Data, 'id' | 'jenis' | 'sppgId'>;
type SppgId = 'all' | 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

type MitraPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
}

const sppgOptions = [
  {
    value: 'sppg-al-ikhlas',
    label: 'SPPG Al-Ikhlas',
    address: 'Jl. Merdeka No. 1, Jakarta',
  },
  {
    value: 'sppg-bina-umat',
    label: 'SPPG Bina Umat',
    address: 'Jl. Pahlawan No. 10, Surabaya',
  },
  {
    value: 'sppg-nurul-hidayah',
    label: 'SPPG Nurul Hidayah',
    address: 'Jl. Sudirman No. 5, Bandung',
  },
];

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2 text-sm">
    <dt className="text-muted-foreground col-span-1">{label}</dt>
    <dd className="font-medium col-span-2">{value || '-'}</dd>
  </div>
);

const SekolahForm = ({ sekolah }: { sekolah?: Sekolah | null }) => {
  const [selectedJenjang, setSelectedJenjang] = useState<Jenjang>(
    (sekolah?.jenjang as Jenjang) || ''
  );

  const renderPorsiInputs = () => {
    switch (selectedJenjang) {
      case 'PAUD':
      case 'TK':
        return (
          <div className="grid gap-1.5">
            <Label htmlFor="porsi-kecil" className="text-xs">Jumlah Porsi Kecil</Label>
            <Input id="porsi-kecil" type="number" placeholder="Contoh: 50" className="text-xs h-9" />
          </div>
        );
      case 'SD':
        return (
          <>
            <div className="grid gap-1.5">
              <Label htmlFor="porsi-kecil" className="text-xs">Jumlah Porsi Kecil (Kelas 1-3)</Label>
              <Input id="porsi-kecil" type="number" placeholder="Contoh: 30" className="text-xs h-9" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="porsi-besar" className="text-xs">Jumlah Porsi Besar (Kelas 4-6)</Label>
              <Input id="porsi-besar" type="number" placeholder="Contoh: 20" className="text-xs h-9" />
            </div>
          </>
        );
      case 'SMP':
      case 'SMA':
        return (
          <div className="grid gap-1.5">
            <Label htmlFor="porsi-besar" className="text-xs">Jumlah Porsi Besar</Label>
            <Input id="porsi-besar" type="number" placeholder="Contoh: 80" className="text-xs h-9" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 py-4">
      <div className="flex-1 space-y-3">
        <h3 className="text-base font-semibold text-muted-foreground">
          Data Umum
        </h3>
        <div className="grid gap-1.5">
          <Label htmlFor="nama-sekolah" className="text-xs">Nama Sekolah</Label>
          <Input id="nama-sekolah" placeholder="Contoh: SD Negeri 1" defaultValue={sekolah?.nama} className="text-xs h-9" />
        </div>
        <WilayahSelector onWilayahChange={() => {}} initialData={sekolah?.wilayah} />
        <div className="grid gap-1.5">
          <Label htmlFor="alamat-sekolah" className="text-xs">Alamat Detail</Label>
          <Input id="alamat-sekolah" placeholder="Contoh: Jl. Pendidikan No. 1" defaultValue={sekolah?.alamat} className="text-xs h-9" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="jenjang" className="text-xs">Jenjang</Label>
          <Select onValueChange={(value) => setSelectedJenjang(value as Jenjang)} value={selectedJenjang}>
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
          Data Personel &amp; Porsi
        </h3>
        <div className="grid gap-1.5">
          <Label htmlFor="nama-kepala-sekolah" className="text-xs">Nama Kepala Sekolah</Label>
          <Input id="nama-kepala-sekolah" placeholder="Contoh: Budi Santoso" className="text-xs h-9" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="nama-pic" className="text-xs">Nama PIC</Label>
          <Input id="nama-pic" placeholder="Contoh: Siti Aminah" className="text-xs h-9" />
        </div>
        <div className="grid gap-1.5">
            <Label htmlFor="telp-pic" className="text-xs">Nomor Telepon PIC</Label>
            <Input id="telp-pic" type="tel" placeholder="0812..." className="text-xs h-9" />
        </div>
        {renderPorsiInputs()}
      </div>
    </div>
  );
};

const B3Form = ({ b3 }: { b3?: B3Data | null }) => {
    return (
        <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="flex-1 space-y-3">
                <h3 className="text-base font-semibold text-muted-foreground">
                    Data Umum
                </h3>
                <div className="grid gap-1.5">
                    <Label htmlFor="nama-desa" className="text-xs">Nama Posyandu/Puskesmas</Label>
                    <Input id="nama-desa" placeholder="Contoh: Posyandu Melati" defaultValue={b3?.namaDesa} className="text-xs h-9" />
                </div>
                 <WilayahSelector onWilayahChange={() => {}} initialData={b3?.wilayah} />
                <div className="grid gap-1.5">
                    <Label htmlFor="alamat-b3" className="text-xs">Alamat Detail</Label>
                    <Input id="alamat-b3" placeholder="Contoh: Jl. Sejahtera No. 1" defaultValue={b3?.alamat} className="text-xs h-9" />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="nama-pic-b3" className="text-xs">Nama PIC</Label>
                    <Input id="nama-pic-b3" placeholder="Contoh: Dewi Lestari" className="text-xs h-9" />
                </div>
                 <div className="grid gap-1.5">
                    <Label htmlFor="telp-pic-b3" className="text-xs">Nomor Telepon PIC</Label>
                    <Input id="telp-pic-b3" type="tel" placeholder="0812..." className="text-xs h-9" />
                </div>
            </div>
            <Separator orientation="vertical" className="h-auto hidden md:block" />
            <div className="flex-1 space-y-3">
                <h3 className="text-base font-semibold text-muted-foreground">
                    Data Penerima Manfaat
                </h3>
                <div className="grid gap-1.5">
                    <Label htmlFor="jumlah-bumil" className="text-xs">Ibu Hamil (Bumil)</Label>
                    <Input id="jumlah-bumil" type="number" placeholder="0" defaultValue={b3?.jenis.bumil} className="text-xs h-9" />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="jumlah-busui" className="text-xs">Ibu Menyusui (Busui)</Label>
                    <Input id="jumlah-busui" type="number" placeholder="0" defaultValue={b3?.jenis.busui} className="text-xs h-9" />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="jumlah-balita" className="text-xs">Balita</Label>
                    <Input id="jumlah-balita" type="number" placeholder="0" defaultValue={b3?.jenis.balita} className="text-xs h-9" />
                </div>
            </div>
        </div>
    );
}

export default function MitraPage({ userRole, userSppgId }: MitraPageProps) {
  const [activeTab, setActiveTab] = useState('sekolah');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // State for SPPG selection
  const [selectedSppg, setSelectedSppg] = useState<SppgId | 'all'>(userRole === 'Admin Pusat' ? 'all' : userSppgId || 'all');
  
  // State for Sekolah tab
  const [sortConfigSekolah, setSortConfigSekolah] = useState<{ key: SortableKeysSekolah; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPerPageSekolah, setItemsPerPageSekolah] = useState(15);
  const [currentPageSekolah, setCurrentPageSekolah] = useState(1);
  const [selectedSekolah, setSelectedSekolah] = useState<Sekolah | null>(null);
  const [isDetailSekolahOpen, setIsDetailSekolahOpen] = useState(false);
  const [isEditSekolahOpen, setIsEditSekolahOpen] = useState(false);
  
  // State for B3 tab
  const [sortConfigB3, setSortConfigB3] = useState<{ key: SortableKeysB3; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPerPageB3, setItemsPerPageB3] = useState(15);
  const [currentPageB3, setCurrentPageB3] = useState(1);
  const [selectedB3, setSelectedB3] = useState<B3Data | null>(null);
  const [isDetailB3Open, setIsDetailB3Open] = useState(false);
  const [isEditB3Open, setIsEditB3Open] = useState(false);

  // Data will come from props
  const semuaDaftarSekolah: Sekolah[] = [];
  const semuaDaftarB3: B3Data[] = [];

  useEffect(() => {
    if (userRole === 'SPPG' && userSppgId) {
        setSelectedSppg(userSppgId);
    }
  }, [userRole, userSppgId]);


  const selectedSppgLabel = useMemo(() => {
    if (selectedSppg === 'all') return 'Semua SPPG';
    return sppgOptions.find(option => option.value === selectedSppg)?.label || 'Pilih SPPG';
  }, [selectedSppg]);

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
    setSelectedSppg(value as SppgId | 'all');
    setCurrentPageSekolah(1);
    setCurrentPageB3(1);
  };
  
  // Memoized filtered data for both tabs
  const filteredSekolah = useMemo(() => {
    if (selectedSppg === 'all') return semuaDaftarSekolah;
    return semuaDaftarSekolah.filter((sekolah) => sekolah.sppgId === selectedSppg);
  }, [selectedSppg, semuaDaftarSekolah]);
  
  const filteredB3 = useMemo(() => {
    if (selectedSppg === 'all') return semuaDaftarB3;
    return semuaDaftarB3.filter((b3) => b3.sppgId === selectedSppg);
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
    setIsEditSekolahOpen(true);
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
    setIsEditB3Open(true);
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
                    <SelectValue placeholder="Pilih SPPG">{selectedSppgLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        <div>
                            <p className="font-medium">Semua SPPG</p>
                        </div>
                    </SelectItem>
                    {sppgOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.address}</p>
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>
        )}

        <Tabs defaultValue="sekolah" onValueChange={setActiveTab} className="relative">
          <TabsList>
            <TabsTrigger
              value="sekolah"
              ref={(el) => tabsRef.current.push(el)}
              data-value="sekolah"
            >
              Sekolah Penerima Manfaat
            </TabsTrigger>
            <TabsTrigger
              value="b3"
              ref={(el) => tabsRef.current.push(el)}
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
            <div className="px-4 pb-4 pt-6 space-y-4">
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
                       <Button variant="ghost" onClick={() => requestSortSekolah('jumlahPM')}>
                        Jumlah PM
                        {getSortIndicatorSekolah('jumlahPM')}
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
                      Halaman {currentPageSekolah} dari {totalPagesSekolah}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentPageSekolah((prev) => Math.min(prev + 1, totalPagesSekolah))}
                      disabled={currentPageSekolah === totalPagesSekolah}
                    >
                      <ChevronRight className="h-4 w-4" />
                       <span className="sr-only">Selanjutnya</span>
                    </Button>
                  </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Tambah Sekolah</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Sekolah Penerima Manfaat</DialogTitle>
                    </DialogHeader>
                    <SekolahForm />
                    <DialogFooter>
                      <Button type="submit">Simpan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="b3">
             <div className="px-4 pb-4 pt-6 space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSortB3('namaDesa')}>
                          Nama Desa/Kelurahan
                          {getSortIndicatorB3('namaDesa')}
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
                          <TableCell>{item.namaDesa}</TableCell>
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
                        <TableCell colSpan={4} className="text-center">
                          Tidak ada data B3 untuk SPPG ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                      Halaman {currentPageB3} dari {totalPagesB3}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentPageB3((prev) => Math.min(prev + 1, totalPagesB3))}
                      disabled={currentPageB3 === totalPagesB3}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Selanjutnya</span>
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Tambah B3</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Tambah B3 Penerima Manfaat</DialogTitle>
                      </DialogHeader>
                      <B3Form />
                       <DialogFooter>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                            <DetailItem label="Jumlah PM" value={selectedSekolah.jumlahPM} />
                            <DetailItem label="SPPG" value={sppgOptions.find(opt => opt.value === selectedSekolah.sppgId)?.label} />
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
    {selectedSekolah && (
        <Dialog open={isEditSekolahOpen} onOpenChange={setIsEditSekolahOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit Data Sekolah</DialogTitle>
                    <DialogDescription>Ubah data untuk {selectedSekolah.nama}.</DialogDescription>
                </DialogHeader>
                <SekolahForm sekolah={selectedSekolah} />
                <DialogFooter>
                    <Button type="submit">Simpan Perubahan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}

    {/* Dialogs for B3 */}
    {selectedB3 && (
        <Dialog open={isDetailB3Open} onOpenChange={setIsDetailB3Open}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{selectedB3.namaDesa}</DialogTitle>
                    <DialogDescription>{selectedB3.alamat}</DialogDescription>
                </DialogHeader>
                 <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Data B3</h3>
                        <dl className="grid gap-2">
                            <DetailItem label="Jumlah" value={selectedB3.jumlah} />
                            <DetailItem label="Ibu Hamil" value={selectedB3.jenis.bumil} />
                            <DetailItem label="Ibu Menyusui" value={selectedB3.jenis.busui} />
                            <DetailItem label="Balita" value={selectedB3.jenis.balita} />
                            <DetailItem label="SPPG" value={sppgOptions.find(opt => opt.value === selectedB3.sppgId)?.label} />
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
     {selectedB3 && (
        <Dialog open={isEditB3Open} onOpenChange={setIsEditB3Open}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit Data B3</DialogTitle>
                    <DialogDescription>Ubah data untuk {selectedB3.namaDesa}.</DialogDescription>
                </DialogHeader>
                <B3Form b3={selectedB3} />
                <DialogFooter>
                    <Button type="submit">Simpan Perubahan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}

    
