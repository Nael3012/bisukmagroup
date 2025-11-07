
'use client';

import ClientPage, { type SppgData, type Sekolah, type B3Data } from './client-page';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from './actions/accounts';


type ClientProviderProps = {
  user: User;
  sppgList: SppgData[];
  sekolahList: Sekolah[];
  b3List: B3Data[];
  assignedUsers: UserProfile[];
}

export default function ClientProvider(props: ClientProviderProps) {
  return <ClientPage {...props} />;
}

    
