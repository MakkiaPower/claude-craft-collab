import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { AuthProvider } from "@/lib/oroscopo/AuthContext";
import Index from "./pages/Index";
import CookieBanner from "./components/CookieBanner";
import Footer from "./components/Footer";

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Oroscopo pages
const OroscopoLanding = lazy(() => import("./pages/oroscopo/Landing"));
const OroscopoLogin = lazy(() => import("./pages/oroscopo/Login"));
const OroscopoSignup = lazy(() => import("./pages/oroscopo/Signup"));
const OroscopoOnboarding = lazy(() => import("./pages/oroscopo/Onboarding"));
const OroscopoPricing = lazy(() => import("./pages/oroscopo/Pricing"));
const OroscopoDashboard = lazy(() => import("./pages/oroscopo/Dashboard"));
const OroscopoArchive = lazy(() => import("./pages/oroscopo/Archive"));
const OroscopoSettings = lazy(() => import("./pages/oroscopo/Settings"));
const OroscopoAdmin = lazy(() => import("./pages/oroscopo/Admin"));
const OroscopoAdminWrite = lazy(() => import("./pages/oroscopo/AdminWrite"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex min-h-dvh items-center justify-center">
    <p className="text-muted-foreground text-sm">Caricamento...</p>
  </div>
);

const OroscopoFallback = () => (
  <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <p style={{color:"rgba(246,246,244,.4)",fontFamily:"'Helvetica Neue',sans-serif",fontSize:14}}>Caricamento...</p>
  </div>
);

const SiteChrome = () => {
  const { pathname } = useLocation();
  const isOroscopo = pathname.startsWith('/oroscopo');
  if (isOroscopo) return null;
  return <><Footer /><CookieBanner /></>;
};

const AppRoutes = () => {
  useCartSync();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><PrivacyPolicy /></Suspense>} />
        <Route path="/shop" element={<Suspense fallback={<LoadingFallback />}><Shop /></Suspense>} />
        <Route path="/product/:handle" element={<Suspense fallback={<LoadingFallback />}><ProductDetail /></Suspense>} />

        {/* Oroscopo su Misura */}
        <Route path="/oroscopo" element={<Suspense fallback={<OroscopoFallback />}><OroscopoLanding /></Suspense>} />
        <Route path="/oroscopo/login" element={<Suspense fallback={<OroscopoFallback />}><OroscopoLogin /></Suspense>} />
        <Route path="/oroscopo/signup" element={<Suspense fallback={<OroscopoFallback />}><OroscopoSignup /></Suspense>} />
        <Route path="/oroscopo/onboarding" element={<Suspense fallback={<OroscopoFallback />}><OroscopoOnboarding /></Suspense>} />
        <Route path="/oroscopo/pricing" element={<Suspense fallback={<OroscopoFallback />}><OroscopoPricing /></Suspense>} />
        <Route path="/oroscopo/dashboard" element={<Suspense fallback={<OroscopoFallback />}><OroscopoDashboard /></Suspense>} />
        <Route path="/oroscopo/archive" element={<Suspense fallback={<OroscopoFallback />}><OroscopoArchive /></Suspense>} />
        <Route path="/oroscopo/settings" element={<Suspense fallback={<OroscopoFallback />}><OroscopoSettings /></Suspense>} />
        <Route path="/oroscopo/admin" element={<Suspense fallback={<OroscopoFallback />}><OroscopoAdmin /></Suspense>} />
        <Route path="/oroscopo/admin/write/:userId" element={<Suspense fallback={<OroscopoFallback />}><OroscopoAdminWrite /></Suspense>} />

        <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
      </Routes>
      <SiteChrome />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
