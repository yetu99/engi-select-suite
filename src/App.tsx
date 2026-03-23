import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MaterialProvider } from "@/context/MaterialContext";
import AppLayout from "@/components/AppLayout";
import DatabaseLayout from "@/components/DatabaseLayout";
import EngineeringLayout from "@/components/EngineeringLayout";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import MaterialDetailPage from "./pages/MaterialDetailPage";
import MaterialFormPage from "./pages/MaterialFormPage";
import ComparisonPage from "./pages/ComparisonPage";
import FavoritesPage from "./pages/FavoritesPage";
import RecommendationPage from "./pages/RecommendationPage";
import EngineeringSelectionPage from "./pages/EngineeringSelectionPage";
import MethodikPage from "./pages/MethodikPage";
import PdfViewerPage from "./pages/PdfViewerPage";
import NotFound from "./pages/NotFound";
import ComingSoonPage from "./pages/ComingSoonPage";

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
              <Route path="/" element={<HomePage />} />
              
              {/* Database module */}
              <Route path="/datenbank" element={<DatabaseLayout />}>
                <Route index element={<Index />} />
                <Route path="favoriten" element={<FavoritesPage />} />
                <Route path="vergleich" element={<ComparisonPage />} />
                <Route path="empfehlung" element={<RecommendationPage />} />
                <Route path="hinzufuegen" element={<MaterialFormPage />} />
                <Route path="bearbeiten/:id" element={<MaterialFormPage />} />
              </Route>
              
              {/* Keep old detail route working */}
              <Route path="/werkstoff/:id" element={<MaterialDetailPage />} />
              
              {/* Engineering module */}
              <Route path="/engineering" element={<EngineeringLayout />}>
                <Route index element={<EngineeringSelectionPage />} />
              </Route>
              
              {/* Coming soon modules */}
              <Route path="/methodik" element={<MethodikPage />} />
              <Route path="/pdf/:documentId" element={<PdfViewerPage />} />
              <Route path="/oring" element={<ComingSoonPage />} />
              <Route path="/schadenskunde" element={<ComingSoonPage />} />
              <Route path="/tolerierung" element={<ComingSoonPage />} />
              <Route path="/normen" element={<ComingSoonPage />} />
              <Route path="/projektplanung" element={<ComingSoonPage />} />
              <Route path="/hydraulik" element={<ComingSoonPage />} />
              <Route path="/templates" element={<ComingSoonPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </MaterialProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
