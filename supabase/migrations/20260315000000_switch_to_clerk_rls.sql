-- ============================================================
-- Migration: Switch RLS policies from Supabase Auth to Clerk JWT
--
-- Clerk sends JWTs with the user ID in the "sub" claim.
-- We create a helper function to extract it, then update all
-- Row Level Security policies to use that helper instead of
-- the built-in auth.uid() (which only works with Supabase Auth).
--
-- Steps to apply:
--   1. Run this migration:  supabase db push
--   2. In Clerk Dashboard → JWT Templates → New → Supabase
--      Set the "sub" claim to {{ user.id }}
--      Copy the JWKS endpoint URL shown after saving
--   3. In Supabase Dashboard → Settings → API → JWT Settings
--      Add the Clerk JWKS URL as a "Third-party auth" provider
-- ============================================================

-- Helper: extract Clerk user ID from the JWT "sub" claim
CREATE OR REPLACE FUNCTION auth.clerk_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  );
$$ LANGUAGE SQL STABLE;

-- ── solar_panel_configs ───────────────────────────────────────
ALTER TABLE solar_panel_configs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own config"   ON solar_panel_configs;
DROP POLICY IF EXISTS "Users can insert own config" ON solar_panel_configs;
DROP POLICY IF EXISTS "Users can update own config" ON solar_panel_configs;
DROP POLICY IF EXISTS "Users can delete own config" ON solar_panel_configs;
ALTER TABLE solar_panel_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clerk_select" ON solar_panel_configs
  FOR SELECT USING (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_insert" ON solar_panel_configs
  FOR INSERT WITH CHECK (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_update" ON solar_panel_configs
  FOR UPDATE USING (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_delete" ON solar_panel_configs
  FOR DELETE USING (user_id::text = auth.clerk_user_id());

-- ── actual_production ─────────────────────────────────────────
ALTER TABLE actual_production DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own production"   ON actual_production;
DROP POLICY IF EXISTS "Users can insert own production" ON actual_production;
ALTER TABLE actual_production ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clerk_select" ON actual_production
  FOR SELECT USING (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_insert" ON actual_production
  FOR INSERT WITH CHECK (user_id::text = auth.clerk_user_id());

-- ── production_comparisons ────────────────────────────────────
ALTER TABLE production_comparisons DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own comparisons"   ON production_comparisons;
DROP POLICY IF EXISTS "Users can insert own comparisons" ON production_comparisons;
ALTER TABLE production_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clerk_select" ON production_comparisons
  FOR SELECT USING (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_insert" ON production_comparisons
  FOR INSERT WITH CHECK (user_id::text = auth.clerk_user_id());

-- ── alerts ────────────────────────────────────────────────────
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own alerts"   ON alerts;
DROP POLICY IF EXISTS "Users can insert own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can update own alerts" ON alerts;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clerk_select" ON alerts
  FOR SELECT USING (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_insert" ON alerts
  FOR INSERT WITH CHECK (user_id::text = auth.clerk_user_id());
CREATE POLICY "clerk_update" ON alerts
  FOR UPDATE USING (user_id::text = auth.clerk_user_id());
