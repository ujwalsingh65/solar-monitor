import { Battery, Zap, TrendingUp, Sun, Leaf, Info, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSolarProduction } from "@/hooks/useSolarProduction";
import { useActualProduction } from "@/hooks/useActualProduction";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnergyStatsProps {
  systemCapacity: number;
  azimuth?: number;
  tilt?: number;
}

export const EnergyStats = ({ systemCapacity, azimuth = 180, tilt = 19 }: EnergyStatsProps) => {
  const { production, loading } = useSolarProduction(systemCapacity, azimuth, tilt);
  const { isConnected, latestReading, todayTotal: actualTotal, loading: iotLoading } = useActualProduction();
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const { t } = useLanguage();

  const co2Saved = parseFloat((production.todayTotal * 0.82).toFixed(1));

  // Calculate difference between actual and simulated
  const diffPercent = production.todayTotal > 0 && isConnected
    ? (((actualTotal - production.todayTotal) / production.todayTotal) * 100).toFixed(1)
    : null;

  const stats = [
    {
      title: t("currentOutput"),
      value: loading ? "..." : `${production.currentOutput} kW`,
      actualValue: isConnected && latestReading ? `${latestReading.power_output} kW` : null,
      icon: Zap,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      info: t("realTimePower"),
    },
    {
      title: t("todaysProduction"),
      value: loading ? "..." : `${production.todayTotal} kWh`,
      actualValue: isConnected ? `${actualTotal} kWh` : null,
      icon: Sun,
      color: "text-accent",
      bgColor: "bg-accent/10",
      info: t("accumulatedEnergy"),
    },
    {
      title: t("systemEfficiency"),
      value: loading ? "..." : `${production.efficiency}%`,
      actualValue: diffPercent !== null ? `${Number(diffPercent) > 0 ? "+" : ""}${diffPercent}%` : null,
      icon: Battery,
      color: "text-primary",
      bgColor: "bg-primary/10",
      info: isConnected ? "Showing difference between actual and simulated." : t("panelPerformance"),
    },
    {
      title: isConnected ? "IoT Status" : t("co2Saved"),
      value: isConnected
        ? (loading ? "..." : `${actualTotal} kWh`)
        : (loading ? "..." : `${co2Saved} kg`),
      actualValue: null,
      icon: isConnected ? Wifi : Leaf,
      color: isConnected ? "text-primary" : "text-accent",
      bgColor: isConnected ? "bg-primary/10" : "bg-accent/10",
      info: isConnected
        ? "Total actual energy from your IoT device today."
        : "CO₂ emissions avoided by using solar energy today.",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 card-glow overflow-visible"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip open={openTooltip === index} onOpenChange={(open) => setOpenTooltip(open ? index : null)}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => { e.preventDefault(); setOpenTooltip(openTooltip === index ? null : index); }}
                        className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 bg-popover border border-border z-[60]">
                      <p className="text-xs text-muted-foreground leading-relaxed">{stat.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{stat.title}</p>
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  {stat.actualValue && (
                    <p className="text-xs font-semibold text-primary">
                      Actual: {stat.actualValue}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};
