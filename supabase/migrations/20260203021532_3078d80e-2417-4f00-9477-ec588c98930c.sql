-- Create public views that exclude created_by for non-admin access
-- This prevents admin UUID exposure in public queries

-- View for public articles (excludes created_by)
CREATE VIEW public.articles_public
WITH (security_invoker = on) AS
SELECT id, title, slug, content, image_url, status, created_at, updated_at
FROM public.articles
WHERE status = 'published'::article_status;

-- View for public announcements (excludes created_by)
CREATE VIEW public.announcements_public
WITH (security_invoker = on) AS
SELECT id, title, description, display_date, active, created_at, updated_at
FROM public.announcements
WHERE active = true;

-- View for public schedules (excludes created_by)
CREATE VIEW public.schedules_public
WITH (security_invoker = on) AS
SELECT id, event_name, event_date, event_time, location, description, created_at, updated_at
FROM public.schedules;

-- View for public banners (excludes created_by)
CREATE VIEW public.banners_public
WITH (security_invoker = on) AS
SELECT id, title, subtitle, image_url, active, created_at, updated_at
FROM public.banners
WHERE active = true;

-- Grant SELECT on views to anon and authenticated roles
GRANT SELECT ON public.articles_public TO anon, authenticated;
GRANT SELECT ON public.announcements_public TO anon, authenticated;
GRANT SELECT ON public.schedules_public TO anon, authenticated;
GRANT SELECT ON public.banners_public TO anon, authenticated;