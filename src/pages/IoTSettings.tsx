import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFooter } from "@/components/DashboardFooter";
import { IoTConnectionGuide } from "@/components/IoTConnectionGuide";
import { IoTDataFeed } from "@/components/IoTDataFeed";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useActualProduction } from "@/hooks/useActualProduction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Wifi, WifiOff, Radio, Clock } from "lucide-react";

const IoTSettings = () => {
  const { authLoading, handleLogout, AuthLoadingScreen } = useAuthGuard();
  const { isConnected, latestReading, todayTotal, todayReadings } = useActualProduction();

  if (authLoading) return <AuthLoadingScreen />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader onLogout={handleLogout} />

      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">IoT Settings</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your IoT device connections and view incoming data
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Connection Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-lg ${isConnected ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {isConnected ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                </div>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Device Status</p>
              <p className="text-xl font-bold text-foreground">
                {isConnected ? "Connected" : "No Device"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary">
                  <Radio className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Today's Readings</p>
              <p className="text-xl font-bold text-foreground">{todayReadings.length}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Last Reading</p>
              <p className="text-xl font-bold text-foreground">
                {latestReading
                  ? new Date(latestReading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Feed + Connection Guide */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IoTDataFeed />
          <IoTConnectionGuide />
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default IoTSettings;
