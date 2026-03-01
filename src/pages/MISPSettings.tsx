import { motion } from "framer-motion";

const MISPSettings = () => (
  <div className="p-8 lg:p-12 max-w-2xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
        MISP <span className="text-accent-primary">Config</span>
      </h1>
      <p className="text-muted-foreground">Threat intelligence platform connection</p>
    </motion.div>

    <motion.div
      className="surface p-8 space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2">
        <span className="dot-live" />
        <span className="text-sm text-accent-primary font-medium">Connected</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label-overline block mb-2">Server URL</label>
          <input
            type="text"
            defaultValue="https://misp.example.org"
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono outline-none focus:border-primary/30 transition-colors"
          />
        </div>
        <div>
          <label className="label-overline block mb-2">API Key</label>
          <input
            type="password"
            defaultValue="••••••••••••"
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono outline-none focus:border-primary/30 transition-colors"
          />
        </div>
      </div>

      <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        Save Configuration
      </motion.button>
    </motion.div>
  </div>
);

export default MISPSettings;
