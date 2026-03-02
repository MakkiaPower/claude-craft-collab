import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import CookieBanner from "./components/CookieBanner";

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex min-h-dvh items-center justify-center">
    <p className="text-muted-foreground text-sm">Caricamento...</p>
  </div>
);

const AppRoutes = () => {
  useCartSync();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><PrivacyPolicy /></Suspense>} />
        <Route path="/shop" element={<Suspense fallback={<LoadingFallback />}><Shop /></Suspense>} />
        <Route path="/product/:handle" element={<Suspense fallback={<LoadingFallback />}><ProductDetail /></Suspense>} />
        <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
      </Routes>
      <CookieBanner />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
