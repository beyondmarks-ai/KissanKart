import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageLayout } from "@/components/LanguageLayout";
import { LanguageRedirect } from "@/components/LanguageRedirect";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Loader } from "@/components/Loader";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import FarmDetail from "./pages/FarmDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Language route wrapper component
function LanguageRoutes() {
  return (
    <LanguageLayout>
      <Routes>
        <Route index element={<Index />} />
        <Route path="shop" element={<Shop />} />
        <Route path="farm/:farmId" element={<FarmDetail />} />
        <Route path="auth" element={<Auth />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LanguageLayout>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Small delay to ensure proper mounting
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              {isLoading && showLoader && <Loader onLoadingComplete={handleLoadingComplete} />}
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Redirect root to default language */}
                  <Route path="/" element={<LanguageRedirect />} />

                  {/* Language-prefixed routes */}
                  <Route path="/:lang/*" element={<LanguageRoutes />} />

                  {/* Catch-all for non-language routes */}
                  <Route path="*" element={<Navigate to="/en" replace />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
