import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import GlassCard from "@/components/GlassCard";
import StatCard from "@/components/StatCard";

const HeroShield3D = lazy(() => import("@/components/HeroShield3D"));

const recentScans = [
  { url: "https://login-secure.example.com/verify", status: "safe", time: "2 min ago" },
  { url: "https://paypa1-update.xyz/account", status: "phishing", time: "5 min ago" },
  { url: "https://google.com/search?q=test", status: "safe", time: "12 min ago" },
  { url: "https://amaz0n-deals.tk/offer", status: "phishing", time: "18 min ago" },
  { url: "https://github.com/repo/issues", status: "safe", time: "25 min ago" },
];

const quickActions = [
  { emoji: "🔍", label: "Scan URL", desc: "Analyze a single URL" },
  { emoji: "📦", label: "Batch Scan", desc: "Check multiple URLs" },
  { emoji: "📱", label: "QR Code", desc: "Scan QR code URLs" },
  { emoji: "📊", label: "Reports", desc: "View scan history" },
];

const Index = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        className="glass-card-static overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="relative flex items-center p-8">
          <div className="flex-1 space-y-4 z-10">
            <motion.h2
              className="text-4xl font-bold text-foreground"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to <span className="text-primary neon-text font-display">P-LENS</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Advanced AI-powered phishing detection with multi-layer sandbox analysis,
              threat intelligence integration, and real-time monitoring.
            </motion.p>
            <motion.button
              className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Start Scanning →
            </motion.button>
          </div>
          <div className="w-80 h-72 flex-shrink-0 hidden lg:block">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            }>
              <HeroShield3D />
            </Suspense>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="🔍" value="1,247" label="Total Scans" colorClass="bg-accent/15 text-accent" delay={0.1} />
        <StatCard icon="✅" value="1,189" label="Safe URLs" colorClass="bg-cyber-safe/15 text-cyber-safe" delay={0.2} />
        <StatCard icon="🚨" value="58" label="Threats Blocked" colorClass="bg-destructive/15 text-destructive" delay={0.3} />
        <StatCard icon="📊" value="95.3%" label="Safety Rate" colorClass="bg-primary/15 text-primary" delay={0.4} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <GlassCard delay={0.3}>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group text-left"
                whileHover={{ x: 6 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg bg-muted/50 group-hover:scale-110 transition-transform">{action.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <svg className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="lg:col-span-2" delay={0.4}>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentScans.map((scan, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  scan.status === "safe" ? "bg-cyber-safe/15" : "bg-destructive/15"
                }`}>
                  {scan.status === "safe" ? "✅" : "🚨"}
                </span>
                <p className="font-mono text-sm text-foreground truncate flex-1">{scan.url}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{scan.time}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  scan.status === "safe"
                    ? "bg-cyber-safe/15 text-cyber-safe"
                    : "bg-destructive/15 text-destructive"
                }`}>
                  {scan.status}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Index;
