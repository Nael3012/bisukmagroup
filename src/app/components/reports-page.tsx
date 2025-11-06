
'use client';

import { useState } from 'react';
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
import { CalendarIcon, Download, Eye } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

const ReportPreviewDialog = ({
  isOpen,
  onOpenChange,
  title,
  children,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Pratinjau: {title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
            {/* Example of table preview */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kolom 1</TableHead>
                        <TableHead>Kolom 2</TableHead>
                        <TableHead>Kolom 3</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Data 1A</TableCell>
                        <TableCell>Data 1B</TableCell>
                        <TableCell>Data 1C</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Data 2A</TableCell>
                        <TableCell>Data 2B</TableCell>
                        <TableCell>Data 2C</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ReportsPage() {
  const [selectedSppg, setSelectedSppg] = useState('all');
  const [selectedReport, setSelectedReport] = useState<ReportType>('');
  const [date, setDate] = useState<Date | undefined>();
  const [menuReportType, setMenuReportType] = useState<MenuReportType>('harian');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const showDatePicker = selectedReport === 'menu' || selectedReport === 'keuangan';

  const isButtonDisabled = 
    !selectedSppg || 
    !selectedReport ||
    (showDatePicker && !date);


  const handleDownload = async () => {
    if (isButtonDisabled) return;

    // Dynamically import xlsx library
    const XLSX = await import('xlsx');

    // Example data
    const data = [
        ["Kolom 1", "Kolom 2", "Kolom 3"],
        ["Data 1A", "Data 1B", "Data 1C"],
        ["Data 2A", "Data 2B", "Data 2C"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    // Generate a file name
    const reportLabel = reportTypeOptions.find(opt => opt.value === selectedReport)?.label || 'Laporan';
    const fileName = `${reportLabel}_${selectedSppg}_${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' })}.xlsx`;
    
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
              <Select onValueChange={setSelectedSppg} value={selectedSppg}>
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
                <div className="grid gap-3">
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
                      />
                      </PopoverContent>
                  </Popover>
              </div>
            )}
            
            {isButtonDisabled && selectedReport && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Harap lengkapi semua pilihan yang diperlukan untuk melanjutkan.
                    </AlertDescription>
                </Alert>
            )}

          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
              <Button variant="outline" disabled={isButtonDisabled} onClick={() => setIsPreviewOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Laporan
              </Button>
              <Button disabled={isButtonDisabled} onClick={handleDownload}>
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
      >
        {/* Children content can be dynamic based on report type */}
      </ReportPreviewDialog>
    </>
  );
}
