
-- Table for storing actual/real solar panel readings from IoT devices
CREATE TABLE public.actual_production (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  power_output NUMERIC NOT NULL,
  energy_produced NUMERIC NOT NULL,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.actual_production ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can read their own data
CREATE POLICY "Users can read own actual production"
  ON public.actual_production FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert (from edge function)
CREATE POLICY "Allow insert via service role or authenticated"
  ON public.actual_production FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow anon insert for IoT devices (they'll use an API key)
CREATE POLICY "Allow anon insert for IoT"
  ON public.actual_production FOR INSERT
  TO anon
  WITH CHECK (true);

-- Table for storing comparison reports
CREATE TABLE public.production_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  comparison_date DATE NOT NULL DEFAULT CURRENT_DATE,
  actual_total NUMERIC NOT NULL DEFAULT 0,
  simulated_total NUMERIC NOT NULL DEFAULT 0,
  difference_percent NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'normal',
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.production_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own comparisons"
  ON public.production_comparisons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service insert comparisons"
  ON public.production_comparisons FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Auth insert comparisons"
  ON public.production_comparisons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for actual_production
ALTER PUBLICATION supabase_realtime ADD TABLE public.actual_production;
