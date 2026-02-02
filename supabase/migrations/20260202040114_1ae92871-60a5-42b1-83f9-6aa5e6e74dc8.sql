-- Add SELECT policy to user_roles table to prevent public exposure
-- Only admins can view user roles
CREATE POLICY "Only admins can view user roles" 
ON public.user_roles 
FOR SELECT 
USING (is_admin());