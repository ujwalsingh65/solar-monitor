import { DashboardFooter } from "@/components/DashboardFooter";
import { Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-secondary shadow-glow">
              <Sun className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              Sun Peek Insight
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">{t("privacyPolicy")}</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong>Effective Date:</strong> February 8, 2026</p>
          
          <h2 className="text-foreground text-xl font-semibold">1. Information We Collect</h2>
          <p>We collect information you provide directly, including your email address during registration, solar panel configuration data (system capacity, orientation, tilt angle), and location data (with your permission) for weather-based calculations.</p>

          <h2 className="text-foreground text-xl font-semibold">2. How We Use Your Information</h2>
          <p>Your information is used to provide personalized solar monitoring dashboards, calculate energy production estimates and cost savings, generate smart alerts based on weather and performance data, and improve our services and user experience.</p>

          <h2 className="text-foreground text-xl font-semibold">3. Data Storage & Security</h2>
          <p>All data is stored securely using industry-standard encryption. We use secure cloud infrastructure with row-level security policies to ensure your data is only accessible to you.</p>

          <h2 className="text-foreground text-xl font-semibold">4. Data Sharing</h2>
          <p>We do not sell, trade, or share your personal information with third parties. We may use anonymized, aggregated data for research and improvement purposes.</p>

          <h2 className="text-foreground text-xl font-semibold">5. Third-Party Services</h2>
          <p>We use Open-Meteo API for weather data (no personal data shared). Location data is processed locally and only coordinates are sent for weather lookups.</p>

          <h2 className="text-foreground text-xl font-semibold">6. Your Rights</h2>
          <p>You have the right to access, modify, or delete your personal data at any time. You can withdraw consent for location tracking. You may request a copy of your stored data.</p>

          <h2 className="text-foreground text-xl font-semibold">7. Contact</h2>
          <p>For privacy-related inquiries, contact us at <a href="mailto:sunpeekinsight@gmail.com" className="text-primary hover:underline">sunpeekinsight@gmail.com</a> or call +91 9892619389.</p>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default PrivacyPolicy;
