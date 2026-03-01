import { motion } from "framer-motion";

const QRScanner = () => (
  <div className="p-8 lg:p-12 max-w-3xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
        QR <span className="text-accent-primary">Scanner</span>
      </h1>
      <p className="text-muted-foreground">Upload a QR code to extract and scan the embedded URL</p>
    </motion.div>
    <motion.div
      className="surface p-8 border-2 border-dashed border-border hover:border-primary/20 transition-colors cursor-pointer text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="py-12 space-y-3">
        <p className="text-4xl">⊞</p>
        <p className="text-foreground font-medium">Drop image here or click to browse</p>
        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
      </div>
    </motion.div>
  </div>
);

export default QRScanner;
