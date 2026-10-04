-- ================================================================
-- VESTIOR — Performance Indexes
-- Date: 2026-10-04
--
-- Purpose: Add indexes for hot query paths in the app.
--   • Products listing / category / featured / new-arrivals
--   • Customer orders (user_id + created_at DESC)
--   • Admin orders (status filter, list by date)
--   • Order items lookup by order_id
--   • Product name search (trigram for ILIKE '%q%')
--
-- Design notes:
--   • Partial indexes (WHERE is_active = true) keep indexes small
--     and match the exact WHERE clauses used in code.
--   • Composite (colA, colB DESC) supports both filtering and ORDER BY
--     in a single index scan.
--   • Trigram index powers fast ILIKE '%...%' search on product names.
-- ================================================================

-- Needed for trigram (ILIKE '%q%') product search
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ================================================================
-- PRODUCTS
-- ================================================================

-- Homepage featured products
--   WHERE is_active = true AND is_featured = true
--   ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_active_featured_created
  ON public.products (created_at DESC)
  WHERE is_active = true AND is_featured = true;

-- Homepage new arrivals
--   WHERE is_active = true AND is_new_arrival = true
--   ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_active_new_arrival_created
  ON public.products (created_at DESC)
  WHERE is_active = true AND is_new_arrival = true;

-- Category listing
--   WHERE category_main = ? AND is_active = true
--   ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_category_active_created
  ON public.products (category_main, created_at DESC)
  WHERE is_active = true;

-- General products listing (all active)
--   WHERE is_active = true
--   ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_active_created
  ON public.products (created_at DESC)
  WHERE is_active = true;

-- Navbar search: name ILIKE '%q%'
--   Trigram GIN index accelerates arbitrary substring matches
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON public.products USING gin (name gin_trgm_ops);

-- Admin products table (filter by is_active)
CREATE INDEX IF NOT EXISTS idx_products_active
  ON public.products (is_active);


-- ================================================================
-- ORDERS
-- ================================================================

-- Customer orders page
--   WHERE user_id = auth.uid()
--   ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON public.orders (user_id, created_at DESC);

-- Admin orders filter by status + sort
--   WHERE status = ?
--   ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON public.orders (status, created_at DESC);

-- Admin "recent orders" (no filter, just sort)
CREATE INDEX IF NOT EXISTS idx_orders_created
  ON public.orders (created_at DESC);

-- Admin revenue queries by date range
--   WHERE created_at >= ? AND created_at < ?
CREATE INDEX IF NOT EXISTS idx_orders_created_range
  ON public.orders (created_at);


-- ================================================================
-- ORDER_ITEMS
-- ================================================================

-- Order detail / history: fetch items for an order
CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON public.order_items (order_id);

-- Reverse lookup: which orders contain a product (analytics)
CREATE INDEX IF NOT EXISTS idx_order_items_product
  ON public.order_items (product_id);


-- ================================================================
-- PROFILES
-- ================================================================

-- Admin users table (sort by created_at)
CREATE INDEX IF NOT EXISTS idx_profiles_created
  ON public.profiles (created_at DESC);

-- Note: profiles.id is already the PK; profiles.email already unique-indexed.


-- ================================================================
-- Verify (optional): list all indexes we created
-- ================================================================
-- SELECT indexname, tablename FROM pg_indexes
-- WHERE schemaname = 'public' ORDER BY tablename, indexname;