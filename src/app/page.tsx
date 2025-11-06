
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
  let { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Jika profil tidak ditemukan, cek apakah itu admin dari metadata lama
  // dan buat profilnya jika perlu.
  if (!userProfile || profileError) {
    console.warn('User profile not found in user_profiles table. Checking old metadata for admin role.', { userId: user.id });
    
    // Periksa metadata lama (legacy)
    const isLegacyAdmin = user.user_metadata?.role === 'Admin Pusat';
    
    if (isLegacyAdmin) {
        console.log('Legacy Admin Pusat detected. Creating new profile in user_profiles table.');
        const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
                id: user.id,
                nama: user.user_metadata?.nama || user.email?.split('@')[0] || 'Admin',
                email: user.email!,
                role: 'Admin Pusat',
                sppg_id: 'admin-pusat', // SPPG ID khusus untuk admin pusat
                avatar_url: user.user_metadata?.avatar_url,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Failed to create profile for legacy admin:', insertError.message);
            // Jika gagal membuat, tetap arahkan ke pending sebagai fallback
            return redirect('/pending');
        }

        console.log('Successfully created profile for legacy admin.');
        userProfile = newProfile; // Gunakan profil yang baru dibuat

    } else {
        // Jika bukan legacy admin, arahkan ke halaman pending
        console.log('User is not a legacy admin. Redirecting to /pending.');
        return redirect('/pending');
    }
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

    