import { motion } from "framer-motion";

const BatchAnalysis = () => (
  <div className="p-8 lg:p-12 max-w-3xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
        Batch <span className="text-accent-primary">Analysis</span>
      </h1>
      <p className="text-muted-foreground">Paste multiple URLs — one per line</p>
    </motion.div>
    <motion.div className="surface p-6 space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <textarea
        rows={8}
        placeholder={"https://example1.com\nhttps://example2.com\nhttps://suspicious.xyz"}
        className="w-full bg-secondary rounded-xl px-5 py-4 text-foreground text-sm font-mono placeholder:text-muted-foreground outline-none resize-none border border-border focus:border-primary/30 transition-colors"
      />
      <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        Analyze All
      </motion.button>
    </motion.div>
  </div>
);

export default BatchAnalysis;
