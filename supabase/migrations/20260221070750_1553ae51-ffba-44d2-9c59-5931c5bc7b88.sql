
-- Table for QRIS donation
CREATE TABLE public.donation_qris (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.donation_qris ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active QRIS" ON public.donation_qris FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all QRIS" ON public.donation_qris FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert QRIS" ON public.donation_qris FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update QRIS" ON public.donation_qris FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete QRIS" ON public.donation_qris FOR DELETE USING (is_admin());

CREATE TRIGGER update_donation_qris_updated_at BEFORE UPDATE ON public.donation_qris
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for bank accounts
CREATE TABLE public.donation_banks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.donation_banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banks" ON public.donation_banks FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all banks" ON public.donation_banks FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert banks" ON public.donation_banks FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update banks" ON public.donation_banks FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete banks" ON public.donation_banks FOR DELETE USING (is_admin());

CREATE TRIGGER update_donation_banks_updated_at BEFORE UPDATE ON public.donation_banks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public views
CREATE VIEW public.donation_qris_public AS
  SELECT id, image_url, caption, active, created_at, updated_at
  FROM public.donation_qris
  WHERE active = true;

CREATE VIEW public.donation_banks_public AS
  SELECT id, bank_name, account_number, account_name, active, sort_order, created_at, updated_at
  FROM public.donation_banks
  WHERE active = true
  ORDER BY sort_order;

-- Seed existing bank data
INSERT INTO public.donation_banks (bank_name, account_number, account_name, sort_order) VALUES
  ('Bank Syariah Indonesia (BSI)', '7171717171', 'Masjid Raya Pulo Asem', 1),
  ('Bank Mandiri', '1234567890012', 'Masjid Raya Pulo Asem', 2);
