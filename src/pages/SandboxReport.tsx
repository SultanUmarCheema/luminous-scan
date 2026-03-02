import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { FlaskConical, Shield, Globe, Code, Link2, Bug, Brain, Copy, X, ChevronDown, ChevronUp } from "lucide-react";

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

const severityColor = (s: string) => {
  if (s === "CRITICAL") return "text-destructive bg-destructive/10";
  if (s === "HIGH") return "text-warning bg-warning/10";
  if (s === "MEDIUM") return "text-yellow-400 bg-yellow-400/10";
  return "text-muted-foreground bg-muted";
};

const SectionCard = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      className="surface-glow overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 border-b border-border hover:bg-secondary/20 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{id}</div>
        <Icon className="w-4 h-4 text-primary" />
        <span className="label-overline flex-1 text-left">{title}</span>
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
  <div className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${danger ? "bg-destructive/[0.04] border border-destructive/10" : ""}`}>
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-mono-code text-xs ${danger ? "text-destructive" : "text-foreground"}`}>{value}</span>
  </div>
);

const SandboxReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const r = mockReport;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const layerScores = [
    { name: "Network", score: r.sections.network.score, weight: r.sections.network.weight },
    { name: "Page/Browser", score: r.sections.page.score, weight: r.sections.page.weight },
    { name: "JS Malware", score: r.sections.jsAnalysis.score, weight: r.sections.jsAnalysis.weight },
    { name: "URL Heuristics", score: r.sections.urlHeuristic.score, weight: r.sections.urlHeuristic.weight },
    { name: "IOC/Threat Intel", score: r.sections.ioc.score, weight: r.sections.ioc.weight },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
          <FlaskConical className="w-16 h-16 text-accent" />
        </motion.div>
        <div className="w-full max-w-md space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Running 5-layer pipeline...</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(190, 100%, 50%), hsl(265, 90%, 65%))" }}
              animate={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1100px] mx-auto space-y-5">
      {/* Header */}
      <motion.div
        className={`surface-glow p-6 border-l-4 ${r.verdict === "PHISHING" ? "border-l-destructive" : "border-l-safe"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-accent" />
              <span className="label-overline">Sandbox Analysis Report</span>
            </div>
            <code className="text-sm font-mono-code text-accent block mb-1">{r.url}</code>
            <p className="text-[11px] text-muted-foreground">{r.timestamp} • Engine: 5-layer heuristic pipeline</p>
          </div>
          <div className="text-right">
            <motion.div
              className="text-6xl font-display font-black text-destructive tabular-nums"
              style={{ textShadow: "0 0 40px hsla(0, 72%, 56%, 0.4)" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {r.finalScore}
            </motion.div>
            <p className="text-sm text-muted-foreground">/100</p>
            <span className="pill-danger mt-1 inline-block">{r.verdict}</span>
          </div>
        </div>
      </motion.div>

      {/* Section A - Network */}
      <SectionCard id="A" title="Network & Transport Analysis" icon={Globe}>
        <div className="space-y-2">
          <TableRow label="IP Address" value={r.sections.network.data.ip} />
          <TableRow label="ASN" value={r.sections.network.data.asn} />
          <TableRow label="Country" value={r.sections.network.data.country} />
          <TableRow label="Domain Age" value={<><span>{r.sections.network.data.domainAge}</span> <span className="pill-danger ml-2">NEW</span></>} danger />
          <TableRow label="SSL Valid" value={r.sections.network.data.ssl.valid ? "✔ Yes" : "✘ No"} />
          <TableRow label="SSL Issuer" value={r.sections.network.data.ssl.issuer} />
          <TableRow label="Redirect Chain" value={r.sections.network.data.redirectChain.join(" → ")} />
        </div>
        <div className="mt-3">
          <span className="label-overline mb-2 block">Security Headers</span>
          <div className="grid grid-cols-2 gap-2">
            {r.sections.network.data.headers.map((h) => (
              <div key={h.name} className="flex items-center gap-2 text-xs">
                <span className={h.present ? "text-safe" : "text-destructive"}>{h.present ? "✔" : "✘"}</span>
                <span className="text-muted-foreground">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
        {r.sections.network.flags.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-destructive bg-destructive/[0.05] border border-destructive/10 rounded-lg px-3 py-2">
            <span>⚠</span> {f}
          </div>
        ))}
      </SectionCard>

      {/* Section B - Page */}
      <SectionCard id="B" title="Page & Browser Analysis" icon={Shield}>
        <div className="space-y-2">
          <TableRow label="Page Title" value={r.sections.page.data.title} />
          <TableRow label="Login Form" value={r.sections.page.data.loginForm ? "⚠ YES" : "✔ NO"} danger={r.sections.page.data.loginForm} />
          <TableRow label="Password Field" value={r.sections.page.data.passwordField ? "⚠ YES" : "✔ NO"} danger={r.sections.page.data.passwordField} />
          <TableRow label="Brand Impersonation" value={r.sections.page.data.brandImpersonation} danger />
          <TableRow label="Form → External Domain" value={r.sections.page.data.externalFormAction ? "⚠ CRITICAL" : "✔ NO"} danger={r.sections.page.data.externalFormAction} />
          <TableRow label="Cross-Origin iFrames" value={String(r.sections.page.data.crossOriginIframes)} />
          <TableRow label="External Scripts" value={String(r.sections.page.data.externalScripts)} />
        </div>
        {r.sections.page.flags.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-destructive bg-destructive/[0.05] border border-destructive/10 rounded-lg px-3 py-2">
            <span>⚠</span> {f}
          </div>
        ))}
      </SectionCard>

      {/* Section C - JS Malware */}
      <SectionCard id="C" title="JavaScript Malware Detection" icon={Code}>
        <div className="space-y-1">
          {r.sections.jsAnalysis.categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors">
              <span className="text-foreground flex-1">{cat.name}</span>
              <span className={cat.status === "detected" ? "text-destructive text-xs" : "text-safe text-xs"}>
                {cat.status === "detected" ? `⚠ DETECTED (${cat.rules})` : "✔ CLEAN"}
              </span>
              <span className={`pill text-[9px] ${severityColor(cat.severity)}`}>{cat.severity}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section D - URL Heuristics */}
      <SectionCard id="D" title="URL Phishing Heuristic Analysis" icon={Link2}>
        <div className="space-y-1">
          {r.sections.urlHeuristic.checks.map((check) => (
            <div key={check.name} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors">
              <span className="text-foreground flex-1">{check.name}</span>
              <span className={`pill text-[9px] ${severityColor(check.severity)}`}>{check.severity}</span>
              <span className="pill-danger text-[9px]">+{check.points}</span>
              <span className="text-[11px] text-muted-foreground max-w-[200px] truncate">{check.detail}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section E - IOC */}
      <SectionCard id="E" title="IOC & Cyber Threat Intelligence" icon={Bug}>
        <span className="label-overline mb-2 block">Threat Feed Lookup</span>
        <div className="space-y-1 mb-4">
          {r.sections.ioc.threatFeeds.map((f) => (
            <div key={f.source} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors">
              <span className="text-foreground flex-1">{f.source}</span>
              <span className={f.status === "hit" ? "pill-danger text-[9px]" : "pill-safe text-[9px]"}>
                {f.status === "hit" ? "HIT" : "CLEAN"}
              </span>
              <span className="text-[11px] text-muted-foreground">{f.detail}</span>
            </div>
          ))}
        </div>

        <span className="label-overline mb-2 block">IOC Extracted</span>
        <div className="space-y-1 mb-4">
          {r.sections.ioc.iocs.map((ioc) => (
            <div key={ioc.type} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-secondary/20">
              <span className="text-foreground flex-1">{ioc.type}</span>
              <span className="pill-primary text-[9px]">{ioc.count}</span>
              <span className="text-[11px] text-muted-foreground font-mono-code">{ioc.samples}</span>
            </div>
          ))}
        </div>

        <span className="label-overline mb-2 block">DGA Detection</span>
        <TableRow label="Verdict" value={r.sections.ioc.dgaVerdict} danger={r.sections.ioc.dgaVerdict !== "Clean"} />
        <TableRow label="DGA Score" value={r.sections.ioc.dgaScore.toFixed(2)} />
      </SectionCard>

      {/* Section F - Final Verdict */}
      <motion.div
        className="surface-glow p-6 border border-destructive/20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive">F</div>
          <Brain className="w-4 h-4 text-destructive" />
          <span className="label-overline">Final Combined Verdict</span>
        </div>

        <div className="space-y-1 mb-4">
          {layerScores.map((l) => (
            <div key={l.name} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg">
              <span className="text-foreground flex-1">{l.name}</span>
              <span className={`font-mono-code text-xs tabular-nums ${l.score > 60 ? "text-destructive" : l.score > 40 ? "text-warning" : "text-safe"}`}>
                {l.score}/100
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold">{l.weight}%</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div
            className="text-5xl font-display font-black text-destructive tabular-nums"
            style={{ textShadow: "0 0 30px hsla(0, 72%, 56%, 0.4)" }}
          >
            {r.finalScore}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">/100 Final Score</p>
            <span className="pill-danger">{r.verdict}</span>
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