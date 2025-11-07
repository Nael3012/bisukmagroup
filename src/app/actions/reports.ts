
'use server';

import { createClient } from '@/utils/supabase/server';
import type { Sekolah, B3Data } from '../client-page';

export async function getMitraReportData(sppgId: 'all' | string): Promise<(Sekolah | B3Data)[]> {
  const supabase = await createClient();

  const fetchSekolah = supabase.from('sekolah').select('*');
  const fetchB3 = supabase.from('b3').select('*');

  if (sppgId !== 'all') {
    fetchSekolah.eq('sppg_id', sppgId);
    fetchB3.eq('sppg_id', sppgId);
  }

  const [{ data: sekolahData, error: sekolahError }, { data: b3Data, error: b3Error }] = await Promise.all([
    fetchSekolah,
    fetchB3,
  ]);

  if (sekolahError) {
    console.error('Error fetching sekolah data for report:', sekolahError);
    throw new Error('Gagal mengambil data mitra sekolah.');
  }
  if (b3Error) {
    console.error('Error fetching B3 data for report:', b3Error);
    throw new Error('Gagal mengambil data mitra B3.');
  }

  return [...(sekolahData || []), ...(b3Data || [])];
}
