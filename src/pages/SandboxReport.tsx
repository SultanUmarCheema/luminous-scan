import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip, PieChart, Pie
} from "recharts";
import {
  FlaskConical, Shield, Globe, Code, Link2, Bug, Brain, Copy, X,
  ChevronDown, ChevronUp, Eye, Network, Lock, Fingerprint, Cpu,
  AlertTriangle, CheckCircle, XCircle, Activity
} from "lucide-react";

const mockReport = {
  url: "paypa1-update.xyz/account",
  timestamp: new Date().toLocaleString(),
  finalScore: 78,
  verdict: "PHISHING" as const,
  sections: {
    network: {
      score: 72,
      weight: 10,
      data: {
        ip: "185.234.72.xx",
        asn: "AS49981 — WorldStream B.V.",
        country: "Netherlands",
        domainAge: "12 days",
        ssl: { valid: true, issuer: "Let's Encrypt", age: "10 days" },
        redirectChain: ["paypa1-update.xyz → paypa1-update.xyz/account/login"],
        finalDestination: "paypa1-update.xyz/account/login",
        headers: [
          { name: "X-Frame-Options", present: false },
          { name: "Content-Security-Policy", present: false },
          { name: "Strict-Transport-Security", present: true },
          { name: "X-Content-Type-Options", present: false },
        ],
      },
      flags: ["Domain registered 12 days ago — NEW DOMAIN", "Missing critical security headers"],
    },
    page: {
      score: 65,
      weight: 15,
      data: {
        title: "PayPal — Login to Your Account",
        loginForm: true,
        passwordField: true,
        brandImpersonation: "PayPal",
        externalFormAction: true,
        crossOriginIframes: 1,
        externalScripts: 4,
      },
      flags: ["Login form submits to external domain — CRITICAL", "Brand impersonation: PayPal"],
    },
    jsAnalysis: {
      score: 58,
      weight: 20,
      categories: [
        { name: "Obfuscation", status: "detected", severity: "HIGH", rules: 3, detail: "Base64 encoded eval(), packed JS" },
        { name: "Data Harvesting", status: "detected", severity: "CRITICAL", rules: 2, detail: "Keystroke logger, form data exfiltration" },
        { name: "Crypto Mining", status: "clean", severity: "LOW", rules: 0, detail: "—" },
        { name: "Malicious Redirects", status: "detected", severity: "MEDIUM", rules: 1, detail: "Dynamic window.location change" },
        { name: "Fingerprinting", status: "clean", severity: "LOW", rules: 0, detail: "—" },
        { name: "Phishing Indicators", status: "detected", severity: "CRITICAL", rules: 4, detail: "Fake login portal, credential harvesting" },
      ],
    },
    urlHeuristic: {
      score: 85,
      weight: 35,
      checks: [
        { name: "Character substitution", severity: "HIGH", points: 15, detail: "'paypa1' mimics 'paypal' using '1' for 'l'" },
        { name: "Suspicious TLD", severity: "MEDIUM", points: 10, detail: ".xyz is commonly used in phishing" },
        { name: "Path depth", severity: "LOW", points: 3, detail: "Nested path: /account/login" },
        { name: "Brand in subdomain", severity: "HIGH", points: 12, detail: "PayPal brand in non-PayPal domain" },
        { name: "URL length", severity: "LOW", points: 2, detail: "Moderate length" },
      ],
    },
    ioc: {
      score: 60,
      weight: 20,
      threatFeeds: [
        { source: "PhishTank", status: "hit", type: "Phishing", detail: "Listed 2 days ago" },
        { source: "URLhaus", status: "clean", type: "—", detail: "Not listed" },
        { source: "VirusTotal", status: "hit", type: "Malicious", detail: "8/90 engines flagged" },
      ],
      iocs: [
        { type: "IP Addresses", count: 2, samples: "185.234.72.xx, 92.38.xx.xx" },
        { type: "File Hashes", count: 1, samples: "a3f2b8c..." },
      ],
      dgaVerdict: "Suspicious",
      dgaScore: 0.72,
      homograph: false,
    },
  },
};

