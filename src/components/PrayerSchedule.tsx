import { Clock, MapPin } from "lucide-react";

const prayerTimes = [
  { name: "Subuh", time: "04:30", arabic: "الفجر" },
  { name: "Dzuhur", time: "12:00", arabic: "الظهر" },
  { name: "Ashar", time: "15:15", arabic: "العصر" },
  { name: "Maghrib", time: "18:00", arabic: "المغرب" },
  { name: "Isya", time: "19:15", arabic: "العشاء" },
];

export function PrayerSchedule() {
  return (
    <section id="jadwal" className="py-20 lg:py-32 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <span className="text-secondary font-arabic text-xl">أوقات الصلاة</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Jadwal Sholat
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Jakarta Timur, Indonesia</span>
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {prayerTimes.map((prayer, index) => (
            <div
              key={prayer.name}
              className={`relative bg-card rounded-2xl p-6 shadow-card border border-border text-center group hover:shadow-elevated transition-all duration-300 ${
                index === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              
              <p className="font-arabic text-lg text-secondary mt-4 mb-1">
                {prayer.arabic}
              </p>
              
              <h3 className="text-lg font-bold text-foreground mb-2">
                {prayer.name}
              </h3>
              
              <p className="text-3xl font-bold text-primary">
                {prayer.time}
              </p>
              
              <p className="text-sm text-muted-foreground mt-1">WIB</p>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          * Jadwal sholat dapat berubah sesuai dengan waktu matahari.
          Silahkan konfirmasi dengan pengurus masjid.
        </p>
      </div>
    </section>
  );
}
