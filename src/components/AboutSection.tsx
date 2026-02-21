import { useEffect, useState } from "react";
import { Home, Target, Heart, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
}

interface SiteContent {
  key: string;
  content: string;
}

export function AboutSection() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [membersRes, contentRes] = await Promise.all([
        supabase
          .from("organization_members_public")
          .select("id, name, position, photo_url, sort_order")
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_content")
          .select("key, content")
          .in("key", ["sejarah", "sejarah_detail", "visi", "misi", "ayat_arab", "ayat_terjemah", "ayat_sumber"]),
      ]);

      if (!membersRes.error && membersRes.data) setMembers(membersRes.data);
      if (!contentRes.error && contentRes.data) {
        const map: Record<string, string> = {};
        contentRes.data.forEach((item: SiteContent) => {
          map[item.key] = item.content;
        });
        setContent(map);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section id="tentang" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Tentang Masjid
          </h2>
          <div className="section-divider w-32 mx-auto" />
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <Home className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Sejarah Singkat</h3>
                <div
                  className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.sejarah || "Memuat...") }}
                />
              </div>
            </div>

            <div
              className="text-muted-foreground leading-relaxed pl-[4.5rem] prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.sejarah_detail || "") }}
            />
          </div>

          {/* Decorative Card */}
          <div className="relative">
            <div className="bg-primary rounded-2xl p-8 lg:p-12 text-primary-foreground islamic-pattern">
              <p className="font-arabic text-2xl lg:text-3xl text-center mb-4 text-secondary">
                {content.ayat_arab || "إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ"}
              </p>
              <p className="text-center text-primary-foreground/90 italic">
                "{content.ayat_terjemah || "Hanyalah yang memakmurkan masjid-masjid Allah..."}"
              </p>
              <p className="text-center text-sm text-primary-foreground/70 mt-2">
                — {content.ayat_sumber || "QS. At-Taubah: 18"}
              </p>
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Visi */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Visi</h3>
            </div>
            {content.visi ? (
              <div
                className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.visi) }}
              />
            ) : (
              <p className="text-muted-foreground">Memuat...</p>
            )}
          </div>

          {/* Misi */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Misi</h3>
            </div>
            {content.misi ? (
              <div
                className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&_ul]:space-y-3 [&_li]:flex [&_li]:items-start [&_li]:gap-2"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.misi) }}
              />
            ) : (
              <p className="text-muted-foreground">Memuat...</p>
            )}
          </div>
        </div>

        {/* Struktur Kepengurusan */}
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Struktur Kepengurusan
              </h3>
            </div>
            <div className="section-divider w-24 mx-auto" />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Data kepengurusan belum tersedia.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="group text-center bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-accent flex items-center justify-center">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{member.name}</h4>
                  <p className="text-muted-foreground text-xs mt-1">{member.position}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
