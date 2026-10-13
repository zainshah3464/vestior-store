-- ================================================================
-- VESTIOR — Normalize legacy role values
-- Date: 2026-10-16
--
-- Older rows in `profiles` have role = 'user' instead of 'customer'.
-- This migration normalizes them.
-- ================================================================

-- Show before
-- SELECT id, email, role FROM public.profiles WHERE role NOT IN ('customer', 'admin');

-- Normalize
UPDATE public.profiles
SET role = 'customer'
WHERE role NOT IN ('customer', 'admin')
   OR role IS NULL;

-- Add CHECK constraint to prevent future invalid roles
-- (safe to re-run: drops and re-adds)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'admin'));

-- Verify
-- SELECT role, count(*) FROM public.profiles GROUP BY role;