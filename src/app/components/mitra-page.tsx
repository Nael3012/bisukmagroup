
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MitraPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitra</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sekolah">
          <TabsList>
            <TabsTrigger value="sekolah">Sekolah Penerima Manfaat</TabsTrigger>
            <TabsTrigger value="b3">B3 Penerima Manfaat</TabsTrigger>
          </TabsList>
          <TabsContent value="sekolah">
            <div className="p-4">
              <p>Konten untuk Sekolah Penerima Manfaat akan ditampilkan di sini.</p>
            </div>
          </TabsContent>
          <TabsContent value="b3">
            <div className="p-4">
              <p>Konten untuk B3 Penerima Manfaat akan ditampilkan di sini.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
