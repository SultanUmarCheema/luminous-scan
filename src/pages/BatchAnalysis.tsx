import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Crosshair, Shield, AlertTriangle, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

type BatchResult = { url: string; status: "safe" | "phishing"; score: number };

const BatchAnalysis = () => {
  const [text, setText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);

  const handleAnalyze = () => {
    const urls = text.split("\n").map(u => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setScanning(true);
    setResults([]);
    setTimeout(() => {
      setResults(urls.map((url) => {
        const bad = url.includes("paypa1") || url.includes("amaz0n") || url.includes(".tk") || url.includes(".xyz");
        return { url, status: bad ? "phishing" : "safe", score: bad ? Math.floor(60 + Math.random() * 35) : Math.floor(3 + Math.random() * 20) };
      }));
      setScanning(false);
    }, 2000);
  };

  const chartData = results.map((r) => ({ name: r.url.replace(/https?:\/\//, "").slice(0, 20), score: r.score }));

  return (
    <div className="p-6 lg:p-10 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Batch <span className="text-accent-secondary glow-text-accent">Analysis</span>
        </h1>
        <p className="text-muted-foreground">Paste multiple URLs — one per line — for parallel scanning</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <motion.div className="surface-glow p-6 space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-accent" />
            <span className="label-overline">URL List</span>
          </div>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"https://example1.com\nhttps://paypa1-login.xyz\nhttps://google.com\nhttps://suspicious.tk/offer"}
            className="w-full bg-secondary rounded-xl px-5 py-4 text-foreground text-sm font-mono-code placeholder:text-muted-foreground outline-none resize-none border border-border focus:border-primary/30 transition-colors"
          />
          <motion.button
            className="btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAnalyze}
            disabled={scanning}
          >
            <Crosshair className="w-4 h-4" />
            {scanning ? "Scanning..." : "Analyze All"}
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="surface-glow p-4 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">{results.length}</p>
                  <p className="label-overline text-[9px]">TOTAL</p>
                </div>
                <div className="surface-glow p-4 text-center">
                  <p className="text-2xl font-display font-bold text-safe">{results.filter(r => r.status === "safe").length}</p>
                  <p className="label-overline text-[9px]">SAFE</p>
                </div>
                <div className="surface-glow p-4 text-center">
                  <p className="text-2xl font-display font-bold text-destructive">{results.filter(r => r.status === "phishing").length}</p>
                  <p className="label-overline text-[9px]">THREATS</p>
                </div>
              </div>

              {/* Chart */}
              <div className="surface-glow p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="label-overline">Risk Scores</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} barSize={12}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(240, 5%, 42%)" }} axisLine={false} tickLine={false} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.score > 50 ? "hsl(0, 72%, 56%)" : "hsl(160, 75%, 46%)"} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results List */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div className="mt-6 surface-glow overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <span className="label-overline">Results</span>
            </div>
            {results.map((r, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors ${r.status === "phishing" ? "bg-destructive/[0.02]" : ""}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {r.status === "safe" ? <Shield className="w-4 h-4 text-safe" /> : <AlertTriangle className="w-4 h-4 text-destructive" />}
                <span className="font-mono-code text-xs text-foreground truncate flex-1">{r.url}</span>
                <span className={`text-xs font-semibold tabular-nums ${r.status === "safe" ? "text-safe" : "text-destructive"}`}>{r.score}</span>
                <span className={r.status === "safe" ? "pill-safe" : "pill-danger"}>
                  {r.status === "safe" ? "CLEAN" : "THREAT"}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatchAnalysis;