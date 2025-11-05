
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  Utensils,
  PlusCircle,
  X,
} from 'lucide-react';
import { format, startOfWeek, setDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
type Nutrient = { id: number; source: string; amount: string };

const initialWeekStatus: Record<DayOfWeek, boolean> = {
  Senin: true,
  Selasa: false,
  Rabu: true,
  Kamis: true,
  Jumat: false,
};

const dayNameToIndex: Record<DayOfWeek, number> = {
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
};

const dayIndexToName: Record<number, DayOfWeek | undefined> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
};

const giziOptions = ['Protein', 'Energi', 'Karbohidrat', 'Lemak', 'Vitamin A', 'Zat Besi'];

const NutrientInputRow = ({
  nutrient,
  onUpdate,
  onRemove,
  segment,
}: {
  nutrient: Nutrient;
  onUpdate: (id: number, field: 'source' | 'amount', value: string) => void;
  onRemove: (id: number) => void;
  segment: 'large' | 'small';
}) => (
  <div className="flex items-end gap-2">
    <div className="grid flex-1 gap-1.5">
      <Label htmlFor={`gizi-${segment}-${nutrient.id}`}>Sumber Gizi</Label>
      <Select
        value={nutrient.source}
        onValueChange={(value) => onUpdate(nutrient.id, 'source', value)}
      >
        <SelectTrigger id={`gizi-${segment}-${nutrient.id}`}>
          <SelectValue placeholder="Pilih sumber gizi" />
        </SelectTrigger>
        <SelectContent>
          {giziOptions.map((option) => (
            <SelectItem key={option} value={option.toLowerCase().replace(' ', '-')}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor={`jumlah-${segment}-${nutrient.id}`}>Jumlah</Label>
      <Input
        id={`jumlah-${segment}-${nutrient.id}`}
        type="number"
        placeholder="cth: 100"
        value={nutrient.amount}
        onChange={(e) => onUpdate(nutrient.id, 'amount', e.target.value)}
        className="w-28"
      />
    </div>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => onRemove(nutrient.id)}
      className="mb-1"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Hapus sumber gizi</span>
    </Button>
  </div>
);

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('harian');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const [weekStatus, setWeekStatus] = useState(initialWeekStatus);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [menuName, setMenuName] = useState('');
  const [largePortionNutrients, setLargePortionNutrients] = useState<Nutrient[]>([{ id: 1, source: '', amount: '' }]);
  const [smallPortionNutrients, setSmallPortionNutrients] = useState<Nutrient[]>([{ id: 1, source: '', amount: '' }]);


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
      const newSelectedDay = dayIndexToName[dayOfWeek] || 'Senin';
      setSelectedDay(newSelectedDay);
    }
  }, [date]);

  const handleDayClick = (day: DayOfWeek) => {
    setSelectedDay(day);
    const currentRefDate = date || new Date();
    const weekStartsOn = 1; // Monday
    const startOfCurrentWeek = startOfWeek(currentRefDate, { weekStartsOn });
    const newDate = setDay(startOfCurrentWeek, dayNameToIndex[day], { weekStartsOn });
    setDate(newDate);
  };
  
  // Nutrient handlers
  const handleNutrientChange = (
    segment: 'large' | 'small',
    id: number,
    field: 'source' | 'amount',
    value: string
  ) => {
    const updater = segment === 'large' ? setLargePortionNutrients : setSmallPortionNutrients;
    updater((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  };

  const addNutrient = (segment: 'large' | 'small') => {
    const updater = segment === 'large' ? setLargePortionNutrients : setSmallPortionNutrients;
    updater((prev) => [
      ...prev,
      { id: Date.now(), source: '', amount: '' },
    ]);
  };

  const removeNutrient = (segment: 'large' | 'small', id: number) => {
    const updater = segment === 'large' ? setLargePortionNutrients : setSmallPortionNutrients;
    updater((prev) => prev.filter((n) => n.id !== id));
  };


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
               <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Isi Menu</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Isi Menu Harian - {selectedDay}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-6 py-4">
                       <div className="space-y-2">
                          <Label htmlFor="menu-name" className="text-base font-semibold">Nama Menu</Label>
                          <Input 
                            id="menu-name" 
                            placeholder="Contoh: Nasi Ayam Teriyaki" 
                            value={menuName}
                            onChange={(e) => setMenuName(e.target.value)}
                          />
                       </div>

                       <Separator />
                       
                       <div className="flex gap-8">
                         {/* Segment Menu Besar */}
                         <div className="flex-1 space-y-4 rounded-lg border p-4">
                           <h3 className="text-lg font-semibold">Menu Besar</h3>
                           <div className="space-y-4">
                             {largePortionNutrients.map((nutrient) => (
                                <NutrientInputRow
                                  key={nutrient.id}
                                  nutrient={nutrient}
                                  onUpdate={(id, field, value) => handleNutrientChange('large', id, field, value)}
                                  onRemove={(id) => removeNutrient('large', id)}
                                  segment="large"
                                />
                             ))}
                           </div>
                           <Button type="button" variant="outline" size="sm" onClick={() => addNutrient('large')}>
                              <PlusCircle className="mr-2" />
                              Tambah Sumber Gizi
                           </Button>
                         </div>

                          <Separator orientation="vertical" className="h-auto" />

                         {/* Segment Menu Kecil */}
                          <div className="flex-1 space-y-4 rounded-lg border p-4">
                           <h3 className="text-lg font-semibold">Menu Kecil</h3>
                           <div className="space-y-4">
                             {smallPortionNutrients.map((nutrient) => (
                                <NutrientInputRow
                                  key={nutrient.id}
                                  nutrient={nutrient}
                                  onUpdate={(id, field, value) => handleNutrientChange('small', id, field, value)}
                                  onRemove={(id) => removeNutrient('small', id)}
                                  segment="small"
                                />
                             ))}
                           </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => addNutrient('small')}>
                              <PlusCircle className="mr-2" />
                              Tambah Sumber Gizi
                           </Button>
                         </div>
                       </div>


                       <div className="flex justify-end pt-4">
                          <Button type="submit">Simpan Menu</Button>
                       </div>
                    </form>
                  </DialogContent>
                </Dialog>
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
                      disabled={(day) => day.getDay() === 0 || day.getDay() === 6}
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
                        onClick={() => handleDayClick(day)}
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


    

    