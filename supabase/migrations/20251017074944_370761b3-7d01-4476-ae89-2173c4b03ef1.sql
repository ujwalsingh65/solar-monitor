-- Create alerts table for solar panel monitoring
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to alerts"
ON public.alerts
FOR SELECT
USING (true);

-- Create index for better query performance
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_is_read ON public.alerts(is_read);

-- Insert some sample alerts
INSERT INTO public.alerts (alert_type, severity, title, message) VALUES
('performance', 'warning', 'Low Energy Production Detected', 'Solar panel output is 25% below expected levels for this time of day. Check for shading or panel cleanliness.'),
('weather', 'info', 'Optimal Conditions Expected', 'Clear skies forecasted for the next 3 days. Expect higher than average energy production.'),
('maintenance', 'warning', 'Panel Cleaning Recommended', 'It has been 30 days since last maintenance. Consider cleaning panels to maintain optimal efficiency.'),
('performance', 'info', 'Peak Production Achieved', 'Solar panels reached peak production of 5.2kW today at 12:30 PM.');