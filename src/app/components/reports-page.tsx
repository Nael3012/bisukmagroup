
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
import { semuaDaftarSekolah, semuaDaftarB3, type Sekolah, type B3Data, menuDataBySppg as allMenuData, mockKeuanganData } from '../data/mock';


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
                            <TableHead>Porsi Besar</TableHead>
                            <TableHead>Porsi Kecil</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.menuName}</TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Array.isArray(item.largePortion) ? item.largePortion.map((nutrient: any) => (
                                            <li key={nutrient.id}><span className="capitalize">{nutrient.source.replace('-', ' ')}</span>: {nutrient.amount}</li>
                                        )) : '-'}
                                    </ul>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Array.isArray(item.smallPortion) ? item.smallPortion.map((nutrient: any) => (
                                            <li key={nutrient.id}><span className="capitalize">{nutrient.source.replace('-', ' ')}</span>: {nutrient.amount}</li>
                                        )) : '-'}
                                    </ul>
                                </TableCell>
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
    
    if (reportType === 'keuangan') {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama SPPG</TableHead>
                        <TableHead>Jumlah Porsi Besar</TableHead>
                        <TableHead>Jumlah Porsi Kecil</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{item.porsiBesar}</TableCell>
                            <TableCell>{item.porsiKecil}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [menuReportType, setMenuReportType] = useState<MenuReportType>('harian');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const showDatePicker = (selectedReport === 'menu' && menuReportType === 'harian') || selectedReport === 'keuangan';

  const isFilterComplete = useMemo(() => {
     if (!selectedSppg || !selectedReport) return false;
     if (showDatePicker && !date) return false;
     return true;
  },[selectedSppg, selectedReport, showDatePicker, date]);

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
    } else if (selectedReport === 'keuangan') {
        // NOTE: Menggunakan mock data. Ganti dengan data asli nanti.
        // Logika ini mengasumsikan data tersedia untuk tanggal yang dipilih.
        if (selectedSppg === 'all') {
            data = sppgOptions
                .filter(opt => opt.value !== 'all')
                .map(opt => ({
                    id: opt.value,
                    nama: opt.label,
                    ...(mockKeuanganData[opt.value] || { porsiBesar: 0, porsiKecil: 0 })
                }));
        } else {
            const sppg = sppgOptions.find(opt => opt.value === selectedSppg);
            if (sppg) {
                data = [{
                    id: sppg.value,
                    nama: sppg.label,
                    ...(mockKeuanganData[sppg.value] || { porsiBesar: 0, porsiKecil: 0 })
                }];
            }
        }
    }
    
    setPreviewData(data);
    
    if (data.length === 0) {
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

    // Re-fetch data just in case
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
            if (selectedSppg === 'all') {
                data = Object.entries(allMenuData)
                    .filter(([key]) => key !== 'all')
                    .map(([sppgId, sppgMenu]) => ({
                        sppgId,
                        sppgName: sppgOptions.find(opt => opt.value === sppgId)?.label || sppgId,
                        menu: sppgMenu.menuData[dayName as keyof typeof sppgMenu.menuData]
                    }))
                    .filter(item => item.menu);
            } else {
                const menuForDay = allMenuData[selectedSppg]?.menuData[dayName as keyof typeof allMenuData[SppgId]['menuData']];
                if (menuForDay) data = [{ menu: menuForDay, sppgName: sppgOptions.find(opt => opt.value === selectedSppg)?.label }];
            }
        } else if (menuReportType === 'mingguan') {
            if (selectedSppg === 'all') {
                data = Object.entries(allMenuData)
                    .filter(([key]) => key !== 'all')
                    .map(([sppgId, sppgMenu]) => ({
                        sppgId,
                        sppgName: sppgOptions.find(opt => opt.value === sppgId)?.label || sppgId,
                        ...sppgMenu
                    }));
            } else {
                const weeklyMenu = allMenuData[selectedSppg];
                if (weeklyMenu) data = [{ sppgName: sppgOptions.find(opt => opt.value === selectedSppg)?.label, ...weeklyMenu }];
            }
        }
    } else if (selectedReport === 'keuangan') {
        if (selectedSppg === 'all') {
            data = sppgOptions
                .filter(opt => opt.value !== 'all')
                .map(opt => ({
                    id: opt.value,
                    nama: opt.label,
                    ...(mockKeuanganData[opt.value] || { porsiBesar: 0, porsiKecil: 0 })
                }));
        } else {
            const sppg = sppgOptions.find(opt => opt.value === selectedSppg);
            if (sppg) {
                data = [{
                    id: sppg.value,
                    nama: sppg.label,
                    ...(mockKeuanganData[sppg.value] || { porsiBesar: 0, porsiKecil: 0 })
                }];
            }
        }
    }

    if (data.length === 0) {
        setError("Tidak ada data untuk diunduh berdasarkan filter yang dipilih.");
        return;
    }
        
    const XLSX = await import('xlsx');
    let dataToDownload: any[][] = [];
    const reportTitle = reportTypeOptions.find(opt => opt.value === selectedReport)?.label || 'Laporan';
    const sppgTitle = sppgOptions.find(opt => opt.value === selectedSppg)?.label || 'Semua SPPG';
    
    // Add header rows
    dataToDownload.push(['Jenis Laporan:', reportTitle]);
    dataToDownload.push(['SPPG:', sppgTitle]);
    if (showDatePicker && date) {
        dataToDownload.push(['Tanggal:', format(date, "d LLL y", { locale: id })]);
    }
    if (selectedReport === 'menu') {
        dataToDownload.push(['Tipe Menu:', menuReportType === 'harian' ? 'Harian' : 'Mingguan']);
    }
    dataToDownload.push([]); // Spacer

    // Format data based on report type
    if (selectedReport === 'mitra') {
        dataToDownload.push(['Tipe Mitra', 'Nama', 'Alamat/Desa', 'Jenjang', 'Jumlah PM', 'Detail PM']);
        const sekolahData = data.filter(item => 'jenjang' in item);
        const b3Data = data.filter(item => 'namaDesa' in item);
        sekolahData.forEach(s => dataToDownload.push(['Sekolah', s.nama, s.alamat, s.jenjang, s.jumlahPM, '']));
        b3Data.forEach(b => dataToDownload.push(['B3', b.namaDesa, b.alamat, '', b.jumlah, `Bumil: ${b.jenis.bumil}, Busui: ${b.jenis.busui}, Balita: ${b.jenis.balita}`]));
    } else if (selectedReport === 'menu') {
        if (menuReportType === 'harian') {
            dataToDownload.push(['SPPG', 'Nama Menu', 'Kandungan Gizi Porsi Besar', 'Kandungan Gizi Porsi Kecil']);
            data.forEach(item => {
                const largePortionStr = Array.isArray(item.menu.largePortion) ? item.menu.largePortion.map((n:any) => `${n.source.replace('-',' ')}: ${n.amount}`).join('\n') : '';
                const smallPortionStr = Array.isArray(item.menu.smallPortion) ? item.menu.smallPortion.map((n:any) => `${n.source.replace('-',' ')}: ${n.amount}`).join('\n') : '';
                dataToDownload.push([item.sppgName || sppgTitle, item.menu.menuName, largePortionStr, smallPortionStr]);
            });
        } else if (menuReportType === 'mingguan') {
            dataToDownload.push(['SPPG', 'Hari', 'Nama Menu', 'Status']);
            data.forEach(sppgMenu => {
                dataToDownload.push([sppgMenu.sppgName]);
                Object.entries(sppgMenu.menuData).forEach(([day, menu]: [string, any]) => {
                    dataToDownload.push(['', day, menu?.menuName || 'Belum diisi', sppgMenu.weekStatus[day] ? 'Terisi' : 'Kosong']);
                });
                dataToDownload.push([]); // Spacer between SPPGs
            });
        }
    } else if (selectedReport === 'keuangan') {
        dataToDownload.push(['Nama SPPG', 'Jumlah Porsi Besar', 'Jumlah Porsi Kecil']);
        data.forEach(item => {
            dataToDownload.push([item.nama, item.porsiBesar, item.porsiKecil]);
        });
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(dataToDownload);
    // Set column widths
    worksheet['!cols'] = [
        { wch: 25 }, // SPPG
        { wch: 30 }, // Nama/Hari
        { wch: 40 }, // Detail 1
        { wch: 40 }, // Detail 2
    ];
    worksheet['!rows'] = [];
    dataToDownload.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (typeof cell === 'string' && cell.includes('\n')) {
                 if (!worksheet['!rows'][rowIndex]) worksheet['!rows'][rowIndex] = {};
                 worksheet['!rows'][rowIndex].hpt = (cell.split('\n').length) * 15;
                 if(worksheet[XLSX.utils.encode_cell({c: cellIndex, r: rowIndex})]){
                    worksheet[XLSX.utils.encode_cell({c: cellIndex, r: rowIndex})].s = { alignment: { wrapText: true } };
                 }
            }
        });
    });


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

            {showDatePicker && (
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

    
