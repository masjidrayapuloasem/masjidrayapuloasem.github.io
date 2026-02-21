import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, X, Image as ImageIcon, Plus, Trash2, GripVertical } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "image";
  placeholder?: string;
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  sort_order: number;
  active: boolean;
}

const PLATFORM_OPTIONS = [
  { value: "Facebook", icon: "Facebook" },
  { value: "Instagram", icon: "Instagram" },
  { value: "YouTube", icon: "Youtube" },
  { value: "TikTok", icon: "Music" },
  { value: "Twitter / X", icon: "Twitter" },
  { value: "Google Maps", icon: "Map" },
  { value: "WhatsApp", icon: "MessageCircle" },
  { value: "Telegram", icon: "Send" },
  { value: "LinkedIn", icon: "Linkedin" },
  { value: "Lainnya", icon: "Link" },
];

const SECTION_VISIBILITY = [
  { key: "section_hero_visible", label: "Hero Slider" },
  { key: "section_sejarah_visible", label: "Sejarah" },
  { key: "section_visimisi_visible", label: "Visi & Misi" },
  { key: "section_kepengurusan_visible", label: "Struktur Kepengurusan" },
  { key: "section_announcements_visible", label: "Pengumuman" },
  { key: "section_schedule_visible", label: "Jadwal Sholat" },
  { key: "section_articles_visible", label: "Artikel" },
  { key: "section_activities_visible", label: "Program & Kegiatan" },
  { key: "section_donation_visible", label: "Donasi & Infaq" },
];

const SECTIONS: { title: string; description: string; fields: SettingField[] }[] = [
  {
    title: "Logo & Identitas",
    description: "Upload logo dan atur nama masjid",
    fields: [
      { key: "logo_url", label: "Logo Masjid", type: "image" },
      { key: "mosque_name", label: "Nama Masjid (Baris 1)", type: "text", placeholder: "Masjid Raya" },
      { key: "mosque_subtitle", label: "Nama Masjid (Baris 2)", type: "text", placeholder: "Pulo Asem" },
    ],
  },
  {
    title: "Informasi Kontak",
    description: "Alamat, telepon, dan email yang tampil di footer",
    fields: [
      { key: "footer_description", label: "Deskripsi Singkat", type: "textarea", placeholder: "Deskripsi singkat masjid..." },
      { key: "footer_address", label: "Alamat Lengkap", type: "textarea", placeholder: "Jl. ..." },
      { key: "footer_phone", label: "Nomor Telepon", type: "text", placeholder: "(021) xxxx-xxxx" },
      { key: "footer_email", label: "Email", type: "text", placeholder: "info@..." },
    ],
  },
  {
    title: "Jam Operasional",
    description: "Jam buka masjid dan sekretariat",
    fields: [
      { key: "footer_hours_daily", label: "Jam Buka Harian", type: "text", placeholder: "04:00 - 22:00 WIB" },
      { key: "footer_hours_office", label: "Jam Sekretariat", type: "text", placeholder: "08:00 - 16:00 WIB" },
    ],
  },
];

