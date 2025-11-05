
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';


type Sekolah = {
  id: string;
  nama: string;
  alamat: string;
  jenjang: string;
  jumlahPM: number;
  sppg: string;
};

type Jenjang = 'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | '';
type SortableKeysSekolah = keyof Omit<Sekolah, 'id'>;

type B3Data = {
  id: string;
  namaDesa: string;
  alamat: string;
  jenis: { bumil: number; busui: number; balita: number };
  jumlah: number;
  sppg: string;
};
type SortableKeysB3 = keyof Omit<B3Data, 'id' | 'jenis'>;

const semuaDaftarSekolah: Sekolah[] = [
  {
    id: 'sekolah-1',
    nama: 'SDN Merdeka 1',
    alamat: 'Jl. Kemerdekaan No. 10, Jakarta',
    jenjang: 'SD',
    jumlahPM: 50,
    sppg: 'sppg-al-ikhlas',
  },
  {
    id: 'sekolah-2',
    nama: 'SMP Juara',
    alamat: 'Jl. Kemenangan No. 5, Jakarta',
    jenjang: 'SMP',
    jumlahPM: 60,
    sppg: 'sppg-al-ikhlas',
  },
  {
    id: 'sekolah-3',
    nama: 'SMP Bina Bangsa',
    alamat: 'Jl. Pendidikan No. 25, Bandung',
    jenjang: 'SMP',
    jumlahPM: 75,
    sppg: 'sppg-bina-umat',
  },
  {
    id: 'sekolah-4',
    nama: 'SMK Bisa',
    alamat: 'Jl. Industri No. 1, Bandung',
    jenjang: 'SMA', // Changed from SMK to SMA to match Jenjang type
    jumlahPM: 90,
    sppg: 'sppg-bina-umat',
  },
  {
    id: 'sekolah-5',
    nama: 'SMA Cendekia',
    alamat: 'Jl. Pelajar No. 5, Surabaya',
    jenjang: 'SMA',
    jumlahPM: 100,
    sppg: 'sppg-nurul-hidayah',
  },
   {
    id: 'sekolah-6',
    nama: 'SD Pelita Harapan',
    alamat: 'Jl. Ilmu No. 15, Surabaya',
    jenjang: 'SD',
    jumlahPM: 45,
    sppg: 'sppg-nurul-hidayah',
  },
];

const semuaDaftarB3: B3Data[] = [
  {
    id: 'b3-1',
    namaDesa: 'Desa Makmur',
    alamat: 'Jl. Sejahtera No. 1',
    jenis: { bumil: 10, busui: 15, balita: 25 },
    jumlah: 50,
    sppg: 'sppg-al-ikhlas',
  },
  {
    id: 'b3-2',
    namaDesa: 'Desa Sentosa',
    alamat: 'Jl. Damai No. 2',
    jenis: { bumil: 5, busui: 10, balita: 20 },
    jumlah: 35,
    sppg: 'sppg-bina-umat',
  },
    {
    id: 'b3-3',
    namaDesa: 'Kelurahan Jaya',
    alamat: 'Jl. Bahagia No. 3',
    jenis: { bumil: 8, busui: 12, balita: 30 },
    jumlah: 50,
    sppg: 'sppg-nurul-hidayah',
  },
];

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

