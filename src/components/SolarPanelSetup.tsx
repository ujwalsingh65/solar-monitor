import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Settings, Sun, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SolarPanelSetupProps {
  panelSize: number;
  hasConfig: boolean;
  loading: boolean;
  onSave: (size: number) => Promise<boolean>;
  inline?: boolean;
}

export const SolarPanelSetup = ({ 
  panelSize: initialSize, 
  hasConfig, 
  loading,
  onSave,
  inline = false,
}: SolarPanelSetupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelSize, setPanelSize] = useState(initialSize);
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !hasConfig && !inline) {
      setIsOpen(true);
    }
  }, [loading, hasConfig, inline]);

  useEffect(() => {
    setPanelSize(initialSize);
  }, [initialSize]);

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(panelSize);
    setSaving(false);
    if (success) {
      setIsOpen(false);
      if (inline) navigate("/");
    }
  };

  const getSystemType = (size: number) => {
    if (size < 3) return t("systemTypeSmall");
    if (size < 7) return t("systemTypeMedium");
    if (size < 12) return t("systemTypeLarge");
    if (size < 50) return t("systemTypeCommercial");
    return t("systemTypeIndustrial");
  };

  const formContent = (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="panel-size" className="text-base font-semibold">
          {t("systemCapacityKw")}
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="panel-size"
            min={1} max={100} step={0.5}
            value={[panelSize]}
            onValueChange={(value) => setPanelSize(value[0])}
            className="flex-1"
          />
          <Input
            type="number" min={1} max={100} step={0.5}
            value={panelSize}
            onChange={(e) => setPanelSize(Math.min(100, Math.max(1, parseFloat(e.target.value) || 1)))}
            className="w-24"
          />
        </div>
        <p className="text-sm text-muted-foreground">{t("typicalRange")}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("systemType")}</span>
          <span className="font-medium">{getSystemType(panelSize)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("estimatedPanels")}:</span>
          <span className="font-medium">{Math.ceil(panelSize / 0.4)} {t("panels")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("dailyProductionAvg")}</span>
          <span className="font-medium">{(panelSize * 4).toFixed(1)} kWh</span>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full" size="lg" disabled={saving}>
        {saving ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("saving")}</>
        ) : (
          t("saveConfiguration")
        )}
      </Button>
    </div>
  );

  if (inline) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sun className="h-6 w-6 text-secondary" />
            {t("configureSystem")}
          </CardTitle>
          <CardDescription>{t("configureDesc")}</CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return (
    <>
      {hasConfig && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Reconfigure solar panel size"
        >
          <Settings className="h-6 w-6" />
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sun className="h-6 w-6 text-secondary" />
              {t("configureSystem")}
            </DialogTitle>
            <DialogDescription>{t("configureDesc")}</DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    </>
  );
};
