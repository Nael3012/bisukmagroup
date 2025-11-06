
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
  // If the logged-in user is naelsianipar544@gmail.com, grant them super admin privileges.
  // This gives them an 'sppgId' to bypass the pending page and ensures they get the 'Admin Pusat' role.
  if (user.email === 'naelsianipar544@gmail.com') {
    if (!user.user_metadata.sppgId || !user.user_metadata.role) {
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          sppgId: 'admin-pusat', // Special ID for admin
          role: 'Admin Pusat'
        }
      })
      
      // Refresh user data after update
      if (!error) {
        const { data: { user: updatedUser } } = await supabase.auth.getUser()
        // Use the updated user object for the rest of the render
        if (updatedUser) {
           const { data: sppgData } = await supabase.from('sppg').select()
           const { data: sekolahData } = await supabase.from('sekolah').select()
           const { data: b3Data } = await supabase.from('b3').select()
          return (
            <ClientPage
              user={updatedUser}
              sppgList={sppgData || []}
              sekolahList={sekolahData || []}
              b3List={b3Data || []}
            />
          )
        }
      }
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
