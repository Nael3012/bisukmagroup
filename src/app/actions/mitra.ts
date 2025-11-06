'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Skema untuk data Sekolah
const SekolahSchema = z.object({
    id: z.string().optional(),
    sppg_id: z.string().min(1, 'SPPG harus dipilih'),
    nama: z.string().min(1, 'Nama sekolah harus diisi'),
    alamat: z.string().optional(),
    jenjang: z.enum(['PAUD', 'TK', 'SD', 'SMP', 'SMA']),
    jumlahpm: z.coerce.number().min(0, 'Jumlah PM tidak boleh negatif'),
    wilayah: z.any().optional(),
    nama_kepala_sekolah: z.string().optional(),
    nama_pic: z.string().optional(),
    telepon_pic: z.string().optional(),
});

// Skema untuk data B3
const B3Schema = z.object({
    id: z.string().optional(),
    sppg_id: z.string().min(1, 'SPPG harus dipilih'),
    namadesa: z.string().min(1, 'Nama Posyandu/Puskesmas harus diisi'),
    alamat: z.string().optional(),
    jenis: z.object({
        bumil: z.coerce.number().default(0),
        busui: z.coerce.number().default(0),
        balita: z.coerce.number().default(0),
    }),
    wilayah: z.any().optional(),
    nama_pic: z.string().optional(),
    telepon_pic: z.string().optional(),
});


export type MitraFormState = {
    message: string;
    errors?: {
        sppg_id?: string[];
        nama?: string[];
        namadesa?: string[];
        _form?: string[];
    };
};

export async function saveSekolah(prevState: MitraFormState, formData: FormData): Promise<MitraFormState> {
    const supabase = await createClient();
    
    const validatedFields = SekolahSchema.safeParse({
        id: formData.get('id') || undefined,
        sppg_id: formData.get('sppg_id'),
        nama: formData.get('nama'),
        alamat: formData.get('alamat'),
        jenjang: formData.get('jenjang'),
        jumlahpm: formData.get('jumlahpm'),
        wilayah: {
            province: formData.get('wilayah_province'),
            regency: formData.get('wilayah_regency'),
            district: formData.get('wilayah_district'),
            village: formData.get('wilayah_village'),
        },
        nama_kepala_sekolah: formData.get('nama_kepala_sekolah'),
        nama_pic: formData.get('nama_pic'),
        telepon_pic: formData.get('telepon_pic'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validasi gagal. Harap periksa kembali isian Anda.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { id, ...sekolahData } = validatedFields.data;

    let result;
    if (id) {
        result = await supabase.from('sekolah').update(sekolahData).eq('id', id).select('id').single();
    } else {
        const newId = (sekolahData.nama || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        result = await supabase.from('sekolah').insert({ ...sekolahData, id: newId }).select('id').single();
    }

    if (result.error) {
        console.error('Supabase error (sekolah):', result.error);
        return {
            message: 'Gagal menyimpan data sekolah ke database.',
            errors: { _form: [result.error.message] }
        };
    }
    
    revalidatePath('/');
    return { message: `Mitra Sekolah berhasil ${id ? 'diperbarui' : 'ditambahkan'}.` };
}


export async function saveB3(prevState: MitraFormState, formData: FormData): Promise<MitraFormState> {
    const supabase = await createClient();

    const validatedFields = B3Schema.safeParse({
        id: formData.get('id') || undefined,
        sppg_id: formData.get('sppg_id'),
        namadesa: formData.get('namadesa'),
        alamat: formData.get('alamat'),
        jenis: {
            bumil: formData.get('bumil'),
            busui: formData.get('busui'),
            balita: formData.get('balita'),
        },
        wilayah: {
            province: formData.get('wilayah_province'),
            regency: formData.get('wilayah_regency'),
            district: formData.get('wilayah_district'),
            village: formData.get('wilayah_village'),
        },
        nama_pic: formData.get('nama_pic'),
        telepon_pic: formData.get('telepon_pic'),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            message: 'Validasi gagal. Harap periksa kembali isian Anda.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { id, ...b3Data } = validatedFields.data;

    let result;
    if (id) {
        result = await supabase.from('b3').update(b3Data).eq('id', id).select('id').single();
    } else {
        const newId = (b3Data.namadesa || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        result = await supabase.from('b3').insert({ ...b3Data, id: newId }).select('id').single();
    }

    if (result.error) {
        console.error('Supabase error (B3):', result.error);
        return {
            message: 'Gagal menyimpan data B3 ke database.',
            errors: { _form: [result.error.message] }
        };
    }

    revalidatePath('/');
    return { message: `Mitra B3 berhasil ${id ? 'diperbarui' : 'ditambahkan'}.` };
}