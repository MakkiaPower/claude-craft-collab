import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";

const NotFound = () => {
  const location = useLocation();

  usePageMeta({
    title: "Pagina non trovata — AstroBastardo",
    description: "La pagina che cerchi non esiste. Torna alla home di AstroBastardo.",
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Pagina non trovata. Le stelle non sanno che cazzo cerchi.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Torna alla home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
