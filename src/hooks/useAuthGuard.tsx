import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Sun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const useAuthGuard = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/welcome");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/welcome");
  };

  const authLoading = !isLoaded;

  const AuthLoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Sun className="h-12 w-12 text-secondary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    </div>
  );

  return { authLoading, handleLogout, AuthLoadingScreen };
};
