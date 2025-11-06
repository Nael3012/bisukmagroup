
export type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
  penerimaManfaat: number;
  namaKaSppg: string;
  namaAkuntan: string;
  ahliGizi: string;
  asistenLapangan: string;
};

export type Sekolah = {
  id: string;
  nama: string;
  alamat: string;
  jenjang: string;
  jumlahPM: number;
  sppgId: string;
};

export type B3Data = {
  id: string;
  namaDesa: string;
  alamat: string;
  jenis: { bumil: number; busui: number; balita: number };
  jumlah: number;
  sppgId: string;
};

type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
type Nutrient = { id: number; source: string; amount: string };
type MenuData = {
  menuName: string;
  imageUrl: string;
  largePortion: Nutrient[];
  smallPortion: Nutrient[];
};
type SppgId = 'all' | 'sppg-al-ikhlas' | 'sppg-bina-umat' | 'sppg-nurul-hidayah';

type WeeklyMenu = {
    weekStatus: Record<DayOfWeek, boolean>;
    menuData: Record<DayOfWeek, MenuData | null>;
}

export const menuDataBySppg: Record<SppgId, WeeklyMenu> = {
    'all': {
        weekStatus: { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false },
        menuData: { Senin: null, Selasa: null, Rabu: null, Kamis: null, Jumat: null }
    },
    'sppg-al-ikhlas': {
        weekStatus: { Senin: true, Selasa: false, Rabu: true, Kamis: true, Jumat: false },
        menuData: {
            Senin: {
                menuName: 'Nasi Ayam Goreng Spesial (Al-Ikhlas)',
                imageUrl: 'https://picsum.photos/seed/1/600/400',
                largePortion: [{ id: 1, source: 'protein', amount: '150' }, { id: 2, source: 'karbohidrat', amount: '200' }],
                smallPortion: [{ id: 1, source: 'protein', amount: '100' }, { id: 2, source: 'karbohidrat', amount: '150' }],
            },
            Rabu: {
                menuName: 'Ikan Bakar & Sayur Sop (Al-Ikhlas)',
                imageUrl: 'https://picsum.photos/seed/2/600/400',
                largePortion: [{ id: 1, source: 'protein', amount: '180' }, { id: 2, source: 'zat-besi', amount: '20' }],
                smallPortion: [{ id: 1, source: 'protein', amount: '120' }, { id: 2, source: 'zat-besi', amount: '15' }],
            },
            Kamis: {
                menuName: 'Daging Rendang & Tumis Kangkung (Al-Ikhlas)',
                imageUrl: 'https://picsum.photos/seed/3/600/400',
                largePortion: [{ id: 1, source: 'protein', amount: '200' }, { id: 2, source: 'lemak', amount: '50' }],
                smallPortion: [{ id: 1, source: 'protein', amount: '130' }, { id: 2, source: 'lemak', amount: '35' }],
            },
            Selasa: null,
            Jumat: null
        }
    },
    'sppg-bina-umat': {
        weekStatus: { Senin: true, Selasa: true, Rabu: false, Kamis: false, Jumat: false },
        menuData: {
            Senin: {
                menuName: 'Soto Ayam Lamongan (Bina Umat)',
                imageUrl: 'https://picsum.photos/seed/4/600/400',
                largePortion: [{ id: 1, source: 'protein', amount: '160' }, { id: 2, source: 'energi', amount: '300' }],
                smallPortion: [{ id: 1, source: 'protein', amount: '110' }, { id: 2, source: 'energi', amount: '250' }],
            },
            Selasa: {
                 menuName: 'Gado-gado Siram (Bina Umat)',
                 imageUrl: 'https://picsum.photos/seed/5/600/400',
                largePortion: [{ id: 1, source: 'protein', amount: '100' }, { id: 2, source: 'lemak', amount: '40' }],
                smallPortion: [{ id: 1, source: 'protein', amount: '70' }, { id: 2, source: 'lemak', amount: '25' }],
            },
            Rabu: null,
            Kamis: null,
            Jumat: null
        }
    },
    'sppg-nurul-hidayah': {
        weekStatus: { Senin: false, Selasa: false, Rabu: false, Kamis: true, Jumat: true },
        menuData: {
            Kamis: {
                menuName: 'Nasi Uduk Komplit (Nurul Hidayah)',
                imageUrl: 'https://picsum.photos/seed/6/600/400',
                largePortion: [{ id: 1, source: 'karbohidrat', amount: '250' }, { id: 2, source: 'protein', amount: '140' }],
                smallPortion: [{ id: 1, source: 'karbohidrat', amount: '180' }, { id: 2, source: 'protein', amount: '90' }],
            },
            Jumat: {
                menuName: 'Bubur Ayam Sehat (Nurul Hidayah)',
                imageUrl: 'https://picsum.photos/seed/7/600/400',
                largePortion: [{ id: 1, source: 'karbohidrat', amount: '200' }, { id: 2, source: 'energi', amount: '280' }],
                smallPortion: [{ id: 1, source: 'karbohidrat', amount: '150' }, { id: 2, source: 'energi', amount: '220' }],
            },
            Senin: null,
            Selasa: null,
            Rabu: null,
        }
    }
};

