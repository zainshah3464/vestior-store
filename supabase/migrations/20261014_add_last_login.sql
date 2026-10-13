-- ================================================================
-- VESTIOR — Login Tracking & Welcome Back Emails
-- Date: 2026-10-14
--
-- Tracks the last login time so we can distinguish first-time
-- logins from returning users, and send a "welcome back" email
-- to returning users (throttled).
-- ================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS welcome_back_sent_at TIMESTAMPTZ;

-- Index for "users who haven't logged in for 7+ days" queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_login
  ON public.profiles (last_login_at DESC NULLS LAST);