
-- 1. Drop the overly permissive public SELECT policy on donation_banks
DROP POLICY IF EXISTS "Anyone can view active banks" ON public.donation_banks;

-- 2. Recreate donation_banks_public view WITHOUT security_invoker
-- so it can bypass RLS and serve as the only public access point
DROP VIEW IF EXISTS public.donation_banks_public;
CREATE VIEW public.donation_banks_public AS
  SELECT id, bank_name, account_name, account_number, active, sort_order, created_at, updated_at
  FROM public.donation_banks
  WHERE active = true;

-- Grant access to the view for anonymous and authenticated users
GRANT SELECT ON public.donation_banks_public TO anon, authenticated;
