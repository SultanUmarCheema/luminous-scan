import { motion } from "framer-motion";
import { Settings, Database, Globe, Key, CheckCircle, Server } from "lucide-react";

const MISPSettings = () => (
  <div className="p-6 lg:p-10 max-w-[900px] mx-auto">
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
        MISP <span className="text-accent-secondary glow-text-accent">Config</span>
      </h1>
      <p className="text-muted-foreground">Threat intelligence platform connection</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Connection Form */}
      <motion.div className="lg:col-span-2 surface-glow p-6 space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Connection Settings</h3>
            <p className="text-xs text-muted-foreground">Configure your MISP instance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-overline block mb-2 flex items-center gap-1"><Globe className="w-3 h-3" /> Server URL</label>
            <input
              type="text"
              defaultValue="https://misp.example.org"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono-code outline-none focus:border-primary/30 focus:shadow-[0_0_20px_hsla(190,100%,50%,0.1)] transition-all"
            />
          </div>
          <div>
            <label className="label-overline block mb-2 flex items-center gap-1"><Key className="w-3 h-3" /> API Key</label>
            <input
              type="password"
              defaultValue="••••••••••••"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono-code outline-none focus:border-primary/30 focus:shadow-[0_0_20px_hsla(190,100%,50%,0.1)] transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Settings className="w-4 h-4" /> Save Configuration
          </motion.button>
          <motion.button className="btn-ghost flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            Test Connection
          </motion.button>
        </div>
      </motion.div>

      {/* Status Panel */}
      <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <div className="surface-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-primary" />
            <span className="label-overline">Status</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="dot-safe" />
            <span className="text-sm text-safe font-medium">Connected</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="text-foreground font-mono-code">2.4.176</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Events</span>
              <span className="text-foreground font-mono-code">12,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="text-foreground font-mono-code">2 min ago</span>
            </div>
          </div>
        </div>

        <div className="surface-glow p-5">
          <span className="label-overline block mb-3">Enabled Feeds</span>
          {["PhishTank", "URLhaus", "MalwareBazaar"].map((feed, i) => (
            <div key={feed} className="flex items-center gap-2 py-1.5">
              <CheckCircle className="w-3 h-3 text-safe" />
              <span className="text-xs text-foreground">{feed}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default MISPSettings;