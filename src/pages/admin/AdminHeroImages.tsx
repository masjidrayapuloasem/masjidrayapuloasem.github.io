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
import { Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";

interface HeroImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export default function AdminHeroImages() {
  const [items, setItems] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroImage | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image_url: "",
    caption: "",
    sort_order: 0,
    active: true,
  });

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_images")
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
    setFormData({ image_url: "", caption: "", sort_order: 0, active: true });
    setEditingItem(null);
  };

  const openEditDialog = (item: HeroImage) => {
    setEditingItem(item);
    setFormData({
      image_url: item.image_url,
      caption: item.caption || "",
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
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("cms-images").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Berhasil", description: "Gambar berhasil diupload" });
    } catch (error: unknown) {
      toast({ title: "Error", description: mapErrorToUserMessage(error, "Gagal mengupload gambar"), variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast({ title: "Error", description: "Gambar wajib diupload", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        image_url: formData.image_url,
        caption: formData.caption || null,
        sort_order: formData.sort_order,
        active: formData.active,
      };
      if (editingItem) {
        const { error } = await supabase.from("hero_images").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Berhasil", description: "Gambar hero berhasil diperbarui" });
      } else {
        const { error } = await supabase.from("hero_images").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
        toast({ title: "Berhasil", description: "Gambar hero berhasil ditambahkan" });
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
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;
    try {
      const { error } = await supabase.from("hero_images").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Gambar berhasil dihapus" });
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
            <h1 className="text-2xl font-bold">Gambar Hero Slider</h1>
            <p className="text-muted-foreground">Kelola gambar slider di halaman beranda</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Gambar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Belum ada gambar hero.</div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img src={item.image_url} alt={item.caption || "Hero"} className="w-24 h-14 object-cover rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{item.caption || "-"}</TableCell>
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
              <DialogTitle>{editingItem ? "Edit Gambar" : "Tambah Gambar"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Gambar</Label>
                <div className="flex gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" id="hero-img-upload" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("hero-img-upload")?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Gambar
                  </Button>
                </div>
                {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (opsional)</Label>
                <Input id="caption" value={formData.caption} onChange={(e) => setFormData((p) => ({ ...p, caption: e.target.value }))} />
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
