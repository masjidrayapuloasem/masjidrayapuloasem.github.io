import { useEffect, useState } from "react";
import { BookOpen, Users, Baby, HandHeart, CalendarDays, MapPin, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

// Default activities (fallback)
const defaultActivities = [
  {
    icon: BookOpen,
    title: "Kajian Rutin",
    description: "Kajian tafsir Al-Quran dan hadits setiap hari Ahad pagi dan Selasa malam",
    schedule: "Ahad 06:00 & Selasa 19:30",
  },
  {
    icon: Users,
    title: "Majelis Ta'lim",
    description: "Pengajian ibu-ibu dan bapak-bapak dengan tema seputar fiqih dan akhlak",
    schedule: "Rabu & Kamis 09:00",
  },
  {
    icon: Baby,
    title: "TPA/TPQ",
    description: "Taman Pendidikan Al-Quran untuk anak-anak usia dini hingga remaja",
    schedule: "Senin - Jumat 15:30",
  },
  {
    icon: HandHeart,
    title: "Bakti Sosial",
    description: "Program santunan yatim, dhuafa, dan bantuan untuk masyarakat sekitar",
    schedule: "Setiap Jumat",
  },
];

interface Schedule {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
}

export function ActivitiesSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("schedules")
          .select("*")
          .gte("event_date", today)
          .order("event_date", { ascending: true })
          .limit(6);

        if (!error && data) {
          setSchedules(data);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <section id="kegiatan" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <span className="text-secondary font-arabic text-xl">الأنشطة</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Kegiatan Masjid
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Berbagai program dan kegiatan keislaman yang rutin diselenggarakan
            untuk memakmurkan masjid dan membina umat.
          </p>
        </div>

        {/* Default Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {defaultActivities.map((activity) => (
            <div
              key={activity.title}
              className="group bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                <activity.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                {activity.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {activity.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground font-medium">{activity.schedule}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Schedules from Database */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : schedules.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
              Jadwal Kegiatan Mendatang
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-card rounded-xl p-5 border border-border hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {schedule.event_name}
                      </h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="w-4 h-4" />
                          <span>
                            {format(new Date(schedule.event_date), "EEEE, dd MMMM yyyy", { locale: localeId })}
                          </span>
                        </div>
                        {schedule.event_time && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{schedule.event_time.slice(0, 5)} WIB</span>
                          </div>
                        )}
                        {schedule.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{schedule.location}</span>
                          </div>
                        )}
                      </div>
                      {schedule.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {schedule.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
