
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
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Edit, Info, Trash2 } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { User } from '@supabase/supabase-js';
import { Switch } from '@/components/ui/switch';
import {
    getPendingAuthUsers,
    createUserWithProfile,
    updateUserProfile,
    assignPendingUser,
    type UserProfile,
} from '@/app/actions/accounts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type SppgData = {
  id: string;
  nama: string;
};

const positionOptions = ['Ka. SPPG', 'Ahli Gizi', 'Akuntan', 'Asisten Lapangan'];

const AccountForm = ({ 
    account, 
    pendingUsers, 
    usePending, 
    onUsePendingChange,
    onFormSubmit,
    sppgList,
    formId
}: { 
    account?: UserProfile | null,
    pendingUsers: User[],
    usePending: boolean,
    onUsePendingChange: (value: boolean) => void,
    onFormSubmit: (formData: FormData) => Promise<void>,
    sppgList: SppgData[],
    formId: string
}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedPendingData, setSelectedPendingData] = useState<{id: string, email: string, name: string} | null>(null);
    const [selectedRole, setSelectedRole] = useState<'Admin Pusat' | 'SPPG'>(account?.role || 'SPPG');

    const handlePendingUserChange = (userId: string) => {
        const user = pendingUsers.find(u => u.id === userId);
        if (user) {
            const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
            setSelectedPendingData({ id: user.id, email: user.email || '', name: fullName });
        }
    };
    
    return (
        <form 
            ref={formRef}
            id={formId} 
            className="space-y-4"
            action={async (formData) => {
                await onFormSubmit(formData);
                formRef.current?.reset();
            }}
        >
            {account && <input type="hidden" name="id" value={account.id} />}
            {usePending && selectedPendingData && <input type="hidden" name="id" value={selectedPendingData.id} />}

            <div className="flex flex-col md:flex-row gap-8 py-4">
                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">Data Pribadi</h3>
                    
                    {!account && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                            id="use-pending-switch"
                            checked={usePending}
                            onCheckedChange={onUsePendingChange}
                            />
                            <Label htmlFor="use-pending-switch">Pilih dari Akun Pending</Label>
                        </div>
                    )}
                    
                    {usePending && !account ? (
                        <div className="grid gap-2">
                            <Label htmlFor="pending-email">Email Akun Pending</Label>
                            <Select name="email_select" onValueChange={handlePendingUserChange}>
                                <SelectTrigger id="pending-email">
                                    <SelectValue placeholder="Pilih email dari akun pending" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pendingUsers.length > 0 ? (
                                        pendingUsers.map(user => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.email}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-muted-foreground">Tidak ada akun pending.</div>
                                    )}
                                </SelectContent>
                            </Select>
                            {selectedPendingData && <Input readOnly disabled value={selectedPendingData.email} className="mt-2" />}
                            <input type="hidden" name="email" value={selectedPendingData?.email || ''} />
                        </div>
                    ) : (
                         <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" id="email" type="email" placeholder="contoh@email.com" defaultValue={account?.email} disabled={!!account} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input name="nama" id="nama" placeholder="Contoh: Budi Santoso" defaultValue={selectedPendingData?.name || account?.nama || ''} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="telepon">Nomor Telepon</Label>
                        <Input name="telepon" id="telepon" type="tel" placeholder="0812..." defaultValue={account?.telepon || ''} />
                    </div>
                    
                    {!usePending && !account && (
                        <>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" id="password" type="password" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="retype-password">Ulangi Password</Label>
                            <Input name="confirmPassword" id="retype-password" type="password" />
                        </div>
                        </>
                    )}
                </div>

                <Separator orientation="vertical" className="h-auto hidden md:block" />

                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">Penugasan & Role</h3>
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Harap teliti dalam memilih SPPG dan Jabatan yang sesuai.
                        </AlertDescription>
                    </Alert>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue={account?.role} onValueChange={(value) => setSelectedRole(value as 'Admin Pusat' | 'SPPG')}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin Pusat">Admin Pusat</SelectItem>
                                <SelectItem value="SPPG">SPPG</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="sppg_id">SPPG yang Dikelola</Label>
                        <Select name="sppg_id" defaultValue={account?.sppg_id}>
                            <SelectTrigger id="sppg_id">
                                <SelectValue placeholder="Pilih SPPG" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin-pusat">Admin Pusat</SelectItem>
                                {sppgList.map(opt => (
                                    <SelectItem key={opt.id} value={opt.id}>{opt.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    { selectedRole === 'SPPG' && (
                        <div className="grid gap-2">
                            <Label htmlFor="jabatan">Jabatan</Label>
                             <Select name="jabatan" defaultValue={account?.jabatan}>
                                <SelectTrigger id="jabatan">
                                    <SelectValue placeholder="Pilih Jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                {positionOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

type AccountsPageProps = {
    accountList: UserProfile[];
    sppgList: SppgData[];
}

export default function AccountsPage({ accountList, sppgList }: AccountsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [itemsPerPage, setClientItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<UserProfile | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [usePendingAccount, setUsePendingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPending, setIsFetchingPending] = useState(false);


  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  
  const fetchPending = async () => {
    setIsFetchingPending(true);
    try {
        const users = await getPendingAuthUsers();
        setPendingUsers(users || []);
    } catch (error: any) {
        console.error("Gagal mengambil data pengguna pending:", error);
        toast({
            variant: "destructive",
            title: "Gagal mengambil data",
            description: error.message || "Tidak dapat memuat daftar akun pending.",
        });
    } finally {
        setIsFetchingPending(false);
    }
  };

  useEffect(() => {
      if(isAddOpen && usePendingAccount) {
          fetchPending();
      }
  }, [isAddOpen, usePendingAccount]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accountList.slice(startIndex, endIndex);
  }, [accountList, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(accountList.length / itemsPerPage);

  const handleEditClick = (account: UserProfile) => {
    setSelectedAccount(account);
    setIsEditOpen(true);
  }

  const handleCloseDialogs = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelectedAccount(null); 
    setUsePendingAccount(false);
  }

  const handleFormSubmit = async (formData: FormData) => {
        setIsLoading(true);
        let result;

        if (usePendingAccount && !selectedAccount) {
            result = await assignPendingUser(formData);
        } else if (selectedAccount) {
             result = await updateUserProfile(formData);
        } else {
            result = await createUserWithProfile(formData);
        }
        
        if (result.success) {
            toast({
                title: "Sukses!",
                description: "Data akun berhasil disimpan.",
            });
            handleCloseDialogs();
            router.refresh(); 
        } else {
            toast({
                variant: "destructive",
                title: "Gagal menyimpan akun",
                description: result.error || "Terjadi kesalahan yang tidak diketahui.",
            });
        }
         setIsLoading(false);
  };


  return (
    <>
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Penanggung Jawab</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                    <TableCell className="font-medium">{account.nama || account.email}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <Badge variant={account.role === 'Admin Pusat' ? 'secondary' : 'default'}>
                        {account.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{sppgList.find(s => s.id === account.sppg_id)?.nama || account.sppg_id || '-'}</TableCell>
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
                  {paginatedAccounts.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={5} className="text-center h-24">
                              Belum ada akun penanggung jawab yang ditugaskan.
                          </TableCell>
                      </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2">
            <Label htmlFor="items-per-page-accounts">Tampilkan</Label>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => setClientItemsPerPage(Number(value))}
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
            Halaman {currentPage} dari {totalPages || 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Selanjutnya</span>
          </Button>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) handleCloseDialogs(); else setIsAddOpen(true);}}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddOpen(true)}>Tambah Akun</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tambah Akun Baru</DialogTitle>
            </DialogHeader>
             <AccountForm 
                pendingUsers={pendingUsers}
                usePending={usePendingAccount}
                onUsePendingChange={setUsePendingAccount}
                onFormSubmit={handleFormSubmit}
                sppgList={sppgList}
                formId="add-account-form"
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" disabled={isLoading || isFetchingPending}>Batal</Button>
                </DialogClose>
              <Button type="submit" form="add-account-form" disabled={isLoading || isFetchingPending}>
                {isLoading ? 'Menyimpan...' : 'Simpan Akun'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    
    <Dialog open={isEditOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Akun & Penugasan</DialogTitle>
          <DialogDescription>
            Ubah detail akun dan penugasan untuk {selectedAccount?.nama || selectedAccount?.email}.
          </DialogDescription>
        </DialogHeader>
         <AccountForm 
            account={selectedAccount}
            pendingUsers={[]}
            usePending={false}
            onUsePendingChange={() => {}}
            onFormSubmit={handleFormSubmit}
            sppgList={sppgList}
            formId="edit-account-form"
        />
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>Batal</Button>
            </DialogClose>
          <Button type="submit" form="edit-account-form" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