export default function MitraPage() {
  const [activeTab, setActiveTab] = useState('sekolah');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // State for Sekolah tab
  const [selectedSppg, setSelectedSppg] = useState('all');
  const [filteredSekolah, setFilteredSekolah] = useState<Sekolah[]>(semuaDaftarSekolah);
  const [selectedJenjang, setSelectedJenjang] = useState<Jenjang>('');
  const [sortConfigSekolah, setSortConfigSekolah] = useState<{ key: SortableKeysSekolah; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPerPageSekolah, setItemsPerPageSekolah] = useState(15);
  const [currentPageSekolah, setCurrentPageSekolah] = useState(1);
  
  // State for B3 tab
  const [filteredB3, setFilteredB3] = useState<B3Data[]>(semuaDaftarB3);
  const [sortConfigB3, setSortConfigB3] = useState<{ key: SortableKeysB3; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPerPageB3, setItemsPerPageB3] = useState(15);
  const [currentPageB3, setCurrentPageB3] = useState(1);


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

  // Effects and handlers for both tabs
  useEffect(() => {
    setCurrentPageSekolah(1);
    setCurrentPageB3(1);

    if (selectedSppg === 'all') {
      setFilteredSekolah(semuaDaftarSekolah);
      setFilteredB3(semuaDaftarB3);
    } else {
      const filteredSekolahData = semuaDaftarSekolah.filter((sekolah) => sekolah.sppg === selectedSppg);
      const filteredB3Data = semuaDaftarB3.filter((b3) => b3.sppg === selectedSppg);
      setFilteredSekolah(filteredSekolahData);
      setFilteredB3(filteredB3Data);
    }
  }, [selectedSppg]);

  const handleSppgChange = (value: string) => {
    setSelectedSppg(value);
  };

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
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };
  
  const paginatedSekolah = useMemo(() => {
    const startIndex = (currentPageSekolah - 1) * itemsPerPageSekolah;
    const endIndex = startIndex + itemsPerPageSekolah;
    return sortedSekolah.slice(startIndex, endIndex);
  }, [sortedSekolah, currentPageSekolah, itemsPerPageSekolah]);

  const totalPagesSekolah = Math.ceil(sortedSekolah.length / itemsPerPageSekolah);
  
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
        if (typeof valA === 'object' || typeof valB === 'object') return 0;

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
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };
  
  const paginatedB3 = useMemo(() => {
    const startIndex = (currentPageB3 - 1) * itemsPerPageB3;
    const endIndex = startIndex + itemsPerPageB3;
    return sortedB3.slice(startIndex, endIndex);
  }, [sortedB3, currentPageB3, itemsPerPageB3]);

  const totalPagesB3 = Math.ceil(sortedB3.length / itemsPerPageB3);


  const renderPorsiInputs = () => {
    switch (selectedJenjang) {
      case 'PAUD':
      case 'TK':
        return (
          <div className="grid gap-2">
            <Label htmlFor="porsi-kecil">Jumlah Porsi Kecil</Label>
            <Input id="porsi-kecil" type="number" placeholder="Contoh: 50" />
          </div>
        );
      case 'SD':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="porsi-kecil">Jumlah Porsi Kecil (Kelas 1-3)</Label>
              <Input id="porsi-kecil" type="number" placeholder="Contoh: 30" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="porsi-besar">Jumlah Porsi Besar (Kelas 4-6)</Label>
              <Input id="porsi-besar" type="number" placeholder="Contoh: 20" />
            </div>
          </>
        );
      case 'SMP':
      case 'SMA':
        return (
          <div className="grid gap-2">
            <Label htmlFor="porsi-besar">Jumlah Porsi Besar</Label>
            <Input id="porsi-besar" type="number" placeholder="Contoh: 80" />
          </div>
        );
      default:
        return null;
    }
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

          <div className="p-4">
             <div className="w-full max-w-xs">
                <Select onValueChange={handleSppgChange} value={selectedSppg}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih SPPG" />
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
          </div>

          <TabsContent value="sekolah">
            <div className="px-4 pb-4 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableRow key={sekolah.id}>
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
                    <div className="flex gap-8 py-4">
                      {/* Left Segment */}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          Data Umum
                        </h3>
                        <div className="grid gap-2">
                          <Label htmlFor="nama-sekolah">Nama Sekolah</Label>
                          <Input id="nama-sekolah" placeholder="Contoh: SD Negeri 1" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="alamat-sekolah">Alamat Sekolah</Label>
                          <Input id="alamat-sekolah" placeholder="Contoh: Jl. Pendidikan No. 1" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="jenjang">Jenjang</Label>
                           <Select onValueChange={(value) => setSelectedJenjang(value as Jenjang)} value={selectedJenjang}>
                            <SelectTrigger id="jenjang">
                              <SelectValue placeholder="Pilih Jenjang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PAUD">PAUD</SelectItem>
                              <SelectItem value="TK">TK</SelectItem>
                              <SelectItem value="SD">SD</SelectItem>
                              <SelectItem value="SMP">SMP</SelectItem>
                              <SelectItem value="SMA">SMA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-auto" />

                      {/* Right Segment */}
                      <div className="flex-1 space-y-4">
                         <h3 className="text-lg font-semibold text-muted-foreground">
                          Data Personel & Porsi
                        </h3>
                        <div className="grid gap-2">
                          <Label htmlFor="nama-kepala-sekolah">Nama Kepala Sekolah</Label>
                          <Input id="nama-kepala-sekolah" placeholder="Contoh: Budi Santoso" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="nama-pic">Nama PIC</Label>
                          <Input id="nama-pic" placeholder="Contoh: Siti Aminah" />
                        </div>
                        {renderPorsiInputs()}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Simpan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="b3">
             <div className="px-4 pb-4 space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                        <TableRow key={item.id}>
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
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah B3 Penerima Manfaat</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <p>Formulir untuk menambah B3 akan ditampilkan di sini.</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    