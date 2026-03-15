import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SolarConfig {
  panelSize: number;
  azimuth: number;
  tilt: number;
}

const DEFAULT_CONFIG: SolarConfig = {
  panelSize: 5,
  azimuth: 180,
  tilt: 19,
};

export const useSolarConfig = () => {
  const [config, setConfig] = useState<SolarConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchConfig = useCallback(async () => {
    if (!user) return;
    try {
      const client = await getSupabaseClient(getToken);
      const { data, error } = await client
        .from("solar_panel_configs")
        .select("panel_size, azimuth, tilt")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig({
          panelSize: Number(data.panel_size),
          azimuth: Number(data.azimuth),
          tilt: Number(data.tilt),
        });
        setHasConfig(true);
      } else {
        setHasConfig(false);
      }
    } catch (error) {
      console.error("Error fetching solar config:", error);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveConfig = useCallback(async (newConfig: Partial<SolarConfig>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save configuration.",
      });
      return false;
    }

    try {
      const configToSave = { ...config, ...newConfig };

      if (configToSave.panelSize < 1 || configToSave.panelSize > 100) {
        toast({ variant: "destructive", title: "Invalid panel size", description: "Panel size must be between 1 and 100 kW." });
        return false;
      }
      if (configToSave.azimuth < 0 || configToSave.azimuth > 360) {
        toast({ variant: "destructive", title: "Invalid azimuth", description: "Azimuth must be between 0° and 360°." });
        return false;
      }
      if (configToSave.tilt < 0 || configToSave.tilt > 90) {
        toast({ variant: "destructive", title: "Invalid tilt", description: "Tilt must be between 0° and 90°." });
        return false;
      }

      const client = await getSupabaseClient(getToken);
      const { error } = await client
        .from("solar_panel_configs")
        .upsert(
          { user_id: user.id, panel_size: configToSave.panelSize, azimuth: configToSave.azimuth, tilt: configToSave.tilt },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      setConfig(configToSave);
      setHasConfig(true);
      return true;
    } catch (error) {
      console.error("Error saving solar config:", error);
      toast({ variant: "destructive", title: "Save failed", description: "Could not save your configuration. Please try again." });
      return false;
    }
  }, [config, toast, user, getToken]);

  const updatePanelSize = useCallback((size: number) => saveConfig({ panelSize: size }), [saveConfig]);
  const updateAzimuth = useCallback((azimuth: number) => saveConfig({ azimuth }), [saveConfig]);
  const updateTilt = useCallback((tilt: number) => saveConfig({ tilt }), [saveConfig]);

  return { config, loading, hasConfig, saveConfig, updatePanelSize, updateAzimuth, updateTilt, refetch: fetchConfig };
};
