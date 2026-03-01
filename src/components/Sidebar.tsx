import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Dashboard", icon: "⬡" },
  { path: "/scanner", label: "Scanner", icon: "◎" },
  { path: "/batch", label: "Batch", icon: "▦" },
  { path: "/qr", label: "QR Scan", icon: "⊞" },
  { path: "/history", label: "History", icon: "◷", count: 12 },
  { path: "/monitoring", label: "Monitor", icon: "◉" },
  { path: "/misp", label: "MISP", icon: "⚙" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-[72px] hover:w-[240px] group/sidebar h-screen flex-shrink-0 bg-sidebar border-r border-border flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 h-[72px] flex-shrink-0">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{ background: "hsl(var(--primary))" }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-primary-foreground font-display font-extrabold text-lg">P</span>
          <div className="absolute inset-0 rounded-xl dot-live opacity-0 group-hover/sidebar:opacity-100 transition-opacity" style={{ width: '100%', height: '100%', background: 'none' }} />
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
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={isActive ? "nav-item-active" : "nav-item"}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-base flex-shrink-0 w-6 text-center">{item.icon}</span>
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
          <span className="dot-live flex-shrink-0" />
          <span className="text-[11px] text-muted-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Systems Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
