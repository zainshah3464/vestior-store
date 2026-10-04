-- ================================================================
-- VESTIOR — RLS Policies Fix
-- Date: 2026-10-03
-- Purpose:
--   1. Fix products ALL policy (any authenticated user can CRUD)
--   2. Fix orders "admin update" policy (applies to all users)
--   3. Fix orders INSERT/SELECT roles (public → authenticated)
--   4. Remove duplicate profiles policies
--   5. Add missing order_items SELECT/UPDATE/DELETE policies
-- ================================================================

-- ---------------------------------------------------------------
-- Helper: is_admin() — safe role check for RLS policies
-- SECURITY DEFINER so it can read profiles regardless of RLS
-- STABLE so Postgres caches the result within a query
-- search_path locked to prevent hijacking
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ================================================================
-- 1. PRODUCTS
-- ================================================================

-- Drop the dangerous ALL policy
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;

-- Public can view active products only (keep existing, re-create for clarity)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products
  FOR SELECT
  TO public
  USING (is_active = true);

-- Admins can view ALL products (including inactive, for admin panel)
CREATE POLICY "Admins can view all products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Admins can update products
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ================================================================
-- 2. ORDERS
-- ================================================================

-- Drop flawed policies
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Users see only their own orders; admins see all
CREATE POLICY "Users view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Authenticated users can create their own orders only
CREATE POLICY "Users insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Only admins can update orders (status changes, etc.)
CREATE POLICY "Admins update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete orders
CREATE POLICY "Admins delete orders"
  ON public.orders
  FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ================================================================
-- 3. ORDER_ITEMS
-- ================================================================

-- Drop existing policy, re-create full set
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;

-- Users can read items belonging to their own orders
CREATE POLICY "Users view own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Users can insert items only into their own orders
CREATE POLICY "Users insert own order items"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

-- Only admins can update order_items
CREATE POLICY "Admins update order items"
  ON public.order_items
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete order_items
CREATE POLICY "Admins delete order items"
  ON public.order_items
  FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ================================================================
-- 4. PROFILES — Remove duplicates, keep clean set
-- ================================================================

-- Drop ALL existing (6 duplicate/loose policies)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Users view own profile; admins view all
CREATE POLICY "Users view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Users insert own profile (trigger uses this on signup)
CREATE POLICY "Users insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Users update own profile; admins update any
CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- Only admins can delete profiles
CREATE POLICY "Admins delete profiles"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());