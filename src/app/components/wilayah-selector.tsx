'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Wilayah = {
  id: string;
  name: string;
};

type WilayahSelection = {
    province?: string;
    regency?: string;
    district?: string;
    village?: string;
}

export const WilayahSelector = ({ onWilayahChange, initialData }: { onWilayahChange: (wilayah: WilayahSelection) => void, initialData?: WilayahSelection | null }) => {
    const [provinces, setProvinces] = useState<Wilayah[]>([]);
    const [regencies, setRegencies] = useState<Wilayah[]>([]);
    const [districts, setDistricts] = useState<Wilayah[]>([]);
    const [villages, setVillages] = useState<Wilayah[]>([]);
    
    const [selectedProvince, setSelectedProvince] = useState(initialData?.province || '');
    const [selectedRegency, setSelectedRegency] = useState(initialData?.regency || '');
    const [selectedDistrict, setSelectedDistrict] = useState(initialData?.district || '');
    const [selectedVillage, setSelectedVillage] = useState(initialData?.village || '');

    useEffect(() => {
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(response => response.json())
            .then(data => setProvinces(data))
            .catch(error => console.error('Error fetching provinces:', error));
    }, []);

    const fetchRegencies = useCallback((provinceId: string) => {
        if (provinceId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
                .then(response => response.json())
                .then(data => setRegencies(data))
                .catch(error => console.error('Error fetching regencies:', error));
        }
    }, []);
    
    const fetchDistricts = useCallback((regencyId: string) => {
         if (regencyId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`)
                .then(response => response.json())
                .then(data => setDistricts(data))
                .catch(error => console.error('Error fetching districts:', error));
        }
    }, []);

    const fetchVillages = useCallback((districtId: string) => {
        if (districtId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`)
                .then(response => response.json())
                .then(data => setVillages(data))
                .catch(error => console.error('Error fetching villages:', error));
        }
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchRegencies(selectedProvince);
        }
    }, [selectedProvince, fetchRegencies]);

    useEffect(() => {
        if (selectedRegency) {
            fetchDistricts(selectedRegency);
        }
    }, [selectedRegency, fetchDistricts]);
    
    useEffect(() => {
        if (selectedDistrict) {
            fetchVillages(selectedDistrict);
        }
    }, [selectedDistrict, fetchVillages]);

    // Pre-load data on mount if initialData is provided
    useEffect(() => {
        if (initialData?.province) fetchRegencies(initialData.province);
        if (initialData?.regency) fetchDistricts(initialData.regency);
        if (initialData?.district) fetchVillages(initialData.district);
    }, [initialData, fetchRegencies, fetchDistricts, fetchVillages]);
    
    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId);
        setSelectedRegency('');
        setSelectedDistrict('');
        setSelectedVillage('');
        setRegencies([]);
        setDistricts([]);
        setVillages([]);
    }

    const handleRegencyChange = (regencyId: string) => {
        setSelectedRegency(regencyId);
        setSelectedDistrict('');
        setSelectedVillage('');
        setDistricts([]);
        setVillages([]);
    }
    
    const handleDistrictChange = (districtId: string) => {
        setSelectedDistrict(districtId);
        setSelectedVillage('');
        setVillages([]);
    }

    useEffect(() => {
        onWilayahChange({
            province: selectedProvince,
            regency: selectedRegency,
            district: selectedDistrict,
            village: selectedVillage
        })
    }, [selectedProvince, selectedRegency, selectedDistrict, selectedVillage, onWilayahChange]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="grid gap-1.5">
                <Label htmlFor="provinsi" className="text-xs">Provinsi</Label>
                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                    <SelectTrigger id="provinsi" className="text-xs h-9">
                        <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map(p => <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="kabupaten" className="text-xs">Kabupaten/Kota</Label>
                <Select value={selectedRegency} onValueChange={handleRegencyChange} disabled={!selectedProvince}>
                    <SelectTrigger id="kabupaten" className="text-xs h-9">
                        <SelectValue placeholder="Pilih Kabupaten/Kota" />
                    </SelectTrigger>
                    <SelectContent>
                        {regencies.map(r => <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="kecamatan" className="text-xs">Kecamatan</Label>
                <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedRegency}>
                    <SelectTrigger id="kecamatan" className="text-xs h-9">
                        <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map(d => <SelectItem key={d.id} value={d.id} className="text-xs">{d.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="desa" className="text-xs">Desa/Kelurahan</Label>
                <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedDistrict}>
                    <SelectTrigger id="desa" className="text-xs h-9">
                        <SelectValue placeholder="Pilih Desa/Kelurahan" />
                    </SelectTrigger>
                    <SelectContent>
                        {villages.map(v => <SelectItem key={v.id} value={v.id} className="text-xs">{v.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
