import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3d?: boolean;
  delay?: number;
}

const GlassCard = ({ children, className = "", hover3d = false, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      className={`${hover3d ? "perspective-container" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`${hover3d ? "card-3d" : ""} glass-card p-6 ${className}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
