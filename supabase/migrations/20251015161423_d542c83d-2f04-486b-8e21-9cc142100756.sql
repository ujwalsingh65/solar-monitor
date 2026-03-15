-- Create table for energy production records
CREATE TABLE public.energy_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  power_output DECIMAL(10,2) NOT NULL, -- in kW
  energy_produced DECIMAL(10,2) NOT NULL, -- in kWh
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster time-based queries
CREATE INDEX idx_energy_production_timestamp ON public.energy_production(timestamp DESC);

-- Create table for electricity rate settings
CREATE TABLE public.electricity_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL DEFAULT 'Mumbai',
  rate_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 8.50, -- Mumbai average rate in ₹
  currency TEXT NOT NULL DEFAULT 'INR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default Mumbai rate
INSERT INTO public.electricity_rates (location, rate_per_kwh, currency)
VALUES ('Mumbai', 8.50, 'INR');

-- Enable Row Level Security
ALTER TABLE public.energy_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electricity_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since no auth yet)
CREATE POLICY "Allow public read access to energy production"
ON public.energy_production
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public read access to electricity rates"
ON public.electricity_rates
FOR SELECT
TO anon, authenticated
USING (true);

-- Create function to calculate savings
CREATE OR REPLACE FUNCTION public.calculate_monthly_savings()
RETURNS TABLE (
  total_energy_kwh DECIMAL,
  total_savings_inr DECIMAL,
  avg_rate DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(ep.energy_produced), 0) as total_energy_kwh,
    COALESCE(SUM(ep.energy_produced) * AVG(er.rate_per_kwh), 0) as total_savings_inr,
    AVG(er.rate_per_kwh) as avg_rate
  FROM public.energy_production ep
  CROSS JOIN public.electricity_rates er
  WHERE ep.timestamp >= date_trunc('month', CURRENT_DATE)
    AND er.location = 'Mumbai';
END;
$$;