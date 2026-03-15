import { Leaf, TreePine, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSolarProduction } from "@/hooks/useSolarProduction";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface CO2WidgetProps {
  systemCapacity: number;
  azimuth?: number;
  tilt?: number;
}

export const CO2Widget = ({ systemCapacity, azimuth = 180, tilt = 19 }: CO2WidgetProps) => {
  const { production, loading } = useSolarProduction(systemCapacity, azimuth, tilt);
  const { t } = useLanguage();

  const co2SavedKg = parseFloat((production.monthlyTotal * 0.82).toFixed(1));
  const treesSaved = Math.round(co2SavedKg / 21);
  const coalAvoided = parseFloat((production.monthlyTotal * 0.4).toFixed(1));

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all duration-300 card-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/15">
            <Leaf className="h-5 w-5 text-accent" />
          </div>
          {t("environmentalImpact")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            <div className="text-center p-5 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-3xl font-bold text-accent">{co2SavedKg} kg</p>
              <p className="text-sm text-muted-foreground mt-1">{t("co2SavedMonth")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <TreePine className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="text-lg font-bold">{treesSaved}</p>
                  <p className="text-xs text-muted-foreground">{t("treesEquivalent")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Wind className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="text-lg font-bold">{coalAvoided} kg</p>
                  <p className="text-xs text-muted-foreground">{t("coalAvoided")}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
