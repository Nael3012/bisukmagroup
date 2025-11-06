'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SppgSchema = z.object({
  id: z.string().optional(), // optional for creation
  nama: z.string().min(1, 'Nama SPPG harus diisi'),
  yayasan: z.string().min(1, 'Yayasan harus dipilih'),
  alamat: z.string().min(1, 'Alamat harus diisi'),
  wilayah: z.object({
    province: z.string().optional(),
    regency: z.string().optional(),
    district: z.string().optional(),
    village: z.string().optional(),
  }),
  logo_url: z.string().url().nullable(),
  namaKaSppg: z.string().optional(),
  namaAkuntan: z.string().optional(),
  ahliGizi: z.string().optional(),
  asistenLapangan: z.string().optional(),
});

export type SppgFormState = {
    message: string;
    sppg?: {
        id: string;
    };
    errors?: {
        nama?: string[];
        yayasan?: string[];
        alamat?: string[];
        wilayah?: string[];
        logo_url?: string[];
        namaKaSppg?: string[];
        namaAkuntan?: string[];
        ahliGizi?: string[];
        asistenLapangan?: string[];
        _form?: string[];
    };
};

export async function saveSppg(
  prevState: SppgFormState,
  formData: FormData
): Promise<SppgFormState> {
  const supabase = await createClient();

  const validatedFields = SppgSchema.safeParse({
    id: formData.get('id') || undefined,
    nama: formData.get('nama'),
    yayasan: formData.get('yayasan'),
    alamat: formData.get('alamat'),
    wilayah: {
        province: formData.get('wilayah.province'),
        regency: formData.get('wilayah.regency'),
        district: formData.get('wilayah.district'),
        village: formData.get('wilayah.village'),
    },
    logo_url: formData.get('logo_url') || null,
    namaKaSppg: formData.get('namaKaSppg'),
    namaAkuntan: formData.get('namaAkuntan'),
    ahliGizi: formData.get('ahliGizi'),
    asistenLapangan: formData.get('asistenLapangan'),
  });

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
        message: 'Validasi gagal. Harap periksa kembali isian Anda.',
        errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, ...sppgData } = validatedFields.data;

  let result;
  if (id) {
    // Update existing SPPG
    result = await supabase
      .from('sppg')
      .update(sppgData)
      .eq('id', id)
      .select('id')
      .single();
  } else {
    // Create new SPPG
    const newId = sppgData.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    result = await supabase
      .from('sppg')
      .insert({ ...sppgData, id: newId, penerimaManfaat: 0 }) // Set penerimaManfaat to 0 for new SPPG
      .select('id')
      .single();
  }

  if (result.error) {
    console.error('Supabase error:', result.error);
    return { 
        message: 'Gagal menyimpan data ke database.',
        errors: { _form: [result.error.message] }
    };
  }
  
  revalidatePath('/sppg'); // Revalidate the page to show the new data
  
  return { 
      message: `SPPG berhasil ${id ? 'diperbarui' : 'ditambahkan'}.`,
      sppg: result.data
  };
}
