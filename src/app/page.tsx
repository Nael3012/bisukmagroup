
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
    const isAdmin = user.user_metadata?.role === 'Admin Pusat' && user.user_metadata?.sppgId === 'admin-pusat';
    
    if (!isAdmin) {
      // Force update user metadata to make them a super admin
      await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, sppgId: 'admin-pusat', role: 'Admin Pusat', full_name: 'Admin Utama' } }
      );
      
      // Re-fetch the user to get the updated metadata for the current render
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      const targetUser = updatedUser || user;

      // Ensure the re-fetched user has the correct properties for the client page
      targetUser.user_metadata = targetUser.user_metadata || {};
      targetUser.user_metadata.sppgId = 'admin-pusat';
      targetUser.user_metadata.role = 'Admin Pusat';


      const { data: sppgData } = await supabase.from('sppg').select()
      const { data: sekolahData } = await supabase.from('sekolah').select()
      const { data: b3Data } = await supabase.from('b3').select()

      return (
        <ClientPage
          user={targetUser}
          sppgList={sppgData || []}
          sekolahList={sekolahData || []}
          b3List={b3Data || []}
        />
      )
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
