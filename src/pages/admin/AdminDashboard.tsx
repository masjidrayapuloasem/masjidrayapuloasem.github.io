import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Megaphone, CalendarDays, Image, Loader2 } from "lucide-react";

interface DashboardStats {
  articles: number;
  announcements: number;
  schedules: number;
  banners: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    announcements: 0,
    schedules: 0,
    banners: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesRes, announcementsRes, schedulesRes, bannersRes] = await Promise.all([
          supabase.from("articles").select("id", { count: "exact", head: true }),
          supabase.from("announcements").select("id", { count: "exact", head: true }),
          supabase.from("schedules").select("id", { count: "exact", head: true }),
          supabase.from("banners").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          articles: articlesRes.count || 0,
          announcements: announcementsRes.count || 0,
          schedules: schedulesRes.count || 0,
          banners: bannersRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Artikel", value: stats.articles, icon: FileText, color: "text-blue-500" },
    { label: "Pengumuman", value: stats.announcements, icon: Megaphone, color: "text-orange-500" },
    { label: "Jadwal Kegiatan", value: stats.schedules, icon: CalendarDays, color: "text-green-500" },
    { label: "Banner", value: stats.banners, icon: Image, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di panel admin</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Panduan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">📝 Artikel</h3>
                <p className="text-sm text-muted-foreground">
                  Tulis dan kelola artikel kajian, berita, atau informasi seputar masjid.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">📢 Pengumuman</h3>
                <p className="text-sm text-muted-foreground">
                  Buat pengumuman penting yang akan ditampilkan di website.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">📅 Jadwal</h3>
                <p className="text-sm text-muted-foreground">
                  Kelola jadwal kegiatan masjid seperti kajian, pengajian, dan acara lainnya.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">🖼️ Banner</h3>
                <p className="text-sm text-muted-foreground">
                  Ubah banner hero section di halaman utama website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
