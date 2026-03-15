import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { supabase, getSupabaseClient } from "@/integrations/supabase/client";

interface FeedEntry {
  id: string;
  power_output: number;
  energy_produced: number;
  timestamp: string;
  device_id: string | null;
}

export const IoTDataFeed = () => {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchRecent = useCallback(async () => {
    if (!user) return;
    const client = await getSupabaseClient(getToken);
    const { data } = await client
      .from("actual_production")
      .select("id, power_output, energy_produced, timestamp, device_id")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(20);

    if (data && data.length > 0) {
      setEntries(data);
      const latestTime = new Date(data[0].timestamp).getTime();
      setConnected(Date.now() - latestTime < 24 * 60 * 60 * 1000);
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchRecent();

    const channel = supabase
      .channel("iot-feed-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "actual_production" },
        () => fetchRecent()
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [fetchRecent]);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live IoT Data Feed
        </CardTitle>
        <Badge variant={connected ? "default" : "secondary"} className="gap-1.5">
          {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {connected ? "Connected" : "No Signal"}
        </Badge>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No IoT data received yet. Connect your device to see live readings.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {entry.power_output} kW
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.energy_produced} kWh • {entry.device_id || "unknown"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatTime(entry.timestamp)}
                  </span>
                  <br />
                  <span className="text-xs text-muted-foreground/60">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
