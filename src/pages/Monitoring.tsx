import { motion } from "framer-motion";

const Monitoring = () => (
  <div className="p-8 lg:p-12 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
        Real-time <span className="text-accent-primary">Monitor</span>
      </h1>
      <p className="text-muted-foreground">Passive clipboard & screen URL monitoring</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[
        { label: "Screen Monitor", desc: "Detect URLs displayed on screen", active: false },
        { label: "Clipboard Monitor", desc: "Auto-scan copied URLs", active: true },
      ].map((m, i) => (
        <motion.div
          key={m.label}
          className="surface-interactive p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">{m.label}</h3>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${m.active ? "bg-primary/30" : "bg-secondary"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${m.active ? "right-0.5 bg-primary" : "left-0.5 bg-muted-foreground"}`} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{m.desc}</p>
          {m.active && <p className="text-xs text-accent-primary mt-2">● Active</p>}
        </motion.div>
      ))}
    </div>

    <motion.div
      className="surface p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-muted-foreground text-sm">No threats detected this session</p>
    </motion.div>
  </div>
);

export default Monitoring;
