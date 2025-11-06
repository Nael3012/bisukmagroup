
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientProvider from './client-provider';
import { getAssignedUserProfiles } from './actions/accounts';

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Ambil profil pengguna dari tabel public.user_profiles
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Jika tidak ada profil, arahkan ke halaman pending
  if (!userProfile || profileError) {
    console.error('Profile error or not found:', profileError?.message);
    return redirect('/pending');
  }
  
  // Gabungkan metadata dari profil ke objek user untuk konsistensi
  const userWithProfile = {
      ...user,
      user_metadata: {
          ...user.user_metadata,
          ...userProfile
      }
  };


  const [sppgData, sekolahData, b3Data, assignedUsers] = await Promise.all([
    supabase.from('sppg').select('*'),
    supabase.from('sekolah').select('*'),
    supabase.from('b3').select('*'),
    getAssignedUserProfiles()
  ]);
  
  return (
    <ClientProvider
      user={userWithProfile}
      sppgList={sppgData?.data || []}
      sekolahList={sekolahData?.data || []}
      b3List={b3Data?.data || []}
      assignedUsers={assignedUsers || []}
    />
  )
}

    