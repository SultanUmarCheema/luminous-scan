import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Upload, Shield, AlertTriangle, Scan } from "lucide-react";

const QRScanner = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ url: string; safe: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setResult(null);
      // Simulate scan
      setScanning(true);
      setTimeout(() => {
        setResult({ url: "https://paypa1-update.xyz/login", safe: false });
        setScanning(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1000px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
          QR <span className="text-accent-primary glow-text">Scanner</span>
        </h1>
        <p className="text-muted-foreground">Upload a QR code to extract and scan the embedded URL</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <motion.div
          className="surface-glow border-2 border-dashed border-border hover:border-primary/20 transition-colors cursor-pointer relative overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {preview ? (
            <div className="relative">
              <img src={preview} alt="QR Code" className="w-full h-auto max-h-[400px] object-contain p-4" />
              {scanning && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Scanning laser line */}
                  <div className="relative w-full h-full overflow-hidden">
                    <motion.div
                      className="absolute left-4 right-4 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, transparent, hsl(190, 100%, 50%), transparent)", boxShadow: "0 0 20px hsl(190, 100%, 50%)" }}
                      animate={{ top: ["10%", "90%", "10%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Corner markers */}
                    {[
                      "top-4 left-4",
                      "top-4 right-4 rotate-90",
                      "bottom-4 left-4 -rotate-90",
                      "bottom-4 right-4 rotate-180",
                    ].map((pos, i) => (
                      <div key={i} className={`absolute ${pos} w-8 h-8`}>
                        <div className="w-full h-0.5 bg-primary rounded" />
                        <div className="w-0.5 h-full bg-primary rounded absolute top-0 left-0" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="py-20 px-8 space-y-4 text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <QrCode className="w-16 h-16 text-muted-foreground mx-auto" strokeWidth={1} />
              </motion.div>
              <div>
                <p className="text-foreground font-medium flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Drop image or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Result Panel */}
        <div className="space-y-4">
          <AnimatePresence>
            {scanning && !result && (
              <motion.div
                className="surface-glow p-6 flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Scan className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <p className="text-sm text-foreground font-medium">Decoding QR pattern...</p>
                  <p className="text-xs text-muted-foreground">Extracting embedded URL</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div className="space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Extracted URL */}
                <div className="surface-glow p-5">
                  <span className="label-overline block mb-2">Extracted URL</span>
                  <code className="text-sm font-mono-code text-accent break-all">{result.url}</code>
                </div>

                {/* Verdict */}
                <div className={`surface-glow p-5 border-l-4 ${result.safe ? "border-l-safe" : "border-l-destructive"}`}>
                  <div className="flex items-center gap-3">
                    {result.safe ? (
                      <Shield className="w-8 h-8 text-safe" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-destructive" />
                    )}
                    <div>
                      <h3 className={`text-lg font-display font-bold ${result.safe ? "text-safe" : "text-destructive"}`}>
                        {result.safe ? "Safe URL" : "Phishing Detected"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {result.safe ? "This QR code links to a verified safe destination" : "This QR code contains a malicious URL"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                {!result.safe && (
                  <motion.button
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Scan className="w-4 h-4" />
                    Deep Scan This URL
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !scanning && (
            <motion.div className="surface-glow p-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Scan className="w-10 h-10 text-muted-foreground mx-auto mb-3" strokeWidth={1} />
              <p className="text-sm text-muted-foreground">Upload a QR code image to begin analysis</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;