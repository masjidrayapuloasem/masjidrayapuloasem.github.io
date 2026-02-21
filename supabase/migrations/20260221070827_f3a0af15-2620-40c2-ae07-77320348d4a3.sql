
-- Fix security definer views by recreating with security_invoker = on
DROP VIEW IF EXISTS public.donation_qris_public;
DROP VIEW IF EXISTS public.donation_banks_public;

CREATE VIEW public.donation_qris_public WITH (security_invoker = on) AS
  SELECT id, image_url, caption, active, created_at, updated_at
  FROM public.donation_qris
  WHERE active = true;

CREATE VIEW public.donation_banks_public WITH (security_invoker = on) AS
  SELECT id, bank_name, account_number, account_name, active, sort_order, created_at, updated_at
  FROM public.donation_banks
  WHERE active = true
  ORDER BY sort_order;
