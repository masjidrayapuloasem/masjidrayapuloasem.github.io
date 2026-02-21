import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "image";
  placeholder?: string;
}

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
  {
    title: "Media Sosial",
    description: "Link akun media sosial masjid",
    fields: [
      { key: "social_facebook", label: "Facebook", type: "url", placeholder: "https://facebook.com/..." },
      { key: "social_instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
      { key: "social_youtube", label: "YouTube", type: "url", placeholder: "https://youtube.com/..." },
      { key: "social_tiktok", label: "TikTok", type: "url", placeholder: "https://tiktok.com/..." },
      { key: "social_twitter", label: "Twitter / X", type: "url", placeholder: "https://x.com/..." },
      { key: "social_google_maps", label: "Google Maps", type: "url", placeholder: "https://maps.google.com/..." },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (!error && data) {
      const map: Record<string, string> = {};
      data.forEach((item) => {
        map[item.key] = item.value;
      });
      setSettings(map);
    }
    setIsLoading(false);
  };

  const handleSaveSection = async (sectionTitle: string, fields: SettingField[]) => {
    setSavingSection(sectionTitle);
    try {
      for (const field of fields) {
        if (field.type === "image") continue; // handled separately
        const value = settings[field.key] ?? "";
        await supabase
          .from("site_settings")
          .update({ value })
          .eq("key", field.key);
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

    const { error: uploadError } = await supabase.storage
      .from("cms-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Gagal upload", description: uploadError.message, variant: "destructive" });
      setUploadingLogo(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    await supabase.from("site_settings").update({ value: publicUrl }).eq("key", "logo_url");
    setSettings((prev) => ({ ...prev, logo_url: publicUrl }));
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
                          <img
                            src={settings.logo_url}
                            alt="Logo"
                            className="h-20 w-20 object-contain rounded-lg border bg-muted p-2"
                          />
                          <button
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-lg border border-dashed flex items-center justify-center bg-muted/50">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                            disabled={uploadingLogo}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingLogo}>
                            <span>
                              {uploadingLogo ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              Upload Logo
                            </span>
                          </Button>
                        </label>
                      </div>
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

              <Button
                onClick={() => handleSaveSection(section.title, section.fields)}
                disabled={savingSection === section.title}
              >
                {savingSection === section.title ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
