
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';

export default function MitraPage() {
  const [activeTab, setActiveTab] = useState('sekolah');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

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
        <CardTitle>Mitra</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sekolah" onValueChange={setActiveTab} className="relative">
          <TabsList>
            <TabsTrigger
              value="sekolah"
              ref={(el) => (tabsRef.current[0] = el)}
              data-value="sekolah"
            >
              Sekolah Penerima Manfaat
            </TabsTrigger>
            <TabsTrigger
              value="b3"
              ref={(el) => (tabsRef.current[1] = el)}
              data-value="b3"
            >
              B3 Penerima Manfaat
            </TabsTrigger>
             <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
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