interface SortableItemProps {
  item: SocialMedia;
  onPlatformChange: (id: string, platform: string) => void;
  onUrlChange: (id: string, url: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onSave: (item: SocialMedia) => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
}

function SortableSocialItem({ item, onPlatformChange, onUrlChange, onToggleActive, onSave, onDelete, isSaving }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg border bg-muted/30">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-shrink-0 hidden sm:block touch-none">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <Select value={item.platform} onValueChange={(val) => onPlatformChange(item.id, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="sm:col-span-2"
          value={item.url}
          onChange={(e) => onUrlChange(item.id, e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            {item.active ? "Tampil" : "Sembunyi"}
          </Label>
          <Switch
            checked={item.active}
            onCheckedChange={(checked) => onToggleActive(item.id, checked)}
          />
        </div>

        <Button variant="outline" size="icon" onClick={() => onSave(item)} disabled={isSaving} className="h-9 w-9">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="h-9 w-9 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingSocial, setSavingSocial] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [settingsRes, socialRes] = await Promise.all([
      supabase.from("site_settings").select("key, value"),
      supabase.from("social_media").select("*").order("sort_order"),
    ]);

    if (settingsRes.data) {
      const map: Record<string, string> = {};
      settingsRes.data.forEach((item) => { map[item.key] = item.value; });
      setSettings(map);
    }
    if (socialRes.data) {
      setSocialMedia(socialRes.data);
    }
    setIsLoading(false);
  };

  const handleSaveSection = async (sectionTitle: string, fields: SettingField[]) => {
    setSavingSection(sectionTitle);
    try {
      for (const field of fields) {
        if (field.type === "image") continue;
        const value = settings[field.key] ?? "";
        await supabase.from("site_settings").update({ value }).eq("key", field.key);
      }
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Berhasil disimpan" });
    } catch {
      toast({ title: "Gagal menyimpan", variant: "destructive" });
    }
    setSavingSection(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `logo/logo-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("cms-images").upload(filePath, file);
    if (uploadError) {
      toast({ title: "Gagal upload", description: uploadError.message, variant: "destructive" });
      setUploadingLogo(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(filePath);
    await supabase.from("site_settings").update({ value: urlData.publicUrl }).eq("key", "logo_url");
    setSettings((prev) => ({ ...prev, logo_url: urlData.publicUrl }));
    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    toast({ title: "Logo berhasil diupload" });
    setUploadingLogo(false);
  };

  const handleRemoveLogo = async () => {
    await supabase.from("site_settings").update({ value: "" }).eq("key", "logo_url");
    setSettings((prev) => ({ ...prev, logo_url: "" }));
    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    toast({ title: "Logo dihapus" });
  };

  // Social media CRUD
  const handleAddSocial = async () => {
    const newOrder = socialMedia.length;
    const { data, error } = await supabase
      .from("social_media")
      .insert({ platform: "Facebook", url: "", icon_name: "Facebook", sort_order: newOrder, active: true })
      .select()
      .single();
    if (error) {
      toast({ title: "Gagal menambah", variant: "destructive" });
      return;
    }
    setSocialMedia((prev) => [...prev, data]);
    queryClient.invalidateQueries({ queryKey: ["social_media"] });
  };

  const handleUpdateSocial = async (id: string, updates: Partial<SocialMedia>) => {
    setSavingSocial(id);
    const { error } = await supabase.from("social_media").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Gagal menyimpan", variant: "destructive" });
    } else {
      setSocialMedia((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
      queryClient.invalidateQueries({ queryKey: ["social_media"] });
    }
    setSavingSocial(null);
  };

  const handleDeleteSocial = async (id: string) => {
    const { error } = await supabase.from("social_media").delete().eq("id", id);
    if (error) {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    } else {
      setSocialMedia((prev) => prev.filter((s) => s.id !== id));
      queryClient.invalidateQueries({ queryKey: ["social_media"] });
      toast({ title: "Berhasil dihapus" });
    }
  };

  const handlePlatformChange = (id: string, platform: string) => {
    const option = PLATFORM_OPTIONS.find((p) => p.value === platform);
    const iconName = option?.icon || "Link";
    setSocialMedia((prev) => prev.map((s) => (s.id === id ? { ...s, platform, icon_name: iconName } : s)));
  };

  const handleUrlChange = (id: string, url: string) => {
    setSocialMedia((prev) => prev.map((s) => (s.id === id ? { ...s, url } : s)));
  };

  const handleSaveSocialItem = async (item: SocialMedia) => {
    await handleUpdateSocial(item.id, { platform: item.platform, url: item.url, icon_name: item.icon_name });
    toast({ title: "Berhasil disimpan" });
  };

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = socialMedia.findIndex((s) => s.id === active.id);
    const newIndex = socialMedia.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(socialMedia, oldIndex, newIndex);
    const updated = reordered.map((s, i) => ({ ...s, sort_order: i }));
    setSocialMedia(updated);

    // Persist new order
    for (const item of updated) {
      await supabase.from("social_media").update({ sort_order: item.sort_order }).eq("id", item.id);
    }
    queryClient.invalidateQueries({ queryKey: ["social_media"] });
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pengaturan Situs</h1>
        <p className="text-muted-foreground">Kelola logo, informasi footer, dan media sosial.</p>

        <div className="space-y-8">
          {/* Maintenance Mode */}
          <div className="bg-card rounded-lg border border-destructive/30 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-destructive">Mode Maintenance</h2>
              <p className="text-sm text-muted-foreground">Aktifkan untuk menutup akses website sementara. Halaman admin tetap bisa diakses.</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="font-medium text-sm">Under Maintenance</span>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">
                  {settings.maintenance_mode === "true" ? "Aktif" : "Nonaktif"}
                </Label>
                <Switch
                  checked={settings.maintenance_mode === "true"}
                  onCheckedChange={async (checked) => {
                    const newVal = checked ? "true" : "false";
                    setSettings((prev) => ({ ...prev, maintenance_mode: newVal }));
                    await supabase.from("site_settings").update({ value: newVal }).eq("key", "maintenance_mode");
                    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section Visibility */}
          <div className="bg-card rounded-lg border p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Tampilan Section</h2>
              <p className="text-sm text-muted-foreground">Atur section mana saja yang ditampilkan di halaman utama</p>
            </div>
            <div className="space-y-3">
              {SECTION_VISIBILITY.map((section) => (
                <div key={section.key} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <span className="font-medium text-sm">{section.label}</span>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">
                      {settings[section.key] !== "false" ? "Tampil" : "Tersembunyi"}
                    </Label>
                    <Switch
                      checked={settings[section.key] !== "false"}
                      onCheckedChange={async (checked) => {
                        const newVal = checked ? "true" : "false";
                        setSettings((prev) => ({ ...prev, [section.key]: newVal }));
                        await supabase.from("site_settings").update({ value: newVal }).eq("key", section.key);
                        queryClient.invalidateQueries({ queryKey: ["site_settings"] });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Site Settings Sections */}
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-card rounded-lg border p-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>

              {section.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.type === "image" ? (
                    <div className="space-y-3">
                      {settings.logo_url ? (
                        <div className="relative inline-block">
                          <img src={settings.logo_url} alt="Logo" className="h-20 w-20 object-contain rounded-lg border bg-muted p-2" />
                          <button onClick={handleRemoveLogo} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-lg border border-dashed flex items-center justify-center bg-muted/50">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                        <Button variant="outline" size="sm" asChild disabled={uploadingLogo}>
                          <span>
                            {uploadingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                    </div>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={settings[field.key] ?? ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={settings[field.key] ?? ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}

              <Button onClick={() => handleSaveSection(section.title, section.fields)} disabled={savingSection === section.title}>
                {savingSection === section.title ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan
              </Button>
            </div>
          ))}

          {/* Social Media Section */}
          <div className="bg-card rounded-lg border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Media Sosial</h2>
                <p className="text-sm text-muted-foreground">Kelola link media sosial yang tampil di footer</p>
              </div>
              <Button onClick={handleAddSocial} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah
              </Button>
            </div>

            {socialMedia.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada media sosial. Klik "Tambah" untuk menambahkan.</p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={socialMedia.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {socialMedia.map((item) => (
                    <SortableSocialItem
                      key={item.id}
                      item={item}
                      onPlatformChange={handlePlatformChange}
                      onUrlChange={handleUrlChange}
                      onToggleActive={(id, checked) => handleUpdateSocial(id, { active: checked })}
                      onSave={handleSaveSocialItem}
                      onDelete={handleDeleteSocial}
                      isSaving={savingSocial === item.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
