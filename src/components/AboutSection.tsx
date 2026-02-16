import { useEffect, useState } from "react";
import { Home, Target, Heart, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
}

export function AboutSection() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("organization_members_public")
          .select("id, name, position, photo_url, sort_order")
          .order("sort_order", { ascending: true });

        if (!error && data) setMembers(data);
      } catch {
        // Silently handle
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <section id="tentang" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <span className="text-secondary font-arabic text-xl">عن المسجد</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
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
                <p className="text-muted-foreground leading-relaxed">
                  Masjid Raya Pulo Asem berdiri sebagai pusat kegiatan keislaman masyarakat
                  di kawasan Pulo Asem, Jakarta Timur. Didirikan dengan visi untuk membina
                  umat yang berilmu, beriman, dan berkontribusi bagi masyarakat sekitar.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed pl-[4.5rem]">
              Selama bertahun-tahun, Masjid Raya Pulo Asem telah menjadi rumah bagi berbagai
              kegiatan dakwah, pendidikan, dan pengabdian kepada masyarakat. Masjid ini terus
              berkembang menjadi tempat yang nyaman untuk beribadah dan menuntut ilmu.
            </p>
          </div>

          {/* Decorative Card */}
          <div className="relative">
            <div className="bg-primary rounded-2xl p-8 lg:p-12 text-primary-foreground islamic-pattern">
              <p className="font-arabic text-2xl lg:text-3xl text-center mb-4 text-secondary">
                إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ
              </p>
              <p className="text-center text-primary-foreground/90 italic">
                "Hanyalah yang memakmurkan masjid-masjid Allah..."
              </p>
              <p className="text-center text-sm text-primary-foreground/70 mt-2">
                — QS. At-Taubah: 18
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
            <p className="text-muted-foreground leading-relaxed">
              Menjadi masjid yang memakmurkan umat, menjadi pusat pembinaan keislaman,
              dan berkontribusi dalam membangun peradaban Islam yang rahmatan lil'alamin.
            </p>
          </div>

          {/* Misi */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Misi</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Menyelenggarakan ibadah sholat lima waktu dan sholat Jumat dengan khusyuk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Mengadakan kajian rutin dan pendidikan agama Islam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Memberdayakan masyarakat melalui program sosial dan zakat</span>
              </li>
            </ul>
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
