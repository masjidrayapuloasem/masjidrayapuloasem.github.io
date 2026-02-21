import { Construction } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function MaintenancePage() {
  const { data: settings } = useSiteSettings();
  const mosqueName = settings?.mosque_name || "Masjid Raya";
  const mosqueSubtitle = settings?.mosque_subtitle || "Pulo Asem";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto">
          <Construction className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sedang Dalam Perbaikan</h1>
          <p className="text-muted-foreground leading-relaxed">
            Website <strong>{mosqueName} {mosqueSubtitle}</strong> sedang dalam proses pemeliharaan. 
            Silakan kunjungi kembali dalam beberapa saat.
          </p>
        </div>
        <p className="font-arabic text-xl text-primary">
          جَزَاكُمُ اللَّهُ خَيْرًا
        </p>
        <p className="text-sm text-muted-foreground">
          Terima kasih atas pengertian Anda.
        </p>
      </div>
    </div>
  );
}
