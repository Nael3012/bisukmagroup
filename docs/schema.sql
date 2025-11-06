-- Skrip SQL untuk Inisialisasi Database Supabase

-- 1. Buat tabel untuk SPPG (Sentra Produksi Pangan Gizi)
CREATE TABLE sppg (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    yayasan TEXT,
    alamat TEXT,
    province_id TEXT,
    regency_id TEXT,
    district_id TEXT,
    village_id TEXT,
    nama_ka_sppg TEXT,
    nama_akuntan TEXT,
    ahli_gizi TEXT,
    asisten_lapangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sppg IS 'Menyimpan data master untuk setiap SPPG';

-- 2. Buat tabel untuk Pengguna/Akun (menggunakan sistem Auth Supabase)
-- Tabel `users` di skema `auth` sudah disediakan oleh Supabase.
-- Kita akan membuat tabel `user_profiles` untuk menyimpan data tambahan.
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telepon TEXT,
    role TEXT NOT NULL CHECK (role IN ('Admin Pusat', 'SPPG')),
    jabatan TEXT CHECK (jabatan IN ('Ka. SPPG', 'Ahli Gizi', 'Akuntan', 'Asisten Lapangan')),
    sppg_id TEXT REFERENCES sppg(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS 'Menyimpan profil dan role untuk setiap pengguna terautentikasi';
COMMENT ON COLUMN user_profiles.sppg_id IS 'SPPG yang dikelola oleh pengguna. NULL jika role adalah Admin Pusat.';

-- 3. Buat tabel untuk Mitra Sekolah
CREATE TABLE sekolah (
    id TEXT PRIMARY KEY,
    sppg_id TEXT NOT NULL REFERENCES sppg(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    alamat TEXT,
    jenjang TEXT NOT NULL CHECK (jenjang IN ('PAUD', 'TK', 'SD', 'SMP', 'SMA')),
    jumlah_pm INT NOT NULL,
    province_id TEXT,
    regency_id TEXT,
    district_id TEXT,
    village_id TEXT,
    nama_kepala_sekolah TEXT,
    nama_pic TEXT,
    telepon_pic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sekolah IS 'Menyimpan data mitra sekolah yang menjadi penerima manfaat.';

-- 4. Buat tabel untuk Mitra B3 (Bumil, Busui, Balita)
CREATE TABLE b3 (
    id TEXT PRIMARY KEY,
    sppg_id TEXT NOT NULL REFERENCES sppg(id) ON DELETE CASCADE,
    nama_posyandu TEXT NOT NULL,
    alamat TEXT,
    jumlah_bumil INT DEFAULT 0,
    jumlah_busui INT DEFAULT 0,
    jumlah_balita INT DEFAULT 0,
    province_id TEXT,
    regency_id TEXT,
    district_id TEXT,
    village_id TEXT,
    nama_pic TEXT,
    telepon_pic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE b3 IS 'Menyimpan data mitra B3 (Posyandu/Puskesmas) yang menjadi penerima manfaat.';

-- 5. Buat tabel untuk Menu Harian
CREATE TABLE menu_harian (
    id BIGSERIAL PRIMARY KEY,
    sppg_id TEXT NOT NULL REFERENCES sppg(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    nama_menu TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sppg_id, tanggal)
);

COMMENT ON TABLE menu_harian IS 'Menyimpan menu yang disajikan oleh SPPG pada tanggal tertentu.';

-- 6. Buat tabel untuk Kandungan Gizi per Menu
-- Ini menggunakan pendekatan JSONB untuk fleksibilitas.
ALTER TABLE menu_harian ADD COLUMN gizi_porsi_besar JSONB;
ALTER TABLE menu_harian ADD COLUMN gizi_porsi_kecil JSONB;

COMMENT ON COLUMN menu_harian.gizi_porsi_besar IS 'Kandungan gizi untuk porsi besar, format: [{"source": "protein", "amount": "150g"}]';
COMMENT ON COLUMN menu_harian.gizi_porsi_kecil IS 'Kandungan gizi untuk porsi kecil, format: [{"source": "protein", "amount": "100g"}]';

-- 7. Buat tabel untuk Laporan Keuangan Harian (Porsi)
CREATE TABLE laporan_keuangan (
    id BIGSERIAL PRIMARY KEY,
    sppg_id TEXT NOT NULL REFERENCES sppg(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    porsi_besar INT NOT NULL DEFAULT 0,
    porsi_kecil INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sppg_id, tanggal)
);

COMMENT ON TABLE laporan_keuangan IS 'Mencatat jumlah porsi (besar dan kecil) yang disalurkan per hari oleh setiap SPPG.';

-- 8. Enable Row Level Security (RLS) untuk semua tabel sebagai praktik keamanan terbaik.
ALTER TABLE sppg ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE b3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_harian ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_keuangan ENABLE ROW LEVEL SECURITY;

-- Contoh RLS Policies (perlu disesuaikan lebih lanjut):
-- Admin bisa melihat semua data.
CREATE POLICY "Admin can see all data" ON sppg FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'Admin Pusat'));
CREATE POLICY "Admin can see all data" ON sekolah FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'Admin Pusat'));
-- Pengguna SPPG hanya bisa melihat data SPPG mereka.
CREATE POLICY "SPPG user can see their own data" ON sekolah FOR SELECT TO authenticated USING (sppg_id = (SELECT sppg_id FROM user_profiles WHERE id = auth.uid()));

-- Catatan:
-- - Pastikan untuk membuat RLS policies yang sesuai untuk setiap tabel dan setiap operasi (SELECT, INSERT, UPDATE, DELETE).
-- - Tabel untuk data wilayah (provinsi, dll) tidak dibuat di sini karena diasumsikan data diambil dari API eksternal. Jika perlu disimpan lokal, tabel tambahan bisa dibuat.
