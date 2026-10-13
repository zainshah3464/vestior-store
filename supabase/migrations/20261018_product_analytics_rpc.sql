-- ================================================================
-- VESTIOR — Product Analytics RPC
-- Date: 2026-10-18
--
-- Aggregates product-level analytics from order_items:
--   • Top products by revenue (units sold + order count)
--   • Category performance
--   • Average units per order
-- ================================================================

CREATE OR REPLACE FUNCTION public.get_product_sales_stats(
  p_limit INTEGER DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
BEGIN
  WITH
  -- Revenue-generating orders only
  paid_orders AS (
    SELECT id
    FROM public.orders
    WHERE status IN ('shipped', 'delivered')
  ),

  -- Aggregate per product
  product_stats AS (
    SELECT
      oi.product_id AS id,
      oi.product_name AS name,
      COALESCE(sum(oi.quantity), 0)::bigint AS units_sold,
      COALESCE(sum(oi.quantity * oi.price), 0)::bigint AS revenue,
      count(DISTINCT oi.order_id)::bigint AS order_count,
      COALESCE(avg(oi.price), 0)::numeric(10, 2) AS avg_unit_price
    FROM public.order_items oi
    JOIN paid_orders po ON po.id = oi.order_id
    GROUP BY oi.product_id, oi.product_name
    ORDER BY revenue DESC
    LIMIT p_limit
  ),

  -- Category-level aggregation
  category_stats AS (
    SELECT
      COALESCE(p.category_main, 'Uncategorized') AS category,
      COALESCE(sum(oi.quantity), 0)::bigint AS units_sold,
      COALESCE(sum(oi.quantity * oi.price), 0)::bigint AS revenue,
      count(DISTINCT oi.order_id)::bigint AS order_count
    FROM public.order_items oi
    JOIN paid_orders po ON po.id = oi.order_id
    LEFT JOIN public.products p ON p.id = oi.product_id
    GROUP BY COALESCE(p.category_main, 'Uncategorized')
    ORDER BY revenue DESC
  ),

  -- Global averages
  global_stats AS (
    SELECT
      COALESCE(sum(oi.quantity), 0)::bigint AS total_units_sold,
      COALESCE(sum(oi.quantity * oi.price), 0)::bigint AS total_revenue,
      count(DISTINCT oi.order_id)::bigint AS total_orders_with_items,
      COALESCE(
        sum(oi.quantity)::numeric / NULLIF(count(DISTINCT oi.order_id), 0),
        0
      )::numeric(10, 2) AS avg_units_per_order
    FROM public.order_items oi
    JOIN paid_orders po ON po.id = oi.order_id
  )

  SELECT jsonb_build_object(
    'top_products', COALESCE(
      (SELECT jsonb_agg(row_to_json(product_stats)) FROM product_stats),
      '[]'::jsonb
    ),
    'by_category', COALESCE(
      (SELECT jsonb_agg(row_to_json(category_stats)) FROM category_stats),
      '[]'::jsonb
    ),
    'global', (SELECT to_jsonb(g) FROM global_stats g)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_product_sales_stats(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_product_sales_stats(INTEGER) TO service_role;