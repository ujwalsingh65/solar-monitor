import { DashboardFooter } from "@/components/DashboardFooter";
import { Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsOfService = () => {
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
        <h1 className="text-3xl font-bold mb-6">{t("termsOfService")}</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong>Effective Date:</strong> February 8, 2026</p>

          <h2 className="text-foreground text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>By accessing and using Sun Peek Insight, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

          <h2 className="text-foreground text-xl font-semibold">2. Description of Service</h2>
          <p>Sun Peek Insight is a solar energy monitoring dashboard that provides real-time energy production estimates, weather-based performance analysis, cost savings calculations, and environmental impact tracking.</p>

          <h2 className="text-foreground text-xl font-semibold">3. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials, providing accurate solar system configuration data, and using the service in compliance with applicable laws.</p>

          <h2 className="text-foreground text-xl font-semibold">4. Data Accuracy Disclaimer</h2>
          <p>Energy production estimates are calculated based on mathematical models and real-time weather data. Actual production may vary depending on panel condition, shading, inverter efficiency, and other factors. Sun Peek Insight is for informational purposes only.</p>

          <h2 className="text-foreground text-xl font-semibold">5. Intellectual Property</h2>
          <p>All content, design, and functionality of Sun Peek Insight are owned by Tripurti and are protected by intellectual property laws.</p>

          <h2 className="text-foreground text-xl font-semibold">6. Limitation of Liability</h2>
          <p>Sun Peek Insight shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our service, including but not limited to financial decisions made based on our estimates.</p>

          <h2 className="text-foreground text-xl font-semibold">7. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>

          <h2 className="text-foreground text-xl font-semibold">8. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:sunpeekinsight@gmail.com" className="text-primary hover:underline">sunpeekinsight@gmail.com</a> or call +91 9892619389.</p>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default TermsOfService;
