-- ================================================================
-- VESTIOR — Super Admin Role Management
-- Date: 2026-10-15
--
-- Adds a `is_super_admin` flag to profiles. Only super admins
-- can change another user's `role` column. All other updates
-- to `role` are blocked by a database trigger.
-- ================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Add is_super_admin column
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────────────────────
-- 2. Promote your account to super admin
--    ⚠️ CHANGE THIS EMAIL before running!
-- ─────────────────────────────────────────────────────────────
UPDATE public.profiles
SET is_super_admin = true
WHERE email = 'zainshahzs110@gmail.com';

-- Verify
-- SELECT id, email, role, is_super_admin FROM public.profiles WHERE is_super_admin = true;

-- ─────────────────────────────────────────────────────────────
-- 3. RPC: admin_change_user_role
--
-- Called by admin UI to change a user's role.
-- Checks: caller is super admin, target is not super admin,
-- target is not the caller.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_change_user_role(
  p_target_user_id UUID,
  p_new_role TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_caller_is_super BOOLEAN;
  v_target_is_super BOOLEAN;
  v_target_email TEXT;
  v_old_role TEXT;
BEGIN
  -- Validate role value
  IF p_new_role NOT IN ('admin', 'customer') THEN
    RAISE EXCEPTION 'Invalid role: %. Allowed: admin, customer.', p_new_role;
  END IF;

  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Caller must be super admin
  SELECT is_super_admin INTO v_caller_is_super
  FROM public.profiles
  WHERE id = v_caller_id;

  IF NOT COALESCE(v_caller_is_super, false) THEN
    RAISE EXCEPTION 'Forbidden: Super admin access required';
  END IF;

  -- Cannot change own role
  IF v_caller_id = p_target_user_id THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;

  -- Fetch target
  SELECT role, is_super_admin, email
  INTO v_old_role, v_target_is_super, v_target_email
  FROM public.profiles
  WHERE id = p_target_user_id;

  IF v_target_email IS NULL THEN
    RAISE EXCEPTION 'Target user not found';
  END IF;

  -- Cannot change another super admin
  IF v_target_is_super THEN
    RAISE EXCEPTION 'Cannot change role of another super admin';
  END IF;

  -- Perform update
  UPDATE public.profiles
  SET role = p_new_role,
      updated_at = now()
  WHERE id = p_target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'userId', p_target_user_id,
    'email', v_target_email,
    'oldRole', v_old_role,
    'newRole', p_new_role
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_change_user_role(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_change_user_role(UUID, TEXT) TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- 4. Trigger: block direct `role` updates from non-super-admins
--
-- Even if someone bypasses the RPC and runs a raw UPDATE on
-- profiles, this trigger prevents the `role` change.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_caller_is_super BOOLEAN;
BEGIN
  -- Only fire if role is actually changing
  IF OLD.role IS NOT DISTINCT FROM NEW.role THEN
    RETURN NEW;
  END IF;

  -- Service role bypass (for migrations, admin RPC, etc.)
  IF v_caller_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Caller must be super admin
  SELECT is_super_admin INTO v_caller_is_super
  FROM public.profiles
  WHERE id = v_caller_id;

  IF NOT COALESCE(v_caller_is_super, false) THEN
    RAISE EXCEPTION 'Only super admins can change roles';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- ─────────────────────────────────────────────────────────────
-- 5. Verify setup
-- ─────────────────────────────────────────────────────────────
-- SELECT
--   email,
--   role,
--   is_super_admin
-- FROM public.profiles
-- WHERE is_super_admin = true;