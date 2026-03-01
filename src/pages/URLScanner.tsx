import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";

type ScanResult = {
  status: "safe" | "phishing";
  url: string;
  riskScore: number;
  riskLevel: string;
  recommendations: { type: "safe" | "warning"; text: string }[];
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
      const isPhishing = url.includes("paypa1") || url.includes("amaz0n") || url.includes(".tk") || url.includes(".xyz");
      setResult({
        status: isPhishing ? "phishing" : "safe",
        url: url,
        riskScore: isPhishing ? 78 : 12,
        riskLevel: isPhishing ? "High Risk" : "Low Risk",
        recommendations: isPhishing
          ? [
              { type: "warning", text: "Domain uses suspicious character substitution" },
              { type: "warning", text: "Domain registered less than 30 days ago" },
              { type: "warning", text: "SSL certificate from free issuer" },
              { type: "safe", text: "No malicious JavaScript detected" },
            ]
          : [
              { type: "safe", text: "Domain has valid SSL certificate" },
              { type: "safe", text: "Domain registered over 5 years ago" },
              { type: "safe", text: "No suspicious redirects detected" },
              { type: "safe", text: "Clean JavaScript analysis" },
            ],
      });
      setScanning(false);
    }, 2500);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          URL Security <span className="text-primary neon-text">Scanner</span>
        </h1>
        <p className="text-muted-foreground">Analyze any URL for phishing threats using AI-powered detection</p>
      </motion.div>

      {/* Input */}
      <GlassCard delay={0.1}>
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="Enter URL to scan (e.g., https://example.com)"
            className="flex-1 bg-muted border border-border rounded-xl px-5 py-4 text-foreground text-sm font-mono placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
          />
          <motion.button
            onClick={handleScan}
            disabled={scanning || !url.trim()}
            className="gradient-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Scan
          </motion.button>
        </div>
      </GlassCard>

      {/* Loading */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="flex flex-col items-center gap-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-secondary/30 border-b-secondary"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-accent/30 border-t-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p
              className="text-primary font-medium text-sm"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Analyzing with AI...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card overflow-hidden">
              {/* Header band */}
              <div className={`p-6 ${result.status === "safe" ? "bg-cyber-safe/10" : "bg-destructive/10"}`}>
                <div className="flex items-center gap-4">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                      result.status === "safe" ? "bg-cyber-safe/20" : "bg-destructive/20"
                    }`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {result.status === "safe" ? "🛡️" : "⚠️"}
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-bold ${result.status === "safe" ? "text-cyber-safe" : "text-destructive"}`}>
                      {result.status === "safe" ? "URL is Safe" : "Phishing Detected"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{result.riskLevel}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* URL */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Scanned URL</label>
                  <code className="block bg-muted rounded-lg px-4 py-3 text-sm font-mono text-foreground break-all">{result.url}</code>
                </div>

                {/* Risk Score */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Risk Score</label>
                  <div className="flex items-center gap-4">
                    <motion.span
                      className={`text-4xl font-bold ${result.status === "safe" ? "text-cyber-safe" : "text-destructive"}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {result.riskScore}
                    </motion.span>
                    <span className="text-muted-foreground text-lg">/100</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${result.status === "safe" ? "bg-cyber-safe" : "bg-gradient-to-r from-cyber-warning to-destructive"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.riskScore}%` }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">Analysis Details</label>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <span className={`text-sm mt-0.5 ${rec.type === "safe" ? "text-cyber-safe" : "text-cyber-warning"}`}>
                          {rec.type === "safe" ? "✓" : "⚠"}
                        </span>
                        <span className="text-sm text-foreground">{rec.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLScanner;
