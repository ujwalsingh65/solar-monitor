import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnergyStats } from "@/components/EnergyStats";
import { PerformanceChart } from "@/components/PerformanceChart";
import { WeatherWidget } from "@/components/WeatherWidget";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFooter } from "@/components/DashboardFooter";
import { Sun } from "lucide-react";
import { useSolarConfig } from "@/hooks/useSolarConfig";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { config } = useSolarConfig();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Sun className="h-12 w-12 text-secondary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <DashboardHeader onLogout={handleLogout} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {t("appName")}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base leading-relaxed">
                {t("heroSubtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-accent/10 text-accent rounded-xl border border-accent/20 font-medium text-sm">
              <div className="h-2.5 w-2.5 bg-accent rounded-full animate-pulse" />
              {t("liveMonitoring")}
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* System Overview Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-card rounded-xl border border-border/50 shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-secondary/15 rounded-lg">
              <Sun className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("systemCapacity")}</p>
              <p className="text-xl font-bold">{config.panelSize} kW</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("estimatedPanels")}</p>
            <p className="text-xl font-bold">{Math.ceil(config.panelSize / 0.4)} {t("panels")}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <section>
          <EnergyStats systemCapacity={config.panelSize} azimuth={config.azimuth} tilt={config.tilt} />
        </section>

        {/* Charts + Weather */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart systemCapacity={config.panelSize} azimuth={config.azimuth} tilt={config.tilt} />
          </div>
          <WeatherWidget />
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Index;
