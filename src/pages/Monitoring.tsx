import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const Monitoring = () => (
  <div className="p-8 space-y-8 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Real-time <span className="text-primary neon-text">Monitoring</span>
      </h1>
      <p className="text-muted-foreground">Monitor clipboard and screen for phishing URLs</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GlassCard hover3d delay={0.1}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-semibold">Screen Monitor</h3>
            <p className="text-xs text-muted-foreground">Detect URLs on screen</p>
          </div>
          <div className="w-12 h-6 rounded-full bg-muted relative cursor-pointer">
            <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-all" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Disabled</p>
      </GlassCard>

      <GlassCard hover3d delay={0.2}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-semibold">Clipboard Monitor</h3>
            <p className="text-xs text-muted-foreground">Auto-scan copied URLs</p>
          </div>
          <div className="w-12 h-6 rounded-full bg-primary/30 relative cursor-pointer">
            <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary transition-all" />
          </div>
        </div>
        <p className="text-xs text-cyber-safe">Active — monitoring clipboard</p>
      </GlassCard>
    </div>

    <GlassCard delay={0.3}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Detection Log</h3>
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">No threats detected in this session</p>
      </div>
    </GlassCard>
  </div>
);

export default Monitoring;
