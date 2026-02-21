import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Megaphone, CalendarDays, Image, LogOut, Menu, X, ImagePlus, Users, Activity, ScrollText, Settings, HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FileText, label: "Artikel", path: "/admin/articles" },
  { icon: Megaphone, label: "Pengumuman", path: "/admin/announcements" },
  { icon: CalendarDays, label: "Jadwal", path: "/admin/schedules" },
  { icon: Image, label: "Banner", path: "/admin/banners" },
  { icon: ImagePlus, label: "Gambar Hero", path: "/admin/hero-images" },
  { icon: Users, label: "Kepengurusan", path: "/admin/organization" },
  { icon: Activity, label: "Kegiatan", path: "/admin/activities" },
  { icon: HandCoins, label: "Donasi & Infaq", path: "/admin/donation" },
  { icon: ScrollText, label: "Profil Masjid", path: "/admin/site-content" },
  { icon: Settings, label: "Pengaturan Situs", path: "/admin/settings" },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Masjid Raya Pulo Asem</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
