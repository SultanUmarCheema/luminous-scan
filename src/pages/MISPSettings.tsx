import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const MISPSettings = () => (
  <div className="p-8 space-y-8 max-w-3xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        MISP <span className="text-primary neon-text">Settings</span>
      </h1>
      <p className="text-muted-foreground">Configure your MISP threat intelligence connection</p>
    </motion.div>

    <GlassCard delay={0.1}>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 rounded-full bg-cyber-safe animate-pulse" />
        <span className="text-sm text-cyber-safe font-medium">Connected to MISP Instance</span>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">MISP Server URL</label>
          <input
            type="text"
            defaultValue="https://misp.example.org"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">API Key</label>
          <input
            type="password"
            defaultValue="••••••••••••••••"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        <motion.button
          className="gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Save Configuration
        </motion.button>
      </div>
    </GlassCard>
  </div>
);

export default MISPSettings;
