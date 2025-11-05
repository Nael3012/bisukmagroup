
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
