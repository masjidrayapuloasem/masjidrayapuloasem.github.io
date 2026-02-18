import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  title: string;
  content: string;
}

const CONTENT_KEYS = [
  { key: "sejarah", label: "Sejarah Singkat", useRichText: false },
  { key: "sejarah_detail", label: "Detail Sejarah", useRichText: false },
  { key: "visi", label: "Visi", useRichText: false },
  { key: "misi", label: "Misi", useRichText: true },
  { key: "ayat_arab", label: "Ayat Al-Quran (Arab)", useRichText: false },
  { key: "ayat_terjemah", label: "Terjemah Ayat", useRichText: false },
  { key: "ayat_sumber", label: "Sumber Ayat (mis: QS. At-Taubah: 18)", useRichText: false },
];

export default function AdminSiteContent() {
  const [contents, setContents] = useState<Record<string, ContentItem>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .in("key", CONTENT_KEYS.map((c) => c.key));

    if (!error && data) {
      const map: Record<string, ContentItem> = {};
      data.forEach((item) => {
        map[item.key] = item;
      });
      setContents(map);
    }
    setIsLoading(false);
  };

  const handleSave = async (key: string) => {
    const item = contents[key];
    if (!item) return;

    setSavingKey(key);
    const { error } = await supabase
      .from("site_content")
      .update({ content: item.content })
      .eq("key", key);

    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil disimpan" });
    }
    setSavingKey(null);
  };

  const updateContent = (key: string, content: string) => {
    setContents((prev) => ({
      ...prev,
      [key]: { ...prev[key], content },
    }));
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
        <h1 className="text-2xl font-bold">Konten Profil Masjid</h1>
        <p className="text-muted-foreground">Edit konten Sejarah, Visi, dan Misi yang tampil di halaman utama.</p>

        <div className="space-y-8">
          {CONTENT_KEYS.map(({ key, label, useRichText }) => {
            const item = contents[key];
            if (!item) return null;

            return (
              <div key={key} className="bg-card rounded-lg border p-6 space-y-4">
                <Label className="text-lg font-semibold">{label}</Label>

                {useRichText ? (
                  <RichTextEditor
                    value={item.content}
                    onChange={(val) => updateContent(key, val)}
                  />
                ) : (
                  <Textarea
                    value={item.content}
                    onChange={(e) => updateContent(key, e.target.value)}
                    rows={4}
                  />
                )}

                <Button
                  onClick={() => handleSave(key)}
                  disabled={savingKey === key}
                >
                  {savingKey === key ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Simpan
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
