
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

export function TabelAkgHarian() {
  const [activeTab, setActiveTab] = useState('sma');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTabElement = tabsRef.current.find(tab => tab?.dataset.value === activeTab);
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tabel AKG Harian</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tabel Angka Kecukupan Gizi (AKG)</DialogTitle>
          <DialogDescription>
            Berikut adalah tabel AKG rata-rata untuk berbagai kelompok usia di Indonesia.
          </DialogDescription>
            <div className="flex items-center gap-2 pt-2">
            <CircleAlert className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
                Berdasarkan Angka Kecukupan Gizi (AKG) 2019 dari Kementerian Kesehatan Republik Indonesia
            </p>
            </div>
        </DialogHeader>
          <Tabs defaultValue="sma" onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList ref={el => {
              if (!el) return;
              tabsRef.current = Array.from(el.children) as HTMLButtonElement[];
            }} className="grid w-full grid-cols-7 relative">
                <TabsTrigger value="busui" data-value="busui">BUSUI</TabsTrigger>
                <TabsTrigger value="balita" data-value="balita">Balita</TabsTrigger>
                <TabsTrigger value="paud" data-value="paud">PAUD</TabsTrigger>
                <TabsTrigger value="sd" data-value="sd">SD</TabsTrigger>
                <TabsTrigger value="smp" data-value="smp">SMP</TabsTrigger>
                <TabsTrigger value="sma" data-value="sma">SMA</TabsTrigger>
                <TabsTrigger value="bumil" data-value="bumil">BUMIL</TabsTrigger>
                 <div
                    className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
                    style={indicatorStyle}
                />
            </TabsList>
            <TabsContent value="busui">
                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan gizi makro untuk ibu menyusui (Tambahan dari kebutuhan perempuan dewasa)</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kandungan Gizi</TableHead>
                                    <TableHead>6 bulan pertama menyusui</TableHead>
                                    <TableHead>6 bulan kedua menyusui</TableHead>
                                    <TableHead>Satuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Energi</TableCell><TableCell>+330</TableCell><TableCell>+400</TableCell><TableCell>kkal</TableCell></TableRow>
                                <TableRow><TableCell>Protein</TableCell><TableCell>+20</TableCell><TableCell>+15</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Lemak</TableCell><TableCell>+13</TableCell><TableCell>+10</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Karbohidrat</TableCell><TableCell>+30</TableCell><TableCell>+30</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Serat</TableCell><TableCell>+5</TableCell><TableCell>+5</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Air</TableCell><TableCell>+850</TableCell><TableCell>+850</TableCell><TableCell>ml</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan gizi mikro untuk ibu menyusui (Tambahan dari kebutuhan perempuan dewasa)</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kandungan Gizi</TableHead>
                                    <TableHead>6 bulan pertama menyusui</TableHead>
                                    <TableHead>6 bulan kedua menyusui</TableHead>
                                    <TableHead>Satuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Kalsium</TableCell><TableCell>+200</TableCell><TableCell>+200</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Zat Besi</TableCell><TableCell>+1</TableCell><TableCell>+1</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Zink</TableCell><TableCell>+5</TableCell><TableCell>+5</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin A</TableCell><TableCell>+350</TableCell><TableCell>+300</TableCell><TableCell>mcg RAE</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin D</TableCell><TableCell>+5</TableCell><TableCell>+5</TableCell><TableCell>mcg</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin C</TableCell><TableCell>+40</TableCell><TableCell>+40</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Asam Folat</TableCell><TableCell>+100</TableCell><TableCell>+100</TableCell><TableCell>mcg</TableCell></TableRow>
                                <TableRow><TableCell>Iodium</TableCell><TableCell>+50</TableCell><TableCell>+50</TableCell><TableCell>mcg</TableCell></TableRow>
                            </TableBody>
                        </Table>
                          <p className="text-xs text-muted-foreground mt-2">*Catatan: Nilai tambahan ini ditambahkan pada kebutuhan harian perempuan dewasa berdasarkan usia, berat badan, dan aktivitas fisik.</p>
                    </div>
                      <div>
                        <h3 className="font-semibold mb-2">Contoh kebutuhan total untuk busui</h3>
                        <p className="text-sm text-muted-foreground mb-2">Jika menggunakan acuan kebutuhan perempuan usia 19–29 tahun dengan aktivitas fisik ringan, maka total kebutuhan harian ibu menyusui adalah:</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kandungan Gizi</TableHead>
                                    <TableHead>Kebutuhan Dasar (19–29 th)</TableHead>
                                    <TableHead>Tambahan (6 bulan pertama)</TableHead>
                                    <TableHead>Total Kebutuhan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Energi</TableCell><TableCell>2.250 kkal</TableCell><TableCell>+330 kkal</TableCell><TableCell>2.580 kkal</TableCell></TableRow>
                                <TableRow><TableCell>Protein</TableCell><TableCell>60 gram</TableCell><TableCell>+20 gram</TableCell><TableCell>80 gram</TableCell></TableRow>
                                <TableRow><TableCell>Air</TableCell><TableCell>2.300 ml</TableCell><TableCell>+850 ml</TableCell><TableCell>3.150 ml</TableCell></TableRow>
                                <TableRow><TableCell>Kalsium</TableCell><TableCell>1.000 mg</TableCell><TableCell>+200 mg</TableCell><TableCell>1.200 mg</TableCell></TableRow>
                                <TableRow><TableCell>Zat Besi</TableCell><TableCell>26 mg</TableCell><TableCell>+1 mg</TableCell><TableCell>27 mg</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin C</TableCell><TableCell>75 mg</TableCell><TableCell>+40 mg</TableCell><TableCell>115 mg</TableCell></TableRow>
                                <TableRow><TableCell>Iodium</TableCell><TableCell>150 mcg</TableCell><TableCell>+50 mcg</TableCell><TableCell>200 mcg</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Poin penting untuk ibu menyusui</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li><span className="font-semibold text-foreground">Hidrasi:</span> Ibu menyusui membutuhkan cairan yang lebih banyak untuk produksi ASI. Disarankan untuk selalu menyediakan air minum di dekat tempat menyusui.</li>
                            <li><span className="font-semibold text-foreground">Gizi seimbang:</span> Kebutuhan gizi yang meningkat perlu dipenuhi dari makanan yang seimbang dan bervariasi. Fokus pada sumber protein (daging, ikan, telur, kacang-kacangan), kalsium (susu, keju, yogurt), zat besi (daging merah, sayuran hijau), serta vitamin dan mineral lainnya.</li>
                            <li><span className="font-semibold text-foreground">Konsultasi medis:</span> Kebutuhan gizi individu dapat berbeda-beda. Konsultasikan dengan ahli gizi atau dokter untuk mendapatkan rekomendasi yang paling sesuai dengan kondisi spesifik.</li>
                        </ul>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="balita">
                  <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Makro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 1–3 tahun</TableHead>
                            <TableHead>Usia 4–6 tahun</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>Energi</TableCell>
                            <TableCell>1.125</TableCell>
                            <TableCell>1.600</TableCell>
                            <TableCell>kkal</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Protein</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell>25</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Lemak</TableCell>
                            <TableCell>45</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Karbohidrat</TableCell>
                            <TableCell>215</TableCell>
                            <TableCell>220</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Serat</TableCell>
                            <TableCell>19</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Air</TableCell>
                            <TableCell>1.150</TableCell>
                            <TableCell>1.450</TableCell>
                            <TableCell>ml</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Mikro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 1–3 tahun</TableHead>
                            <TableHead>Usia 4–6 tahun</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Kalsium</TableCell>
                                <TableCell>650</TableCell>
                                <TableCell>1.000</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zat Besi</TableCell>
                                <TableCell>7</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zink</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>5</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin A</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>mcg RAE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin D</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin C</TableCell>
                                <TableCell>40</TableCell>
                                <TableCell>45</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Asam Folat</TableCell>
                                <TableCell>160</TableCell>
                                <TableCell>200</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Iodium</TableCell>
                                <TableCell>90</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="paud">
                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Makro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 1–3 tahun</TableHead>
                            <TableHead>Usia 4–6 tahun</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>Energi</TableCell>
                            <TableCell>1.125</TableCell>
                            <TableCell>1.600</TableCell>
                            <TableCell>kkal</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Protein</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell>25</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Lemak</TableCell>
                            <TableCell>45</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Karbohidrat</TableCell>
                            <TableCell>215</TableCell>
                            <TableCell>220</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Serat</TableCell>
                            <TableCell>19</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Air</TableCell>
                            <TableCell>1.150</TableCell>
                            <TableCell>1.450</TableCell>
                            <TableCell>ml</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Mikro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 1–3 tahun</TableHead>
                            <TableHead>Usia 4–6 tahun</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Kalsium</TableCell>
                                <TableCell>650</TableCell>
                                <TableCell>1.000</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zat Besi</TableCell>
                                <TableCell>7</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zink</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>5</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin A</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>mcg RAE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin D</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin C</TableCell>
                                <TableCell>40</TableCell>
                                <TableCell>45</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Asam Folat</TableCell>
                                <TableCell>160</TableCell>
                                <TableCell>200</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Iodium</TableCell>
                                <TableCell>90</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="sd">
                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Makro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 7–9 tahun</TableHead>
                            <TableHead>Usia 10–12 (L)</TableHead>
                            <TableHead>Usia 10–12 (P)</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>Energi</TableCell>
                            <TableCell>1.850</TableCell>
                            <TableCell>2.050</TableCell>
                            <TableCell>2.000</TableCell>
                            <TableCell>kkal</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Protein</TableCell>
                            <TableCell>40</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Lemak</TableCell>
                            <TableCell>60</TableCell>
                            <TableCell>65</TableCell>
                            <TableCell>60</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Karbohidrat</TableCell>
                            <TableCell>250</TableCell>
                            <TableCell>280</TableCell>
                            <TableCell>275</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Serat</TableCell>
                            <TableCell>21</TableCell>
                            <TableCell>23</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Air</TableCell>
                            <TableCell>1.650</TableCell>
                            <TableCell>1.900</TableCell>
                            <TableCell>1.900</TableCell>
                            <TableCell>ml</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Mikro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 7–9 tahun</TableHead>
                            <TableHead>Usia 10–12 (L)</TableHead>
                            <TableHead>Usia 10–12 (P)</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Kalsium</TableCell>
                                <TableCell>1.000</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zat Besi</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zink</TableCell>
                                <TableCell>8</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin A</TableCell>
                                <TableCell>500</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>mcg RAE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin D</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin C</TableCell>
                                <TableCell>45</TableCell>
                                <TableCell>65</TableCell>
                                <TableCell>65</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Asam Folat</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Iodium</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="smp">
                  <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Makro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 10–12 (L)</TableHead>
                            <TableHead>Usia 10–12 (P)</TableHead>
                            <TableHead>Usia 13–15 (L)</TableHead>
                            <TableHead>Usia 13–15 (P)</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>Energi</TableCell>
                            <TableCell>2.050</TableCell>
                            <TableCell>2.000</TableCell>
                            <TableCell>2.400</TableCell>
                            <TableCell>2.050</TableCell>
                            <TableCell>kkal</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Protein</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>72</TableCell>
                            <TableCell>69</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Lemak</TableCell>
                            <TableCell>65</TableCell>
                            <TableCell>60</TableCell>
                            <TableCell>70</TableCell>
                            <TableCell>60</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Karbohidrat</TableCell>
                            <TableCell>280</TableCell>
                            <TableCell>275</TableCell>
                            <TableCell>330</TableCell>
                            <TableCell>280</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Serat</TableCell>
                            <TableCell>23</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell>24</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Air</TableCell>
                            <TableCell>1.900</TableCell>
                            <TableCell>1.900</TableCell>
                            <TableCell>2.100</TableCell>
                            <TableCell>2.100</TableCell>
                            <TableCell>ml</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Mikro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Usia 10–12 (L)</TableHead>
                            <TableHead>Usia 10–12 (P)</TableHead>
                            <TableHead>Usia 13–15 (L)</TableHead>
                            <TableHead>Usia 13–15 (P)</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Kalsium</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zat Besi</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zink</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin A</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>mcg RAE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin D</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin C</TableCell>
                                <TableCell>65</TableCell>
                                <TableCell>65</TableCell>
                                <TableCell>75</TableCell>
                                <TableCell>75</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Asam Folat</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Iodium</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="sma">
                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Makro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Remaja 13–15 (L)</TableHead>
                            <TableHead>Remaja 13–15 (P)</TableHead>
                            <TableHead>Remaja 16–18 (L)</TableHead>
                            <TableHead>Remaja 16–18 (P)</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>Energi</TableCell>
                            <TableCell>2.400</TableCell>
                            <TableCell>2.050</TableCell>
                            <TableCell>2.650</TableCell>
                            <TableCell>2.100</TableCell>
                            <TableCell>kkal</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Protein</TableCell>
                            <TableCell>72</TableCell>
                            <TableCell>69</TableCell>
                            <TableCell>66</TableCell>
                            <TableCell>59</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Lemak</TableCell>
                            <TableCell>70</TableCell>
                            <TableCell>60</TableCell>
                            <TableCell>75</TableCell>
                            <TableCell>65</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Karbohidrat</TableCell>
                            <TableCell>330</TableCell>
                            <TableCell>280</TableCell>
                            <TableCell>360</TableCell>
                            <TableCell>290</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Serat</TableCell>
                            <TableCell>24</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell>24</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell>gram</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Air</TableCell>
                            <TableCell>2.100</TableCell>
                            <TableCell>2.100</TableCell>
                            <TableCell>2.300</TableCell>
                            <TableCell>2.100</TableCell>
                            <TableCell>ml</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Kebutuhan Gizi Mikro</h3>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Kandungan Gizi</TableHead>
                            <TableHead>Remaja 13–15 (L)</TableHead>
                            <TableHead>Remaja 13–15 (P)</TableHead>
                            <TableHead>Remaja 16–18 (L)</TableHead>
                            <TableHead>Remaja 16–18 (P)</TableHead>
                            <TableHead>Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Kalsium</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>1.200</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zat Besi</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>11</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zink</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>11</TableCell>
                                <TableCell>9</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin A</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>600</TableCell>
                                <TableCell>mcg RAE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin D</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vitamin C</TableCell>
                                <TableCell>75</TableCell>
                                <TableCell>75</TableCell>
                                <TableCell>90</TableCell>
                                <TableCell>75</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                              <TableRow>
                                <TableCell>Vitamin E</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>mg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Asam folat</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>400</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Iodium</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>120</TableCell>
                                <TableCell>150</TableCell>
                                <TableCell>150</TableCell>
                                <TableCell>mcg</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="bumil">
                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Tambahan gizi makro untuk ibu hamil</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kandungan Gizi</TableHead>
                                    <TableHead>Trimester I</TableHead>
                                    <TableHead>Trimester II</TableHead>
                                    <TableHead>Trimester III</TableHead>
                                    <TableHead>Satuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Energi</TableCell><TableCell>+180</TableCell><TableCell>+300</TableCell><TableCell>+300</TableCell><TableCell>kkal</TableCell></TableRow>
                                <TableRow><TableCell>Protein</TableCell><TableCell>+1</TableCell><TableCell>+10</TableCell><TableCell>+20</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Lemak</TableCell><TableCell>+1</TableCell><TableCell>+10</TableCell><TableCell>+10</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Karbohidrat</TableCell><TableCell>+20</TableCell><TableCell>+30</TableCell><TableCell>+40</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Serat</TableCell><TableCell>+3</TableCell><TableCell>+3</TableCell><TableCell>+4</TableCell><TableCell>gram</TableCell></TableRow>
                                <TableRow><TableCell>Air</TableCell><TableCell>+300</TableCell><TableCell>+300</TableCell><TableCell>+300</TableCell><TableCell>ml</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Tambahan gizi mikro untuk ibu hamil</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kandungan Gizi</TableHead>
                                    <TableHead>Trimester I</TableHead>
                                    <TableHead>Trimester II</TableHead>
                                    <TableHead>Trimester III</TableHead>
                                    <TableHead>Satuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Kalsium</TableCell><TableCell>+200</TableCell><TableCell>+200</TableCell><TableCell>+200</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Zat Besi</TableCell><TableCell>+1</TableCell><TableCell>+1</TableCell><TableCell>+1</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Zink</TableCell><TableCell>+2</TableCell><TableCell>+2</TableCell><TableCell>+2</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin A</TableCell><TableCell>+50</TableCell><TableCell>+50</TableCell><TableCell>+50</TableCell><TableCell>mcg RAE</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin D</TableCell><TableCell>+0</TableCell><TableCell>+0</TableCell><TableCell>+0</TableCell><TableCell>mcg</TableCell></TableRow>
                                <TableRow><TableCell>Vitamin C</TableCell><TableCell>+10</TableCell><TableCell>+10</TableCell><TableCell>+10</TableCell><TableCell>mg</TableCell></TableRow>
                                <TableRow><TableCell>Asam Folat</TableCell><TableCell>+200</TableCell><TableCell>+200</TableCell><TableCell>+200</TableCell><TableCell>mcg</TableCell></TableRow>
                                <TableRow><TableCell>Iodium</TableCell><TableCell>+25</TableCell><TableCell>+25</TableCell><TableCell>+25</TableCell><TableCell>mcg</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Contoh total kebutuhan untuk bumil</h3>
                        <p className="text-sm text-muted-foreground">
                            Sebagai contoh, jika kebutuhan dasar energi perempuan dewasa usia 19–29 tahun dengan aktivitas ringan adalah 2.250 kkal, maka kebutuhan totalnya di trimester ketiga akan menjadi 2.250 + 300 = 2.550 kkal.
                        </p>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
