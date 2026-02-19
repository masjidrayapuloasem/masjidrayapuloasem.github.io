import { Building2, Wallet, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const bankAccounts = [
  {
    bank: "Bank Syariah Indonesia (BSI)",
    accountNumber: "7171 7171 71",
    accountName: "Masjid Raya Pulo Asem",
  },
  {
    bank: "Bank Mandiri",
    accountNumber: "1234 5678 9012",
    accountName: "Masjid Raya Pulo Asem",
  },
];

export function DonationSection() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin!",
      description: `Nomor rekening ${label} telah disalin ke clipboard.`,
    });
  };

  return (
    <section id="donasi" className="py-20 lg:py-32 bg-primary islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Donasi & Infaq
          </h2>
          <div className="w-32 h-px bg-primary-foreground/30 mx-auto mb-6" />
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Mari bersama-sama memakmurkan masjid dan membantu program-program sosial
            melalui donasi dan infaq terbaik Anda.
          </p>
        </div>

        {/* Donation Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {bankAccounts.map((account) => (
            <div
              key={account.bank}
              className="bg-card rounded-2xl p-6 shadow-elevated"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{account.bank}</h3>
              </div>
              
              <div className="bg-muted rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
                    <p className="text-xl font-bold text-foreground font-mono">
                      {account.accountNumber}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(account.accountNumber.replace(/\s/g, ""), account.bank)}
                    className="hover:bg-accent"
                  >
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="w-4 h-4" />
                <span>a.n. {account.accountName}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-primary-foreground/90 font-arabic text-lg mb-2">
            جَزَاكُمُ اللَّهُ خَيْرًا
          </p>
          <p className="text-primary-foreground/70 text-sm">
            Semoga Allah SWT membalas kebaikan Anda dengan berlipat ganda.
          </p>
        </div>
      </div>
    </section>
  );
}
