import { Clock, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

interface ApiPrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const formatTime = (time: string): string => {
  // API returns time in HH:MM format, we just need to clean it
  return time.split(" ")[0];
};

const mapPrayerTimes = (timings: ApiPrayerTimes): PrayerTime[] => [
  { name: "Subuh", time: formatTime(timings.Fajr), arabic: "الفجر" },
  { name: "Dzuhur", time: formatTime(timings.Dhuhr), arabic: "الظهر" },
  { name: "Ashar", time: formatTime(timings.Asr), arabic: "العصر" },
  { name: "Maghrib", time: formatTime(timings.Maghrib), arabic: "المغرب" },
  { name: "Isya", time: formatTime(timings.Isha), arabic: "العشاء" },
];

// Jakarta Timur coordinates
const LOCATION = {
  latitude: -6.2253,
  longitude: 106.9004,
  city: "Jakarta Timur",
  country: "Indonesia",
};

export function PrayerSchedule() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      // Format date for display
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(today.toLocaleDateString("id-ID", options));

      // Using Aladhan API - free, no API key required
      // Method 20 = Kemenag Indonesia
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=20`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil jadwal sholat");
      }

      const data = await response.json();
      const timings = data.data.timings as ApiPrayerTimes;

      setPrayerTimes(mapPrayerTimes(timings));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      // Fallback to default times
      setPrayerTimes([
        { name: "Subuh", time: "04:30", arabic: "الفجر" },
        { name: "Dzuhur", time: "12:00", arabic: "الظهر" },
        { name: "Ashar", time: "15:15", arabic: "العصر" },
        { name: "Maghrib", time: "18:00", arabic: "المغرب" },
        { name: "Isya", time: "19:15", arabic: "العشاء" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();

    // Refresh prayer times at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      fetchPrayerTimes();
      // Then set up daily refresh
      const dailyInterval = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []);

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
          
          {/* Location and Date */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{LOCATION.city}, {LOCATION.country}</span>
            </div>
            {currentDate && (
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchPrayerTimes}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{loading ? "Memperbarui..." : "Perbarui Jadwal"}</span>
          </button>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {loading && prayerTimes.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`relative bg-card rounded-2xl p-6 shadow-card border border-border text-center ${
                  index === 0 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <Skeleton className="h-6 w-16 mx-auto mt-4 mb-1" />
                <Skeleton className="h-5 w-20 mx-auto mb-2" />
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-8 mx-auto mt-1" />
              </div>
            ))
          ) : (
            prayerTimes.map((prayer, index) => (
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

                <p className="text-3xl font-bold text-primary">{prayer.time}</p>

                <p className="text-sm text-muted-foreground mt-1">WIB</p>
              </div>
            ))
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-destructive text-sm mt-4">
            {error} - Menampilkan jadwal default
          </p>
        )}

        {/* Last Updated */}
        {lastUpdated && !error && (
          <p className="text-center text-muted-foreground text-xs mt-6">
            Terakhir diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
          </p>
        )}

        {/* Note */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          * Jadwal sholat berdasarkan perhitungan Kemenag RI.
          Waktu dapat berbeda ±2 menit.
        </p>
      </div>
    </section>
  );
}
