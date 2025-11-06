
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import ClientPage from './client-page';

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: sppgData } = await supabase.from('sppg').select()
  const { data: sekolahData } = await supabase.from('sekolah').select()
  const { data: b3Data } = await supabase.from('b3').select()

  return (
    <ClientPage
      sppgList={sppgData || []}
      sekolahList={sekolahData || []}
      b3List={b3Data || []}
    />
  )
}
