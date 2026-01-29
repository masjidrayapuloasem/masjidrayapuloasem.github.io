import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    title: "Sholat Jumat Berjamaah",
    category: "Ibadah",
  },
  {
    src: "https://images.unsplash.com/photo-1609158349175-c3e024f857e7?w=800&q=80",
    title: "Kajian Rutin Mingguan",
    category: "Kajian",
  },
  {
    src: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80",
    title: "Pembelajaran Al-Quran TPA",
    category: "Pendidikan",
  },
  {
    src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
    title: "Buka Puasa Bersama",
    category: "Ramadhan",
  },
  {
    src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
    title: "Sholat Tarawih",
    category: "Ramadhan",
  },
  {
    src: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80",
    title: "Arsitektur Masjid",
    category: "Fasilitas",
  },
  {
    src: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",
    title: "Kegiatan Sosial",
    category: "Sosial",
  },
  {
    src: "https://images.unsplash.com/photo-1597535973747-951442d5dbc7?w=800&q=80",
    title: "Anak-anak Belajar Mengaji",
    category: "Pendidikan",
  },
  {
    src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80",
    title: "Perayaan Idul Fitri",
    category: "Hari Besar",
  },
  {
    src: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=800&q=80",
    title: "Sholat Ied",
    category: "Hari Besar",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    title: "Kajian Ustadz",
    category: "Kajian",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    title: "Bakti Sosial",
    category: "Sosial",
  },
];

const categories = ["Semua", "Ibadah", "Kajian", "Pendidikan", "Ramadhan", "Sosial", "Hari Besar", "Fasilitas"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = selectedCategory === "Semua"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            📸 Galeri Foto
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Dokumentasi Kegiatan Masjid
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kumpulan foto kegiatan ibadah, kajian, pendidikan, dan kegiatan sosial 
            di Masjid Raya Pulo Asem
          </p>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <Card
                key={index}
                className="group overflow-hidden cursor-pointer hover:shadow-elevated transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
                      {image.category}
                    </Badge>
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Tidak ada foto untuk kategori ini
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <GalleryLightbox
        images={filteredImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentImageIndex}
      />

      <Footer />
    </div>
  );
}
