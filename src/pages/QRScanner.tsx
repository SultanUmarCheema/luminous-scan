import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const QRScanner = () => (
  <div className="p-8 space-y-8 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        QR Code <span className="text-primary neon-text">Scanner</span>
      </h1>
      <p className="text-muted-foreground">Upload a QR code image to extract and analyze the URL</p>
    </motion.div>
    <GlassCard delay={0.1}>
      <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center hover:border-primary/30 transition-colors cursor-pointer">
        <div className="text-5xl mb-4">📱</div>
        <p className="text-foreground font-medium mb-1">Drop QR code image here</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
    </GlassCard>
  </div>
);

export default QRScanner;
