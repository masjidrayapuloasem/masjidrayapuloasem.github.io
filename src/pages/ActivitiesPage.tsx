import { useEffect, useState } from "react";
import { BookOpen, Users, Baby, HandHeart, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { stripHtmlTags } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import MaintenancePage from "@/pages/MaintenancePage";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Users,
  Baby,
  HandHeart,
};

interface Activity {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  schedule_text: string | null;
  highlighted: boolean;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from("activities_public")
          .select("id, title, description, icon_name, schedule_text, highlighted")
          .order("highlighted", { ascending: false });

        if (!error && data) setActivities(data);
      } catch {
        // Silently handle
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (!settingsLoading && siteSettings?.maintenance_mode === "true") {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-secondary font-arabic text-xl">الأنشطة</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
              Semua Kegiatan Masjid
            </h1>
            <div className="section-divider w-32 mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Daftar lengkap program dan kegiatan keislaman di Masjid Raya Pulo Asem.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Belum ada kegiatan yang tersedia.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const IconComponent = iconMap[activity.icon_name || "BookOpen"] || BookOpen;
                return (
                  <div
                    key={activity.id}
                    className="group bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary transition-colors">
                        <IconComponent className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      {activity.highlighted && (
                        <span className="text-xs font-medium bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full">
                          Highlight
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {activity.title}
                    </h3>

                    {activity.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {stripHtmlTags(activity.description)}
                      </p>
                    )}

                    {activity.schedule_text && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">{activity.schedule_text}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
