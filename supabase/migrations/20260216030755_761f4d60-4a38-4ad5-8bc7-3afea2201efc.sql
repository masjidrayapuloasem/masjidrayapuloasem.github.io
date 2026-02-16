
-- Fix security definer views by recreating with security_invoker = true
DROP VIEW IF EXISTS public.hero_images_public;
CREATE VIEW public.hero_images_public WITH (security_invoker = true) AS
  SELECT id, image_url, caption, sort_order, active, created_at, updated_at
  FROM public.hero_images
  WHERE active = true;
GRANT SELECT ON public.hero_images_public TO anon, authenticated;

DROP VIEW IF EXISTS public.organization_members_public;
CREATE VIEW public.organization_members_public WITH (security_invoker = true) AS
  SELECT id, name, position, photo_url, sort_order, active, created_at, updated_at
  FROM public.organization_members
  WHERE active = true;
GRANT SELECT ON public.organization_members_public TO anon, authenticated;

DROP VIEW IF EXISTS public.activities_public;
CREATE VIEW public.activities_public WITH (security_invoker = true) AS
  SELECT id, title, description, icon_name, schedule_text, highlighted, active, created_at, updated_at
  FROM public.activities
  WHERE active = true;
GRANT SELECT ON public.activities_public TO anon, authenticated;

-- Also need SELECT policies for anon/authenticated on base tables for the views to work
CREATE POLICY "Public can view active hero_images" ON public.hero_images FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Public can view active org_members" ON public.organization_members FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Public can view active activities" ON public.activities FOR SELECT TO anon, authenticated USING (active = true);
