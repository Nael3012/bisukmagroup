
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  Download,
  Pencil,
  PlusCircle,
  Upload,
  X,
} from 'lucide-react';
import { format, startOfWeek, setDay, addWeeks, addDays } from 'date-fns';
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
import { CardDescription } from '@/components/ui/card';
import Image from 'next/image';

type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
type Nutrient = { id: number; source: string; amount: string };
type MenuData = {
  menuName: string;
  imageUrl: string;
  largePortion: Nutrient[];
  smallPortion: Nutrient[];
};

type SppgData = {
  id: string;
  nama: string;
  yayasan: string;
  alamat: string;
};

type SppgId = string;

type MenuPageProps = {
    userRole: 'Admin Pusat' | 'SPPG';
    userSppgId?: SppgId;
    sppgList: SppgData[];
}

type WeeklyMenu = {
    weekStatus: Record<DayOfWeek, boolean>;
    menuData: Record<DayOfWeek, MenuData | null>;
}

const yayasanLogos: Record<string, string> = {
    "Yayasan Bisukma Bangun Bangsa": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413828035_Bisukma%20Bangun%20Bangsa.png",
    "Yayasan Patriot Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413871003_Patriot%20Generasi%20Emas%20Indonesia.png",
    "Yayasan Bisukma Hita Mangula": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413915579_Bisukma%20Hita%20Mangula.png",
    "Yayasan Bisukma Generasi Emas Indonesia": "https://oilvtefzzupggnstgpsa.supabase.co/storage/v1/object/public/logos/1762413958140_Bisukma%20Generasi%20Emas%20Indonesia.png"
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

const MenuFormDialog = ({
  isOpen,
  onOpenChange,
  day,
  menuData
}: {
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  day: DayOfWeek,
  menuData: MenuData | null
}) => {
    
  const [menuName, setMenuName] = useState('');
  const [largePortionNutrients, setLargePortionNutrients] = useState<Nutrient[]>([{ id: 1, source: '', amount: '' }]);
  const [smallPortionNutrients, setSmallPortionNutrients] = useState<Nutrient[]>([{ id: 1, source: '', amount: '' }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (menuData) {
        setMenuName(menuData.menuName);
        setLargePortionNutrients(menuData.largePortion.length > 0 ? menuData.largePortion : [{ id: 1, source: '', amount: '' }]);
        setSmallPortionNutrients(menuData.smallPortion.length > 0 ? menuData.smallPortion : [{ id: 1, source: '', amount: '' }]);
        setImagePreview(menuData.imageUrl);
    } else {
        setMenuName('');
        setLargePortionNutrients([{ id: 1, source: '', amount: '' }]);
        setSmallPortionNutrients([{ id: 1, source: '', amount: '' }]);
        setImagePreview(null);
    }
  }, [menuData, isOpen]);


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
    
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>{menuData ? 'Edit' : 'Isi'} Menu Harian - {day}</DialogTitle>
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

            <div className="space-y-2">
              <Label className="text-base font-semibold">Upload foto menu hari ini</Label>
              <div 
                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                   <>
                    <Image src={imagePreview} alt="Pratinjau menu" fill className="object-contain rounded-md p-2" />
                     <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        className="absolute top-2 right-2 h-7 w-7"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                   </>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="mb-1 text-xs">
                      <span className="font-semibold">Klik untuk mengunggah</span>
                    </p>
                    <p className="text-xs">PNG, JPG (MAX. 5MB)</p>
                  </div>
                )}
                <Input 
                  ref={fileInputRef}
                  id="dropzone-file" 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <Separator />
            
            <div className="flex flex-col gap-8 md:flex-row">
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
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Sumber Gizi
                </Button>
            </div>

            <Separator orientation="vertical" className="h-auto hidden md:block" />

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
                <PlusCircle className="mr-2 h-4 w-4" />
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
  );
}


