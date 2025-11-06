
'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { User } from '@supabase/supabase-js';

// Skema untuk membuat pengguna di auth.users
const createAuthUserSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

// Skema untuk membuat atau memperbarui profil di public.user_profiles
const userProfileSchema = z.object({
  id: z.string().uuid().optional(), // ID dari auth.users
  nama: z.string().min(1, 'Nama lengkap harus diisi'),
  email: z.string().email(),
  telepon: z.string().optional(),
  role: z.enum(['Admin Pusat', 'SPPG']),
  sppg_id: z.string().min(1, 'SPPG harus dipilih'),
  jabatan: z.enum(['Ka. SPPG', 'Ahli Gizi', 'Akuntan', 'Asisten Lapangan']).optional(),
  avatar_url: z.string().url().optional(),
});


export type UserProfile = z.infer<typeof userProfileSchema>;

export async function getAssignedUserProfiles() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) {
    console.error('Error fetching user profiles:', error);
    throw new Error('Gagal mengambil data profil pengguna.');
  }
  return data;
}

export async function getPendingAuthUsers(): Promise<User[]> {
    const supabase = createAdminClient();

    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Error fetching auth users:', authError);
        return [];
    }

    const { data: profiles, error: profilesError } = await supabase.from('user_profiles').select('id');
    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
    }

    const assignedUserIds = new Set(profiles.map(p => p.id));
    const pendingUsers = authUsers.filter(u => !assignedUserIds.has(u.id));

    return pendingUsers;
}


export async function createUserWithProfile(formData: FormData) {
    const supabase = createAdminClient();

    const authData = createAuthUserSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!authData.success) {
        return { success: false, error: 'Data otentikasi tidak valid.' };
    }

    // 1. Buat pengguna di auth.users
    const { data: authUser, error: creationError } = await supabase.auth.admin.createUser({
        email: authData.data.email,
        password: authData.data.password,
        email_confirm: true,
    });

    if (creationError) {
        return { success: false, error: creationError.message };
    }

    if (!authUser.user) {
        return { success: false, error: 'Gagal membuat pengguna.' };
    }

    // 2. Siapkan dan validasi data profil
    const profileData = userProfileSchema.safeParse({
        id: authUser.user.id,
        email: authUser.user.email,
        nama: formData.get('nama'),
        telepon: formData.get('telepon') || undefined,
        role: formData.get('role'),
        sppg_id: formData.get('sppg_id'),
        jabatan: formData.get('jabatan') || undefined,
        avatar_url: authUser.user.user_metadata?.avatar_url,
    });

    if (!profileData.success) {
        // Jika profil gagal, hapus pengguna yang baru dibuat untuk konsistensi
        await supabase.auth.admin.deleteUser(authUser.user.id);
        return { success: false, error: 'Data profil tidak valid.' };
    }

    // 3. Simpan profil ke public.user_profiles
    const { error: profileError } = await supabase.from('user_profiles').insert(profileData.data);

    if (profileError) {
         await supabase.auth.admin.deleteUser(authUser.user.id);
        return { success: false, error: profileError.message };
    }
    
    revalidatePath('/#');
    return { success: true, data: authUser.user };
}


export async function updateUserProfile(formData: FormData) {
    const supabase = createAdminClient();
    const userId = formData.get('id') as string;

    const profileData = userProfileSchema.safeParse({
        id: userId,
        nama: formData.get('nama'),
        email: formData.get('email'),
        telepon: formData.get('telepon') || undefined,
        role: formData.get('role'),
        sppg_id: formData.get('sppg_id'),
        jabatan: formData.get('jabatan') || undefined,
    });
    
    if (!profileData.success) {
        return { success: false, error: 'Data profil tidak valid.' };
    }
    
    // Hapus id dan email dari data yang akan diupdate karena tidak boleh diubah
    const { id, email, ...updateData } = profileData.data;

    const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);

    if (error) {
        return { success: false, error: error.message };
    }
    
    revalidatePath('/#');
    return { success: true };
}

export async function assignPendingUser(formData: FormData) {
     const supabase = createAdminClient();
     const userId = formData.get('id') as string;

    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    if(authError || !authUser.user){
        return { success: false, error: 'Pengguna tidak ditemukan.' };
    }
     
    const profileData = userProfileSchema.safeParse({
        id: userId,
        email: authUser.user.email,
        nama: formData.get('nama'),
        telepon: formData.get('telepon') || undefined,
        role: formData.get('role'),
        sppg_id: formData.get('sppg_id'),
        jabatan: formData.get('jabatan') || undefined,
        avatar_url: authUser.user.user_metadata?.avatar_url,
    });

    if (!profileData.success) {
        return { success: false, error: 'Data profil tidak valid.' };
    }
    
    const { error } = await supabase.from('user_profiles').insert(profileData.data);
    
    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/#');
    return { success: true };
}
