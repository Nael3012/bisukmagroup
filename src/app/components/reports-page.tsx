
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
import { CalendarIcon, Download } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';

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

export default function ReportsPage() {
  const [selectedSppg, setSelectedSppg] = useState('all');
  const [selectedReport, setSelectedReport] = useState<ReportType>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const showDatePicker = selectedReport === 'menu' || selectedReport === 'keuangan';

  return (
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

          {showDatePicker && (
             <div className="grid gap-2">
                <Label>Pilih Rentang Tanggal</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "d LLL y", { locale: id })} -{" "}
                            {format(dateRange.to, "d LLL y", { locale: id })}
                            </>
                        ) : (
                            format(dateRange.from, "d LLL y", { locale: id })
                        )
                        ) : (
                        <span>Pilih tanggal</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={id}
                    />
                    </PopoverContent>
                </Popover>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-end'>
            <Button disabled={!selectedSppg || !selectedReport}>
                <Download className="mr-2 h-4 w-4" />
                Generate Laporan
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
