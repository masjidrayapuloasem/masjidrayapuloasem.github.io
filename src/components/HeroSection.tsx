import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-mosque.jpg";
import { supabase } from "@/integrations/supabase/client";

interface HeroImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
}

export function HeroSection() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, imagesRes] = await Promise.all([
          supabase
            .from("banners_public")
            .select("id, title, subtitle")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("hero_images_public")
            .select("id, image_url, caption, sort_order")
            .order("sort_order", { ascending: true }),
        ]);

        if (!bannerRes.error && bannerRes.data) setBanner(bannerRes.data);
        if (!imagesRes.error && imagesRes.data && imagesRes.data.length > 0) {
          setHeroImages(imagesRes.data);
        }
      } catch {
        // Silently handle
      }
    };

    fetchData();
  }, []);

  const images = heroImages.length > 0 ? heroImages.map((h) => h.image_url) : [heroImage];
  const hasMultipleSlides = images.length > 1;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance slides
  useEffect(() => {
    if (!hasMultipleSlides) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [hasMultipleSlides, nextSlide]);

  const title = banner?.title || "Selamat Datang";
  const subtitle = banner?.subtitle || "Masjid Raya Pulo Asem hadir sebagai rumah ibadah dan pusat kegiatan keislaman bagi masyarakat Pulo Asem dan sekitarnya.";

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Images with Slide Transition */}
      {images.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentSlide ? 1 : 0,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay islamic-pattern" />

      {/* Slide Controls */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-secondary w-8"
                    : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

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
