'use client';

import ClientPage from './client-page';
import type { User } from '@supabase/supabase-js';

type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
  penerimaManfaat: number;
  namaKaSppg: string;
  namaAkuntan: string;
  ahliGizi: string;
  asistenLapangan: string;
  wilayah: any;
  logo_url: string | null;
};

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

type ClientProviderProps = {
  user: User;
  sppgList: SppgData[];
  sekolahList: Sekolah[];
  b3List: B3Data[];
  assignedUsers: User[];
}

export default function ClientProvider(props: ClientProviderProps) {
  return <ClientPage {...props} />;
}