export const mockKeuanganData: Record<string, { porsiBesar: number, porsiKecil: number }> = {
    'sppg-al-ikhlas': { porsiBesar: 50, porsiKecil: 30 },
    'sppg-bina-umat': { porsiBesar: 70, porsiKecil: 45 },
    'sppg-nurul-hidayah': { porsiBesar: 60, porsiKecil: 40 },
}

export const semuaDaftarSekolah: Sekolah[] = [
  {
    id: 'sekolah-1',
    nama: 'SDN Merdeka 1',
    alamat: 'Jl. Kemerdekaan No. 10, Jakarta',
    jenjang: 'SD',
    jumlahPM: 50,
    sppgId: 'sppg-al-ikhlas',
  },
  {
    id: 'sekolah-2',
    nama: 'SMP Juara',
    alamat: 'Jl. Kemenangan No. 5, Jakarta',
    jenjang: 'SMP',
    jumlahPM: 60,
    sppgId: 'sppg-al-ikhlas',
  },
  {
    id: 'sekolah-3',
    nama: 'SMP Bina Bangsa',
    alamat: 'Jl. Pendidikan No. 25, Bandung',
    jenjang: 'SMP',
    jumlahPM: 75,
    sppgId: 'sppg-bina-umat',
  },
  {
    id: 'sekolah-4',
    nama: 'SMK Bisa',
    alamat: 'Jl. Industri No. 1, Bandung',
    jenjang: 'SMA', // Changed from SMK to SMA to match Jenjang type
    jumlahPM: 90,
    sppgId: 'sppg-bina-umat',
  },
  {
    id: 'sekolah-5',
    nama: 'SMA Cendekia',
    alamat: 'Jl. Pelajar No. 5, Surabaya',
    jenjang: 'SMA',
    jumlahPM: 100,
    sppgId: 'sppg-nurul-hidayah',
  },
   {
    id: 'sekolah-6',
    nama: 'SD Pelita Harapan',
    alamat: 'Jl. Ilmu No. 15, Surabaya',
    jenjang: 'SD',
    jumlahPM: 45,
    sppgId: 'sppg-nurul-hidayah',
  },
];

export const semuaDaftarB3: B3Data[] = [
  {
    id: 'b3-1',
    namaDesa: 'Desa Makmur',
    alamat: 'Jl. Sejahtera No. 1',
    jenis: { bumil: 10, busui: 15, balita: 25 },
    jumlah: 50,
    sppgId: 'sppg-al-ikhlas',
  },
  {
    id: 'b3-2',
    namaDesa: 'Desa Sentosa',
    alamat: 'Jl. Damai No. 2',
    jenis: { bumil: 5, busui: 10, balita: 20 },
    jumlah: 35,
    sppgId: 'sppg-bina-umat',
  },
    {
    id: 'b3-3',
    namaDesa: 'Kelurahan Jaya',
    alamat: 'Jl. Bahagia No. 3',
    jenis: { bumil: 8, busui: 12, balita: 30 },
    jumlah: 50,
    sppgId: 'sppg-nurul-hidayah',
  },
];

const sppgListRaw: Omit<SppgData, 'penerimaManfaat'>[] = [
  {
    id: 'sppg-al-ikhlas',
    nama: 'SPPG Al-Ikhlas',
    yayasan: 'Yayasan Al-Ikhlas',
    alamat: 'Jl. Merdeka No. 1, Jakarta',
    namaKaSppg: 'Budi Hartono',
    namaAkuntan: 'Siti Rahma',
    ahliGizi: 'Dr. Ani Wijaya',
    asistenLapangan: 'Joko Susilo',
  },
  {
    id: 'sppg-bina-umat',
    nama: 'SPPG Bina Umat',
    yayasan: 'Yayasan Bina Umat',
    alamat: 'Jl. Pahlawan No. 10, Surabaya',
    namaKaSppg: 'Ahmad Subarjo',
    namaAkuntan: 'Dewi Sartika',
    ahliGizi: 'Dr. Rina Puspita',
    asistenLapangan: 'Agus Salim',
  },
  {
    id: 'sppg-nurul-hidayah',
    nama: 'SPPG Nurul Hidayah',
    yayasan: 'Yayasan Nurul Hidayah',
    alamat: 'Jl. Sudirman No. 5, Bandung',
    namaKaSppg: 'Zainal Abidin',
    namaAkuntan: 'Lina Marlina',
    ahliGizi: 'Dr. Hendra Gunawan',
    asistenLapangan: 'Rudi Hartono',
  },
];


export const getSppgListWithDynamicPM = (): SppgData[] => {
    return sppgListRaw.map(sppg => {
        const totalPenerimaManfaatSekolah = semuaDaftarSekolah
            .filter(sekolah => sekolah.sppgId === sppg.id)
            .reduce((acc, sekolah) => acc + sekolah.jumlahPM, 0);

        const totalPenerimaManfaatB3 = semuaDaftarB3
            .filter(b3 => b3.sppgId === sppg.id)
            .reduce((acc, b3) => acc + b3.jumlah, 0);
        
        return {
            ...sppg,
            penerimaManfaat: totalPenerimaManfaatSekolah + totalPenerimaManfaatB3
        };
    });
};

    
