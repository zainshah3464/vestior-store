-- ================================================================
-- VESTIOR — Backend Wishlist
-- Date: 2026-10-12
--
-- One row per (user, product). Idempotent insert on the client.
-- RLS: users manage their own wishlist; admins can read all.
-- ================================================================

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wishlists_unique_user_product
    UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user
  ON public.wishlists (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_wishlists_product
  ON public.wishlists (product_id);

-- RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own wishlist" ON public.wishlists;
CREATE POLICY "Users read own wishlist"
  ON public.wishlists
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users insert own wishlist" ON public.wishlists;
CREATE POLICY "Users insert own wishlist"
  ON public.wishlists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own wishlist" ON public.wishlists;
CREATE POLICY "Users delete own wishlist"
  ON public.wishlists
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());