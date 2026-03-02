import { motion } from "framer-motion";
import { Clock, Shield, AlertTriangle, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const history = [
  { url: "login-secure.example.com", status: "safe" as const, time: "14:32", score: 8 },
  { url: "paypa1-update.xyz/account", status: "danger" as const, time: "14:28", score: 82 },
  { url: "google.com", status: "safe" as const, time: "13:15", score: 3 },
  { url: "amaz0n-deals.tk/offer", status: "danger" as const, time: "12:40", score: 91 },
  { url: "github.com/repo", status: "safe" as const, time: "Yesterday", score: 5 },
  { url: "micr0soft-verify.ml", status: "danger" as const, time: "Yesterday", score: 88 },
];

const safeCount = history.filter(h => h.status === "safe").length;
const dangerCount = history.filter(h => h.status === "danger").length;
const pieData = [
  { name: "Safe", value: safeCount, color: "hsl(160, 75%, 46%)" },
  { name: "Threats", value: dangerCount, color: "hsl(0, 72%, 56%)" },
];

const ScanHistory = () => (
  <div className="p-6 lg:p-10 max-w-[1100px] mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8">
      <div>
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Scan <span className="text-accent-primary glow-text">History</span>
        </h1>
        <p className="text-muted-foreground">{history.length} records</p>
      </div>
      <button className="btn-ghost text-xs text-destructive border-destructive/20 hover:border-destructive/40 hover:text-destructive flex items-center gap-1">
        <Trash2 className="w-3 h-3" /> Clear All
      </button>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Stats sidebar */}
      <motion.div className="space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <div className="surface-glow p-5">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={48} paddingAngle={4} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-[10px] text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-glow p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="label-overline text-[9px]">AVG SCORE</span>
            <span className="text-lg font-display font-bold text-foreground tabular-nums">
              {Math.round(history.reduce((a, h) => a + h.score, 0) / history.length)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="label-overline text-[9px]">HIGHEST</span>
            <span className="text-lg font-display font-bold text-destructive tabular-nums">
              {Math.max(...history.map(h => h.score))}
            </span>
          </div>
        </div>
      </motion.div>

      {/* History List */}
      <div className="lg:col-span-3 surface-glow overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="label-overline">Scan Records</span>
        </div>
        {history.map((item, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer ${item.status === "danger" ? "bg-destructive/[0.02]" : ""}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            {item.status === "safe" ? <Shield className="w-4 h-4 text-safe" /> : <AlertTriangle className="w-4 h-4 text-destructive" />}
            <p className="font-mono-code text-xs text-foreground truncate flex-1">{item.url}</p>
            <span className="text-[11px] text-muted-foreground tabular-nums w-16 text-right font-mono-code">{item.time}</span>
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
  </div>
);

export default ScanHistory;