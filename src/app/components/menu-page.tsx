
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';


export default function MenuPage() {
    const [activeTab, setActiveTab] = useState('harian');
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [date, setDate] = useState<Date | undefined>();
    const [selectedDay, setSelectedDay] = useState<string>('');


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
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="grid gap-2">
                    <Label>Pilih Tanggal</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-full sm:w-[240px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="hari">Pilih Hari</Label>
                    <Select onValueChange={setSelectedDay} value={selectedDay}>
                        <SelectTrigger id="hari" className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Pilih hari" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="senin">Senin</SelectItem>
                            <SelectItem value="selasa">Selasa</SelectItem>
                            <SelectItem value="rabu">Rabu</SelectItem>
                            <SelectItem value="kamis">Kamis</SelectItem>
                            <SelectItem value="jumat">Jumat</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </div>
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
