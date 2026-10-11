-- ================================================================
-- VESTIOR — Coupon System
-- Date: 2026-10-13
--
-- Features:
--   • Percentage or fixed-amount discounts
--   • Min order amount
--   • Total usage limit + per-user limit
--   • Expiry date
--   • Active/inactive toggle
--   • Redemption tracking
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- Coupons
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
  max_discount_amount NUMERIC,  -- optional cap for percent discounts
  usage_limit INTEGER,          -- NULL = unlimited total
  per_user_limit INTEGER NOT NULL DEFAULT 1,
  times_used INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,      -- NULL = no expiry
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code_active
  ON public.coupons (code)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_coupons_active_until
  ON public.coupons (is_active, valid_until);

-- ─────────────────────────────────────────────────────────────
-- Redemptions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL CHECK (discount_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, order_id) -- prevent double redemption on same order
);

CREATE INDEX IF NOT EXISTS idx_redemptions_user
  ON public.coupon_redemptions (user_id, coupon_id);

CREATE INDEX IF NOT EXISTS idx_redemptions_coupon
  ON public.coupon_redemptions (coupon_id);

-- ─────────────────────────────────────────────────────────────
-- Orders table: add coupon columns
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC NOT NULL DEFAULT 0;

-- ─────────────────────────────────────────────────────────────
-- Auto-update updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_coupons_updated_at ON public.coupons;
CREATE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.set_coupons_updated_at();

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- Anyone can read ACTIVE coupons (for validation on client display only)
DROP POLICY IF EXISTS "Anyone reads active coupons" ON public.coupons;
CREATE POLICY "Anyone reads active coupons"
  ON public.coupons
  FOR SELECT
  TO public
  USING (is_active = true);

-- Admins full access
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons"
  ON public.coupons
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users see own redemptions
DROP POLICY IF EXISTS "Users see own redemptions" ON public.coupon_redemptions;
CREATE POLICY "Users see own redemptions"
  ON public.coupon_redemptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Admins read all redemptions
DROP POLICY IF EXISTS "Admins read all redemptions" ON public.coupon_redemptions;
CREATE POLICY "Admins read all redemptions"
  ON public.coupon_redemptions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- RPC: validate_coupon
--
-- Called by the checkout to check if a code is valid, what
-- discount it yields, and whether the user can use it.
-- Does NOT mutate anything.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code TEXT,
  p_user_id UUID,
  p_subtotal NUMERIC
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_coupon public.coupons;
  v_user_usage INTEGER;
  v_discount NUMERIC := 0;
  v_discount_type TEXT;
  v_max_discount NUMERIC;
BEGIN
  -- Find active coupon
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE UPPER(code) = UPPER(p_code)
    AND is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon not found');
  END IF;

  -- Expiry check
  IF v_coupon.valid_until IS NOT NULL AND now() > v_coupon.valid_until THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon has expired');
  END IF;

  IF now() < v_coupon.valid_from THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon is not yet valid');
  END IF;

  -- Total usage limit
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.times_used >= v_coupon.usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon usage limit reached');
  END IF;

  -- Min order
  IF p_subtotal < v_coupon.min_order_amount THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', format('Minimum order of PKR %s required', v_coupon.min_order_amount::text)
    );
  END IF;

  -- Per-user limit
  SELECT COUNT(*) INTO v_user_usage
  FROM public.coupon_redemptions
  WHERE coupon_id = v_coupon.id AND user_id = p_user_id;

  IF v_user_usage >= v_coupon.per_user_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'You have already used this coupon');
  END IF;

  -- Calculate discount
  IF v_coupon.discount_type = 'percent' THEN
    v_discount := (p_subtotal * v_coupon.discount_value / 100);
    v_max_discount := v_coupon.max_discount_amount;
    IF v_max_discount IS NOT NULL AND v_discount > v_max_discount THEN
      v_discount := v_max_discount;
    END IF;
  ELSE
    v_discount := v_coupon.discount_value;
  END IF;

  -- Cap at subtotal (never negative total)
  IF v_discount > p_subtotal THEN
    v_discount := p_subtotal;
  END IF;

  v_discount := ROUND(v_discount, 0);

  RETURN jsonb_build_object(
    'valid', true,
    'coupon_id', v_coupon.id,
    'code', v_coupon.code,
    'description', v_coupon.description,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'discount_amount', v_discount,
    'message', 'Coupon applied'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(TEXT, UUID, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT, UUID, NUMERIC) TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- RPC: redeem_coupon_atomic
--
-- Called during order placement. Atomically:
--   1. Re-validate the coupon (against current state)
--   2. Increment times_used (with lock to prevent race)
--   3. Insert redemption record
-- Returns the final discount amount applied.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.redeem_coupon_atomic(
  p_code TEXT,
  p_user_id UUID,
  p_order_id UUID,
  p_subtotal NUMERIC
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_coupon public.coupons;
  v_user_usage INTEGER;
  v_discount NUMERIC := 0;
  v_max_discount NUMERIC;
  v_validation jsonb;
BEGIN
  -- Re-run validation (safe — coupon may have changed)
  v_validation := public.validate_coupon(p_code, p_user_id, p_subtotal);

  IF (v_validation->>'valid')::boolean IS NOT TRUE THEN
    RETURN v_validation;
  END IF;

  v_discount := (v_validation->>'discount_amount')::numeric;
  v_coupon := NULL;

  -- Lock the coupon row
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE UPPER(code) = UPPER(p_code)
  FOR UPDATE;

  IF v_coupon.id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon not found');
  END IF;

  -- Double-check usage (with lock, we're safe)
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.times_used >= v_coupon.usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon usage limit reached');
  END IF;

  SELECT COUNT(*) INTO v_user_usage
  FROM public.coupon_redemptions
  WHERE coupon_id = v_coupon.id AND user_id = p_user_id;

  IF v_user_usage >= v_coupon.per_user_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'You have already used this coupon');
  END IF;

  -- Increment usage
  UPDATE public.coupons
  SET times_used = times_used + 1
  WHERE id = v_coupon.id;

  -- Record redemption
  INSERT INTO public.coupon_redemptions
    (coupon_id, user_id, order_id, discount_amount)
  VALUES
    (v_coupon.id, p_user_id, p_order_id, v_discount);

  RETURN jsonb_build_object(
    'valid', true,
    'coupon_id', v_coupon.id,
    'code', v_coupon.code,
    'discount_amount', v_discount
  );
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_coupon_atomic(TEXT, UUID, UUID, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_coupon_atomic(TEXT, UUID, UUID, NUMERIC) TO service_role;