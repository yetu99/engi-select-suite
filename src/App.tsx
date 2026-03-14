import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MaterialProvider } from "@/context/MaterialContext";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import MaterialDetailPage from "./pages/MaterialDetailPage.tsx";
import MaterialFormPage from "./pages/MaterialFormPage.tsx";
import ComparisonPage from "./pages/ComparisonPage.tsx";
import FavoritesPage from "./pages/FavoritesPage.tsx";
import RecommendationPage from "./pages/RecommendationPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MaterialProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/werkstoff/:id" element={<MaterialDetailPage />} />
              <Route path="/hinzufuegen" element={<MaterialFormPage />} />
              <Route path="/bearbeiten/:id" element={<MaterialFormPage />} />
              <Route path="/vergleich" element={<ComparisonPage />} />
              <Route path="/favoriten" element={<FavoritesPage />} />
              <Route path="/empfehlung" element={<RecommendationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </MaterialProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
