-- Create solar_panel_configs table with validation constraints
CREATE TABLE public.solar_panel_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  panel_size numeric NOT NULL DEFAULT 5 
    CONSTRAINT panel_size_range CHECK (panel_size >= 1 AND panel_size <= 100),
  azimuth numeric NOT NULL DEFAULT 180 
    CONSTRAINT azimuth_range CHECK (azimuth >= 0 AND azimuth <= 360),
  tilt numeric NOT NULL DEFAULT 19 
    CONSTRAINT tilt_range CHECK (tilt >= 0 AND tilt <= 90),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id) -- One config per user
);

-- Enable Row Level Security
ALTER TABLE public.solar_panel_configs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own config
CREATE POLICY "Users can read own config"
ON public.solar_panel_configs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own config
CREATE POLICY "Users can insert own config"
ON public.solar_panel_configs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own config
CREATE POLICY "Users can update own config"
ON public.solar_panel_configs
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own config
CREATE POLICY "Users can delete own config"
ON public.solar_panel_configs
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_solar_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_solar_panel_configs_updated_at
BEFORE UPDATE ON public.solar_panel_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_solar_config_updated_at();