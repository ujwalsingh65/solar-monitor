import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { supabase, getSupabaseClient } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, RefreshCw, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Alert = {
  id: string;
  alert_type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const AlertsWidget = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useLanguage();
  const { getToken } = useAuth();
  const { user } = useUser();

  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ["alerts", user?.id],
    queryFn: async () => {
      const lastGeneratedDate = localStorage.getItem("alerts_last_generated");
      const today = new Date().toDateString();

      if (lastGeneratedDate !== today && user?.id) {
        try {
          const client = await getSupabaseClient(getToken);
          const { data: generateResult } =
            await client.functions.invoke("generate-daily-alerts", {
              body: { user_id: user.id },
            });
          if (generateResult?.success) {
            localStorage.setItem("alerts_last_generated", today);
          }
        } catch (error) {
          console.error("Error generating alerts:", error);
        }
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const client = await getSupabaseClient(getToken);
      const { data, error } = await client
        .from("alerts")
        .select("*")
        .gte("created_at", startOfDay.toISOString())
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Alert[];
    },
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    enabled: !!user?.id,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    localStorage.removeItem("alerts_last_generated");
    try {
      if (user?.id) {
        const client = await getSupabaseClient(getToken);
        await client.functions.invoke("generate-daily-alerts", {
          body: { user_id: user.id },
        });
      }
    } catch (error) {
      console.error("Error refreshing alerts:", error);
    }
    await refetch();
    setIsRefreshing(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      critical: "destructive",
      warning: "default",
      info: "secondary",
    };
    return (
      <Badge variant={variants[severity] || "secondary"} className="capitalize text-xs">
        {severity}
      </Badge>
    );
  };

  const getAlertTypeBadge = (type: string) => {
    const labelKeys: Record<string, string> = {
      production: "production",
      weather: "weather",
      performance: "performance",
      maintenance: "maintenance",
      optimization: "optimization",
    };
    const key = labelKeys[type];
    return (
      <span className="text-xs text-muted-foreground font-medium">
        {key ? t(key as any) : type}
      </span>
    );
  };

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all duration-300 card-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-accent rounded-lg shadow-glow">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            {t("smartAlerts")}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
            title={t("refreshAlerts")}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                alert.severity === "critical"
                  ? "border-destructive/30 bg-destructive/5"
                  : alert.severity === "warning"
                  ? "border-yellow-500/30 bg-yellow-500/5"
                  : "border-border/50 bg-gradient-to-br from-card to-card/50"
              }`}
            >
              <div className="mt-0.5 shrink-0">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm leading-tight">{alert.title}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {getAlertTypeBadge(alert.alert_type)}
                    {getSeverityBadge(alert.severity)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {formatDistanceToNow(new Date(alert.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("noAlerts")}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {t("generateAlerts")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
