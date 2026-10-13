-- ================================================================
-- VESTIOR — Normalize legacy role values (HARDENED)
-- Date: 2026-10-16 (hardened 2026-10-19)
--
-- Original goal: convert legacy `role = 'user'` values to 'customer'.
--
-- ─── Why this was rewritten ──────────────────────────────────────
-- The original migration used:
--
--   UPDATE profiles SET role = 'customer'
--   WHERE role NOT IN ('customer', 'admin') OR role IS NULL;
--
-- That clause is DANGEROUS if re-run later:
--   • Any new role introduced in the future (e.g. 'vendor',
--     'moderator', 'support') would be silently overwritten to
--     'customer' — losing the user's actual role.
--   • No backup was taken before the destructive UPDATE.
--   • No transaction wrapper (SQL Editor runs each statement
--     in autocommit mode by default).
--
-- This hardened version:
--   1. Backs up all affected rows into a dedicated audit table.
--   2. Uses an explicit WHITELIST of known-legacy roles instead
--      of a broad NOT IN — future roles are left untouched.
--   3. Wraps the UPDATE in a DO block (single atomic unit).
--   4. Fails loudly if unknown role values exist AFTER
--      normalization — no silent broken state.
--   5. Is fully idempotent — safe to run multiple times.
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- 0. Backup table (idempotent — creates once, reuses after)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public._role_normalization_backup (
  id          uuid PRIMARY KEY,
  email       text,
  old_role    text,
  new_role    text NOT NULL DEFAULT 'customer',
  migrated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public._role_normalization_backup IS
  'Audit trail for the 2026-10-16 role normalization migration. '
  'Preserves old role values so the operation is reversible if needed.';

-- ─────────────────────────────────────────────────────────────
-- 1. Main migration (atomic — DO block is one transaction)
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  -- Only these legacy values are considered "known-bad".
  -- Anything else is left untouched — future-proofs the migration.
  v_legacy_roles text[] := ARRAY['user', 'member', 'guest', ''];

  v_affected     int;
  v_unknown      int;
  v_unknown_vals text;
BEGIN
  -- ───────────────────────────────────────────
  -- 1a. Backup affected rows (idempotent)
  --     ON CONFLICT DO NOTHING preserves the *original* backup
  --     even if the migration is re-run after manual changes.
  -- ───────────────────────────────────────────
  INSERT INTO public._role_normalization_backup (id, email, old_role)
  SELECT id, email, COALESCE(role, '<<NULL>>')
  FROM public.profiles
  WHERE role IS NULL
     OR role = ANY(v_legacy_roles)
  ON CONFLICT (id) DO NOTHING;

  -- ───────────────────────────────────────────
  -- 1b. Normalize ONLY the whitelisted legacy values
  -- ───────────────────────────────────────────
  UPDATE public.profiles
  SET role = 'customer'
  WHERE role IS NULL
     OR role = ANY(v_legacy_roles);

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  RAISE NOTICE '[role_normalization] Normalized % row(s)', v_affected;

  -- ───────────────────────────────────────────
  -- 1c. Sanity check: are there any unknown values left?
  --     If yes → abort BEFORE adding the CHECK constraint,
  --     so the DB doesn't end up in a half-broken state.
  -- ───────────────────────────────────────────
  SELECT COUNT(*), string_agg(DISTINCT role, ', ')
    INTO v_unknown, v_unknown_vals
  FROM public.profiles
  WHERE role IS NOT NULL
    AND role NOT IN ('customer', 'admin');

  IF v_unknown > 0 THEN
    RAISE EXCEPTION
      'Role normalization aborted: % row(s) still have unknown role '
      'values: %. Add them to the migration whitelist (v_legacy_roles) '
      'or fix manually before re-running.',
      v_unknown, v_unknown_vals
      USING ERRCODE = '22023';
  END IF;

  RAISE NOTICE '[role_normalization] All role values are clean';
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. Re-apply CHECK constraint (idempotent)
--    Runs ONLY if the DO block above didn't raise.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'admin'));

-- ─────────────────────────────────────────────────────────────
-- 3. Verify (uncomment to run manually)
-- ─────────────────────────────────────────────────────────────
-- SELECT role, count(*) FROM public.profiles GROUP BY role;
-- SELECT * FROM public._role_normalization_backup ORDER BY migrated_at DESC;