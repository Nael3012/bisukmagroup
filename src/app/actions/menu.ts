
'use server';

import { createClient } from '@/utils/supabase/server';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export async function getWeekMenuStatus(sppgId: string, date: Date) {
    if (!sppgId || !date) {
        return {
            Senin: false,
            Selasa: false,
            Rabu: false,
            Kamis: false,
            Jumat: false,
        };
    }

    const supabase = await createClient();
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    const { data, error } = await supabase
        .from('menu_harian')
        .select('tanggal')
        .eq('sppg_id', sppgId)
        .gte('tanggal', format(weekStart, 'yyyy-MM-dd'))
        .lte('tanggal', format(weekEnd, 'yyyy-MM-dd'));

    if (error) {
        console.error('Error fetching week menu status:', error);
        return {
            Senin: false,
            Selasa: false,
            Rabu: false,
            Kamis: false,
            Jumat: false,
        };
    }

    const filledDays = new Set(data.map(item => new Date(item.tanggal).getDay()));
    
    return {
        Senin: filledDays.has(1),
        Selasa: filledDays.has(2),
        Rabu: filledDays.has(3),
        Kamis: filledDays.has(4),
        Jumat: filledDays.has(5),
    };
}
