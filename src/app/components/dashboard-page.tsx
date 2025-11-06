
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { Users, Utensils, Building, Soup } from 'lucide-react';
import { getSppgListWithDynamicPM, mockKeuanganData } from '../data/mock';

// Mock data (can be replaced with API calls)
const sppgOptions = [
  { value: 'all', label: 'Semua SPPG' },
  { value: 'sppg-al-ikhlas', label: 'SPPG Al-Ikhlas', address: 'Jl. Merdeka No. 1, Jakarta' },
  { value: 'sppg-bina-umat', label: 'SPPG Bina Umat', address: 'Jl. Pahlawan No. 10, Surabaya' },
  { value: 'sppg-nurul-hidayah', label: 'SPPG Nurul Hidayah', address: 'Jl. Sudirman No. 5, Bandung' },
];

const sppgList = getSppgListWithDynamicPM();

const calculateDashboardData = () => {
    const allData = {
        totalSppg: sppgList.length,
        totalPenerimaManfaat: sppgList.reduce((acc, sppg) => acc + sppg.penerimaManfaat, 0),
        porsiHariIni: Object.values(mockKeuanganData).reduce((acc, data) => acc + data.porsiBesar + data.porsiKecil, 0),
        porsiMingguan: Object.values(mockKeuanganData).reduce((acc, data) => acc + (data.porsiBesar + data.porsiKecil) * 5, 0), // Asumsi 5 hari kerja
    };

    const dashboardData: Record<string, any> = {
        all: allData
    };

    sppgList.forEach(sppg => {
        const keuangan = mockKeuanganData[sppg.id];
        dashboardData[sppg.id] = {
            totalSppg: 1,
            totalPenerimaManfaat: sppg.penerimaManfaat,
            porsiHariIni: keuangan ? keuangan.porsiBesar + keuangan.porsiKecil : 0,
            porsiMingguan: keuangan ? (keuangan.porsiBesar + keuangan.porsiKecil) * 5 : 0, // Asumsi 5 hari kerja
        };
    });

    return dashboardData;
}

const dashboardData = calculateDashboardData();


type SppgId = 'all' | 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

const StatCard = ({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: React.ElementType; description: string }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const [selectedSppg, setSelectedSppg] = useState<SppgId>('all');

  const currentData = useMemo(() => {
    return dashboardData[selectedSppg] || dashboardData.all;
  }, [selectedSppg]);

  const selectedSppgLabel = useMemo(() => {
    return sppgOptions.find(option => option.value === selectedSppg)?.label || 'Pilih SPPG';
  }, [selectedSppg]);

  return (
    <div className="space-y-6">
      <div className="w-full max-w-xs">
        <Select onValueChange={(value) => setSelectedSppg(value as SppgId)} value={selectedSppg}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih SPPG">{selectedSppgLabel}</SelectValue>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jumlah SPPG"
          value={currentData.totalSppg}
          icon={Building}
          description={selectedSppg === 'all' ? 'Total semua SPPG terdaftar' : 'SPPG yang sedang ditampilkan'}
        />
        <StatCard
          title="Jumlah Penerima Manfaat"
          value={currentData.totalPenerimaManfaat}
          icon={Users}
          description="Total dari Mitra Sekolah & B3"
        />
        <StatCard
          title="Porsi Hari Ini"
          value={currentData.porsiHariIni}
          icon={Utensils}
          description="Porsi besar dan kecil hari ini"
        />
        <StatCard
          title="Porsi Mingguan"
          value={currentData.porsiMingguan}
          icon={Soup}
          description="Akumulasi porsi minggu ini"
        />
      </div>
    </div>
  );
}
