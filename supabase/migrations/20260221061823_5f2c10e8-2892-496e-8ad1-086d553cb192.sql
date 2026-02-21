
-- Create site_settings table for logo, footer data, social media
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can view site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert site_settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site_settings"
  ON public.site_settings FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete site_settings"
  ON public.site_settings FOR DELETE
  USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default values
INSERT INTO public.site_settings (key, value) VALUES
  ('logo_url', ''),
  ('mosque_name', 'Masjid Raya'),
  ('mosque_subtitle', 'Pulo Asem'),
  ('footer_description', 'Pusat kegiatan keislaman dan pembinaan umat di kawasan Pulo Asem, Jakarta Timur.'),
  ('footer_address', 'Jl. Pulo Asem Raya No. 1, Kelurahan Jati, Kecamatan Pulo Gadung, Jakarta Timur 13220'),
  ('footer_phone', '(021) 1234-5678'),
  ('footer_email', 'info@masjidpuloasem.org'),
  ('footer_hours_daily', '04:00 - 22:00 WIB'),
  ('footer_hours_office', '08:00 - 16:00 WIB'),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_youtube', ''),
  ('social_tiktok', ''),
  ('social_twitter', '');
