import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer id="kontak" className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-arabic text-xl">م</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-background">Masjid Raya</h3>
                <p className="text-sm text-secondary">Pulo Asem</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Pusat kegiatan keislaman dan pembinaan umat di kawasan Pulo Asem,
              Jakarta Timur.
            </p>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-background">Alamat</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-background/70 text-sm">
                  Jl. Pulo Asem Raya No. 1, Kelurahan Jati, Kecamatan Pulo Gadung,
                  Jakarta Timur 13220
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-background/70 text-sm">(021) 1234-5678</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-background/70 text-sm">info@masjidpuloasem.org</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-background">Jam Operasional</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="text-background text-sm font-medium">Setiap Hari</p>
                  <p className="text-background/70 text-sm">04:00 - 22:00 WIB</p>
                </div>
              </div>
              <div className="pl-8">
                <p className="text-background text-sm font-medium">Sekretariat</p>
                <p className="text-background/70 text-sm">08:00 - 16:00 WIB</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-background">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5 text-background" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5 text-background" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="w-5 h-5 text-background" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center text-background/50 text-sm">
            © {new Date().getFullYear()} Masjid Raya Pulo Asem. Hak Cipta Dilindungi.
          </p>
          <Link 
            to="/admin/login" 
            className="text-background/30 hover:text-background/60 text-xs transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
