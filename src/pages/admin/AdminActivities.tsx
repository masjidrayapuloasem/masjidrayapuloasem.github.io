import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { mapErrorToUserMessage } from "@/lib/errorUtils";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  { value: "BookOpen", label: "Buku (Kajian)" },
  { value: "Users", label: "Orang (Majelis)" },
  { value: "Baby", label: "Anak (TPA)" },
  { value: "HandHeart", label: "Hati (Sosial)" },
  { value: "CalendarDays", label: "Kalender" },
];

interface Activity {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  schedule_text: string | null;
  highlighted: boolean;
  active: boolean;
  created_at: string;
}

export default function AdminActivities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Activity | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "BookOpen",
    schedule_text: "",
    highlighted: false,
    active: true,
  });

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false });
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
    setFormData({ title: "", description: "", icon_name: "BookOpen", schedule_text: "", highlighted: false, active: true });
    setEditingItem(null);
  };

  const openEditDialog = (item: Activity) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      icon_name: item.icon_name || "BookOpen",
      schedule_text: item.schedule_text || "",
      highlighted: item.highlighted,
      active: item.active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        icon_name: formData.icon_name,
        schedule_text: formData.schedule_text || null,
        highlighted: formData.highlighted,
        active: formData.active,
      };
      if (editingItem) {
        const { error } = await supabase.from("activities").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Berhasil", description: "Kegiatan berhasil diperbarui" });
      } else {
        const { error } = await supabase.from("activities").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
        toast({ title: "Berhasil", description: "Kegiatan berhasil ditambahkan" });
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
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;
    try {
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Kegiatan berhasil dihapus" });
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
            <h1 className="text-2xl font-bold">Kegiatan Masjid</h1>
            <p className="text-muted-foreground">Kelola daftar kegiatan masjid. Tandai "Highlight" untuk ditampilkan di beranda.</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Belum ada kegiatan.</div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kegiatan</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Highlight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.schedule_text || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={item.highlighted ? "default" : "outline"}>
                        {item.highlighted ? "Ya" : "Tidak"}
                      </Badge>
                    </TableCell>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Kegiatan" : "Tambah Kegiatan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nama Kegiatan</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule_text">Jadwal</Label>
                <Input id="schedule_text" value={formData.schedule_text} onChange={(e) => setFormData((p) => ({ ...p, schedule_text: e.target.value }))} placeholder="Contoh: Ahad 06:00 & Selasa 19:30" />
              </div>
              <div className="space-y-2">
                <Label>Ikon</Label>
                <Select value={formData.icon_name} onValueChange={(value) => setFormData((p) => ({ ...p, icon_name: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((p) => ({ ...p, description: value }))}
                  placeholder="Tulis deskripsi kegiatan..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="highlighted">Tampilkan di Beranda (Highlight)</Label>
                <Switch id="highlighted" checked={formData.highlighted} onCheckedChange={(checked) => setFormData((p) => ({ ...p, highlighted: checked }))} />
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
