import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuditProvider } from "@/contexts/AuditContext";
import { VolunteerReportsProvider } from "@/contexts/VolunteerReportsContext";
import { StaffProvider } from "@/contexts/StaffContext";
import { ToiletProvider } from "@/contexts/ToiletContext";
import { ZoneProvider } from "@/contexts/ZoneContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ZoneProvider>
        <AuditProvider>
          <VolunteerReportsProvider>
            <StaffProvider>
              <ToiletProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </ToiletProvider>
            </StaffProvider>
          </VolunteerReportsProvider>
        </AuditProvider>
      </ZoneProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
