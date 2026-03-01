import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const history = [
  { url: "https://login-secure.example.com", status: "safe", time: "Today 14:32", score: 8 },
  { url: "https://paypa1-update.xyz/account", status: "phishing", time: "Today 14:28", score: 82 },
  { url: "https://google.com", status: "safe", time: "Today 13:15", score: 3 },
  { url: "https://amaz0n-deals.tk/offer", status: "phishing", time: "Today 12:40", score: 91 },
  { url: "https://github.com/repo", status: "safe", time: "Yesterday 18:22", score: 5 },
  { url: "https://micr0soft-verify.ml", status: "phishing", time: "Yesterday 16:10", score: 88 },
];

const ScanHistory = () => (
  <div className="p-8 space-y-8 max-w-5xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Scan <span className="text-primary neon-text">History</span>
        </h1>
        <p className="text-muted-foreground">{history.length} scans recorded</p>
      </div>
      <motion.button
        className="px-4 py-2 rounded-xl text-sm font-medium bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25 transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Clear History
      </motion.button>
    </motion.div>

    <div className="space-y-4">
      {history.map((item, i) => (
        <GlassCard key={i} hover3d delay={0.1 + i * 0.05}>
          <div className="flex items-center gap-4">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              item.status === "safe" ? "bg-cyber-safe/15" : "bg-destructive/15"
            }`}>
              {item.status === "safe" ? "✅" : "🚨"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-foreground truncate">{item.url}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${item.status === "safe" ? "text-cyber-safe" : "text-destructive"}`}>
                {item.score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              item.status === "safe" ? "bg-cyber-safe/15 text-cyber-safe" : "bg-destructive/15 text-destructive"
            }`}>
              {item.status}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

export default ScanHistory;
