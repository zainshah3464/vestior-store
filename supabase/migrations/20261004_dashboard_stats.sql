-- ================================================================
-- VESTIOR — Dashboard Aggregation RPC
-- Date: 2026-10-04
--
-- Purpose: Replace 4 separate client-side aggregations with
-- one server-side function that returns everything in a single
-- round-trip, using native SQL aggregation (SUM, COUNT, GROUP BY).
--
-- Benefit: 10,000 orders → transfer 1 row instead of 10,000 rows.
-- ================================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'product_count', (
      SELECT count(*) FROM public.products
    ),
    'order_count', (
      SELECT count(*) FROM public.orders
    ),
    'user_count', (
      SELECT count(*) FROM public.profiles
    ),
    'total_revenue', (
      SELECT COALESCE(sum(total), 0)::bigint FROM public.orders
    ),
    'status_counts', (
      SELECT COALESCE(
        jsonb_object_agg(status, cnt),
        '{}'::jsonb
      )
      FROM (
        SELECT status, count(*)::bigint AS cnt
        FROM public.orders
        GROUP BY status
      ) s
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_stats() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_dashboard_stats() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO service_role;