'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';

// Skema validasi untuk metadata pengguna
const metadataSchema = z.object({
  role: z.enum(['Admin Pusat', 'SPPG']),
  sppgId: z.string().min(1, 'SPPG ID harus diisi'),
  full_name: z.string().min(1, 'Nama lengkap harus diisi'),
  position: z.string().optional(),
  phone: z.string().optional(),
});


export async function getPendingUsers() {
  const supabase = createAdminClient();

  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(`Supabase admin error: ${error.message}`);
  }

  // Filter pengguna yang belum punya role atau sppgId
  const pendingUsers = users.filter(user => 
    !user.user_metadata?.role || !user.user_metadata?.sppgId
  );

  return pendingUsers;
}


export async function updateUserMetadata(userId: string, metadata: z.infer<typeof metadataSchema>) {
    try {
        const validatedMetadata = metadataSchema.parse(metadata);
        const supabase = createAdminClient();
        const { data, error } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: validatedMetadata }
        );

        if (error) {
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (e: any) {
        // Handle Zod validation errors or Supabase errors
        const errorMessage = e.errors ? e.errors.map((err: any) => err.message).join(', ') : e.message;
        return { success: false, error: errorMessage };
    }
}


export async function createUser(userData: any) {
     const supabase = createAdminClient();
     const { email, password, ...metadata } = userData;

    try {
        // 1. Validasi metadata
        const validatedMetadata = metadataSchema.parse(metadata);

        // 2. Buat pengguna baru
        const { data: newUser, error: creationError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Otomatis konfirmasi email
            user_metadata: validatedMetadata,
        });

        if (creationError) {
            throw new Error(creationError.message);
        }

        return { success: true, data: newUser };

    } catch (e: any) {
        const errorMessage = e.errors ? e.errors.map((err: any) => err.message).join(', ') : e.message;
        return { success: false, error: errorMessage };
    }
}
