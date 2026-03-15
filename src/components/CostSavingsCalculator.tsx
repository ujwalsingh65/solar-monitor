import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp, Zap, Calendar } from "lucide-react";
import { useSolarProduction } from "@/hooks/useSolarProduction";
import { useLanguage } from "@/contexts/LanguageContext";

interface CostSavingsCalculatorProps {
  systemCapacity: number;
}

export const CostSavingsCalculator = ({ systemCapacity }: CostSavingsCalculatorProps) => {
  const { production, loading } = useSolarProduction(systemCapacity);
  const { t } = useLanguage();
  
  const electricityRate = 8.50;
  
  const monthlyEnergy = production.monthlyTotal;
  const monthlySavings = monthlyEnergy * electricityRate;
  const dailyAverage = (monthlySavings / 30).toFixed(2);
  const yearlyProjection = (monthlySavings * 12).toFixed(2);

  if (loading) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-card card-glow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-secondary" />
            {t("costSavings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("loading")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all duration-300 card-glow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <div className="p-2 bg-gradient-secondary rounded-lg shadow-glow">
            <IndianRupee className="h-5 w-5 text-secondary-foreground" />
          </div>
          {t("costSavings")}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t("basedOnRates")} (₹{electricityRate.toFixed(2)}/kWh)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent rounded-2xl border border-secondary/30 shadow-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2 font-medium">{t("thisMonthSavings")}</p>
              <p className="text-4xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                ₹{monthlySavings.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-secondary rounded-xl shadow-glow">
              <TrendingUp className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">
              {monthlyEnergy.toFixed(2)} kWh {t("generated")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-accent" />
              <p className="text-xs text-muted-foreground font-medium">{t("dailyAverage")}</p>
            </div>
            <p className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">₹{dailyAverage}</p>
          </div>
          
          <div className="p-5 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <p className="text-xs text-muted-foreground font-medium">{t("yearlyProjection")}</p>
            </div>
            <p className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">₹{yearlyProjection}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-border/50">
          <p className="text-sm font-medium mb-3">{t("howMuchSaving")}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("gridCost")}</span>
              <span className="font-semibold text-destructive">₹{monthlySavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("solarCost")}</span>
              <span className="font-semibold text-green-500">₹0.00</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <span className="font-medium">{t("netSavings")}</span>
              <span className="font-bold text-secondary">₹{monthlySavings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
            {t("envImpact")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("co2Offset")} {(monthlyEnergy * 0.82).toFixed(2)} kg CO₂ 🌱
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
