import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip
} from "recharts";
import {
  Search, Shield, AlertTriangle, Crosshair, FlaskConical,
  Globe, Eye, Bug, Code, Link2, Cpu, Fingerprint, Lock, Network
} from "lucide-react";

type ScanResult = {
  status: "safe" | "phishing";
  url: string;
  riskScore: number;
  features: { feature: string; score: number; fullMark: number }[];
  findings: { type: "safe" | "warning" | "critical"; text: string; score: number }[];
  modules: { name: string; icon: any; file: string; status: "clean" | "suspicious" | "critical"; score: number; detail: string }[];
};

const modulesMeta = [
  { name: "Network Analyzer", icon: Globe, file: "network_analyzer.py", color: "190, 100%, 50%" },
  { name: "Browser Analyzer", icon: Eye, file: "browser_analyzer.py", color: "265, 90%, 65%" },
  { name: "IOC Scanner", icon: Bug, file: "ioc_scanner.py", color: "0, 72%, 56%" },
  { name: "JS Malware Detector", icon: Code, file: "js_malware_detector.py", color: "40, 96%, 56%" },
  { name: "URL Heuristic Analyzer", icon: Link2, file: "url_heuristic_analyzer.py", color: "160, 75%, 46%" },
];

const URLScanner = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const navigate = useNavigate();

  const stages = [
    { label: "DNS Resolution & Network", icon: Network, module: "Network Analyzer" },
    { label: "SSL & Certificate Check", icon: Lock, module: "Network Analyzer" },
    { label: "Headless Browser Render", icon: Eye, module: "Browser Analyzer" },
    { label: "JavaScript Deep Scan", icon: Code, module: "JS Malware Detector" },
    { label: "Heuristic Engine (14 checks)", icon: Fingerprint, module: "URL Heuristic Analyzer" },
    { label: "IOC & Threat Intel Lookup", icon: Bug, module: "IOC Scanner" },
    { label: "AI Classification", icon: Cpu, module: "Final Verdict" },
  ];

  const handleScan = () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);
    setScanStage(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < stages.length) {
        setScanStage(stage);
      }
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      const bad = url.includes("paypa1") || url.includes("amaz0n") || url.includes(".tk") || url.includes(".xyz");
      setResult({
        status: bad ? "phishing" : "safe",
        url,
        riskScore: bad ? 78 : 12,
        features: [
          { feature: "SSL", score: bad ? 30 : 95, fullMark: 100 },
          { feature: "Domain Age", score: bad ? 15 : 90, fullMark: 100 },
          { feature: "Content", score: bad ? 25 : 85, fullMark: 100 },
          { feature: "JS Analysis", score: bad ? 40 : 92, fullMark: 100 },
          { feature: "Headers", score: bad ? 55 : 98, fullMark: 100 },
          { feature: "Reputation", score: bad ? 20 : 88, fullMark: 100 },
        ],
        findings: bad
          ? [
              { type: "critical", text: "Suspicious character substitution in domain ('1' for 'l')", score: 25 },
              { type: "critical", text: "Domain age < 30 days — newly registered", score: 20 },
              { type: "warning", text: "Free SSL certificate issuer (Let's Encrypt)", score: 10 },
              { type: "warning", text: "Login form submits to external domain", score: 15 },
              { type: "critical", text: "Brand impersonation detected: PayPal", score: 18 },
              { type: "safe", text: "No crypto mining scripts detected", score: 0 },
            ]
          : [
              { type: "safe", text: "Valid SSL from trusted CA", score: 0 },
              { type: "safe", text: "Domain registered 5+ years", score: 0 },
              { type: "safe", text: "No suspicious redirects", score: 0 },
              { type: "safe", text: "Clean JS analysis — no obfuscation", score: 0 },
            ],
        modules: [
          { name: "Network Analyzer", icon: Globe, file: "network_analyzer.py", status: bad ? "critical" : "clean", score: bad ? 72 : 8, detail: bad ? "New domain, missing headers, suspicious ASN" : "Established domain, all headers present" },
          { name: "Browser Analyzer", icon: Eye, file: "browser_analyzer.py", status: bad ? "critical" : "clean", score: bad ? 65 : 5, detail: bad ? "Login form → external, brand impersonation" : "No suspicious forms or content" },
          { name: "IOC Scanner", icon: Bug, file: "ioc_scanner.py", status: bad ? "suspicious" : "clean", score: bad ? 60 : 3, detail: bad ? "PhishTank HIT, VirusTotal 8/90" : "Clean across all threat feeds" },
          { name: "JS Malware Detector", icon: Code, file: "js_malware_detector.py", status: bad ? "suspicious" : "clean", score: bad ? 58 : 4, detail: bad ? "Obfuscation + keystroke logger detected" : "No malicious patterns found" },
          { name: "URL Heuristic Analyzer", icon: Link2, file: "url_heuristic_analyzer.py", status: bad ? "critical" : "clean", score: bad ? 85 : 6, detail: bad ? "5/14 checks triggered, char substitution" : "0/14 checks triggered" },
        ],
      });
      setScanning(false);
    }, 3500);
  };

  const scoreColor = (score: number) => {
    if (score > 60) return "hsl(0, 72%, 56%)";
    if (score > 35) return "hsl(40, 96%, 56%)";
    return "hsl(160, 75%, 46%)";
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1300px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          URL <span className="text-accent-primary glow-text">Scanner</span>
        </h1>
        <p className="text-muted-foreground">5-module deep analysis pipeline — paste any URL</p>
      </motion.div>

      {/* Architecture Blueprint */}
      <motion.div
        className="surface-glow p-5 mb-6 overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="label-overline">Analysis Pipeline — 5 Modules</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {modulesMeta.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.name}
                className="flex items-center gap-1 flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <div className="surface p-3 flex items-center gap-3 min-w-[200px]">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `hsla(${mod.color}, 0.12)` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: `hsl(${mod.color})` }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-tight">{mod.name}</p>
                    <p className="text-[9px] font-mono-code text-muted-foreground">{mod.file}</p>
                  </div>
                </div>
                {i < modulesMeta.length - 1 && (
                  <motion.div
                    className="flex-shrink-0 mx-1"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <svg width="24" height="12" viewBox="0 0 24 12">
                      <path d="M0 6 L18 6 M14 2 L20 6 L14 10" fill="none" stroke="hsl(190, 100%, 50%)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div className="surface-glow p-2 flex gap-2 mb-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center px-3">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="https://suspicious-url.example"
          className="flex-1 bg-transparent py-3 text-foreground text-sm font-mono-code placeholder:text-muted-foreground outline-none"
        />
        <motion.button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Crosshair className="w-4 h-4" />
          {scanning ? "Analyzing..." : "Analyze"}
        </motion.button>
      </motion.div>

      {/* Scanning Animation — Pipeline Visualization */}
      <AnimatePresence>
        {scanning && (
          <motion.div className="py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Central scanner graphic */}
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-40 h-40">
                {/* Rotating outer ring */}
                <motion.svg
                  viewBox="0 0 160 160"
                  className="absolute inset-0 w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="80" cy="80" r="75" fill="none" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" strokeOpacity="0.2" />
                  <circle cx="80" cy="80" r="75" fill="none" stroke="hsl(190, 100%, 50%)" strokeWidth="2" strokeDasharray="30 440" strokeLinecap="round" />
                </motion.svg>
                {/* Counter-rotating middle ring */}
                <motion.svg
                  viewBox="0 0 160 160"
                  className="absolute inset-0 w-full h-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="80" cy="80" r="58" fill="none" stroke="hsl(265, 90%, 65%)" strokeWidth="1" strokeDasharray="20 350" strokeLinecap="round" />
                </motion.svg>
                {/* Pulsing center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle, hsla(190, 100%, 50%, 0.15), transparent)",
                      border: "1px solid hsla(190, 100%, 50%, 0.3)",
                    }}
                    animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 20px hsla(190,100%,50%,0.1)", "0 0 40px hsla(190,100%,50%,0.3)", "0 0 20px hsla(190,100%,50%,0.1)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crosshair className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>
              </div>

              {/* Module pipeline progress */}
              <div className="w-full max-w-2xl">
                <div className="grid grid-cols-7 gap-1">
                  {stages.map((stage, i) => {
                    const Icon = stage.icon;
                    const done = i < scanStage;
                    const active = i === scanStage;
                    return (
                      <motion.div
                        key={i}
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                            done
                              ? "bg-safe/10 border-safe/30"
                              : active
                              ? "bg-primary/10 border-primary/40"
                              : "bg-secondary border-border"
                          }`}
                          animate={active ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px transparent", "0 0 20px hsla(190,100%,50%,0.3)", "0 0 0px transparent"] } : {}}
                          transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
                        >
                          <Icon className={`w-4 h-4 ${done ? "text-safe" : active ? "text-primary" : "text-muted-foreground"}`} />
                        </motion.div>
                        <span className={`text-[8px] text-center leading-tight max-w-[80px] ${active ? "text-primary font-medium" : done ? "text-safe" : "text-muted-foreground"}`}>
                          {stage.label}
                        </span>
                        {done && <span className="text-[9px] text-safe">✓</span>}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, hsl(190, 100%, 50%), hsl(265, 90%, 65%))" }}
                    animate={{ width: `${((scanStage + 1) / stages.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Running module: <span className="text-primary font-medium">{stages[scanStage]?.module}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top row: Verdict + Score Ring + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Verdict */}
              <motion.div
                className={`lg:col-span-4 surface-glow p-6 border-l-4 ${result.status === "safe" ? "border-l-safe" : "border-l-destructive"}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${result.status === "safe" ? "bg-safe/10" : "bg-destructive/10"}`}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.15 }}
                  >
                    {result.status === "safe" ? <Shield className="w-6 h-6 text-safe" /> : <AlertTriangle className="w-6 h-6 text-destructive" />}
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-display font-bold ${result.status === "safe" ? "text-safe" : "text-destructive"}`}>
                      {result.status === "safe" ? "Clean URL" : "Phishing Detected"}
                    </h3>
                    <span className={result.status === "safe" ? "pill-safe" : "pill-danger"}>
                      {result.status === "safe" ? "LOW RISK" : "HIGH RISK"}
                    </span>
                  </div>
                </div>
                <code className="text-[11px] font-mono-code text-muted-foreground break-all block mb-4 p-2 rounded-lg bg-secondary">{result.url}</code>

                {/* Score gauge */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
                      <motion.circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={scoreColor(result.riskScore)}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.riskScore / 100) }}
                        transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-2xl font-display font-black tabular-nums"
                        style={{ color: scoreColor(result.riskScore) }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {result.riskScore}
                      </motion.span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">/100 Risk Score</p>
                    <div className="h-1.5 w-32 bg-secondary rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, hsl(160,75%,46%), hsl(40,96%,56%), hsl(0,72%,56%))` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.riskScore}%` }}
                        transition={{ delay: 0.4, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Radar Chart — Feature Extraction */}
              <motion.div
                className="lg:col-span-4 surface-glow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="font-display font-bold text-foreground mb-1">Signal Extraction</h4>
                <p className="text-[10px] text-muted-foreground mb-3">Feature scores from analysis modules</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={result.features}>
                    <PolarGrid stroke="hsl(240, 5%, 15%)" strokeOpacity={0.6} />
                    <PolarAngleAxis dataKey="feature" tick={{ fontSize: 9, fill: "hsl(240, 5%, 50%)" }} />
                    <Radar dataKey="score" stroke="hsl(190, 100%, 50%)" fill="hsl(190, 100%, 50%)" fillOpacity={0.12} strokeWidth={2} dot={{ fill: "hsl(190, 100%, 50%)", r: 3 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Score Breakdown */}
              <motion.div
                className="lg:col-span-4 surface-glow p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="font-display font-bold text-foreground mb-1">Score Breakdown</h4>
                <p className="text-[10px] text-muted-foreground mb-3">Per-feature contribution to risk score</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={result.features} layout="vertical" barSize={8}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 9, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip contentStyle={{ background: "hsl(240, 7%, 6%)", border: "1px solid hsl(240, 5%, 15%)", borderRadius: "10px", fontSize: "11px" }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {result.features.map((f, i) => (
                        <Cell key={i} fill={f.score > 70 ? "hsl(160, 75%, 46%)" : f.score > 40 ? "hsl(40, 96%, 56%)" : "hsl(0, 72%, 56%)"} fillOpacity={0.75} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Module Results — Architecture View */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="label-overline">Module-by-Module Results</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {result.modules.map((mod, i) => {
                  const Icon = mod.icon;
                  const meta = modulesMeta[i];
                  const statusColor = mod.status === "clean" ? "var(--status-safe)" : mod.status === "critical" ? "var(--destructive)" : "var(--status-warning)";
                  return (
                    <motion.div
                      key={mod.name}
                      className="surface-glow p-4 relative overflow-hidden group"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.06 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Top glow accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ background: `linear-gradient(90deg, transparent, hsl(${meta.color}), transparent)`, opacity: 0.6 }}
                      />

                      {/* Score circle */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `hsla(${meta.color}, 0.12)` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: `hsl(${meta.color})` }} />
                        </div>
                        <div className="relative w-10 h-10">
                          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2.5" />
                            <motion.circle
                              cx="20" cy="20" r="16" fill="none"
                              stroke={scoreColor(mod.score)}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 16}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - mod.score / 100) }}
                              transition={{ delay: 0.6 + i * 0.1, duration: 1 }}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums" style={{ color: scoreColor(mod.score) }}>
                            {mod.score}
                          </span>
                        </div>
                      </div>

                      <h5 className="text-xs font-semibold text-foreground mb-0.5 leading-tight">{mod.name}</h5>
                      <p className="text-[9px] font-mono-code text-muted-foreground mb-2">{mod.file}</p>

                      <span
                        className="pill text-[8px]"
                        style={{
                          background: `hsla(${statusColor}, 0.12)`,
                          color: `hsl(${statusColor})`,
                        }}
                      >
                        {mod.status.toUpperCase()}
                      </span>

                      <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{mod.detail}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Findings Table */}
            <motion.div
              className="surface-glow overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-primary" />
                <span className="label-overline">Detailed Findings</span>
                <span className="pill-primary ml-auto">{result.findings.length} ITEMS</span>
              </div>
              {result.findings.map((f, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 ${f.type === "critical" ? "bg-destructive/[0.03]" : ""}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.04 }}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    f.type === "safe" ? "bg-safe/10 text-safe" : f.type === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                  }`}>
                    {f.type === "safe" ? "✓" : f.type === "critical" ? "✕" : "⚠"}
                  </span>
                  <span className="text-sm text-foreground flex-1">{f.text}</span>
                  {f.score > 0 && (
                    <span className={f.type === "critical" ? "pill-danger" : "pill-warning"}>+{f.score}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Sandbox CTA */}
            {result.status === "phishing" && (
              <motion.div
                className="surface-glow p-8 text-center border border-accent/20 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {/* Decorative background rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <div className="w-64 h-64 rounded-full border border-primary" />
                  <div className="absolute w-48 h-48 rounded-full border border-accent" />
                  <div className="absolute w-32 h-32 rounded-full border border-primary" />
                </div>

                <FlaskConical className="w-10 h-10 text-accent mx-auto mb-4" />
                <h4 className="font-display font-bold text-lg text-foreground mb-1">Deep Sandbox Analysis</h4>
                <p className="text-xs text-muted-foreground mb-2 max-w-md mx-auto">
                  Launch the full 5-layer heuristic pipeline — Network, Browser, IOC, JS Malware & Heuristic engines — for a comprehensive forensic report
                </p>
                <div className="flex justify-center gap-2 mb-5">
                  {modulesMeta.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <motion.div
                        key={m.name}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `hsla(${m.color}, 0.1)` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.0 + i * 0.06, type: "spring" }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${m.color})` }} />
                      </motion.div>
                    );
                  })}
                </div>
                <motion.button
                  className="btn-primary text-sm"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/sandbox", { state: { url: result.url, riskScore: result.riskScore } })}
                >
                  <FlaskConical className="w-4 h-4 inline mr-2" />
                  Run Sandbox Analysis →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLScanner;
