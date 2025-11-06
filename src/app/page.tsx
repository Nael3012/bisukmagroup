
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientProvider from './client-provider';
import { getUsers } from './actions/accounts';

export default async function Page() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const SUPER_ADMIN_UID = '35c5fae7-4fe7-48a8-bc6f-1fdaaee42cde';

  if (user.id === SUPER_ADMIN_UID) {
    const isAdmin = user.user_metadata?.role === 'Admin Pusat';
    
    if (!isAdmin) {
      await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, sppgId: 'admin-pusat', role: 'Admin Pusat', full_name: 'Admin Utama' } }
      ).catch(console.error); 

      user.user_metadata = {
        ...user.user_metadata,
        role: 'Admin Pusat',
        sppgId: 'admin-pusat',
        full_name: user.user_metadata.full_name || 'Admin Utama'
      };
    }
  }


  if (!user.user_metadata?.sppgId) {
    return redirect('/pending');
  }

  const [sppgData, sekolahData, b3Data, assignedUsers] = await Promise.all([
    supabase.from('sppg').select(),
    supabase.from('sekolah').select(),
    supabase.from('b3').select(),
    getUsers({ type: 'assigned' })
  ]);
  
  return (
    <ClientProvider
      user={user}
      sppgList={sppgData?.data || []}
      sekolahList={sekolahData?.data || []}
      b3List={b3Data?.data || []}
      assignedUsers={assignedUsers || []}
    />
  )
}
