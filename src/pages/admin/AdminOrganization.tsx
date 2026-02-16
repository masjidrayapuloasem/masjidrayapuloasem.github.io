import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Loader2, Upload, Users } from "lucide-react";

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export default function AdminOrganization() {
  const [items, setItems] = useState<OrgMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<OrgMember | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photo_url: "",
    sort_order: 0,
    active: true,
  });

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("organization_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch {
      toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({ name: "", position: "", photo_url: "", sort_order: 0, active: true });
    setEditingItem(null);
  };

  const openEditDialog = (item: OrgMember) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      photo_url: item.photo_url || "",
      sort_order: item.sort_order,
      active: item.active,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `org-${Date.now()}.${fileExt}`;
      const filePath = `organization/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("cms-images").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, photo_url: publicUrl }));
      toast({ title: "Berhasil", description: "Foto berhasil diupload" });
    } catch (error: unknown) {
      toast({ title: "Error", description: mapErrorToUserMessage(error, "Gagal mengupload foto"), variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        position: formData.position,
        photo_url: formData.photo_url || null,
        sort_order: formData.sort_order,
        active: formData.active,
      };
      if (editingItem) {
        const { error } = await supabase.from("organization_members").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Berhasil", description: "Data pengurus berhasil diperbarui" });
      } else {
        const { error } = await supabase.from("organization_members").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
        toast({ title: "Berhasil", description: "Pengurus berhasil ditambahkan" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: unknown) {
      toast({ title: "Error", description: mapErrorToUserMessage(error, "Gagal menyimpan"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pengurus ini?")) return;
    try {
      const { error } = await supabase.from("organization_members").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Pengurus berhasil dihapus" });
      fetchData();
    } catch (error: unknown) {
      toast({ title: "Error", description: mapErrorToUserMessage(error, "Gagal menghapus"), variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Struktur Kepengurusan</h1>
            <p className="text-muted-foreground">Kelola data pengurus masjid</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengurus
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Belum ada data pengurus.</div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.photo_url ? (
                        <img src={item.photo_url} alt={item.name} className="w-10 h-10 object-cover rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Pengurus" : "Tambah Pengurus"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input id="position" value={formData.position} onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Foto (opsional)</Label>
                <div className="flex gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" id="org-photo-upload" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("org-photo-upload")?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Foto
                  </Button>
                </div>
                {formData.photo_url && <img src={formData.photo_url} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-full" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Urutan</Label>
                <Input id="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Status Aktif</Label>
                <Switch id="active" checked={formData.active} onCheckedChange={(checked) => setFormData((p) => ({ ...p, active: checked }))} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
