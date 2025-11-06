
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Eye, XCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { semuaDaftarSekolah, semuaDaftarB3, type Sekolah, type B3Data, menuDataBySppg as allMenuData } from '../data/mock';


const sppgOptions = [
  { value: 'all', label: 'Semua SPPG' },
  { value: 'sppg-al-ikhlas', label: 'SPPG Al-Ikhlas', address: 'Jl. Merdeka No. 1, Jakarta' },
  { value: 'sppg-bina-umat', label: 'SPPG Bina Umat', address: 'Jl. Pahlawan No. 10, Surabaya' },
  { value: 'sppg-nurul-hidayah', label: 'SPPG Nurul Hidayah', address: 'Jl. Sudirman No. 5, Bandung' },
];

const reportTypeOptions = [
    { value: 'mitra', label: 'Laporan Mitra' },
    { value: 'menu', label: 'Laporan Menu' },
    { value: 'keuangan', label: 'Laporan Keuangan' },
]

type ReportType = 'mitra' | 'menu' | 'keuangan' | '';
type MenuReportType = 'harian' | 'mingguan';
type SppgId = 'all' | 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

const ReportPreviewDialog = ({
  isOpen,
  onOpenChange,
  title,
  data,
  reportType,
  menuReportType
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: any[]
  reportType: ReportType,
  menuReportType?: MenuReportType
}) => {
  
  const renderContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-10">
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Data Tidak Ditemukan</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tidak ada data yang tersedia untuk kriteria laporan yang Anda pilih.
          </p>
        </div>
      )
    }

    if (reportType === 'mitra') {
      const sekolahData = data.filter(item => 'jenjang' in item);
      const b3Data = data.filter(item => 'namaDesa' in item);

      return (
        <div className="space-y-6">
          {sekolahData.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Mitra Sekolah</h4>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Nama Sekolah</TableHead>
                          <TableHead>Jenjang</TableHead>
                          <TableHead>Jumlah PM</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {sekolahData.map((item: Sekolah) => (
                          <TableRow key={item.id}>
                              <TableCell>{item.nama}</TableCell>
                              <TableCell>{item.jenjang}</TableCell>
                              <TableCell>{item.jumlahPM}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </div>
          )}
          {b3Data.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Mitra B3</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Desa</TableHead>
                    <TableHead>Jumlah PM</TableHead>
                    <TableHead>Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {b3Data.map((item: B3Data) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.namaDesa}</TableCell>
                      <TableCell>{item.jumlah}</TableCell>
                      <TableCell>Bumil: {item.jenis.bumil}, Busui: {item.jenis.busui}, Balita: {item.jenis.balita}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      );
    }
    
    if (reportType === 'menu') {
        if (menuReportType === 'harian') {
            return (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Menu</TableHead>
                            <TableHead>Porsi Besar (Protein)</TableHead>
                            <TableHead>Porsi Kecil (Protein)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.menuName}</TableCell>
                                <TableCell>{item.largePortion.find(n => n.source === 'protein')?.amount || '-'}</TableCell>
                                <TableCell>{item.smallPortion.find(n => n.source === 'protein')?.amount || '-'}</TableCell>
                            </TableRow>
                         ))}
                    </TableBody>
                </Table>
            )
        }
         if (menuReportType === 'mingguan') {
            return (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hari</TableHead>
                            <TableHead>Nama Menu</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {Object.entries(data[0].menuData).map(([day, menu]: [string, any]) => (
                            <TableRow key={day}>
                                <TableCell>{day}</TableCell>
                                <TableCell>{menu?.menuName || 'Belum diisi'}</TableCell>
                                <TableCell>{data[0].weekStatus[day] ? 'Terisi' : 'Kosong'}</TableCell>
                            </TableRow>
                         ))}
                    </TableBody>
                </Table>
            )
        }
    }


    return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Pratinjau Belum Tersedia</h3>
          <p className="text-sm text-muted-foreground">
            Tampilan pratinjau untuk jenis laporan ini sedang dalam pengembangan.
          </p>
        </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Pratinjau: {title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1">
            {renderContent()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ReportsPage() {
  const [selectedSppg, setSelectedSppg] = useState<SppgId>('all');
  const [selectedReport, setSelectedReport] = useState<ReportType>('');
  const [date, setDate] = useState<Date | undefined>();
  const [menuReportType, setMenuReportType] = useState<MenuReportType>('harian');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const showDatePicker = selectedReport === 'menu' || selectedReport === 'keuangan';

  const isFilterComplete = useMemo(() => {
     if (!selectedSppg || !selectedReport) return false;
     if (showDatePicker && menuReportType === 'harian' && !date) return false;
     return true;
  },[selectedSppg, selectedReport, showDatePicker, date, menuReportType]);

  const handlePreview = () => {
    if (!isFilterComplete) {
        setError('Harap lengkapi semua pilihan yang diperlukan untuk melanjutkan.');
        return;
    }
    setError(null);

    let data: any[] = [];
    if (selectedReport === 'mitra') {
        const sekolah = selectedSppg === 'all' 
            ? semuaDaftarSekolah 
            : semuaDaftarSekolah.filter(s => s.sppgId === selectedSppg);
        const b3 = selectedSppg === 'all'
            ? semuaDaftarB3
            : semuaDaftarB3.filter(b => b.sppgId === selectedSppg);
        data = [...sekolah, ...b3];
    } else if (selectedReport === 'menu') {
        const dayIndexToName: Record<number, string> = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat' };
        
        if (menuReportType === 'harian' && date) {
            const dayName = dayIndexToName[date.getDay()];
            if(selectedSppg === 'all') {
                 const allSppgMenuForDay = Object.values(allMenuData)
                    .map(sppgMenu => sppgMenu.menuData[dayName as keyof typeof sppgMenu.menuData])
                    .filter(Boolean); // Filter out null/undefined
                 data = allSppgMenuForDay as any[];
            } else {
                const menuForDay = allMenuData[selectedSppg]?.menuData[dayName as keyof typeof allMenuData[SppgId]['menuData']];
                if (menuForDay) {
                    data = [menuForDay];
                }
            }

        } else if (menuReportType === 'mingguan') {
             if(selectedSppg === 'all') {
                data = Object.values(allMenuData).filter(menu => menu.weekStatus.Senin || menu.weekStatus.Selasa || menu.weekStatus.Rabu || menu.weekStatus.Kamis || menu.weekStatus.Jumat);
             } else {
                const weeklyMenu = allMenuData[selectedSppg];
                if (weeklyMenu) {
                    data = [weeklyMenu];
                }
             }
        }
    }
    // Laporan Keuangan belum ada data
    
    setPreviewData(data);
    
    if (data.length === 0 && selectedReport !== 'keuangan') {
        setError("Data tidak ditemukan untuk kriteria yang dipilih.");
    } else {
        setIsPreviewOpen(true);
    }
  }


  const handleDownload = async () => {
    if (!isFilterComplete) {
        setError('Harap lengkapi semua pilihan yang diperlukan untuk melanjutkan.');
        return;
    }
    setError(null);
    
    // This is a placeholder. In a real app, you'd fetch data similar to handlePreview
    // and then format it for XLSX. For now, we'll use a simple example.
    const dataToDownload = [
        ["Laporan", reportTypeOptions.find(opt => opt.value === selectedReport)?.label || ''],
        ["SPPG", sppgOptions.find(opt => opt.value === selectedSppg)?.label || ''],
        ["Tanggal", date ? format(date, "d LLL y", { locale: id }) : 'N/A'],
        [], // empty row as separator
        ["Kolom 1", "Kolom 2", "Kolom 3"],
        ["Data 1A", "Data 1B", "Data 1C"],
        ["Data 2A", "Data 2B", "Data 2C"],
    ];

    if (previewData.length > 0) {
        // A more sophisticated mapping would be needed here based on report type
        console.log("Downloading actual data:", previewData);
    } else {
        // Temporary logic if preview data isn't directly usable
        const checkDataForDownload = () => {
             if (selectedReport === 'mitra') return true;
             if (selectedReport === 'menu') return true;
             return false; // No data for 'keuangan' yet
        }
        if (!checkDataForDownload()) {
            setError("Data tidak ditemukan untuk diunduh.");
            return;
        }
    }

    // Dynamically import xlsx library
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.aoa_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    const fileName = `${selectedReport}_${selectedSppg}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const reportLabel = reportTypeOptions.find(opt => opt.value === selectedReport)?.label || "Laporan";

  return (
    <>
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Laporan</CardTitle>
            <CardDescription>
              Pilih SPPG dan jenis laporan yang ingin Anda buat. Filter tambahan seperti tanggal akan muncul sesuai kebutuhan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="sppg-select">Pilih SPPG</Label>
              <Select onValueChange={(v) => setSelectedSppg(v as SppgId)} value={selectedSppg}>
                <SelectTrigger id="sppg-select">
                  <SelectValue placeholder="Pilih SPPG" />
                </SelectTrigger>
                <SelectContent>
                  {sppgOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        {option.address && <p className="text-xs text-muted-foreground">{option.address}</p>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="report-select">Pilih Laporan</Label>
              <Select onValueChange={(value) => setSelectedReport(value as ReportType)} value={selectedReport}>
                <SelectTrigger id="report-select">
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedReport === 'menu' && (
                <div className="grid gap-3 p-4 border rounded-md">
                    <Label>Pilih Tipe Laporan Menu</Label>
                    <RadioGroup defaultValue="harian" onValueChange={(value: string) => setMenuReportType(value as MenuReportType)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="harian" id="harian" />
                            <Label htmlFor="harian">Harian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mingguan" id="mingguan" />
                            <Label htmlFor="mingguan">Mingguan</Label>
                        </div>
                    </RadioGroup>
                </div>
            )}

            {showDatePicker && menuReportType === 'harian' && (
              <div className="grid gap-2">
                  <Label>Pilih Tanggal</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                      <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                          )}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "d LLL y", { locale: id }) : <span>Pilih tanggal</span>}
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          initialFocus
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          locale={id}
                          disabled={(day) => day.getDay() === 0 || day.getDay() === 6}
                      />
                      </PopoverContent>
                  </Popover>
              </div>
            )}
            
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
              <Button variant="outline" onClick={handlePreview} disabled={!isFilterComplete}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Laporan
              </Button>
              <Button onClick={handleDownload} disabled={!isFilterComplete}>
                  <Download className="mr-2 h-4 w-4" />
                  Unduh Data
              </Button>
          </CardFooter>
        </Card>
      </div>
      <ReportPreviewDialog 
        isOpen={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen}
        title={reportLabel}
        data={previewData}
        reportType={selectedReport}
        menuReportType={menuReportType}
      />
    </>
  );
}

    
    