
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';


export default function MenuPage() {
    const [activeTab, setActiveTab] = useState('harian');
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
            <div className="p-4">
              <p>Konten untuk Menu Harian akan ditampilkan di sini.</p>
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
