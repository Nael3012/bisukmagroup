
'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

type Account = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Admin Pusat' | 'SPPG';
  sppgManaged: string | null; // SPPG ID
  position?: 'Ka. SPPG' | 'Ahli Gizi' | 'Akuntan' | 'Asisten Lapangan';
};

const accountList: Account[] = [
  {
    id: 'user-1',
    name: 'Admin BGN',
    email: 'admin.pusat@bgn.com',
    phone: '081234567890',
    role: 'Admin Pusat',
    sppgManaged: null,
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '081234567891',
    role: 'SPPG',
    sppgManaged: 'SPPG Al-Ikhlas',
    position: 'Ka. SPPG',
  },
  {
    id: 'user-3',
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    phone: '081234567892',
    role: 'SPPG',
    sppgManaged: 'SPPG Bina Umat',
    position: 'Akuntan',
  },
];

const sppgOptions = [
    { value: 'SPPG Al-Ikhlas', label: 'SPPG Al-Ikhlas' },
    { value: 'SPPG Bina Umat', label: 'SPPG Bina Umat' },
    { value: 'SPPG Nurul Hidayah', label: 'SPPG Nurul Hidayah' },
];

const positionOptions = ['Ka. SPPG', 'Ahli Gizi', 'Akuntan', 'Asisten Lapangan'];


const AccountForm = ({ account }: { account?: Account | null }) => {
    const [role, setRole] = useState(account?.role || 'SPPG');

    useEffect(() => {
        if(account?.role) {
            setRole(account.role);
        }
    }, [account]);
    
    return (
        <div className="flex flex-col md:flex-row gap-8 py-4">
            {/* Segment 1: Data Pribadi */}
            <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">Data Pribadi</h3>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" placeholder="Contoh: Budi Santoso" defaultValue={account?.name} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" type="tel" placeholder="0812..." defaultValue={account?.phone} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contoh@email.com" defaultValue={account?.email} />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="password">{account ? 'Password Baru (Opsional)' : 'Password'}</Label>
                    <Input id="password" type="password" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="retype-password">{account ? 'Ulangi Password Baru' : 'Ulangi Password'}</Label>
                    <Input id="retype-password" type="password" />
                </div>
            </div>

            <Separator orientation="vertical" className="h-auto hidden md:block" />

            {/* Segment 2: Penugasan & Role */}
            <div className="flex-1 space-y-4">
                 <h3 className="text-lg font-semibold text-muted-foreground">Penugasan & Role</h3>
                 <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin Pusat">Admin Pusat</SelectItem>
                        <SelectItem value="SPPG">SPPG</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                { role === 'SPPG' && (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="sppg">SPPG yang Dikelola</Label>
                            <Select defaultValue={account?.sppgManaged || undefined}>
                                <SelectTrigger id="sppg">
                                <SelectValue placeholder="Pilih SPPG" />
                                </SelectTrigger>
                                <SelectContent>
                                {sppgOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="position">Jabatan</Label>
                            <Select defaultValue={account?.position || undefined}>
                                <SelectTrigger id="position">
                                <SelectValue placeholder="Pilih Jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                {positionOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default function AccountsPage() {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accountList.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(accountList.length / itemsPerPage);

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setIsEditOpen(true);
  }

  const handleCloseDialogs = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelectedAccount(null); // Clear selection on close
  }

  return (
    <>
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Penanggung Jawab</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>SPPG yang Dikelola</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <Badge variant={account.role === 'Admin Pusat' ? 'secondary' : 'default'}>
                      {account.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.sppgManaged || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(account)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Akun</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Hapus Akun</span>
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2">
            <Label htmlFor="items-per-page-accounts">Tampilkan</Label>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger id="items-per-page-accounts" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Sebelumnya</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Selanjutnya</span>
          </Button>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddOpen(true)}>Tambah Akun</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tambah Akun Baru</DialogTitle>
            </DialogHeader>
            <AccountForm />
            <DialogFooter>
              <Button type="submit">Simpan Akun</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    
    {/* Edit Dialog */}
    <Dialog open={isEditOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Akun & Penugasan</DialogTitle>
          <DialogDescription>
            Ubah detail akun dan penugasan untuk {selectedAccount?.name}.
          </DialogDescription>
        </DialogHeader>
        <AccountForm account={selectedAccount} />
        <DialogFooter>
          <Button type="submit">Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

    
    