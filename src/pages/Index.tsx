import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Shield, Zap, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

const HeroShield3D = lazy(() => import("@/components/HeroShield3D"));

const scanTrend = [
  { day: "Mon", scans: 42, threats: 3 },
  { day: "Tue", scans: 68, threats: 5 },
  { day: "Wed", scans: 55, threats: 2 },
  { day: "Thu", scans: 89, threats: 8 },
  { day: "Fri", scans: 120, threats: 6 },
  { day: "Sat", scans: 95, threats: 4 },
  { day: "Sun", scans: 78, threats: 3 },
];

const threatTypes = [
  { name: "Phishing", value: 42, color: "hsl(0, 72%, 56%)" },
  { name: "Malware", value: 18, color: "hsl(265, 90%, 65%)" },
  { name: "Spam", value: 25, color: "hsl(40, 96%, 56%)" },
  { name: "Clean", value: 215, color: "hsl(160, 75%, 46%)" },
];

const featureBreakdown = [
  { feature: "SSL", score: 85 },
  { feature: "Domain", score: 92 },
  { feature: "Content", score: 67 },
  { feature: "JS", score: 78 },
  { feature: "Headers", score: 95 },
  { feature: "Rep.", score: 88 },
];

const recentScans = [
  { url: "login-secure.example.com/verify", status: "safe" as const, time: "2m", score: 8 },
  { url: "paypa1-update.xyz/account", status: "danger" as const, time: "5m", score: 82 },
  { url: "google.com/search", status: "safe" as const, time: "12m", score: 3 },
  { url: "amaz0n-deals.tk/offer", status: "danger" as const, time: "18m", score: 91 },
  { url: "github.com/repo/issues", status: "safe" as const, time: "25m", score: 5 },
];

const stats = [
  { value: "1,247", label: "TOTAL SCANS", change: "+23%", icon: Shield, gradient: "from-primary/20 to-primary/5" },
  { value: "95.3%", label: "SAFE RATE", change: "+1.2%", icon: TrendingUp, gradient: "from-safe/20 to-safe/5" },
  { value: "58", label: "THREATS", change: "-8%", icon: AlertTriangle, gradient: "from-destructive/20 to-destructive/5" },
  { value: "12ms", label: "AVG SPEED", change: "-3ms", icon: Zap, gradient: "from-accent/20 to-accent/5" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center min-h-[380px]">
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div className="pill-primary inline-block" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            ACTIVE PROTECTION
          </motion.div>
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[0.95]">
            Detect <span className="text-accent-primary glow-text">threats</span>
            <br />
            before <span className="text-accent-secondary glow-text-accent">impact.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
            Multi-layer AI phishing detection with sandbox analysis, threat intelligence feeds, and real-time URL monitoring.
          </p>
          <div className="flex gap-3">
            <motion.button className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/scanner")}>
              Start Scanning <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              View Docs
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-2 h-[350px] hidden lg:block"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-10 h-10 rounded-full border border-border border-t-primary animate-spin" /></div>}>
            <HeroShield3D />
          </Suspense>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={item} className="surface-glow p-5 group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-foreground" strokeWidth={1.8} />
              </div>
              <p className="metric text-3xl">{stat.value}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="label-overline text-[10px]">{stat.label}</span>
                <span className="text-[11px] font-medium text-primary">{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scan Trend */}
        <motion.div className="lg:col-span-2 surface-glow p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground">Scan Activity</h3>
            <span className="pill-primary">7 DAYS</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={scanTrend}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 72%, 56%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0, 72%, 56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="hsl(240, 5%, 30%)" tick={{ fontSize: 11, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(240, 5%, 30%)" tick={{ fontSize: 11, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(240, 7%, 6%)", border: "1px solid hsl(240, 5%, 15%)", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="scans" stroke="hsl(190, 100%, 50%)" fill="url(#scanGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="threats" stroke="hsl(0, 72%, 56%)" fill="url(#threatGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Threat Distribution */}
        <motion.div className="surface-glow p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="font-display font-bold text-foreground mb-4">Threat Map</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={threatTypes} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                {threatTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240, 7%, 6%)", border: "1px solid hsl(240, 5%, 15%)", borderRadius: "12px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {threatTypes.map((t) => (
              <div key={t.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <span className="text-[10px] text-muted-foreground">{t.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feature Analysis + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Feature Scores */}
        <motion.div className="surface-glow p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <h3 className="font-display font-bold text-foreground mb-4">Detection Layers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={featureBreakdown} layout="vertical" barSize={8}>
              <XAxis type="number" domain={[0, 100]} stroke="hsl(240, 5%, 30%)" tick={{ fontSize: 10, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="feature" stroke="hsl(240, 5%, 30%)" tick={{ fontSize: 11, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} width={50} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="url(#barGrad)">
                {featureBreakdown.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "hsl(190, 100%, 50%)" : "hsl(265, 90%, 65%)"} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground">Recent Scans</h3>
            <button className="btn-ghost text-xs" onClick={() => navigate("/history")}>View All →</button>
          </div>
          <div className="surface-glow overflow-hidden">
            {recentScans.map((scan, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.04 }}
              >
                <span className={scan.status === "safe" ? "dot-safe" : "dot-danger"} />
                <p className="font-mono-code text-xs text-foreground truncate flex-1">{scan.url}</p>
                <span className="text-xs text-muted-foreground tabular-nums">{scan.time}</span>
                <span className={`text-xs font-semibold tabular-nums ${scan.status === "safe" ? "text-safe" : "text-destructive"}`}>{scan.score}</span>
                <span className={scan.status === "safe" ? "pill-safe" : "pill-danger"}>
                  {scan.status === "safe" ? "CLEAN" : "THREAT"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;