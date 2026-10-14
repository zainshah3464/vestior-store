-- ================================================================
-- VESTIOR — place_order_atomic v2
-- Date: 2026-10-19
--
-- Root-cause fix for order placement consistency.
--
-- v1 problem:
--   Order creation, coupon redemption, and payment_provider tagging
--   were 3 separate operations. Any of them could fail mid-way,
--   leaving the system in an inconsistent state (coupon consumed
--   but discount not on order, provider mismatch, etc.).
--
-- v2 solution:
--   All four concerns now live inside ONE transaction:
--     1. Stock lock + decrement
--     2. Order insert
--     3. Coupon validate + redeem (FOR UPDATE lock)
--     4. payment_method + payment_provider tagging
--
--   If ANY step fails → the entire transaction rolls back.
--   No retry logic needed. No compensating RPC needed.
--
-- Breaking change:
--   - Old 4-arg signature is dropped.
--   - New signature has 6 args (2 optional with defaults).
--   - Callers using 4-arg style still work (defaults fill in).
-- ================================================================

-- Drop the old 4-arg version (new version will be 6-arg with defaults)
DROP FUNCTION IF EXISTS public.place_order_atomic(uuid, text, jsonb, jsonb);


CREATE OR REPLACE FUNCTION public.place_order_atomic(
  p_user_id        uuid,
  p_user_email     text,
  p_items          jsonb,
  p_address        jsonb,
  p_coupon_code    text DEFAULT NULL,
  p_payment_method text DEFAULT 'cod'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_order_id       uuid;
  v_subtotal       numeric := 0;
  v_shipping       int     := 0;
  v_discount       numeric := 0;
  v_total          int     := 0;
  v_item           jsonb;
  v_product        record;
  v_qty            int;
  v_ordered_items  jsonb   := '[]'::jsonb;
  v_free_threshold numeric := 5000;
  v_shipping_fee   int     := 100;

  -- Coupon state
  v_coupon         public.coupons;
  v_coupon_id      uuid    := NULL;
  v_coupon_code    text    := NULL;
  v_coupon_valid   boolean := false;
  v_user_usage     int     := 0;
  v_max_discount   numeric;

  -- Payment provider whitelist
  v_allowed_providers text[] := ARRAY['cod', 'stripe', 'paypal'];
BEGIN
  -- ============================================================
  -- 0. Basic input validation
  -- ============================================================
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Missing user ID' USING ERRCODE = '22023';
  END IF;

  IF p_user_email IS NULL OR length(trim(p_user_email)) = 0 THEN
    RAISE EXCEPTION 'Missing user email' USING ERRCODE = '22023';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array'
     OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty' USING ERRCODE = '22023';
  END IF;

  IF jsonb_array_length(p_items) > 30 THEN
    RAISE EXCEPTION 'Too many distinct items in cart' USING ERRCODE = '22023';
  END IF;

  IF p_payment_method IS NULL
     OR NOT (p_payment_method = ANY(v_allowed_providers)) THEN
    RAISE EXCEPTION 'Invalid payment method: %', COALESCE(p_payment_method, 'NULL')
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 1. Lock + validate products, compute subtotal
  --    Sorted by product_id → consistent lock order → no deadlocks
  -- ============================================================
  FOR v_item IN
    SELECT value
    FROM jsonb_array_elements(p_items)
    ORDER BY (value->>'product_id')
  LOOP
    v_qty := (v_item->>'quantity')::int;

    IF v_qty IS NULL OR v_qty < 1 OR v_qty > 50 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', (v_item->>'product_id')
        USING ERRCODE = '22023';
    END IF;

    SELECT id, name, price, stock, is_active
      INTO v_product
      FROM public.products
     WHERE id = (v_item->>'product_id')::uuid
     FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', (v_item->>'product_id')
        USING ERRCODE = 'P0002';
    END IF;

    IF v_product.is_active IS NOT TRUE THEN
      RAISE EXCEPTION 'Product "%" is no longer available', v_product.name
        USING ERRCODE = '22023';
    END IF;

    IF v_product.stock IS NULL OR v_product.stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for "%". Available: %, requested: %',
        v_product.name, COALESCE(v_product.stock, 0), v_qty
        USING ERRCODE = '22023';
    END IF;

    v_subtotal := v_subtotal + (v_product.price * v_qty);

    v_ordered_items := v_ordered_items || jsonb_build_object(
      'product_id',   v_product.id,
      'product_name', v_product.name,
      'quantity',     v_qty,
      'price',        v_product.price
    );

    UPDATE public.products
       SET stock      = stock - v_qty,
           updated_at = now()
     WHERE id = v_product.id;
  END LOOP;

  -- ============================================================
  -- 2. Coupon validation + redemption (inside this transaction)
  --
  --    Failure policy: If the coupon is invalid for any reason,
  --    we DO NOT fail the order. We silently skip the discount
  --    and continue. Only hard DB errors abort the transaction.
  -- ============================================================
  IF p_coupon_code IS NOT NULL AND length(trim(p_coupon_code)) > 0 THEN
    -- Lock the coupon row (blocks concurrent redemptions)
    SELECT * INTO v_coupon
      FROM public.coupons
     WHERE UPPER(code) = UPPER(trim(p_coupon_code))
       AND is_active = true
     FOR UPDATE;

    IF FOUND THEN
      v_coupon_valid := true;
      v_coupon_id    := v_coupon.id;
      v_coupon_code  := v_coupon.code;

      -- Expiry window
      IF v_coupon.valid_until IS NOT NULL AND now() > v_coupon.valid_until THEN
        v_coupon_valid := false;
      END IF;

      IF v_coupon_valid AND now() < v_coupon.valid_from THEN
        v_coupon_valid := false;
      END IF;

      -- Total usage limit
      IF v_coupon_valid
         AND v_coupon.usage_limit IS NOT NULL
         AND v_coupon.times_used >= v_coupon.usage_limit THEN
        v_coupon_valid := false;
      END IF;

      -- Minimum order gate
      IF v_coupon_valid AND v_subtotal < v_coupon.min_order_amount THEN
        v_coupon_valid := false;
      END IF;

      -- Per-user limit
      IF v_coupon_valid THEN
        SELECT COUNT(*) INTO v_user_usage
          FROM public.coupon_redemptions
         WHERE coupon_id = v_coupon.id
           AND user_id = p_user_id;

        IF v_user_usage >= v_coupon.per_user_limit THEN
          v_coupon_valid := false;
        END IF;
      END IF;

      -- Compute discount
      IF v_coupon_valid THEN
        IF v_coupon.discount_type = 'percent' THEN
          v_discount := (v_subtotal * v_coupon.discount_value / 100);
          v_max_discount := v_coupon.max_discount_amount;
          IF v_max_discount IS NOT NULL AND v_discount > v_max_discount THEN
            v_discount := v_max_discount;
          END IF;
        ELSE
          v_discount := v_coupon.discount_value;
        END IF;

        -- Never discount more than the subtotal
        IF v_discount > v_subtotal THEN
          v_discount := v_subtotal;
        END IF;

        v_discount := ROUND(v_discount, 0);

        -- Increment usage (will roll back if later step fails)
        UPDATE public.coupons
           SET times_used = times_used + 1
         WHERE id = v_coupon.id;
      ELSE
        -- Coupon matched but no longer usable — clear so it isn't applied
        v_coupon_id   := NULL;
        v_coupon_code := NULL;
        v_discount    := 0;
      END IF;
    END IF;
    -- Coupon not found → skip silently. Order proceeds without discount.
  END IF;

  -- ============================================================
  -- 3. Compute shipping + total
  -- ============================================================
  IF v_subtotal >= v_free_threshold THEN
    v_shipping := 0;
  ELSE
    v_shipping := v_shipping_fee;
  END IF;

  v_total := ROUND(v_subtotal)::int + v_shipping - ROUND(v_discount)::int;
  IF v_total < 0 THEN
    v_total := 0;
  END IF;

  -- ============================================================
  -- 4. Insert order (all fields set in one shot)
  -- ============================================================
  INSERT INTO public.orders (
    user_id, user_email, items, address,
    subtotal, shipping, total,
    status, payment_status,
    payment_method,     -- legacy column
    payment_provider,   -- new column
    coupon_code,
    discount_amount
  ) VALUES (
    p_user_id,
    p_user_email,
    v_ordered_items,
    p_address,
    ROUND(v_subtotal)::int,
    v_shipping,
    v_total,
    'pending',
    'pending',
    p_payment_method,
    p_payment_method,
    v_coupon_code,
    ROUND(v_discount)::int
  )
  RETURNING id INTO v_order_id;

  -- ============================================================
  -- 5. Insert order_items
  -- ============================================================
  INSERT INTO public.order_items (order_id, product_id, product_name, quantity, price)
  SELECT
    v_order_id,
    (item->>'product_id')::uuid,
    (item->>'product_name'),
    (item->>'quantity')::int,
    (item->>'price')::numeric
  FROM jsonb_array_elements(v_ordered_items) AS item;

  -- ============================================================
  -- 6. Insert coupon_redemption (if discount was applied)
  -- ============================================================
  IF v_coupon_id IS NOT NULL AND v_discount > 0 THEN
    INSERT INTO public.coupon_redemptions
      (coupon_id, user_id, order_id, discount_amount)
    VALUES
      (v_coupon_id, p_user_id, v_order_id, v_discount);
  END IF;

  -- ============================================================
  -- 7. Return summary
  -- ============================================================
  RETURN jsonb_build_object(
    'order_id',        v_order_id,
    'subtotal',        ROUND(v_subtotal)::int,
    'shipping',        v_shipping,
    'discount_amount', ROUND(v_discount)::int,
    'coupon_code',     v_coupon_code,
    'total',           v_total
  );
END;
$function$;

-- Lock down access — only service_role (Server Actions) can call this
REVOKE ALL ON FUNCTION public.place_order_atomic(uuid, text, jsonb, jsonb, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order_atomic(uuid, text, jsonb, jsonb, text, text) TO service_role;

-- ============================================================
-- Verify
-- ============================================================
-- SELECT proname, pronargs
-- FROM pg_proc
-- WHERE proname = 'place_order_atomic';
-- Should show: place_order_atomic | 