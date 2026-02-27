import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PrayerSchedule } from "@/components/PrayerSchedule";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { ActivitiesSection } from "@/components/ActivitiesSection";
import { DonationSection } from "@/components/DonationSection";
import { Footer } from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import MaintenancePage from "@/pages/MaintenancePage";

const Index = () => {
  const { data: settings, isLoading } = useSiteSettings();

  const isVisible = (key: string) => settings?.[key] !== "false";

  if (!isLoading && settings?.maintenance_mode === "true") {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {isVisible("section_hero_visible") && <HeroSection />}
        {(isVisible("section_sejarah_visible") || isVisible("section_visimisi_visible") || isVisible("section_kepengurusan_visible")) && <AboutSection />}
        {isVisible("section_announcements_visible") && <AnnouncementsSection />}
        {isVisible("section_schedule_visible") && <PrayerSchedule />}
        {isVisible("section_articles_visible") && <ArticlesSection />}
        {isVisible("section_activities_visible") && <ActivitiesSection />}
        {isVisible("section_donation_visible") && <DonationSection />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
