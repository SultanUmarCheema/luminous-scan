import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Clipboard, Shield, AlertTriangle, Activity, Waves, Radio } from "lucide-react";

const detections = [
  { url: "paypa1-update.xyz/login", time: "14:32:01", type: "clipboard", threat: true },
  { url: "google.com", time: "14:31:45", type: "screen", threat: false },
  { url: "amaz0n-secure.tk/verify", time: "14:30:12", type: "clipboard", threat: true },
];

const Monitoring = () => {
  const [screenMonitor, setScreenMonitor] = useState(false);
  const [clipboardMonitor, setClipboardMonitor] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulsePhase((p) => p + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Real-time <span className="text-accent-primary glow-text">Monitor</span>
        </h1>
        <p className="text-muted-foreground">Passive URL monitoring across clipboard and screen</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eye Scanner Visualization */}
        <motion.div
          className="lg:col-span-1 surface-glow p-6 flex flex-col items-center justify-center min-h-[300px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Animated Eye */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${120 + i * 40}px`,
                  height: `${120 + i * 40}px`,
                  borderColor: `hsla(190, 100%, 50%, ${0.15 - i * 0.04})`,
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}

            {/* Eye shape */}
            <svg viewBox="0 0 120 60" className="w-32 absolute">
              <motion.path
                d="M10 30 Q60 -10 110 30 Q60 70 10 30Z"
                fill="none"
                stroke="hsl(190, 100%, 50%)"
                strokeWidth="1.5"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M10 30 Q60 -10 110 30 Q60 70 10 30Z"
                fill="hsla(190, 100%, 50%, 0.05)"
                stroke="none"
              />
            </svg>

            {/* Iris */}
            <motion.div
              className="absolute w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center"
              style={{ background: "radial-gradient(circle, hsla(265, 90%, 65%, 0.3), transparent)" }}
              animate={{
                scale: clipboardMonitor || screenMonitor ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Pupil */}
              <motion.div
                className="w-4 h-4 rounded-full bg-primary"
                style={{ boxShadow: "0 0 20px hsl(190, 100%, 50%)" }}
                animate={{
                  x: [0, 3, -3, 0],
                  scale: [1, 0.8, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Scanning line */}
            {(clipboardMonitor || screenMonitor) && (
              <motion.div
                className="absolute w-32 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(190, 100%, 50%), transparent)",
                  boxShadow: "0 0 10px hsl(190, 100%, 50%)",
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            {clipboardMonitor || screenMonitor ? (
              <span className="text-primary flex items-center gap-1"><Radio className="w-3 h-3" /> Actively Scanning</span>
            ) : (
              "All monitors disabled"
            )}
          </p>
        </motion.div>

        {/* Controls + Detection Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Toggle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Screen Monitor", desc: "Detect URLs displayed on screen", icon: Eye, active: screenMonitor, toggle: () => setScreenMonitor(!screenMonitor) },
              { label: "Clipboard Monitor", desc: "Auto-scan copied URLs", icon: Clipboard, active: clipboardMonitor, toggle: () => setClipboardMonitor(!clipboardMonitor) },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                className="surface-interactive p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={m.toggle}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <m.icon className={`w-4 h-4 ${m.active ? "text-primary" : "text-muted-foreground"}`} />
                    <h3 className="font-semibold text-foreground text-sm">{m.label}</h3>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${m.active ? "bg-primary/30" : "bg-secondary"}`}>
                    <motion.div
                      className={`absolute top-0.5 w-4 h-4 rounded-full ${m.active ? "bg-primary" : "bg-muted-foreground"}`}
                      animate={{ x: m.active ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
                {m.active && (
                  <motion.div className="flex items-center gap-1 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span className="dot-live" />
                    <span className="text-xs text-primary">Active</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Live Detection Feed */}
          <div className="surface-glow overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="label-overline">Live Detection Feed</span>
              <motion.span
                className="dot-live ml-auto"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            {detections.length === 0 ? (
              <div className="py-12 text-center">
                <Waves className="w-8 h-8 text-muted-foreground mx-auto mb-2" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">No threats detected this session</p>
              </div>
            ) : (
              detections.map((d, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 ${d.threat ? "bg-destructive/[0.02]" : ""}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {d.threat ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Shield className="w-4 h-4 text-safe" />}
                  <span className="font-mono-code text-xs text-foreground truncate flex-1">{d.url}</span>
                  <span className={`pill text-[9px] ${d.type === "clipboard" ? "pill-accent" : "pill-primary"}`}>{d.type.toUpperCase()}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums font-mono-code">{d.time}</span>
                  <span className={d.threat ? "pill-danger" : "pill-safe"}>{d.threat ? "THREAT" : "SAFE"}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;