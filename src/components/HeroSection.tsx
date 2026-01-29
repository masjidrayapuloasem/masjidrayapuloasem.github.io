import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-mosque.jpg";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
}

export function HeroSection() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("id, title, subtitle, image_url")
          .eq("active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setBanner(data);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBanner();
  }, []);

  // Use banner from database if available, otherwise use defaults
  const backgroundImage = banner?.image_url || heroImage;
  const title = banner?.title || "Selamat Datang";
  const subtitle = banner?.subtitle || "Masjid Raya Pulo Asem hadir sebagai rumah ibadah dan pusat kegiatan keislaman bagi masyarakat Pulo Asem dan sekitarnya.";

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay islamic-pattern" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto stagger-children">
        <p className="text-secondary font-arabic text-2xl md:text-3xl mb-4">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
        
        <a
          href="#tentang"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 transition-colors animate-float"
        >
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}
