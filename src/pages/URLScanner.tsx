import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { Search, Shield, AlertTriangle, Crosshair, FlaskConical } from "lucide-react";

type ScanResult = {
  status: "safe" | "phishing";
  url: string;
  riskScore: number;
  features: { feature: string; score: number; fullMark: number }[];
  findings: { type: "safe" | "warning" | "critical"; text: string; score: number }[];
};

const URLScanner = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const navigate = useNavigate();

  const stages = ["Resolving DNS...", "Checking SSL Certificate...", "Analyzing Page Content...", "Running AI Model...", "Querying Threat Intel..."];

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
    }, 500);

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
              { type: "critical", text: "Suspicious character substitution in domain", score: 25 },
              { type: "critical", text: "Domain age < 30 days", score: 20 },
              { type: "warning", text: "Free SSL certificate issuer (Let's Encrypt)", score: 10 },
              { type: "warning", text: "Login form submits to external domain", score: 15 },
              { type: "safe", text: "No crypto mining scripts detected", score: 0 },
            ]
          : [
              { type: "safe", text: "Valid SSL from trusted CA", score: 0 },
              { type: "safe", text: "Domain registered 5+ years", score: 0 },
              { type: "safe", text: "No suspicious redirects", score: 0 },
              { type: "safe", text: "Clean JS analysis — no obfuscation", score: 0 },
            ],
      });
      setScanning(false);
    }, 2800);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          URL <span className="text-accent-primary glow-text">Scanner</span>
        </h1>
        <p className="text-muted-foreground">Paste any URL for multi-layer phishing analysis</p>
      </motion.div>

      {/* Input */}
      <motion.div className="surface-glow p-2 flex gap-2 mb-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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

      {/* Scanning Animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div className="flex flex-col items-center gap-6 py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Animated scanner rings */}
            <div className="relative w-32 h-32">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border border-accent/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border border-primary/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Crosshair className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            </div>

            {/* Stage progress */}
            <div className="space-y-3 w-80">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i <= scanStage ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`w-2 h-2 rounded-full ${i < scanStage ? "bg-safe" : i === scanStage ? "dot-live" : "bg-muted"}`} />
                  <span className={`text-xs font-mono-code ${i <= scanStage ? "text-foreground" : "text-muted-foreground"}`}>{stage}</span>
                  {i < scanStage && <span className="text-[10px] text-safe ml-auto">✓</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Verdict + Radar side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Verdict Card */}
              <div className={`surface-glow p-6 border-l-4 ${result.status === "safe" ? "border-l-safe" : "border-l-destructive"}`}>
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${result.status === "safe" ? "bg-safe/10" : "bg-destructive/10"}`}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                  >
                    {result.status === "safe" ? <Shield className="w-7 h-7 text-safe" /> : <AlertTriangle className="w-7 h-7 text-destructive" />}
                  </motion.div>
                  <div>
                    <h3 className={`text-2xl font-display font-bold ${result.status === "safe" ? "text-safe" : "text-destructive"}`}>
                      {result.status === "safe" ? "Clean URL" : "Phishing Detected"}
                    </h3>
                    <code className="text-xs font-mono-code text-muted-foreground break-all block mt-1">{result.url}</code>
                  </div>
                </div>

                {/* Risk Score Gauge */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className={`text-6xl font-display font-black tabular-nums ${result.status === "safe" ? "text-safe" : "text-destructive"}`}
                    style={{ textShadow: `0 0 30px ${result.status === "safe" ? "hsla(160, 75%, 46%, 0.4)" : "hsla(0, 72%, 56%, 0.4)"}` }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {result.riskScore}
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">/100 Risk</p>
                    <span className={result.status === "safe" ? "pill-safe" : "pill-danger"}>
                      {result.status === "safe" ? "LOW RISK" : "HIGH RISK"}
                    </span>
                  </div>
                </div>

                {/* Risk Bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(160, 75%, 46%), hsl(40, 96%, 56%), hsl(0, 72%, 56%))`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.riskScore}%` }}
                    transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Radar Chart — Feature Extraction */}
              <div className="surface-glow p-6">
                <h4 className="font-display font-bold text-foreground mb-2">Feature Extraction</h4>
                <p className="text-[11px] text-muted-foreground mb-3">Analysis signals that determined the verdict</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={result.features}>
                    <PolarGrid stroke="hsl(240, 5%, 15%)" />
                    <PolarAngleAxis dataKey="feature" tick={{ fontSize: 10, fill: "hsl(240, 5%, 50%)" }} />
                    <Radar dataKey="score" stroke="hsl(190, 100%, 50%)" fill="hsl(190, 100%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Findings + Score Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Findings */}
              <div className="lg:col-span-2 surface-glow overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <span className="label-overline">Analysis Findings</span>
                </div>
                {result.findings.map((f, i) => (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 ${f.type === "critical" ? "bg-destructive/[0.03]" : ""}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                  >
                    <span className={`text-sm ${f.type === "safe" ? "text-safe" : f.type === "critical" ? "text-destructive" : "text-warning"}`}>
                      {f.type === "safe" ? "✓" : f.type === "critical" ? "✕" : "⚠"}
                    </span>
                    <span className="text-sm text-foreground flex-1">{f.text}</span>
                    {f.score > 0 && (
                      <span className={f.type === "critical" ? "pill-danger" : "pill-warning"}>+{f.score}</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Score Breakdown Bar */}
              <div className="surface-glow p-6">
                <h4 className="font-display font-bold text-foreground mb-3">Score Breakdown</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={result.features} layout="vertical" barSize={6}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} width={55} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {result.features.map((f, i) => (
                        <Cell key={i} fill={f.score > 70 ? "hsl(160, 75%, 46%)" : f.score > 40 ? "hsl(40, 96%, 56%)" : "hsl(0, 72%, 56%)"} fillOpacity={0.7} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sandbox Button */}
            {result.status === "phishing" && (
              <motion.div
                className="surface-glow p-6 text-center border border-accent/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <FlaskConical className="w-8 h-8 text-accent mx-auto mb-3" />
                <h4 className="font-display font-bold text-foreground mb-1">Deep Sandbox Analysis Available</h4>
                <p className="text-xs text-muted-foreground mb-4">Run this URL through our 5-layer heuristic pipeline for a comprehensive report</p>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/sandbox", { state: { url: result.url, riskScore: result.riskScore } })}
                >
                  <FlaskConical className="w-4 h-4 inline mr-2" />
                  Run Sandbox Analysis
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