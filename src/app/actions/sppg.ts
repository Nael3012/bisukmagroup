
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Skema disesuaikan dengan nama kolom di database (snake_case)
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
  }).nullable(),
  logo_url: z.string().url().nullable().optional(),
  nama_ka_sppg: z.string().optional(),
  nama_akuntan: z.string().optional(),
  ahli_gizi: z.string().optional(),
  asisten_lapangan: z.string().optional(),
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
        nama_ka_sppg?: string[];
        nama_akuntan?: string[];
        ahli_gizi?: string[];
        asisten_lapangan?: string[];
        _form?: string[];
    };
};

export async function saveSppg(
  prevState: SppgFormState,
  formData: FormData
): Promise<SppgFormState> {
  const supabase = await createClient();

  // Merakit data dari FormData secara manual
  const dataToValidate = {
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
    nama_ka_sppg: formData.get('nama_ka_sppg'),
    nama_akuntan: formData.get('nama_akuntan'),
    ahli_gizi: formData.get('ahli_gizi'),
    asisten_lapangan: formData.get('asisten_lapangan'),
  };

  const validatedFields = SppgSchema.safeParse(dataToValidate);

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
    const newId = (sppgData.nama || 'sppg').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    result = await supabase
      .from('sppg')
      .insert({ ...sppgData, id: newId })
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