const modulesMeta = [
  { key: "network", id: "A", name: "Network Analyzer", file: "network_analyzer.py", icon: Globe, color: "190, 100%, 50%", desc: "DNS, SSL, HTTP headers, WHOIS" },
  { key: "page", id: "B", name: "Browser Analyzer", file: "browser_analyzer.py", icon: Eye, color: "265, 90%, 65%", desc: "Headless Chrome — screenshots, DOM, forms, brand" },
  { key: "jsAnalysis", id: "C", name: "JS Malware Detector", file: "js_malware_detector.py", icon: Code, color: "40, 96%, 56%", desc: "40+ regex rules across 6 categories" },
  { key: "urlHeuristic", id: "D", name: "URL Heuristic Analyzer", file: "url_heuristic_analyzer.py", icon: Link2, color: "160, 75%, 46%", desc: "14-check phishing intelligence engine" },
  { key: "ioc", id: "E", name: "IOC Scanner", file: "ioc_scanner.py", icon: Bug, color: "0, 72%, 56%", desc: "Threat feeds, YARA sigs, DGA, homograph" },
];

const severityColor = (s: string) => {
  if (s === "CRITICAL") return { bg: "hsla(0, 72%, 56%, 0.1)", text: "hsl(0, 72%, 56%)" };
  if (s === "HIGH") return { bg: "hsla(25, 95%, 53%, 0.1)", text: "hsl(25, 95%, 53%)" };
  if (s === "MEDIUM") return { bg: "hsla(40, 96%, 56%, 0.1)", text: "hsl(40, 96%, 56%)" };
  return { bg: "hsla(240, 5%, 42%, 0.1)", text: "hsl(240, 5%, 42%)" };
};

const scoreColor = (score: number) => {
  if (score > 60) return "hsl(0, 72%, 56%)";
  if (score > 35) return "hsl(40, 96%, 56%)";
  return "hsl(160, 75%, 46%)";
};

const SectionCard = ({ id, title, icon: Icon, color, file, desc, score, children }: {
  id: string; title: string; icon: any; color: string; file: string; desc: string; score: number; children: React.ReactNode
}) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      className="surface-glow overflow-hidden relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, hsl(${color}), transparent)`, opacity: 0.5 }} />

      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 border-b border-border hover:bg-secondary/20 transition-colors">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `hsla(${color}, 0.12)`, color: `hsl(${color})` }}>
          {id}
        </div>
        <Icon className="w-4 h-4" style={{ color: `hsl(${color})` }} />
        <div className="flex-1 text-left">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-[9px] font-mono-code text-muted-foreground ml-2">{file}</span>
        </div>
        {/* Mini score ring */}
        <div className="relative w-9 h-9 mr-2">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="14" fill="none" stroke={scoreColor(score)} strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`} strokeDashoffset={`${2 * Math.PI * 14 * (1 - score / 100)}`} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums" style={{ color: scoreColor(score) }}>{score}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="p-5 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TableRow = ({ label, value, danger }: { label: string; value: React.ReactNode; danger?: boolean }) => (
  <div className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm ${danger ? "bg-destructive/[0.04] border border-destructive/10" : "hover:bg-secondary/20 transition-colors"}`}>
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className={`font-mono-code text-xs ${danger ? "text-destructive" : "text-foreground"}`}>{value}</span>
  </div>
);

const FlagRow = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/[0.05] border border-destructive/10 rounded-lg px-3 py-2.5">
    <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {text}
  </div>
);

const SandboxReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeModule, setActiveModule] = useState(0);
  const r = mockReport;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        const inc = Math.random() * 12 + 4;
        const next = Math.min(100, p + inc);
        setActiveModule(Math.min(4, Math.floor(next / 20)));
        return next;
      });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const layerScores = [
    { name: "Network", score: r.sections.network.score, weight: r.sections.network.weight, color: "190, 100%, 50%" },
    { name: "Browser", score: r.sections.page.score, weight: r.sections.page.weight, color: "265, 90%, 65%" },
    { name: "JS Malware", score: r.sections.jsAnalysis.score, weight: r.sections.jsAnalysis.weight, color: "40, 96%, 56%" },
    { name: "Heuristics", score: r.sections.urlHeuristic.score, weight: r.sections.urlHeuristic.weight, color: "160, 75%, 46%" },
    { name: "IOC/Intel", score: r.sections.ioc.score, weight: r.sections.ioc.weight, color: "0, 72%, 56%" },
  ];

  const radarData = layerScores.map((l) => ({ subject: l.name, score: l.score, fullMark: 100 }));
  const pieData = r.sections.jsAnalysis.categories.map((c) => ({
    name: c.name,
    value: c.status === "detected" ? c.rules : 0,
  })).filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] gap-8">
        {/* Animated pipeline loading */}
        <div className="relative w-44 h-44">
          <motion.svg viewBox="0 0 180 180" className="absolute inset-0 w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
            <circle cx="90" cy="90" r="85" fill="none" stroke="hsl(190,100%,50%)" strokeWidth="0.5" strokeOpacity="0.15" />
            <circle cx="90" cy="90" r="85" fill="none" stroke="hsl(190,100%,50%)" strokeWidth="2" strokeDasharray="40 500" strokeLinecap="round" />
          </motion.svg>
          <motion.svg viewBox="0 0 180 180" className="absolute inset-0 w-full h-full" animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
            <circle cx="90" cy="90" r="68" fill="none" stroke="hsl(265,90%,65%)" strokeWidth="1.5" strokeDasharray="25 400" strokeLinecap="round" />
          </motion.svg>
          <motion.svg viewBox="0 0 180 180" className="absolute inset-0 w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
            <circle cx="90" cy="90" r="50" fill="none" stroke="hsl(40,96%,56%)" strokeWidth="1" strokeDasharray="15 300" strokeLinecap="round" />
          </motion.svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <FlaskConical className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
        </div>

        {/* Module progress */}
        <div className="w-full max-w-lg space-y-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Sandbox Pipeline</span>
            <span className="tabular-nums">{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(190,100%,50%), hsl(265,90%,65%), hsl(40,96%,56%))" }}
              animate={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {modulesMeta.map((mod, i) => {
              const Icon = mod.icon;
              const done = i < activeModule;
              const active = i === activeModule;
              return (
                <motion.div
                  key={mod.key}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${active ? "bg-primary/5 border border-primary/20" : done ? "border border-safe/10" : "border border-transparent"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `hsla(${mod.color}, ${active ? 0.15 : 0.06})` }}
                    animate={active ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: done ? "hsl(var(--status-safe))" : active ? `hsl(${mod.color})` : "hsl(var(--muted-foreground))" }} />
                  </motion.div>
                  <span className={`text-[8px] text-center leading-tight ${active ? "text-primary" : done ? "text-safe" : "text-muted-foreground"}`}>
                    {mod.name.split(" ")[0]}
                  </span>
                  {done && <span className="text-[8px] text-safe">✓</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-5">
      {/* Header Card */}
      <motion.div
        className={`surface-glow p-6 border-l-4 relative overflow-hidden ${r.verdict === "PHISHING" ? "border-l-destructive" : "border-l-safe"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background gradient wash */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: r.verdict === "PHISHING"
            ? "linear-gradient(135deg, hsla(0,72%,56%,0.04), transparent 60%)"
            : "linear-gradient(135deg, hsla(160,75%,46%,0.04), transparent 60%)"
        }} />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-accent" />
              <span className="label-overline">P-LENS Sandbox Analysis Report</span>
            </div>
            <code className="text-sm font-mono-code text-primary block p-2 bg-secondary rounded-lg">{r.url}</code>
            <p className="text-[11px] text-muted-foreground">{r.timestamp} • Engine: 5-layer heuristic pipeline</p>

            {/* Module architecture mini-display */}
            <div className="flex items-center gap-1.5 pt-2">
              {modulesMeta.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <motion.div
                    key={mod.key}
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ background: `hsla(${mod.color}, 0.1)` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
                    title={mod.name}
                  >
                    <Icon className="w-3 h-3" style={{ color: `hsl(${mod.color})` }} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-5">
            {/* Score ring */}
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary))" strokeWidth="5" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={scoreColor(r.finalScore)}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - r.finalScore / 100) }}
                  transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-4xl font-display font-black tabular-nums"
                  style={{ color: scoreColor(r.finalScore), textShadow: `0 0 30px ${scoreColor(r.finalScore)}40` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  {r.finalScore}
                </motion.span>
                <span className="text-[10px] text-muted-foreground">/100</span>
              </div>
            </div>
            <div>
              <span className={`inline-block mb-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                r.verdict === "PHISHING"
                  ? "bg-destructive/15 text-destructive"
                  : "bg-safe/15 text-safe"
              }`} style={{ boxShadow: `0 0 20px ${r.verdict === "PHISHING" ? "hsla(0,72%,56%,0.2)" : "hsla(160,75%,46%,0.2)"}` }}>
                {r.verdict}
              </span>
              <p className="text-[10px] text-muted-foreground max-w-[140px]">
                Weighted composite from 5 analysis modules
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overview: Radar + Module Scores + JS Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar */}
        <motion.div className="surface-glow p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h4 className="font-display font-bold text-foreground text-sm mb-1">Module Radar</h4>
          <p className="text-[9px] text-muted-foreground mb-2">Score distribution across 5 engines</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(240, 5%, 15%)" strokeOpacity={0.6} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "hsl(240, 5%, 50%)" }} />
              <Radar dataKey="score" stroke="hsl(190, 100%, 50%)" fill="hsl(190, 100%, 50%)" fillOpacity={0.1} strokeWidth={2} dot={{ fill: "hsl(190, 100%, 50%)", r: 3 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Module score bars */}
        <motion.div className="surface-glow p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h4 className="font-display font-bold text-foreground text-sm mb-1">Module Scores</h4>
          <p className="text-[9px] text-muted-foreground mb-3">Individual risk per engine</p>
          <div className="space-y-3">
            {layerScores.map((l, i) => (
              <div key={l.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">{l.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code tabular-nums" style={{ color: scoreColor(l.score) }}>{l.score}</span>
                    <span className="text-[8px] text-muted-foreground">{l.weight}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `hsl(${l.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${l.score}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* JS Category pie */}
        <motion.div className="surface-glow p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h4 className="font-display font-bold text-foreground text-sm mb-1">JS Threat Categories</h4>
          <p className="text-[9px] text-muted-foreground mb-2">Detected malware rule distribution</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={4} dataKey="value" stroke="none">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={["hsl(25,95%,53%)", "hsl(0,72%,56%)", "hsl(40,96%,56%)", "hsl(265,90%,65%)"][i % 4]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240, 7%, 6%)", border: "1px solid hsl(240, 5%, 15%)", borderRadius: "10px", fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-1">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ["hsl(25,95%,53%)", "hsl(0,72%,56%)", "hsl(40,96%,56%)", "hsl(265,90%,65%)"][i % 4] }} />
                <span className="text-[8px] text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Section A - Network */}
      <SectionCard id="A" title="Network & Transport Analysis" icon={Globe} color={modulesMeta[0].color} file={modulesMeta[0].file} desc={modulesMeta[0].desc} score={r.sections.network.score}>
        <div className="space-y-1">
          <TableRow label="IP Address" value={r.sections.network.data.ip} />
          <TableRow label="ASN" value={r.sections.network.data.asn} />
          <TableRow label="Country" value={r.sections.network.data.country} />
          <TableRow label="Domain Age" value={<>{r.sections.network.data.domainAge} <span className="pill-danger ml-2 text-[8px]">NEW</span></>} danger />
          <TableRow label="SSL Valid" value={r.sections.network.data.ssl.valid ? "✔ Yes" : "✘ No"} />
          <TableRow label="SSL Issuer" value={r.sections.network.data.ssl.issuer} />
          <TableRow label="SSL Age" value={r.sections.network.data.ssl.age} />
          <TableRow label="Redirect Chain" value={r.sections.network.data.redirectChain.join(" → ")} />
          <TableRow label="Final Destination" value={r.sections.network.data.finalDestination} />
        </div>
        <div className="mt-3">
          <span className="label-overline mb-2 block">Security Headers</span>
          <div className="grid grid-cols-2 gap-1.5">
            {r.sections.network.data.headers.map((h) => (
              <div key={h.name} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${h.present ? "" : "bg-destructive/[0.03]"}`}>
                {h.present ? <CheckCircle className="w-3 h-3 text-safe" /> : <XCircle className="w-3 h-3 text-destructive" />}
                <span className="text-muted-foreground">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
        {r.sections.network.flags.map((f, i) => <FlagRow key={i} text={f} />)}
      </SectionCard>

      {/* Section B - Page/Browser */}
      <SectionCard id="B" title="Page & Browser Analysis" icon={Eye} color={modulesMeta[1].color} file={modulesMeta[1].file} desc={modulesMeta[1].desc} score={r.sections.page.score}>
        <div className="space-y-1">
          <TableRow label="Page Title" value={r.sections.page.data.title} />
          <TableRow label="Login Form" value={r.sections.page.data.loginForm ? "⚠ YES" : "✔ NO"} danger={r.sections.page.data.loginForm} />
          <TableRow label="Password Field" value={r.sections.page.data.passwordField ? "⚠ YES" : "✔ NO"} danger={r.sections.page.data.passwordField} />
          <TableRow label="Brand Impersonation" value={r.sections.page.data.brandImpersonation} danger />
          <TableRow label="Form → External Domain" value={r.sections.page.data.externalFormAction ? "⚠ CRITICAL" : "✔ NO"} danger={r.sections.page.data.externalFormAction} />
          <TableRow label="Cross-Origin iFrames" value={String(r.sections.page.data.crossOriginIframes)} />
          <TableRow label="External Scripts" value={String(r.sections.page.data.externalScripts)} />
        </div>
        {r.sections.page.flags.map((f, i) => <FlagRow key={i} text={f} />)}
      </SectionCard>

      {/* Section C - JS Malware */}
      <SectionCard id="C" title="JavaScript Malware Detection" icon={Code} color={modulesMeta[2].color} file={modulesMeta[2].file} desc={modulesMeta[2].desc} score={r.sections.jsAnalysis.score}>
        <div className="space-y-1">
          {r.sections.jsAnalysis.categories.map((cat) => {
            const sev = severityColor(cat.severity);
            return (
              <div key={cat.name} className={`flex items-center gap-3 text-sm py-2.5 px-3 rounded-lg transition-colors ${cat.status === "detected" ? "bg-destructive/[0.03]" : "hover:bg-secondary/20"}`}>
                {cat.status === "detected" ? <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 text-safe flex-shrink-0" />}
                <span className="text-foreground flex-1 text-xs font-medium">{cat.name}</span>
                <span className={cat.status === "detected" ? "text-destructive text-[10px]" : "text-safe text-[10px]"}>
                  {cat.status === "detected" ? `${cat.rules} rules` : "CLEAN"}
                </span>
                <span className="pill text-[8px] px-2 py-0.5" style={{ background: sev.bg, color: sev.text }}>{cat.severity}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Section D - URL Heuristics */}
      <SectionCard id="D" title="URL Phishing Heuristic Analysis" icon={Link2} color={modulesMeta[3].color} file={modulesMeta[3].file} desc={modulesMeta[3].desc} score={r.sections.urlHeuristic.score}>
        <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-secondary/30">
          <span className="text-xs text-muted-foreground">Checks Triggered:</span>
          <span className="text-sm font-bold text-destructive">{r.sections.urlHeuristic.checks.length}/14</span>
          <span className="text-xs text-muted-foreground ml-auto">Total Points:</span>
          <span className="text-sm font-bold text-destructive">{r.sections.urlHeuristic.checks.reduce((a, c) => a + c.points, 0)}</span>
        </div>
        <div className="space-y-1">
          {r.sections.urlHeuristic.checks.map((check) => {
            const sev = severityColor(check.severity);
            return (
              <div key={check.name} className="flex items-center gap-3 text-sm py-2.5 px-3 rounded-lg hover:bg-secondary/20 transition-colors">
                <span className="text-xs font-medium text-foreground flex-1">{check.name}</span>
                <span className="pill text-[8px] px-2 py-0.5" style={{ background: sev.bg, color: sev.text }}>{check.severity}</span>
                <span className="pill-danger text-[8px]">+{check.points}</span>
                <span className="text-[10px] text-muted-foreground max-w-[180px] truncate hidden md:block">{check.detail}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Section E - IOC */}
      <SectionCard id="E" title="IOC & Cyber Threat Intelligence" icon={Bug} color={modulesMeta[4].color} file={modulesMeta[4].file} desc={modulesMeta[4].desc} score={r.sections.ioc.score}>
        <span className="label-overline mb-2 block">🔗 Threat Feed Lookup</span>
        <div className="space-y-1 mb-4">
          {r.sections.ioc.threatFeeds.map((f) => (
            <div key={f.source} className={`flex items-center gap-3 text-sm py-2.5 px-3 rounded-lg transition-colors ${f.status === "hit" ? "bg-destructive/[0.03]" : "hover:bg-secondary/20"}`}>
              {f.status === "hit" ? <XCircle className="w-3.5 h-3.5 text-destructive" /> : <CheckCircle className="w-3.5 h-3.5 text-safe" />}
              <span className="text-xs font-medium text-foreground flex-1">{f.source}</span>
              <span className={f.status === "hit" ? "pill-danger text-[8px]" : "pill-safe text-[8px]"}>{f.status === "hit" ? "HIT" : "CLEAN"}</span>
              <span className="text-[10px] text-muted-foreground">{f.detail}</span>
            </div>
          ))}
        </div>

        <span className="label-overline mb-2 block">📍 IOC Extracted</span>
        <div className="space-y-1 mb-4">
          {r.sections.ioc.iocs.map((ioc) => (
            <div key={ioc.type} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-secondary/20">
              <span className="text-xs text-foreground flex-1">{ioc.type}</span>
              <span className="pill-primary text-[8px]">{ioc.count}</span>
              <span className="text-[10px] text-muted-foreground font-mono-code">{ioc.samples}</span>
            </div>
          ))}
        </div>

        <span className="label-overline mb-2 block">🧠 DGA Detection</span>
        <TableRow label="Verdict" value={r.sections.ioc.dgaVerdict} danger={r.sections.ioc.dgaVerdict !== "Clean"} />
        <TableRow label="DGA Score" value={r.sections.ioc.dgaScore.toFixed(2)} danger={r.sections.ioc.dgaScore > 0.5} />
      </SectionCard>

      {/* Section F - Final Verdict */}
      <motion.div
        className={`surface-glow p-6 border-l-4 relative overflow-hidden ${r.verdict === "PHISHING" ? "border-l-destructive" : "border-l-safe"}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{
          background: r.verdict === "PHISHING"
            ? "linear-gradient(90deg, transparent, hsl(0,72%,56%), transparent)"
            : "linear-gradient(90deg, transparent, hsl(160,75%,46%), transparent)",
          opacity: 0.5
        }} />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive">F</div>
          <Brain className="w-4 h-4 text-destructive" />
          <span className="font-display font-bold text-foreground text-sm">Final Combined Verdict</span>
        </div>

        {/* Weight table with visual bars */}
        <div className="space-y-2 mb-5">
          {layerScores.map((l, i) => (
            <div key={l.name} className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground w-20">{l.name}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `hsl(${l.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${l.score}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.8 }}
                />
              </div>
              <span className="font-mono-code tabular-nums w-8 text-right" style={{ color: scoreColor(l.score) }}>{l.score}</span>
              <span className="text-muted-foreground w-8 text-right font-semibold">{l.weight}%</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5 pt-4 border-t border-border">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
              <motion.circle cx="40" cy="40" r="34" fill="none" stroke={scoreColor(r.finalScore)} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - r.finalScore / 100) }}
                transition={{ delay: 0.5, duration: 1.5 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-display font-black tabular-nums" style={{ color: scoreColor(r.finalScore), textShadow: `0 0 20px ${scoreColor(r.finalScore)}40` }}>
              {r.finalScore}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">/100 Final Score</p>
            <span className={r.verdict === "PHISHING" ? "pill-danger" : "pill-safe"}>{r.verdict}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-primary flex items-center gap-2 text-xs" onClick={() => navigator.clipboard.writeText(`P-LENS Report: ${r.url} — Score: ${r.finalScore}/100 — Verdict: ${r.verdict}`)}>
            <Copy className="w-3 h-3" /> Copy Summary
          </button>
          <button className="btn-ghost text-xs flex items-center gap-2" onClick={() => navigate(-1)}>
            <X className="w-3 h-3" /> Close Report
          </button>
        </div>
      </motion.div>

      <p className="text-center text-[11px] text-muted-foreground py-4">P-LENS v2.0 — Sandbox Report generated at {r.timestamp}</p>
    </div>
  );
};

export default SandboxReport;
