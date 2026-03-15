-- Update RLS policies to require authentication
-- This secures all tables to only authenticated users

-- ALERTS TABLE
-- Drop existing public read policy
DROP POLICY IF EXISTS "Allow public read access to alerts" ON public.alerts;

-- Create authenticated-only read policy
CREATE POLICY "Authenticated users can read alerts" ON public.alerts
  FOR SELECT TO authenticated
  USING (true);

-- Add DENY write policies for authenticated users
-- Only edge functions with service role can write
CREATE POLICY "Deny direct insert to alerts" ON public.alerts
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY "Deny direct update to alerts" ON public.alerts
  FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY "Deny direct delete to alerts" ON public.alerts
  FOR DELETE TO authenticated
  USING (false);

-- ENERGY PRODUCTION TABLE
-- Drop existing public read policy
DROP POLICY IF EXISTS "Allow public read access to energy production" ON public.energy_production;

-- Create authenticated-only read policy
CREATE POLICY "Authenticated users can read energy production" ON public.energy_production
  FOR SELECT TO authenticated
  USING (true);

-- Add DENY write policies for authenticated users
CREATE POLICY "Deny direct insert to energy production" ON public.energy_production
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY "Deny direct update to energy production" ON public.energy_production
  FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY "Deny direct delete to energy production" ON public.energy_production
  FOR DELETE TO authenticated
  USING (false);

-- ELECTRICITY RATES TABLE
-- Drop existing public read policy
DROP POLICY IF EXISTS "Allow public read access to electricity rates" ON public.electricity_rates;

-- Create authenticated-only read policy
CREATE POLICY "Authenticated users can read electricity rates" ON public.electricity_rates
  FOR SELECT TO authenticated
  USING (true);

-- Add DENY write policies for authenticated users
-- Only edge functions with service role can modify rates
CREATE POLICY "Deny direct insert to rates" ON public.electricity_rates
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY "Deny direct update to rates" ON public.electricity_rates
  FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY "Deny direct delete to rates" ON public.electricity_rates
  FOR DELETE TO authenticated
  USING (false);