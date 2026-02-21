import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { data: settings } = useSiteSettings();

  const mosqueName = settings?.mosque_name || "Masjid Raya";
  const mosqueSubtitle = settings?.mosque_subtitle || "Pulo Asem";
  const logoUrl = settings?.logo_url;
  const description = settings?.footer_description || "Pusat kegiatan keislaman dan pembinaan umat di kawasan Pulo Asem, Jakarta Timur.";
  const address = settings?.footer_address || "Jl. Pulo Asem Raya No. 1, Kelurahan Jati, Kecamatan Pulo Gadung, Jakarta Timur 13220";
  const phone = settings?.footer_phone || "(021) 1234-5678";
  const email = settings?.footer_email || "info@masjidpuloasem.org";
  const hoursDaily = settings?.footer_hours_daily || "04:00 - 22:00 WIB";
  const hoursOffice = settings?.footer_hours_office || "08:00 - 16:00 WIB";

  const socialLinks = [
    { key: "social_facebook", icon: Facebook, label: "Facebook" },
    { key: "social_instagram", icon: Instagram, label: "Instagram" },
    { key: "social_youtube", icon: Youtube, label: "YouTube" },
  ].filter((s) => settings?.[s.key]);

  return (
    <footer id="kontak" className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-arabic text-xl">م</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-background">{mosqueName}</h3>
                <p className="text-sm text-secondary">{mosqueSubtitle}</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-background">Alamat</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-background/70 text-sm">{address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-background/70 text-sm">{phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-background/70 text-sm">{email}</p>
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
                  <p className="text-background/70 text-sm">{hoursDaily}</p>
                </div>
              </div>
              <div className="pl-8">
                <p className="text-background text-sm font-medium">Sekretariat</p>
                <p className="text-background/70 text-sm">{hoursOffice}</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-background">Ikuti Kami</h4>
            <div className="flex gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={settings?.[social.key] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-background" />
                  </a>
                ))
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-background/50" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-background/50" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-background/50" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center text-background/50 text-sm">
            © {new Date().getFullYear()} {mosqueName} {mosqueSubtitle}. Hak Cipta Dilindungi.
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