export default function MenuPage({ userRole, userSppgId, sppgList }: MenuPageProps) {
  const [activeTab, setActiveTab] = useState('harian');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const defaultSppg = userRole === 'SPPG' && userSppgId ? userSppgId : (sppgList[0]?.id || '');
  const [selectedSppg, setSelectedSppg] = useState<SppgId>(defaultSppg);

  useEffect(() => {
    if (userRole === 'SPPG' && userSppgId) {
        setSelectedSppg(userSppgId);
    }
  }, [userRole, userSppgId]);
  
  const currentWeeklyMenu: WeeklyMenu = useMemo(() => {
    // This will be replaced with real data fetching
    return {
        weekStatus: { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false },
        menuData: {
            Senin: null,
            Rabu: null,
            Kamis: null,
            Selasa: null,
            Jumat: null
        }
    }
  }, [selectedSppg]);

  const selectedSppgDetails = useMemo(() => {
    return sppgList.find(option => option.id === selectedSppg);
  }, [selectedSppg, sppgList]);

  const handleDownloadLogo = async () => {
    const yayasan = selectedSppgDetails?.yayasan;
    if (yayasan && yayasanLogos[yayasan]) {
      try {
        const response = await fetch(yayasanLogos[yayasan]);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${yayasan.replace(/ /g, '_')}-logo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  const nextWeekDateRange = useMemo(() => {
    const today = new Date();
    const nextWeek = addWeeks(today, 1);
    const startOfNextWeek = startOfWeek(nextWeek, { weekStartsOn: 1 }); // Monday
    const endOfNextWeek = addDays(startOfNextWeek, 4); // Friday
    return {
      start: format(startOfNextWeek, 'd MMMM yyyy', { locale: id }),
      end: format(endOfNextWeek, 'd MMMM yyyy', { locale: id }),
    };
  }, []);

  useEffect(() => {
    const activeTabElement = tabsRef.current.find(tab => tab?.dataset.value === activeTab);
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
      if (newSelectedDay !== selectedDay) {
        setSelectedDay(newSelectedDay);
      }
    }
  }, [date, selectedDay]);

  const handleDayClick = (day: DayOfWeek) => {
    setSelectedDay(day);
    const currentRefDate = date || new Date();
    const weekStartsOn = 1; // Monday
    const startOfCurrentWeek = startOfWeek(currentRefDate, { weekStartsOn });
    const newDate = setDay(startOfCurrentWeek, dayNameToIndex[day], { weekStartsOn });
    setDate(newDate);
  };
  
  const renderDailyMenuContent = () => {
    const isFilled = currentWeeklyMenu.weekStatus[selectedDay];
    const currentMenuData = currentWeeklyMenu.menuData[selectedDay];

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              Menu Hari {selectedDay}
            </div>
            {isFilled && (
                <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFilled && currentMenuData ? (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{currentMenuData.menuName}</h3>
                  <div className="relative aspect-video w-full max-w-lg mx-auto rounded-lg overflow-hidden border">
                    <Image 
                      src={currentMenuData.imageUrl} 
                      alt={`Foto menu ${currentMenuData.menuName}`} 
                      fill
                      data-ai-hint="food meal"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-lg">Menu Besar</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {currentMenuData.largePortion.map(n => (
                                <li key={n.id}><span className="capitalize">{n.source.replace('-', ' ')}</span>: {n.amount}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-2">
                         <h4 className="font-semibold text-lg">Menu Kecil</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {currentMenuData.smallPortion.map(n => (
                                <li key={n.id}><span className="capitalize">{n.source.replace('-', ' ')}</span>: {n.amount}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Menu untuk hari {selectedDay} belum diisi.</p>
                <Button className="mt-4" onClick={() => setIsFormOpen(true)}>Isi Menu</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const currentMenuDataForDialog = currentWeeklyMenu.menuData[selectedDay];

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userRole === 'Admin Pusat' && (
             <div className="flex items-center gap-2">
                <div className="w-full max-w-xs">
                <Select onValueChange={(value) => setSelectedSppg(value as SppgId)} value={selectedSppg}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih SPPG">
                            {selectedSppgDetails?.nama}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {sppgList.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            <div>
                                <p className="font-medium">{option.nama}</p>
                                <p className="text-xs text-muted-foreground">{option.alamat}</p>
                            </div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
                <Button variant="outline" size="icon" onClick={handleDownloadLogo} disabled={!selectedSppgDetails?.yayasan}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Logo</span>
                </Button>
             </div>
        )}
        
        <Tabs defaultValue="harian" onValueChange={setActiveTab} className="relative">
          <TabsList ref={el => {
              if (!el) return;
              tabsRef.current = Array.from(el.children) as HTMLButtonElement[];
          }}>
            <TabsTrigger
              value="harian"
              data-value="harian"
            >
              Menu Harian
            </TabsTrigger>
            <TabsTrigger
              value="mingguan"
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
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {(Object.keys(currentWeeklyMenu.weekStatus) as DayOfWeek[]).map((day) => {
                    const isFilled = currentWeeklyMenu.weekStatus[day];
                    const isSelected = selectedDay === day;
                    return (
                      <Button
                        key={day}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => handleDayClick(day)}
                        className="w-full justify-center"
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
            <Card>
                <CardHeader>
                    <CardTitle>Pengajuan Menu Minggu Depan</CardTitle>
                    <CardDescription>
                        Tab ini digunakan untuk pengajuan menu pada periode tanggal 
                        <span className="font-semibold text-foreground"> {nextWeekDateRange.start}</span> sampai 
                        <span className="font-semibold text-foreground"> {nextWeekDateRange.end}</span>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-8">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download Format
                        </Button>
                        <Button className="w-full sm:w-auto">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Laporan
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    <MenuFormDialog 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        day={selectedDay}
        menuData={currentMenuDataForDialog}
    />
    </>
  );
}
