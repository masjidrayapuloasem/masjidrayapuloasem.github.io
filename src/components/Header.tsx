import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { 
    href: "#profil", 
    label: "Profil",
    submenu: [
      { href: "#visi-misi", label: "Visi & Misi" },
      { href: "#kepengurusan", label: "Kepengurusan" },
    ]
  },
  { href: "#jadwal", label: "Jadwal Sholat" },
  { href: "#kegiatan", label: "Kegiatan" },
  { href: "#donasi", label: "Donasi" },
  { href: "#kontak", label: "Kontak" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (label: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === label ? null : label);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-soft py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-arabic text-xl">م</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-tight transition-colors ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}>
              Masjid Raya
            </span>
            <span className={`text-sm font-medium leading-tight transition-colors ${isScrolled ? "text-primary" : "text-secondary"}`}>
              Pulo Asem
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.submenu ? (
              <DropdownMenu key={link.href}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                      isScrolled ? "text-foreground" : "text-primary-foreground"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {link.submenu.map((subItem) => (
                    <DropdownMenuItem key={subItem.href} asChild>
                      <a
                        href={subItem.href}
                        className="w-full cursor-pointer"
                      >
                        {subItem.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-primary-foreground"
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
            <X className={`h-6 w-6 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden glass mt-2 mx-4 rounded-lg p-4 shadow-elevated">
          {navLinks.map((link) => (
            link.submenu ? (
              <div key={link.href}>
                <button
                  onClick={() => toggleMobileSubmenu(link.label)}
                  className="w-full flex items-center justify-between py-3 px-4 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  {link.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMobileSubmenu === link.label ? "rotate-180" : ""}`} />
                </button>
                {openMobileSubmenu === link.label && (
                  <div className="ml-4 border-l-2 border-primary/20">
                    {link.submenu.map((subItem) => (
                      <a
                        key={subItem.href}
                        href={subItem.href}
                        className="block py-2 px-4 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
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
