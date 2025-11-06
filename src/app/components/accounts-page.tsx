
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Edit, Info, Trash2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { User } from '@supabase/supabase-js';
import { Switch } from '@/components/ui/switch';
import { getUsers, updateUserMetadata, createUser } from '@/app/actions/accounts';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type SppgData = {
  id: string;
  nama: string;
};

const positionOptions = ['Ka. SPPG', 'Ahli Gizi', 'Akuntan', 'Asisten Lapangan'];


const baseSchema = z.object({
    full_name: z.string().min(1, 'Nama lengkap harus diisi'),
    phone: z.string().optional(),
    role: z.enum(['Admin Pusat', 'SPPG'], { required_error: 'Role harus dipilih' }),
    sppgId: z.string().min(1, 'SPPG harus dipilih'),
    position: z.string().optional(),
});

const createUserFormSchema = baseSchema.extend({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
});

const updateUserFormSchema = baseSchema.extend({
    email: z.string().min(1, "Harap pilih akun pending."), // Now holds the user ID
});

const editUserFormSchema = baseSchema;


type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;
type EditUserFormValues = z.infer<typeof editUserFormSchema>;
type FormValues = CreateUserFormValues | UpdateUserFormValues | EditUserFormValues;


const AccountForm = ({ 
    account, 
    pendingUsers, 
    usePending, 
    onUsePendingChange,
    onFormSubmit,
    sppgList
}: { 
    account?: User | null,
    pendingUsers: User[],
    usePending: boolean,
    onUsePendingChange: (value: boolean) => void,
    onFormSubmit: SubmitHandler<any>,
    sppgList: SppgData[]
}) => {
    const [selectedPendingData, setSelectedPendingData] = useState<{id: string, email: string, name: string} | null>(null);
    
    const activeSchema = useMemo(() => {
        if (account) {
            return editUserFormSchema;
        }
        if (usePending) {
            return updateUserFormSchema;
        }
        return createUserFormSchema;
    }, [account, usePending]);

    const defaultValues = useMemo(() => {
        if (account) {
            return {
                full_name: account.user_metadata?.full_name || '',
                email: account.email || '',
                phone: account.user_metadata?.phone || '',
                role: account.user_metadata?.role || 'SPPG',
                sppgId: account.user_metadata?.sppgId || '',
                position: account.user_metadata?.position || '',
            }
        }
        return {
             full_name: '', email: '', phone: '', role: 'SPPG', sppgId: '', position: ''
        }
    }, [account]);

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(activeSchema),
        defaultValues
    });

    const role = watch('role');

    useEffect(() => {
        if (!usePending) {
            setSelectedPendingData(null);
            if (!account) { 
                setValue('email', '');
                setValue('full_name', '');
            }
        }
    }, [usePending, account, setValue]);

    const handlePendingUserChange = (userId: string) => {
        const user = pendingUsers.find(u => u.id === userId);
        if (user) {
            const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
            setValue('email', user.id); // IMPORTANT: set the ID to the email field
            setValue('full_name', fullName, { shouldValidate: true });
            setSelectedPendingData({ id: user.id, email: user.email || '', name: fullName });
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onFormSubmit)} id="account-form" className="space-y-4">
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
                             <Controller
                                name="email" 
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                        handlePendingUserChange(value);
                                    }}
                                    value={field.value}
                                    >
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
                                )}
                            />
                            {errors.email && <p className="text-sm text-destructive">{(errors.email as any).message}</p>}
                            {selectedPendingData && <Input readOnly disabled value={selectedPendingData.email} className="mt-2" />}
                        </div>
                    ) : (
                         <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="contoh@email.com" {...register('email')} disabled={!!account} />
                             {errors.email && <p className="text-sm text-destructive">{(errors.email as any).message}</p>}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input id="name" placeholder="Contoh: Budi Santoso" {...register('full_name')} />
                         {errors.full_name && <p className="text-sm text-destructive">{(errors.full_name as any).message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input id="phone" type="tel" placeholder="0812..." {...register('phone')} />
                    </div>
                    
                    {!usePending && !account && (
                        <>
                        <div className="grid gap-2">
                            <Label htmlFor="password">{account ? 'Password Baru (Opsional)' : 'Password'}</Label>
                            <Input id="password" type="password" {...register('password')} />
                            {errors.password && <p className="text-sm text-destructive">{(errors.password as any).message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="retype-password">{account ? 'Ulangi Password Baru' : 'Ulangi Password'}</Label>
                            <Input id="retype-password" type="password" {...register('confirmPassword')} />
                            {errors.confirmPassword && <p className="text-sm text-destructive">{(errors.confirmPassword as any).message}</p>}
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
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin Pusat">Admin Pusat</SelectItem>
                                    <SelectItem value="SPPG">SPPG</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.role && <p className="text-sm text-destructive">{(errors.role as any).message}</p>}
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="sppg">SPPG yang Dikelola</Label>
                        <Controller
                            name="sppgId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="sppg">
                                    <SelectValue placeholder="Pilih SPPG" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="admin-pusat">Admin Pusat</SelectItem>
                                    {sppgList.map(opt => (
                                        <SelectItem key={opt.id} value={opt.id}>{opt.nama}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.sppgId && <p className="text-sm text-destructive">{(errors.sppgId as any).message}</p>}
                    </div>
                    { role === 'SPPG' && (
                        <div className="grid gap-2">
                            <Label htmlFor="position">Jabatan</Label>
                            <Controller
                                name="position"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id="position">
                                        <SelectValue placeholder="Pilih Jabatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {positionOptions.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

type AccountsPageProps = {
    accountList: User[];
    sppgList: SppgData[];
}

export default function AccountsPage({ accountList, sppgList }: AccountsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [itemsPerPage, setClientItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<User | null>(null);
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
        const users = await getUsers({ type: 'pending' });
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

  const handleEditClick = (account: User) => {
    setSelectedAccount(account);
    setIsEditOpen(true);
  }

  const handleCloseDialogs = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelectedAccount(null); 
    setUsePendingAccount(false);
  }

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        let result;
        const metadata = {
            full_name: data.full_name,
            role: data.role,
            sppgId: data.sppgId,
            position: data.position,
            phone: data.phone,
        };

        if (usePendingAccount && !selectedAccount) {
            const updateData = data as UpdateUserFormValues;
            const userId = updateData.email; 
            if (!userId) {
                toast({ variant: "destructive", title: "Error", description: "Pengguna pending tidak valid." });
                setIsLoading(false);
                return;
            }
             result = await updateUserMetadata(userId, metadata);

        } else if (selectedAccount) {
            const editData = data as EditUserFormValues;
             result = await updateUserMetadata(selectedAccount.id, editData);
        } else {
            const createData = data as CreateUserFormValues;
            if (!createData.password) {
                 toast({ variant: "destructive", title: "Error", description: "Password harus diisi untuk akun baru." });
                 setIsLoading(false);
                return;
            }
            result = await createUser({ email: createData.email, password: createData.password, ...metadata });
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
                  <TableCell className="font-medium">{account.user_metadata.full_name || account.email}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <Badge variant={account.user_metadata.role === 'Admin Pusat' ? 'secondary' : 'default'}>
                      {account.user_metadata.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{sppgList.find(s => s.id === account.user_metadata.sppgId)?.nama || account.user_metadata.sppgId || '-'}</TableCell>
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
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" disabled={isLoading || isFetchingPending}>Batal</Button>
                </DialogClose>
              <Button type="submit" form="account-form" disabled={isLoading || isFetchingPending}>
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
            Ubah detail akun dan penugasan untuk {selectedAccount?.user_metadata.full_name || selectedAccount?.email}.
          </DialogDescription>
        </DialogHeader>
         <AccountForm 
            account={selectedAccount}
            pendingUsers={[]}
            usePending={false}
            onUsePendingChange={() => {}}
            onFormSubmit={handleFormSubmit}
            sppgList={sppgList}
        />
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>Batal</Button>
            </DialogClose>
          <Button type="submit" form="account-form" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
