import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { mapErrorToUserMessage } from "@/lib/errorUtils";
import { Plus, Pencil, Trash2, Loader2, Upload, QrCode, Building2, Eye, EyeOff } from "lucide-react";

interface QrisItem {
  id: string;
  image_url: string;
  caption: string | null;
  active: boolean;
}

interface BankItem {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  active: boolean;
  sort_order: number;
}

export default function AdminDonation() {
  const [qrisList, setQrisList] = useState<QrisItem[]>([]);
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState<BankItem | null>(null);
  const [uploadingQris, setUploadingQris] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [bankForm, setBankForm] = useState({
    bank_name: "", account_number: "", account_name: "", active: true, sort_order: 0,
  });

  const fetchData = async () => {
    try {
      const [qrisRes, banksRes] = await Promise.all([
        supabase.from("donation_qris").select("*").order("created_at", { ascending: false }),
        supabase.from("donation_banks").select("*").order("sort_order"),
      ]);
      if (qrisRes.data) setQrisList(qrisRes.data);
      if (banksRes.data) setBanks(banksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // QRIS handlers
  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "File harus berupa gambar", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Ukuran maksimal 5MB", variant: "destructive" });
      return;
    }

    setUploadingQris(true);
    const ext = file.name.split(".").pop();
    const fileName = `qris/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cms-images").upload(fileName, file);

    if (uploadError) {
      toast({ title: "Gagal upload", description: uploadError.message, variant: "destructive" });
      setUploadingQris(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(uploadData.path);

    const { error } = await supabase.from("donation_qris").insert({
      image_url: urlData.publicUrl,
      caption: "QRIS",
      created_by: user?.id,
    });

    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "QRIS berhasil ditambahkan" });
      fetchData();
    }
    setUploadingQris(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleQris = async (id: string, active: boolean) => {
    const { error } = await supabase.from("donation_qris").update({ active: !active }).eq("id", id);
    if (error) {
      toast({ title: "Gagal mengubah status", variant: "destructive" });
    } else {
      fetchData();
    }
  };

  const deleteQris = async (id: string) => {
    if (!confirm("Yakin ingin menghapus QRIS ini?")) return;
    const { error } = await supabase.from("donation_qris").delete().eq("id", id);
    if (error) {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    } else {
      toast({ title: "QRIS dihapus" });
      fetchData();
    }
  };

  // Bank handlers
  const resetBankForm = () => {
    setBankForm({ bank_name: "", account_number: "", account_name: "", active: true, sort_order: 0 });
    setEditingBank(null);
  };

  const openEditBank = (item: BankItem) => {
    setEditingBank(item);
    setBankForm({
      bank_name: item.bank_name,
      account_number: item.account_number,
      account_name: item.account_name,
      active: item.active,
      sort_order: item.sort_order,
    });
    setIsBankDialogOpen(true);
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBank) {
        const { error } = await supabase.from("donation_banks").update(bankForm).eq("id", editingBank.id);
        if (error) throw error;
        toast({ title: "Rekening berhasil diperbarui" });
      } else {
        const { error } = await supabase.from("donation_banks").insert({
          ...bankForm, created_by: user?.id,
        });
        if (error) throw error;
        toast({ title: "Rekening berhasil ditambahkan" });
      }
      setIsBankDialogOpen(false);
      resetBankForm();
      fetchData();
    } catch (error: unknown) {
      toast({ title: "Error", description: mapErrorToUserMessage(error, "Gagal menyimpan"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBank = async (id: string, active: boolean) => {
    const { error } = await supabase.from("donation_banks").update({ active: !active }).eq("id", id);
    if (error) {
      toast({ title: "Gagal mengubah status", variant: "destructive" });
    } else {
      fetchData();
    }
  };

  const deleteBank = async (id: string) => {
    if (!confirm("Yakin ingin menghapus rekening ini?")) return;
    const { error } = await supabase.from("donation_banks").delete().eq("id", id);
    if (error) {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    } else {
      toast({ title: "Rekening dihapus" });
      fetchData();
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Donasi & Infaq</h1>
          <p className="text-muted-foreground">Kelola QRIS dan rekening bank donasi</p>
        </div>

        {/* QRIS Section */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">QRIS Indonesia</h2>
            </div>
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploadingQris}>
              {uploadingQris ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload QRIS
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleQrisUpload} />
          </div>

          {qrisList.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada gambar QRIS.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrisList.map((item) => (
                <div key={item.id} className="relative border rounded-lg overflow-hidden bg-background">
                  <img src={item.image_url} alt="QRIS" className="w-full h-auto object-contain max-h-64" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <div className="p-3 flex items-center justify-between border-t">
                    <Button size="sm" variant="ghost" onClick={() => toggleQris(item.id, item.active)} title={item.active ? "Sembunyikan" : "Tampilkan"}>
                      {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteQris(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bank Section */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Rekening Bank</h2>
            </div>
            <Button onClick={() => { resetBankForm(); setIsBankDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Rekening
            </Button>
          </div>

          {banks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada rekening bank.</p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead>No. Rekening</TableHead>
                    <TableHead>Atas Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banks.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.bank_name}</TableCell>
                      <TableCell className="font-mono">{item.account_number}</TableCell>
                      <TableCell>{item.account_name}</TableCell>
                      <TableCell>
                        <Badge variant={item.active ? "default" : "secondary"}>
                          {item.active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => toggleBank(item.id, item.active)} title={item.active ? "Sembunyikan" : "Tampilkan"}>
                          {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEditBank(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteBank(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Bank Dialog */}
        <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBank ? "Edit Rekening" : "Tambah Rekening"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBankSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Bank</Label>
                <Input value={bankForm.bank_name} onChange={(e) => setBankForm((p) => ({ ...p, bank_name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Nomor Rekening</Label>
                <Input value={bankForm.account_number} onChange={(e) => setBankForm((p) => ({ ...p, account_number: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Atas Nama</Label>
                <Input value={bankForm.account_name} onChange={(e) => setBankForm((p) => ({ ...p, account_name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input type="number" value={bankForm.sort_order} onChange={(e) => setBankForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Status Aktif</Label>
                <Switch checked={bankForm.active} onCheckedChange={(c) => setBankForm((p) => ({ ...p, active: c }))} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsBankDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
