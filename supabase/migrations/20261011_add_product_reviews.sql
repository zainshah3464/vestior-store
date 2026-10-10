-- ================================================================
-- VESTIOR — Product Reviews
-- Date: 2026-10-11
--
-- Adds a product_reviews table with:
--   • One review per user per product (UNIQUE constraint)
--   • Moderation workflow (pending / approved / rejected)
--   • Verified purchase flag
--   • RLS: anyone reads approved, users write own, admins moderate
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- Table
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One review per user per product
  CONSTRAINT product_reviews_unique_user_product
    UNIQUE (product_id, user_id)
);

-- ─────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved
  ON public.product_reviews (product_id, created_at DESC)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_reviews_status
  ON public.product_reviews (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_user
  ON public.product_reviews (user_id);

-- ─────────────────────────────────────────────────────────────
-- Auto-update `updated_at`
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER trg_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.set_reviews_updated_at();

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can READ approved reviews (for product pages)
DROP POLICY IF EXISTS "Anyone reads approved reviews" ON public.product_reviews;
CREATE POLICY "Anyone reads approved reviews"
  ON public.product_reviews
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Admins can read all reviews (moderation panel)
DROP POLICY IF EXISTS "Admins read all reviews" ON public.product_reviews;
CREATE POLICY "Admins read all reviews"
  ON public.product_reviews
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Authenticated users can read their own reviews (any status)
DROP POLICY IF EXISTS "Users read own reviews" ON public.product_reviews;
CREATE POLICY "Users read own reviews"
  ON public.product_reviews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Authenticated users can INSERT their own reviews
DROP POLICY IF EXISTS "Users insert own reviews" ON public.product_reviews;
CREATE POLICY "Users insert own reviews"
  ON public.product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending' -- force pending on insert
  );

-- Users can UPDATE own reviews (edit their own comment/rating) — resets to pending
DROP POLICY IF EXISTS "Users update own reviews" ON public.product_reviews;
CREATE POLICY "Users update own reviews"
  ON public.product_reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
  );

-- Admins can UPDATE any review (approve/reject)
DROP POLICY IF EXISTS "Admins update reviews" ON public.product_reviews;
CREATE POLICY "Admins update reviews"
  ON public.product_reviews
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can DELETE any review
DROP POLICY IF EXISTS "Admins delete reviews" ON public.product_reviews;
CREATE POLICY "Admins delete reviews"
  ON public.product_reviews
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- RPC: aggregate stats for a product (used by product page)
-- Single round-trip: avg rating, total count, per-star breakdown
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_product_review_stats(p_product_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'average_rating', COALESCE(AVG(rating)::numeric(3,2), 0),
    'total_count', COUNT(*),
    'breakdown', jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    )
  )
  INTO v_result
  FROM public.product_reviews
  WHERE product_id = p_product_id
    AND status = 'approved';

  RETURN COALESCE(v_result, jsonb_build_object(
    'average_rating', 0,
    'total_count', 0,
    'breakdown', '{}'::jsonb
  ));
END;
$$;

REVOKE ALL ON FUNCTION public.get_product_review_stats(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_product_review_stats(UUID) TO public;

-- ─────────────────────────────────────────────────────────────
-- RPC: batch stats for many products (used by product cards)
-- Returns a map of product_id -> { avg, count }
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_products_review_stats(p_product_ids UUID[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT COALESCE(jsonb_object_agg(product_id, stats), '{}'::jsonb)
  INTO v_result
  FROM (
    SELECT
      product_id,
      jsonb_build_object(
        'average_rating', ROUND(AVG(rating)::numeric, 1),
        'total_count', COUNT(*)
      ) AS stats
    FROM public.product_reviews
    WHERE product_id = ANY(p_product_ids)
      AND status = 'approved'
    GROUP BY product_id
  ) s;

  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_products_review_stats(UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_products_review_stats(UUID[]) TO public;