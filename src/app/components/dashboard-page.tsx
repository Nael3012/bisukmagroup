
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { Users, Utensils, Building, Soup, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sppgOptions = [
  { value: 'all', label: 'Semua SPPG', address: '', yayasan: '' },
  { value: 'sppg-al-ikhlas', label: 'SPPG Al-Ikhlas', address: 'Jl. Merdeka No. 1, Jakarta', yayasan: "Yayasan Bisukma Bangun Bangsa" },
  { value: 'sppg-bina-umat', label: 'SPPG Bina Umat', address: 'Jl. Pahlawan No. 10, Surabaya', yayasan: "Yayasan Patriot Generasi Emas Indonesia" },
  { value: 'sppg-nurul-hidayah', label: 'SPPG Nurul Hidayah', address: 'Jl. Sudirman No. 5, Bandung', yayasan: "Yayasan Bisukma Hita Mangula" },
];

const yayasanLogos: Record<string, string> = {
    "Yayasan Bisukma Bangun Bangsa": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413828035_Bisukma%20Bangun%20Bangsa.png",
    "Yayasan Patriot Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413871003_Patriot%20Generasi%20Emas%20Indonesia.png",
    "Yayasan Bisukma Hita Mangula": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413915579_Bisukma%20Hita%20Mangula.png",
    "Yayasan Bisukma Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413958140_Bisukma%20Generasi%20Emas%20Indonesia.png"
};

const dashboardData: Record<string, any> = {};


type SppgId = 'all' | 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

type DashboardPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
}

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

export default function DashboardPage({ userRole, userSppgId }: DashboardPageProps) {
  const [selectedSppg, setSelectedSppg] = useState<SppgId>(userRole === 'Admin Pusat' ? 'all' : userSppgId || 'all');
  
  useEffect(() => {
    if (userRole === 'SPPG' && userSppgId) {
        setSelectedSppg(userSppgId);
    } else if (userRole === 'Admin Pusat') {
        setSelectedSppg('all');
    }
  }, [userRole, userSppgId]);


  const currentData = useMemo(() => {
    return dashboardData[selectedSppg] || { totalSppg: 0, totalPenerimaManfaat: 0, porsiHariIni: 0, porsiMingguan: 0 };
  }, [selectedSppg]);

  const selectedSppgDetails = useMemo(() => {
    return sppgOptions.find(option => option.value === selectedSppg);
  }, [selectedSppg]);

  const handleDownloadLogo = async () => {
    const yayasan = selectedSppgDetails?.yayasan;
    if (yayasan && yayasanLogos[yayasan]) {
      try {
        const response = await fetch(yayasanLogos[yayasan]);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${yayasan.replace(/ /g, '_')}-logo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };


  return (
    <div className="space-y-6">
      {userRole === 'Admin Pusat' && (
        <div className="flex items-center gap-2">
          <div className="w-full max-w-xs">
              <Select onValueChange={(value) => setSelectedSppg(value as SppgId)} value={selectedSppg}>
              <SelectTrigger>
                  <SelectValue placeholder="Pilih SPPG">{selectedSppgDetails?.label || 'Pilih SPPG'}</SelectValue>
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
          {selectedSppg !== 'all' && (
            <Button variant="outline" size="icon" onClick={handleDownloadLogo} disabled={!selectedSppgDetails?.yayasan}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download Logo</span>
            </Button>
          )}
        </div>
      )}
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
