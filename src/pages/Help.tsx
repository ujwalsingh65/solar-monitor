import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFooter } from "@/components/DashboardFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, LayoutDashboard, BarChart3, Wrench, Sun, Zap, Leaf, IndianRupee, Wifi, MapPin } from "lucide-react";

const Help = () => {
  const { t } = useLanguage();
  const { authLoading, handleLogout, AuthLoadingScreen } = useAuthGuard();

  if (authLoading) return <AuthLoadingScreen />;

  const guides = [
    { icon: LayoutDashboard, title: t("helpDashboardTitle"), description: t("helpDashboardDesc") },
    { icon: BarChart3, title: t("helpReportsTitle"), description: t("helpReportsDesc") },
    { icon: Wrench, title: t("helpConfigureTitle"), description: t("helpConfigureDesc") },
    { icon: Wifi, title: t("helpIoTTitle"), description: t("helpIoTDesc") },
    { icon: MapPin, title: t("helpAutoOrientTitle"), description: t("helpAutoOrientDesc") },
    { icon: Sun, title: t("helpWeatherTitle"), description: t("helpWeatherDesc") },
    { icon: Zap, title: t("helpAlertsTitle"), description: t("helpAlertsDesc") },
    { icon: IndianRupee, title: t("helpSavingsTitle"), description: t("helpSavingsDesc") },
  ];

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq6Q"), a: t("faq6A") },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader onLogout={handleLogout} />

      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("userGuide")}</h1>
              <p className="text-muted-foreground mt-1 text-sm">{t("userGuideSubtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, i) => (
            <Card key={i} className="border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <guide.icon className="h-5 w-5 text-primary" />
                  </div>
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{guide.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">{t("faqTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Help;
