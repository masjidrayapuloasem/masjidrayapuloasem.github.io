import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { href: "#beranda", label: "Beranda", isRoute: false },
  { href: "#tentang", label: "Tentang", isRoute: false },
  { href: "#jadwal", label: "Jadwal Sholat", isRoute: false },
  { href: "#kegiatan", label: "Kegiatan", isRoute: false },
  { href: "/galeri", label: "Galeri", isRoute: true },
  { href: "#donasi", label: "Donasi", isRoute: false },
  { href: "#kontak", label: "Kontak", isRoute: false },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldShowSolidBg = isScrolled || !isHomePage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowSolidBg ? "glass shadow-soft py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-arabic text-xl">م</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-tight transition-colors ${shouldShowSolidBg ? "text-foreground" : "text-primary-foreground"}`}>
              Masjid Raya
            </span>
            <span className={`text-sm font-medium leading-tight transition-colors ${shouldShowSolidBg ? "text-primary" : "text-secondary"}`}>
              Pulo Asem
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  shouldShowSolidBg ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={isHomePage ? link.href : `/${link.href}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  shouldShowSolidBg ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`h-6 w-6 ${shouldShowSolidBg ? "text-foreground" : "text-primary-foreground"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${shouldShowSolidBg ? "text-foreground" : "text-primary-foreground"}`} />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden glass mt-2 mx-4 rounded-lg p-4 shadow-elevated">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="block py-3 px-4 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={isHomePage ? link.href : `/${link.href}`}
                className="block py-3 px-4 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          ))}
        </nav>
      )}
    </header>
  );
}
