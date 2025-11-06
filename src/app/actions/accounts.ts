
'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';

// Skema validasi untuk metadata pengguna
const metadataSchema = z.object({
  full_name: z.string().min(1, 'Nama lengkap harus diisi'),
  role: z.enum(['Admin Pusat', 'SPPG']),
  sppgId: z.string().min(1, 'SPPG ID harus diisi'),
  position: z.string().optional(),
  phone: z.string().optional(),
});

// Skema validasi untuk pembuatan pengguna baru
const createUserSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
}).merge(metadataSchema);


export async function getPendingUsers() {
  const supabase = createAdminClient();

  const { data: { users }, error } = await supabase.auth.admin.listUsers({
      perPage: 1000 // Ambil lebih banyak pengguna jika diperlukan
  });

  if (error) {
    console.error('Error fetching users:', error);
    // Di lingkungan produksi, Anda mungkin ingin melempar error yang lebih umum
    throw new Error('Gagal mengambil data pengguna dari server.');
  }

  // Filter pengguna yang belum punya role atau sppgId
  const pendingUsers = users.filter(user => 
    !user.user_metadata?.role || !user.user_metadata?.sppgId
  );

  return pendingUsers;
}


export async function updateUserMetadata(userId: string, metadata: unknown) {
    try {
        const validatedMetadata = metadataSchema.parse(metadata);
        const supabase = createAdminClient();
        const { data, error } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: validatedMetadata }
        );

        if (error) {
            console.error('Supabase update error:', error);
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (e: any) {
        // Tangani error validasi Zod atau error dari Supabase
        const errorMessage = e.errors ? e.errors.map((err: any) => err.message).join(', ') : e.message;
        console.error('Update user metadata failed:', errorMessage);
        return { success: false, error: errorMessage };
    }
}


export async function createUser(userData: unknown) {
     const supabase = createAdminClient();
     
    try {
        // 1. Validasi semua data termasuk email dan password
        const validatedData = createUserSchema.parse(userData);
        const { email, password, ...metadata } = validatedData;

        // 2. Buat pengguna baru
        const { data: newUser, error: creationError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Otomatis konfirmasi email
            user_metadata: metadata,
        });

        if (creationError) {
            console.error('Supabase creation error:', creationError);
            throw new Error(creationError.message);
        }

        return { success: true, data: newUser };

    } catch (e: any) {
        const errorMessage = e.errors ? e.errors.map((err: any) => err.message).join(', ') : e.message;
        console.error('Create user failed:', errorMessage);
        return { success: false, error: errorMessage };
    }
}
