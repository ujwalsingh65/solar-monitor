import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { supabase, getSupabaseClient } from "@/integrations/supabase/client";

interface ActualReading {
  id: string;
  power_output: number;
  energy_produced: number;
  timestamp: string;
  device_id: string | null;
}

interface ActualProductionData {
  isConnected: boolean;
  latestReading: ActualReading | null;
  todayTotal: number;
  todayReadings: ActualReading[];
  loading: boolean;
}

export const useActualProduction = () => {
  const [data, setData] = useState<ActualProductionData>({
    isConnected: false,
    latestReading: null,
    todayTotal: 0,
    todayReadings: [],
    loading: true,
  });

  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const client = await getSupabaseClient(getToken);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: readings, error } = await client
        .from("actual_production")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", todayStart.toISOString())
        .order("timestamp", { ascending: false });

      if (error) throw error;

      const todayTotal = (readings || []).reduce((sum, r) => sum + Number(r.energy_produced), 0);
      const latestReading = readings && readings.length > 0 ? readings[0] : null;

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { data: recentCheck } = await client
        .from("actual_production")
        .select("id")
        .eq("user_id", user.id)
        .gte("timestamp", twentyFourHoursAgo.toISOString())
        .limit(1);

      setData({
        isConnected: (recentCheck && recentCheck.length > 0) || false,
        latestReading,
        todayTotal: parseFloat(todayTotal.toFixed(2)),
        todayReadings: readings || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching actual production:", error);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("actual-production-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "actual_production" }, () => fetchData())
      .subscribe();

    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, [fetchData]);

  return { ...data, refresh: fetchData };
};
