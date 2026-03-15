import { useState } from "react";
import { Sun, Menu, X, LayoutDashboard, BarChart3, Wrench, HelpCircle, LogOut, Globe, Moon, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "/", label: t("navDashboard"), icon: LayoutDashboard },
    { id: "/reports", label: t("navReports"), icon: BarChart3 },
    { id: "/configure", label: t("navConfigure"), icon: Wrench },
    { id: "/iot-settings", label: t("navIoT"), icon: Wifi },
    { id: "/help", label: t("navHelp"), icon: HelpCircle },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-secondary shadow-glow">
                <Sun className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                Sun Peek Insight
              </span>
            </div>

            {/* Hamburger */}
            <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Slide-in Drawer (right to left) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/60">
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {t("appName")}
            </span>
            <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom Controls */}
          <div className="p-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("language")}</span>
              <LanguageSelector />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("theme")}</span>
              <ThemeToggle />
            </div>
            <Button
              onClick={() => { onLogout(); setDrawerOpen(false); }}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
