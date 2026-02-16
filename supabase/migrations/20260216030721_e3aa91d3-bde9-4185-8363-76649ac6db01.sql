
-- =============================================
-- 1. Hero Images table (for homepage slider)
-- =============================================
CREATE TABLE public.hero_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view hero_images directly" ON public.hero_images FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert hero_images" ON public.hero_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update hero_images" ON public.hero_images FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete hero_images" ON public.hero_images FOR DELETE USING (is_admin());

CREATE VIEW public.hero_images_public AS
  SELECT id, image_url, caption, sort_order, active, created_at, updated_at
  FROM public.hero_images
  WHERE active = true;

GRANT SELECT ON public.hero_images_public TO anon, authenticated;

CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 2. Organization Members table (kepengurusan)
-- =============================================
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view org_members directly" ON public.organization_members FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert org_members" ON public.organization_members FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update org_members" ON public.organization_members FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete org_members" ON public.organization_members FOR DELETE USING (is_admin());

CREATE VIEW public.organization_members_public AS
  SELECT id, name, position, photo_url, sort_order, active, created_at, updated_at
  FROM public.organization_members
  WHERE active = true;

GRANT SELECT ON public.organization_members_public TO anon, authenticated;

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 3. Activities table (kegiatan masjid)
-- =============================================
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'BookOpen',
  schedule_text TEXT,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view activities directly" ON public.activities FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert activities" ON public.activities FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update activities" ON public.activities FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete activities" ON public.activities FOR DELETE USING (is_admin());

CREATE VIEW public.activities_public AS
  SELECT id, title, description, icon_name, schedule_text, highlighted, active, created_at, updated_at
  FROM public.activities
  WHERE active = true;

GRANT SELECT ON public.activities_public TO anon, authenticated;

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
