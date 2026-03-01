import { motion } from "framer-motion";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  colorClass: string;
  delay?: number;
}

const StatCard = ({ icon, value, label, colorClass, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      className="perspective-container"
      initial={{ opacity: 0, y: 30, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="card-3d glass-card p-6 text-center group cursor-default">
        <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-xl ${colorClass}`}>
          {icon}
        </div>
        <motion.p
          className="text-3xl font-bold text-foreground mb-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.p>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
