
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import Image from 'next/image';
import type { Sekolah, B3Data } from '../client-page';

const yayasanLogos: Record<string, string> = {
    "Yayasan Bisukma Bangun Bangsa": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413828035_Bisukma%20Bangun%20Bangsa.png",
    "Yayasan Patriot Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413871003_Patriot%20Generasi%20Emas%20Indonesia.png",
    "Yayasan Bisukma Hita Mangula": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413915579_Bisukma%20Hita%20Mangula.png",
    "Yayasan Bisukma Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413958140_Bisukma%20Generasi%20Emas%20Indonesia.png"
};

type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
  logo_url: string | null;
};

type SppgId = 'all' | string;

type DashboardPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
    sppgList: SppgData[];
    sekolahList: Sekolah[];
    b3List: B3Data[];
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

export default function DashboardPage({ userRole, userSppgId, sppgList, sekolahList, b3List }: DashboardPageProps) {
  const [selectedSppg, setSelectedSppg] = useState<SppgId>(userRole === 'Admin Pusat' ? 'all' : userSppgId || 'all');
  const [currentData, setCurrentData] = useState({ totalPenerimaManfaat: 0, porsiHariIni: 0, porsiMingguan: 0 });
  
  useEffect(() => {
    if (userRole === 'SPPG' && userSppgId) {
        setSelectedSppg(userSppgId);
    } else if (userRole === 'Admin Pusat') {
        setSelectedSppg('all');
    }
  }, [userRole, userSppgId]);

  useEffect(() => {
    const filteredSekolah = selectedSppg === 'all'
        ? sekolahList
        : sekolahList.filter(s => s.sppg_id === selectedSppg);
        
    const filteredB3 = selectedSppg === 'all'
        ? b3List
        : b3List.filter(b => b.sppg_id === selectedSppg);

    const totalSekolahPM = filteredSekolah.reduce((acc, s) => acc + (s.jumlahpm || 0), 0);
    const totalB3PM = filteredB3.reduce((acc, b) => acc + (b.jumlah || 0), 0);
    
    // TODO: Fetch real porsi data
    setCurrentData({
        totalPenerimaManfaat: totalSekolahPM + totalB3PM,
        porsiHariIni: 0, 
        porsiMingguan: 0 
    });

  }, [selectedSppg, sekolahList, b3List]);


  const selectedSppgDetails = useMemo(() => {
    return sppgList.find(option => option.id === selectedSppg);
  }, [selectedSppg, sppgList]);

  const handleDownloadLogo = async (url: string | null, yayasan: string | undefined) => {
    if (!url || !yayasan) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${yayasan.replace(/ /g, '_')}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      // You could add a toast notification here to inform the user.
    }
  };


  return (
    <div className="space-y-6">
      {userRole === 'Admin Pusat' && (
        <div className="flex items-center gap-2">
          <div className="w-full max-w-xs">
              <Select onValueChange={(value) => setSelectedSppg(value as SppgId)} value={selectedSppg}>
              <SelectTrigger>
                  <SelectValue placeholder="Pilih SPPG">{selectedSppg === 'all' ? 'Semua SPPG' : selectedSppgDetails?.nama || 'Pilih SPPG'}</SelectValue>
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
                      {option.alamat && <p className="text-xs text-muted-foreground">{option.alamat}</p>}
                      </div>
                  </SelectItem>
                  ))}
              </SelectContent>
              </Select>
          </div>
          {selectedSppg !== 'all' && (
            <Button variant="outline" size="icon" onClick={() => handleDownloadLogo(selectedSppgDetails?.logo_url || yayasanLogos[selectedSppgDetails?.yayasan || ''], selectedSppgDetails?.yayasan)} disabled={!selectedSppgDetails?.yayasan}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download Logo</span>
            </Button>
          )}
        </div>
      )}

      {userRole === 'SPPG' && selectedSppgDetails && (
        <Card className='max-w-sm'>
            <CardHeader>
                <CardTitle>Logo Yayasan</CardTitle>
                <CardDescription>{selectedSppgDetails.yayasan}</CardDescription>
            </CardHeader>
            <CardContent>
                {selectedSppgDetails.logo_url && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                         <Image 
                            src={selectedSppgDetails.logo_url} 
                            alt={`Logo ${selectedSppgDetails.yayasan}`} 
                            fill
                            className="object-contain p-4" 
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button className='w-full' onClick={() => handleDownloadLogo(selectedSppgDetails.logo_url, selectedSppgDetails.yayasan)} disabled={!selectedSppgDetails.logo_url}>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Logo
                </Button>
            </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jumlah SPPG"
          value={userRole === 'Admin Pusat' ? (selectedSppg === 'all' ? sppgList.length : 1) : 1}
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
