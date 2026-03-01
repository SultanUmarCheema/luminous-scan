import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const BatchAnalysis = () => (
  <div className="p-8 space-y-8 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Batch <span className="text-primary neon-text">Analysis</span>
      </h1>
      <p className="text-muted-foreground">Analyze multiple URLs at once — one per line</p>
    </motion.div>
    <GlassCard delay={0.1}>
      <textarea
        rows={8}
        placeholder={"https://example1.com\nhttps://example2.com\nhttps://suspicious-site.xyz"}
        className="w-full bg-muted border border-border rounded-xl px-5 py-4 text-foreground text-sm font-mono placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none"
      />
      <motion.button
        className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm mt-4"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Analyze All →
      </motion.button>
    </GlassCard>
  </div>
);

export default BatchAnalysis;
