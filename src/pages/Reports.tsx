import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFooter } from "@/components/DashboardFooter";
import { AlertsWidget } from "@/components/AlertsWidget";
import { CO2Widget } from "@/components/CO2Widget";
import { CostSavingsCalculator } from "@/components/CostSavingsCalculator";
import { RealVsSimulatedChart } from "@/components/RealVsSimulatedChart";
import { IoTDataFeed } from "@/components/IoTDataFeed";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSolarConfig } from "@/hooks/useSolarConfig";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useActualProduction } from "@/hooks/useActualProduction";

const IoTSection = () => {
  const { isConnected, loading } = useActualProduction();

  if (loading) return null;
  if (!isConnected) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RealVsSimulatedChart />
      <IoTDataFeed />
    </section>
  );
};

const Reports = () => {
  const { config } = useSolarConfig();
  const { t } = useLanguage();
  const { authLoading, handleLogout, AuthLoadingScreen } = useAuthGuard();

  if (authLoading) return <AuthLoadingScreen />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader onLogout={handleLogout} />

      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("navReports")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("reportsSubtitle")}</p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Real vs Simulated Comparison — only when IoT device is connected */}
        <IoTSection />

        {/* Existing Widgets */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AlertsWidget />
          <CO2Widget systemCapacity={config.panelSize} azimuth={config.azimuth} tilt={config.tilt} />
          <CostSavingsCalculator systemCapacity={config.panelSize} />
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Reports;
