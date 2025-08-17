import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import AlarmManager from "./pages/AlarmManager";
import PredictiveMaintenance from "./pages/PredictiveMaintenance";
import PipelineAnomalyDetection from "./pages/PipelineAnomalyDetection";
import Sustainability from "./pages/Sustainability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b border-sidebar-border bg-sidebar-background/50 backdrop-blur-sm">
                <SidebarTrigger className="ml-4" />
                <div className="ml-4">
                  <h1 className="text-lg font-semibold text-foreground">SCADA AI Dashboard</h1>
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/alarms" replace />} />
                  <Route path="/alarms" element={<AlarmManager />} />
                  <Route path="/maintenance" element={<PredictiveMaintenance />} />
                  <Route path="/pipeline" element={<PipelineAnomalyDetection />} />
                  <Route path="/sustainability" element={<Sustainability />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
