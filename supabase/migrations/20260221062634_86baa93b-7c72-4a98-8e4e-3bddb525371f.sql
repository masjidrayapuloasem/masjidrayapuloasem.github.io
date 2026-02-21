
-- Create social_media table
CREATE TABLE public.social_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Link',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social_media" ON public.social_media FOR SELECT USING (true);
CREATE POLICY "Admins can insert social_media" ON public.social_media FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update social_media" ON public.social_media FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete social_media" ON public.social_media FOR DELETE USING (is_admin());

CREATE TRIGGER update_social_media_updated_at
  BEFORE UPDATE ON public.social_media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Remove old social keys from site_settings
DELETE FROM public.site_settings WHERE key LIKE 'social_%';
