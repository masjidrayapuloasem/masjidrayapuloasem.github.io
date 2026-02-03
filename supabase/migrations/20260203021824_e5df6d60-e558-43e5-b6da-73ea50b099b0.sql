-- Drop existing public SELECT policies that expose created_by
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Anyone can view schedules" ON public.schedules;
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;

-- Create new restrictive SELECT policies - admins only for base tables
-- Public access will go through the views which exclude created_by

CREATE POLICY "Only admins can view articles directly" 
ON public.articles 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can view announcements directly" 
ON public.announcements 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can view schedules directly" 
ON public.schedules 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can view banners directly" 
ON public.banners 
FOR SELECT 
USING (is_admin());