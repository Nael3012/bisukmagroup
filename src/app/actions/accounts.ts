
'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';
import type { User } from '@supabase/supabase-js';

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


export async function getUsers({ type = 'assigned' }: { type: 'pending' | 'assigned' }) {
  const supabase = createAdminClient();

  const { data: { users }, error } = await supabase.auth.admin.listUsers({
      perPage: 1000
  });

  if (error) {
    console.error('Error fetching users:', error);
    if (error.message.includes('User not allowed')) {
        console.error('Security alert: Admin action attempted from an unauthorized context.');
        // In a real app, you'd have more robust logging/alerting here.
        return [];
    }
    throw new Error('Gagal mengambil data pengguna dari server.');
  }
  
  if (type === 'pending') {
      return users.filter(user => !user.user_metadata?.role || !user.user_metadata?.sppgId);
  }

  // 'assigned' users
  return users.filter(user => user.user_metadata?.role && user.user_metadata?.sppgId);
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
        const errorMessage = e.errors ? e.errors.map((err: any) => err.message).join(', ') : e.message;
        console.error('Update user metadata failed:', errorMessage);
        return { success: false, error: errorMessage };
    }
}


export async function createUser(userData: unknown) {
     const supabase = createAdminClient();
     
    try {
        const validatedData = createUserSchema.parse(userData);
        const { email, password, ...metadata } = validatedData;

        const { data: newUser, error: creationError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, 
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
