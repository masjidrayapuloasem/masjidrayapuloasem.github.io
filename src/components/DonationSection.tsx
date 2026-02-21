import { useEffect, useState } from "react";
import { Building2, Wallet, Copy, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QrisItem {
  id: string;
  image_url: string;
  caption: string | null;
}

interface BankItem {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export function DonationSection() {
  const [qrisList, setQrisList] = useState<QrisItem[]>([]);
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [qrisRes, banksRes] = await Promise.all([
        supabase.from("donation_qris_public").select("*"),
        supabase.from("donation_banks_public").select("*").order("sort_order"),
      ]);
      if (qrisRes.data) setQrisList(qrisRes.data as QrisItem[]);
      if (banksRes.data) setBanks(banksRes.data as BankItem[]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin!",
      description: `Nomor rekening ${label} telah disalin ke clipboard.`,
    });
  };

  if (isLoading) {
    return (
      <section id="donasi" className="py-20 lg:py-32 bg-primary islamic-pattern">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
        </div>
      </section>
    );
  }

  // Don't render section if nothing active
  if (qrisList.length === 0 && banks.length === 0) return null;

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

        <div className="max-w-4xl mx-auto space-y-10">
          {/* QRIS */}
          {qrisList.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <QrCode className="w-6 h-6" />
                <h3 className="text-xl font-bold">Scan QRIS</h3>
              </div>
              <div className={`flex flex-wrap justify-center gap-4`}>
                {qrisList.map((item) => (
                  <div key={item.id} className="bg-card rounded-2xl p-4 shadow-elevated max-w-xs w-full">
                    <img
                      src={item.image_url}
                      alt={item.caption || "QRIS"}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    {item.caption && (
                      <p className="text-center text-sm text-muted-foreground mt-2">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Accounts */}
          {banks.length > 0 && (
            <div>
              <div className="flex items-center justify-center gap-2 text-primary-foreground mb-6">
                <Building2 className="w-6 h-6" />
                <h3 className="text-xl font-bold">Transfer Rekening</h3>
              </div>
              <div className={`flex flex-wrap justify-center gap-6 ${banks.length === 1 ? '' : 'max-w-4xl'}`}>
                {banks.map((account) => (
                  <div key={account.id} className="bg-card rounded-2xl p-6 shadow-elevated w-full md:w-[calc(50%-0.75rem)] max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{account.bank_name}</h3>
                    </div>
                    <div className="bg-muted rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
                          <p className="text-xl font-bold text-foreground font-mono">
                            {account.account_number}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(account.account_number.replace(/\s/g, ""), account.bank_name)}
                          className="hover:bg-accent"
                        >
                          <Copy className="w-5 h-5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="w-4 h-4" />
                      <span>a.n. {account.account_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
