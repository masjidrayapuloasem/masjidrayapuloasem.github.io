import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PrayerSchedule } from "@/components/PrayerSchedule";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { ActivitiesSection } from "@/components/ActivitiesSection";
import { DonationSection } from "@/components/DonationSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <AnnouncementsSection />
      <PrayerSchedule />
      <ArticlesSection />
      <ActivitiesSection />
      <DonationSection />
      <Footer />
    </div>
  );
};

export default Index;
