import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import URLScanner from "./pages/URLScanner";
import BatchAnalysis from "./pages/BatchAnalysis";
import QRScanner from "./pages/QRScanner";
import ScanHistory from "./pages/ScanHistory";
import Monitoring from "./pages/Monitoring";
import MISPSettings from "./pages/MISPSettings";
import SandboxReport from "./pages/SandboxReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scanner" element={<URLScanner />} />
            <Route path="/batch" element={<BatchAnalysis />} />
            <Route path="/qr" element={<QRScanner />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/misp" element={<MISPSettings />} />
            <Route path="/sandbox" element={<SandboxReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;