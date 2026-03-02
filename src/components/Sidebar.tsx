import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Search, Layers, QrCode, Clock, Eye, Settings, Activity } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: Shield },
  { path: "/scanner", label: "Scanner", icon: Search },
  { path: "/batch", label: "Batch", icon: Layers },
  { path: "/qr", label: "QR Scan", icon: QrCode },
  { path: "/history", label: "History", icon: Clock, count: 12 },
  { path: "/monitoring", label: "Monitor", icon: Eye },
  { path: "/misp", label: "MISP", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-[72px] hover:w-[240px] group/sidebar h-screen flex-shrink-0 bg-sidebar border-r border-border flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 h-[72px] flex-shrink-0">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(190 100% 50%), hsl(265 90% 65%))" }}
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-xl" style={{ boxShadow: "0 0 20px hsla(190, 100%, 50%, 0.4)" }} />
        </motion.div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <h1 className="font-display font-extrabold text-base text-foreground tracking-tight">P-LENS</h1>
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.25em]">v2.0</p>
        </div>
      </div>

      <div className="divider mx-4" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={isActive ? "nav-item-active" : "nav-item"}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </span>
              {item.count && (
                <span className="pill-primary ml-auto opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                  {item.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="p-3 space-y-2">
        <div className="divider" />
        <div className="flex items-center gap-2 px-3 py-2">
          <Activity className="w-3 h-3 text-primary flex-shrink-0" />
          <span className="text-[11px] text-muted-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Systems Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;