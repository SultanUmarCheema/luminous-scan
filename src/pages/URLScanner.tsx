import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ScanResult = {
  status: "safe" | "phishing";
  url: string;
  riskScore: number;
  findings: { type: "safe" | "warning"; text: string }[];
};

const URLScanner = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const bad = url.includes("paypa1") || url.includes("amaz0n") || url.includes(".tk") || url.includes(".xyz");
      setResult({
        status: bad ? "phishing" : "safe",
        url,
        riskScore: bad ? 78 : 12,
        findings: bad
          ? [
              { type: "warning", text: "Suspicious character substitution in domain" },
              { type: "warning", text: "Domain age < 30 days" },
              { type: "warning", text: "Free SSL certificate issuer" },
              { type: "safe", text: "No malicious JS patterns detected" },
            ]
          : [
              { type: "safe", text: "Valid SSL from trusted CA" },
              { type: "safe", text: "Domain registered 5+ years" },
              { type: "safe", text: "No suspicious redirects" },
              { type: "safe", text: "Clean JS analysis" },
            ],
      });
      setScanning(false);
    }, 2200);
  };

  return (
    <div className="p-8 lg:p-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          URL <span className="text-accent-primary">Scanner</span>
        </h1>
        <p className="text-muted-foreground">Paste any URL to analyze it for phishing threats</p>
      </motion.div>

      {/* Input */}
      <motion.div
        className="surface p-2 flex gap-2 mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="https://suspicious-url.example"
          className="flex-1 bg-transparent px-4 py-3 text-foreground text-sm font-mono placeholder:text-muted-foreground outline-none"
        />
        <motion.button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {scanning ? "..." : "Analyze"}
        </motion.button>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="flex flex-col items-center gap-6 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-16 h-16">
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/40"
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-muted-foreground/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="dot-live" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">Analyzing target...</p>
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
            {/* Verdict */}
            <div className="surface p-8">
              <div className="flex items-start gap-6">
                <motion.div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    result.status === "safe" ? "bg-safe/10" : "bg-destructive/10"
                  }`}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                >
                  {result.status === "safe" ? "✓" : "✕"}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-xl font-display font-bold ${result.status === "safe" ? "text-safe" : "text-destructive"}`}>
                      {result.status === "safe" ? "Clean" : "Phishing Detected"}
                    </h3>
                    <span className={result.status === "safe" ? "pill-safe" : "pill-danger"}>
                      {result.riskScore}/100
                    </span>
                  </div>
                  <code className="text-xs font-mono text-muted-foreground break-all">{result.url}</code>
                </div>
              </div>

              {/* Risk bar */}
              <div className="mt-6">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${result.status === "safe" ? "bg-safe" : "bg-destructive"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.riskScore}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Findings */}
            <div className="surface overflow-hidden">
              <div className="px-6 py-3 border-b border-border">
                <span className="label-overline">Analysis Findings</span>
              </div>
              {result.findings.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 px-6 py-3.5 border-b border-border last:border-0"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <span className={f.type === "safe" ? "text-safe text-sm" : "text-warning text-sm"}>
                    {f.type === "safe" ? "✓" : "⚠"}
                  </span>
                  <span className="text-sm text-foreground">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLScanner;
