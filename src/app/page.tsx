
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
