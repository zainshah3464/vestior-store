-- ================================================================
-- VESTIOR — Sales Report RPC
-- Date: 2026-10-17
--
-- Single-call aggregation for the /admin/reports dashboard.
-- Returns:
--   • Summary totals (revenue, orders, avg order value)
--   • Revenue by order status
--   • Revenue by payment provider
--   • Revenue by category
--   • Top selling products
--   • Daily revenue series
--
-- Only "delivered" and "shipped" orders count as revenue.
-- ================================================================

CREATE OR REPLACE FUNCTION public.get_sales_report(
  p_from_date TIMESTAMPTZ DEFAULT NULL,
  p_to_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
  v_revenue_statuses TEXT[] := ARRAY['shipped', 'delivered'];
BEGIN
  WITH
  -- ─────────────────────────────────────────────
  -- Base filter: orders within date range
  -- ─────────────────────────────────────────────
  filtered AS (
    SELECT *
    FROM public.orders
    WHERE (p_from_date IS NULL OR created_at >= p_from_date)
      AND (p_to_date IS NULL OR created_at <= p_to_date)
  ),

  -- ─────────────────────────────────────────────
  -- Counts by status
  -- ─────────────────────────────────────────────
  status_counts AS (
    SELECT
      status,
      count(*)::bigint AS cnt
    FROM filtered
    GROUP BY status
  ),

  -- ─────────────────────────────────────────────
  -- Revenue by provider (only shipped/delivered)
  -- ─────────────────────────────────────────────
  provider_stats AS (
    SELECT
      COALESCE(payment_provider, 'cod') AS provider,
      count(*)::bigint AS order_count,
      COALESCE(sum(total), 0)::bigint AS revenue
    FROM filtered
    WHERE status = ANY(v_revenue_statuses)
    GROUP BY COALESCE(payment_provider, 'cod')
  ),

  -- ─────────────────────────────────────────────
  -- Totals
  -- ─────────────────────────────────────────────
  totals AS (
    SELECT
      count(*)::bigint AS total_orders,
      COALESCE(sum(CASE WHEN status = ANY(v_revenue_statuses) THEN total ELSE 0 END), 0)::bigint AS total_revenue,
      COALESCE(
        avg(CASE WHEN status = ANY(v_revenue_statuses) THEN total END),
        0
      )::numeric(10, 2) AS avg_order_value
    FROM filtered
  ),

  -- ─────────────────────────────────────────────
  -- Revenue by category (via order_items join)
  -- ─────────────────────────────────────────────
  category_stats AS (
    SELECT
      COALESCE(p.category_main, 'Uncategorized') AS category,
      COALESCE(sum(oi.quantity * oi.price), 0)::bigint AS revenue,
      COALESCE(sum(oi.quantity), 0)::bigint AS units_sold,
      count(DISTINCT oi.order_id)::bigint AS order_count
    FROM filtered o
    JOIN public.order_items oi ON oi.order_id = o.id
    LEFT JOIN public.products p ON p.id = oi.product_id
    WHERE o.status = ANY(v_revenue_statuses)
    GROUP BY COALESCE(p.category_main, 'Uncategorized')
    ORDER BY revenue DESC
  ),

  -- ─────────────────────────────────────────────
  -- Top selling products
  -- ─────────────────────────────────────────────
  top_products AS (
    SELECT
      oi.product_id AS id,
      oi.product_name AS name,
      COALESCE(sum(oi.quantity), 0)::bigint AS units_sold,
      COALESCE(sum(oi.quantity * oi.price), 0)::bigint AS revenue,
      count(DISTINCT oi.order_id)::bigint AS order_count
    FROM filtered o
    JOIN public.order_items oi ON oi.order_id = o.id
    WHERE o.status = ANY(v_revenue_statuses)
    GROUP BY oi.product_id, oi.product_name
    ORDER BY revenue DESC
    LIMIT 10
  ),

  -- ─────────────────────────────────────────────
  -- Daily revenue series (for chart)
  -- ─────────────────────────────────────────────
  daily_series AS (
    SELECT
      to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
      COALESCE(sum(CASE WHEN status = ANY(v_revenue_statuses) THEN total ELSE 0 END), 0)::bigint AS revenue,
      count(*)::bigint AS order_count
    FROM filtered
    GROUP BY day
    ORDER BY day ASC
  )

  SELECT jsonb_build_object(
    'totals', (SELECT to_jsonb(t) FROM totals t),
    'by_status', COALESCE(
      (SELECT jsonb_object_agg(status, cnt) FROM status_counts),
      '{}'::jsonb
    ),
    'by_provider', COALESCE(
      (SELECT jsonb_agg(row_to_json(provider_stats)) FROM provider_stats),
      '[]'::jsonb
    ),
    'by_category', COALESCE(
      (SELECT jsonb_agg(row_to_json(category_stats)) FROM category_stats),
      '[]'::jsonb
    ),
    'top_products', COALESCE(
      (SELECT jsonb_agg(row_to_json(top_products)) FROM top_products),
      '[]'::jsonb
    ),
    'daily_series', COALESCE(
      (SELECT jsonb_agg(row_to_json(daily_series)) FROM daily_series),
      '[]'::jsonb
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Lock down access
REVOKE ALL ON FUNCTION public.get_sales_report(TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_sales_report(TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;