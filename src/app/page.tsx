
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ClientPage from './client-page';

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // --- START OF SUPER ADMIN LOGIC ---
  // Force a specific user to be the main admin based on their UID.
  const SUPER_ADMIN_UID = '35c5fae7-4fe7-48a8-bc6f-1fdaaee42cde';

  if (user.id === SUPER_ADMIN_UID) {
    const isAdmin = user.user_metadata?.role === 'Admin Pusat';
    
    // If the user is the super admin but their metadata is not set correctly
    if (!isAdmin) {
      // 1. Asynchronously update the user's metadata in Supabase for future sessions.
      // We don't await this, as we will force the role for the current session.
      supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, sppgId: 'admin-pusat', role: 'Admin Pusat', full_name: 'Admin Utama' } }
      ).catch(console.error); // Log any errors in the background

      // 2. Force the user object to have the correct admin metadata for the current render.
      // This avoids race conditions and ensures the UI renders correctly immediately.
      user.user_metadata = {
        ...user.user_metadata,
        role: 'Admin Pusat',
        sppgId: 'admin-pusat',
        full_name: user.user_metadata.full_name || 'Admin Utama'
      };
    }
  }
  // --- END OF SUPER ADMIN LOGIC ---


  // Redirect to pending page if user has no SPPG assigned
  if (!user.user_metadata?.sppgId) {
    return redirect('/pending');
  }

  const { data: sppgData } = await supabase.from('sppg').select()
  const { data: sekolahData } = await supabase.from('sekolah').select()
  const { data: b3Data } = await supabase.from('b3').select()

  return (
    <ClientPage
      user={user}
      sppgList={sppgData || []}
      sekolahList={sekolahData || []}
      b3List={b3Data || []}
    />
  )
}
