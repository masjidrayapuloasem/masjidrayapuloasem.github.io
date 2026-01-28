import { BookOpen, Users, Baby, HandHeart } from "lucide-react";

const activities = [
  {
    icon: BookOpen,
    title: "Kajian Rutin",
    description: "Kajian tafsir Al-Quran dan hadits setiap hari Ahad pagi dan Selasa malam",
    schedule: "Ahad 06:00 & Selasa 19:30",
  },
  {
    icon: Users,
    title: "Majelis Ta'lim",
    description: "Pengajian ibu-ibu dan bapak-bapak dengan tema seputar fiqih dan akhlak",
    schedule: "Rabu & Kamis 09:00",
  },
  {
    icon: Baby,
    title: "TPA/TPQ",
    description: "Taman Pendidikan Al-Quran untuk anak-anak usia dini hingga remaja",
    schedule: "Senin - Jumat 15:30",
  },
  {
    icon: HandHeart,
    title: "Bakti Sosial",
    description: "Program santunan yatim, dhuafa, dan bantuan untuk masyarakat sekitar",
    schedule: "Setiap Jumat",
  },
];

export function ActivitiesSection() {
  return (
    <section id="kegiatan" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <span className="text-secondary font-arabic text-xl">الأنشطة</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Kegiatan Masjid
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Berbagai program dan kegiatan keislaman yang rutin diselenggarakan
            untuk memakmurkan masjid dan membina umat.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="group bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                <activity.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                {activity.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {activity.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground font-medium">{activity.schedule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
