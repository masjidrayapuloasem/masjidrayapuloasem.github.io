import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CalendarDays, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { stripHtmlTags } from "@/lib/utils";
import { id as localeId } from "date-fns/locale";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  display_date: string;
}

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Use public view to prevent admin UUID exposure
        const { data, error } = await supabase
          .from("announcements_public")
          .select("id, title, description, display_date")
          .order("display_date", { ascending: false })
          .limit(4);

        if (!error && data) {
          setAnnouncements(data);
        }
      } catch {
        // Silently handle errors to avoid information leakage
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Don't render section if no announcements
  if (!isLoading && announcements.length === 0) {
    return null;
  }

  return (
    <section id="pengumuman" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Pengumuman
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Informasi dan pengumuman terbaru dari Masjid Raya Pulo Asem
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">
                        {announcement.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          {format(new Date(announcement.display_date), "dd MMMM yyyy", { locale: localeId })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {announcement.description && (
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {stripHtmlTags(announcement.description)}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
