import { motion } from "framer-motion";

const history = [
  { url: "login-secure.example.com", status: "safe" as const, time: "14:32", score: 8 },
  { url: "paypa1-update.xyz/account", status: "danger" as const, time: "14:28", score: 82 },
  { url: "google.com", status: "safe" as const, time: "13:15", score: 3 },
  { url: "amaz0n-deals.tk/offer", status: "danger" as const, time: "12:40", score: 91 },
  { url: "github.com/repo", status: "safe" as const, time: "Yesterday", score: 5 },
  { url: "micr0soft-verify.ml", status: "danger" as const, time: "Yesterday", score: 88 },
];

const ScanHistory = () => (
  <div className="p-8 lg:p-12 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-10">
      <div>
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Scan <span className="text-accent-primary">History</span>
        </h1>
        <p className="text-muted-foreground">{history.length} records</p>
      </div>
      <button className="btn-ghost text-xs text-destructive border-destructive/20 hover:border-destructive/40 hover:text-destructive">
        Clear All
      </button>
    </motion.div>

    <div className="surface overflow-hidden">
      {history.map((item, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <span className={item.status === "safe" ? "dot-safe" : "dot-danger"} />
          <p className="font-mono text-sm text-foreground truncate flex-1">{item.url}</p>
          <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">{item.time}</span>
          <span className={`text-sm font-semibold tabular-nums w-10 text-right ${item.status === "safe" ? "text-safe" : "text-destructive"}`}>
            {item.score}
          </span>
          <span className={item.status === "safe" ? "pill-safe" : "pill-danger"}>
            {item.status === "safe" ? "CLEAN" : "THREAT"}
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ScanHistory;
