'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function getPendingUsers() {
  const supabase = createAdminClient();

  // Fetch all users. You might want to add pagination for large user bases.
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
    // In a real app, you might want to throw a more specific error
    // or return an object indicating failure.
    throw new Error(`Supabase admin error: ${error.message}`);
  }

  // Filter users who do not have a 'role' or 'sppgId' in their metadata
  const pendingUsers = users.filter(user => 
    !user.user_metadata?.role || !user.user_metadata?.sppgId
  );

  return pendingUsers;
}
