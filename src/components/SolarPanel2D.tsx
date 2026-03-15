import { useLanguage } from "@/contexts/LanguageContext";

interface SolarPanel2DProps {
  azimuth: number;
  tilt: number;
}

export const SolarPanel2D = ({ azimuth, tilt }: SolarPanel2DProps) => {
  const { t } = useLanguage();
  const azimuthRotation = azimuth - 90;
  const tiltRadians = (tilt * Math.PI) / 180;
  const panelHeight = Math.sin(tiltRadians) * 60;
  const panelWidth = Math.cos(tiltRadians) * 60;

  return (
    <div className="w-full h-[400px] bg-muted/30 dark:bg-muted/20 rounded-xl overflow-hidden border border-border/50 p-8 shadow-card card-glow">
      <div className="flex h-full gap-8 items-center justify-center">
        {/* Compass View */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h3 className="text-sm font-semibold text-foreground">{t("directionAzimuth")}</h3>
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
              <text x="100" y="25" textAnchor="middle" className="fill-foreground text-sm font-bold">N</text>
              <text x="175" y="105" textAnchor="middle" className="fill-foreground text-sm font-bold">E</text>
              <text x="100" y="185" textAnchor="middle" className="fill-foreground text-sm font-bold">S</text>
              <text x="25" y="105" textAnchor="middle" className="fill-foreground text-sm font-bold">W</text>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = 100 + Math.cos(rad) * 85;
                const y1 = 100 + Math.sin(rad) * 85;
                const x2 = 100 + Math.cos(rad) * 90;
                const y2 = 100 + Math.sin(rad) * 90;
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--border))" strokeWidth="2" />;
              })}
              <g transform={`rotate(${azimuthRotation} 100 100)`}>
                <rect x="80" y="40" width="40" height="60" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" opacity="0.8" rx="2" />
                <line x1="100" y1="40" x2="100" y2="100" stroke="hsl(var(--primary-foreground))" strokeWidth="1" opacity="0.5"/>
                <line x1="80" y1="70" x2="120" y2="70" stroke="hsl(var(--primary-foreground))" strokeWidth="1" opacity="0.5"/>
                <path d="M 100 30 L 95 40 L 105 40 Z" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive-foreground))" strokeWidth="1" />
              </g>
              <circle cx="100" cy="100" r="4" fill="hsl(var(--foreground))"/>
            </svg>
            <div className="absolute -bottom-6 left-0 right-0 text-center text-sm font-medium text-muted-foreground">
              {azimuth}°
            </div>
          </div>
        </div>

        {/* Side View */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h3 className="text-sm font-semibold text-foreground">{t("tiltAngle")}</h3>
          <div className="relative w-48 h-48 flex items-end justify-center pb-8">
            <svg viewBox="0 0 200 150" className="w-full h-full">
              <line x1="20" y1="120" x2="180" y2="120" stroke="hsl(var(--border))" strokeWidth="3"/>
              <rect x="20" y="120" width="160" height="10" fill="hsl(var(--muted))" opacity="0.5"/>
              <line x1="100" y1="120" x2="100" y2={120 - panelHeight} stroke="hsl(var(--muted-foreground))" strokeWidth="4" />
              <circle cx="100" cy={120 - panelHeight} r="4" fill="hsl(var(--muted-foreground))"/>
              <g transform={`rotate(${-tilt} 100 ${120 - panelHeight})`}>
                <rect x={100 - panelWidth / 2} y={120 - panelHeight - 5} width={panelWidth} height="10" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" rx="2" />
                {[0.25, 0.5, 0.75].map((fraction) => (
                  <line key={fraction} x1={100 - panelWidth / 2 + panelWidth * fraction} y1={120 - panelHeight - 5} x2={100 - panelWidth / 2 + panelWidth * fraction} y2={120 - panelHeight + 5} stroke="hsl(var(--primary-foreground))" strokeWidth="1" opacity="0.5" />
                ))}
              </g>
              <path d={`M ${100 + 30} 120 A 30 30 0 0 1 ${100 + 30 * Math.cos(tiltRadians)} ${120 - 30 * Math.sin(tiltRadians)}`} fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="3,3" />
              <text x={100 + 40} y={115} className="fill-accent-foreground text-xs font-medium">{tilt}°</text>
            </svg>
            <div className="absolute -bottom-6 left-0 right-0 text-center text-sm font-medium text-muted-foreground">
              {t("fromHorizontal")}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex gap-6 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>{t("solarPanel")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive rounded"></div>
          <span>{t("directionIndicator")}</span>
        </div>
      </div>
    </div>
  );
};
