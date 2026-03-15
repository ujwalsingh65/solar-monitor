import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, BarChart3, Wifi, Shield, ArrowRight, Zap, Leaf } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const customEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: customEase as unknown as [number, number, number, number] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: customEase as unknown as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: Sun,
    title: "Real-Time Dashboard",
    desc: "Live energy production stats, weather data, and system efficiency metrics at a glance.",
    color: "text-secondary",
  },
  {
    icon: Wifi,
    title: "IoT Device Integration",
    desc: "Connect your solar panels via MQTT/IoT gateway. Compare actual vs simulated output.",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Smart Reports",
    desc: "Daily comparison reports at 7 PM with hourly breakdowns and efficiency analysis.",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Fault Detection",
    desc: "Instant alerts when production deviates >10% from expected. Never miss a panel issue.",
    color: "text-destructive",
  },
  {
    icon: Leaf,
    title: "Environmental Impact",
    desc: "Track CO₂ offset, trees equivalent, and coal avoided with your clean energy.",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Auto-Optimization",
    desc: "GPS-based panel orientation detection for maximum energy capture at your location.",
    color: "text-secondary",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/");
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-sm text-muted-foreground"
          >
            <Zap className="h-4 w-4 text-secondary" />
            Smart Solar Monitoring Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <span className="block">Harness the</span>
            <motion.span
              className="block gradient-text"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              Power of the Sun
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            Monitor, analyze, and optimize your solar panel performance in real-time.
            Compare IoT device data with simulated output and receive intelligent fault alerts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-xl border-border/50 hover:scale-105 transition-all"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-8">
            {[
              { value: "99.5%", label: "Uptime" },
              { value: "10%", label: "Fault Threshold" },
              { value: "24/7", label: "Monitoring" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete solar monitoring solution with real-time analytics, IoT integration, and smart alerting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card card-glow cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to Optimize Your Solar Energy?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join Sun Peek Insight and start monitoring your solar panels with precision.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              className="text-lg px-10 py-6 rounded-xl shadow-lg"
              onClick={() => navigate("/auth")}
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Minimal Footer */}
      <motion.footer
        className="border-t border-border/40 py-8 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-secondary" />
            <span className="font-semibold text-foreground">Sun Peek Insight</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate("/privacy-policy")} className="hover:text-foreground transition-colors">Privacy Policy</button>
            <button onClick={() => navigate("/terms-of-service")} className="hover:text-foreground transition-colors">Terms of Service</button>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}
