import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useSolarProduction } from "@/hooks/useSolarProduction";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface PerformanceChartProps {
  systemCapacity: number;
  azimuth?: number;
  tilt?: number;
}

export const PerformanceChart = ({ systemCapacity, azimuth = 180, tilt = 19 }: PerformanceChartProps) => {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");
  const { production, loading } = useSolarProduction(systemCapacity, azimuth, tilt);
  const { t } = useLanguage();

  const data =
    timeRange === "day"
      ? production.hourlyData
      : timeRange === "week"
      ? production.weeklyData
      : production.monthlyWeekData;

  const dataKey =
    timeRange === "day" ? "time" : timeRange === "week" ? "day" : "week";

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all duration-300 card-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {t("energyProduction")}
          </CardTitle>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList>
              <TabsTrigger value="day">{t("day")}</TabsTrigger>
              <TabsTrigger value="week">{t("week")}</TabsTrigger>
              <TabsTrigger value="month">{t("month")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(35 100% 55%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(35 100% 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={dataKey}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: "kWh", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="energy"
              stroke="hsl(35 100% 55%)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#energyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
