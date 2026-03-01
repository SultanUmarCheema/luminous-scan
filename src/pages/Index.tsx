import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

const HeroShield3D = lazy(() => import("@/components/HeroShield3D"));

const recentScans = [
  { url: "login-secure.example.com/verify", status: "safe" as const, time: "2m" },
  { url: "paypa1-update.xyz/account", status: "danger" as const, time: "5m" },
  { url: "google.com/search", status: "safe" as const, time: "12m" },
  { url: "amaz0n-deals.tk/offer", status: "danger" as const, time: "18m" },
  { url: "github.com/repo/issues", status: "safe" as const, time: "25m" },
];

const stats = [
  { value: "1,247", label: "SCANS", change: "+23%" },
  { value: "95.3%", label: "SAFE RATE", change: "+1.2%" },
  { value: "58", label: "THREATS", change: "-8%" },
  { value: "12ms", label: "AVG SPEED", change: "-3ms" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const Index = () => {
  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[420px] mb-16">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <motion.div
              className="pill-primary inline-block mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              ACTIVE PROTECTION
            </motion.div>
            <h1 className="font-display text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[0.95]">
              Detect
              <br />
              <span className="text-accent-primary">threats</span>
              <br />
              before they hit.
            </h1>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            AI-powered phishing detection with multi-layer sandbox analysis and real-time threat intelligence.
          </p>
          <div className="flex gap-3">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Scanning
            </motion.button>
            <motion.button
              className="btn-ghost"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Docs
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="h-[380px] lg:h-[420px] hidden lg:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-border border-t-primary animate-spin" />
            </div>
          }>
            <HeroShield3D />
          </Suspense>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="surface p-6">
            <p className="metric">{stat.value}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="label-overline">{stat.label}</span>
              <span className="text-[11px] font-medium text-accent-primary">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-foreground">Recent Scans</h2>
          <button className="btn-ghost text-xs">View All →</button>
        </div>

        <div className="surface overflow-hidden">
          {recentScans.map((scan, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}
            >
              <span className={scan.status === "safe" ? "dot-safe" : "dot-danger"} />
              <p className="font-mono text-sm text-foreground truncate flex-1">{scan.url}</p>
              <span className="text-xs text-muted-foreground tabular-nums">{scan.time}</span>
              <span className={scan.status === "safe" ? "pill-safe" : "pill-danger"}>
                {scan.status === "safe" ? "CLEAN" : "THREAT"}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
