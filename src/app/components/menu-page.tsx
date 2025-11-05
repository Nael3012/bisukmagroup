
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { CalendarIcon, CheckCircle2, Clock, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

const initialWeekStatus: Record<DayOfWeek, boolean> = {
  Senin: true,
  Selasa: false,
  Rabu: true,
  Kamis: true,
  Jumat: false,
};

const dayMapping: Record<number, DayOfWeek> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
};

export default function MenuPage() {
    const [activeTab, setActiveTab] = useState('harian');
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
    const [weekStatus, setWeekStatus] = useState(initialWeekStatus);


    useEffect(() => {
        const activeTabIndex = tabsRef.current.findIndex(
        (tab) => tab?.dataset.value === activeTab
        );
        const activeTabElement = tabsRef.current[activeTabIndex];

        if (activeTabElement) {
        setIndicatorStyle({
            left: activeTabElement.offsetLeft,
            width: activeTabElement.offsetWidth,
        });
        }
    }, [activeTab]);
    
    useEffect(() => {
        if (date) {
            const dayOfWeek = date.getDay();
            const newSelectedDay = dayMapping[dayOfWeek];
            if (newSelectedDay) {
                setSelectedDay(newSelectedDay);
            }
        }
    }, [date]);

    const renderDailyMenuContent = () => {
      const isFilled = weekStatus[selectedDay];
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Menu Hari {selectedDay}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFilled ? (
              <div>
                <p>Detail menu untuk hari {selectedDay} akan ditampilkan di sini.</p>
                {/* Placeholder for actual menu content */}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Menu untuk hari {selectedDay} belum diisi.</p>
                <Button className="mt-4">Isi Menu</Button>
              </div>
            )}
          </CardContent>
        </Card>
      );
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="harian" onValueChange={setActiveTab} className="relative">
          <TabsList>
            <TabsTrigger 
                value="harian"
                ref={(el) => (tabsRef.current[0] = el)}
                data-value="harian"
            >
                Menu Harian
            </TabsTrigger>
            <TabsTrigger 
                value="mingguan"
                ref={(el) => (tabsRef.current[1] = el)}
                data-value="mingguan"
            >
                Menu Mingguan
            </TabsTrigger>
             <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
          </TabsList>
          <TabsContent value="harian">
            <div className="p-4 space-y-6">
              <div className="grid gap-2 max-w-xs">
                  <Label>Pilih Tanggal</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                      <Button
                          variant={'outline'}
                          className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                          )}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP', { locale: id }) : <span>Pilih tanggal</span>}
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={id}
                      />
                      </PopoverContent>
                  </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Pilih Hari</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(weekStatus) as DayOfWeek[]).map((day) => {
                    const isFilled = weekStatus[day];
                    const isSelected = selectedDay === day;
                    return (
                      <Button
                        key={day}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => setSelectedDay(day)}
                        className="flex-1 min-w-[100px]"
                      >
                        {isFilled ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                            <Clock className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        {day}
                      </Button>
                    );
                  })}
                </div>
              </div>

               {renderDailyMenuContent()}

            </div>
          </TabsContent>
          <TabsContent value="mingguan">
            <div className="p-4">
              <p>Konten untuk Menu Mingguan akan ditampilkan di sini.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
