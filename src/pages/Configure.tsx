import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFooter } from "@/components/DashboardFooter";
import { SolarPanel2D } from "@/components/SolarPanel2D";
import { PanelOrientationControls } from "@/components/PanelOrientationControls";
import { SolarPanelSetup } from "@/components/SolarPanelSetup";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSolarConfig } from "@/hooks/useSolarConfig";
import { getEfficiencyPercentage } from "@/utils/solarCalculations";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const Configure = () => {
  const { config, loading: configLoading, hasConfig, updatePanelSize, updateAzimuth, updateTilt } = useSolarConfig();
  const { t } = useLanguage();
  const efficiency = getEfficiencyPercentage(config.azimuth, config.tilt);
  const { authLoading, handleLogout, AuthLoadingScreen } = useAuthGuard();

  if (authLoading) return <AuthLoadingScreen />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader onLogout={handleLogout} />

      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("navConfigure")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("configureSubtitle")}</p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* System Configuration */}
        <SolarPanelSetup
          panelSize={config.panelSize}
          hasConfig={hasConfig}
          loading={configLoading}
          onSave={updatePanelSize}
          inline
        />

        {/* Panel Visualization + Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SolarPanel2D azimuth={config.azimuth} tilt={config.tilt} />
          <PanelOrientationControls
            azimuth={config.azimuth}
            tilt={config.tilt}
            onAzimuthChange={(value) => updateAzimuth(value)}
            onTiltChange={(value) => updateTilt(value)}
            efficiency={efficiency}
          />
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Configure;
