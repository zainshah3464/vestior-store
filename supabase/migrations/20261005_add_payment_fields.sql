-- ================================================================
-- VESTIOR — Payment Fields for Orders
-- Date: 2026-10-05
--
-- Adds columns needed for multi-provider payment support.
-- Non-destructive: existing orders get sensible defaults.
-- ================================================================

-- Extend orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'cod',
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_metadata JSONB,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Constrain payment_provider to known values
-- (dropped first in case this migration is re-run)
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_provider_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_provider_check
  CHECK (payment_provider IN ('cod', 'stripe', 'paypal'));

-- Index for admin payment queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_provider
  ON public.orders (payment_provider, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status
  ON public.orders (payment_status)
  WHERE payment_status != 'completed';

-- Backfill: any existing order with no provider becomes 'cod'
UPDATE public.orders
  SET payment_provider = 'cod'
  WHERE payment_provider IS NULL;

-- Verify
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'orders'
--   AND column_name IN ('payment_provider', 'payment_intent_id', 'payment_metadata', 'paid_at');