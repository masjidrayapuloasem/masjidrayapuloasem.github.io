import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ActivitiesPage from "./pages/ActivitiesPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSchedules from "./pages/admin/AdminSchedules";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminHeroImages from "./pages/admin/AdminHeroImages";
import AdminOrganization from "./pages/admin/AdminOrganization";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminSiteContent from "./pages/admin/AdminSiteContent";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kegiatan" element={<ActivitiesPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/schedules" element={<AdminSchedules />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/hero-images" element={<AdminHeroImages />} />
            <Route path="/admin/organization" element={<AdminOrganization />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/site-content" element={<AdminSiteContent />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
