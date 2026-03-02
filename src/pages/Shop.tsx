import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2, ArrowRight } from "lucide-react";
import logo from "@/assets/astrobastardo-logo.png";

const Shop = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("shop_auth") === "true"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-shop-password", { body: { password: password.trim() } });
      if (fnError) throw fnError;
      if (data?.success) {
        sessionStorage.setItem("shop_auth", "true");
        setAuthenticated(true);
      } else {
        setError("Codice errato. Riprova.");
      }
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  }, [password, loading]);

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-5 py-10">
        <main className="w-full max-w-[380px] flex flex-col items-center text-center">
          <div className="mb-8 animate-enter-up" style={{ animationDelay: "0.1s" }}>
            <img src={logo} alt="AstroBastardo" className="h-[100px] w-[100px] object-contain" width={100} height={100} />
          </div>
          <h1 className="mb-3 text-xl font-extrabold uppercase tracking-tight animate-enter-up" style={{ animationDelay: "0.2s" }}>
            Area Riservata
          </h1>
          <p className="mb-8 text-sm text-muted-foreground animate-enter-up" style={{ animationDelay: "0.3s" }}>
            Inserisci il codice che hai ricevuto per accedere allo shop.
          </p>
          <form onSubmit={handleUnlock} className="w-full animate-enter-up" style={{ animationDelay: "0.4s" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Codice di accesso"
              autoFocus
              className="w-full rounded bg-foreground/5 border border-input px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            {error && <p className="mt-2 text-[0.78rem] font-medium text-destructive" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="mt-4 w-full rounded bg-primary px-4 py-[16px] text-[0.82rem] font-extrabold uppercase tracking-[3px] text-primary-foreground transition-all duration-200 hover:brightness-90 active:brightness-75 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  VERIFICO...
                </span>
              ) : "ENTRA"}
            </button>
          </form>
          <p className="mt-8 text-[0.78rem] text-muted-foreground animate-enter-up" style={{ animationDelay: "0.5s" }}>
            Non hai la password?
          </p>
          <Link to="/" className="mt-2 text-[0.78rem] font-bold text-primary underline underline-offset-4 hover:brightness-90 transition-all animate-enter-up" style={{ animationDelay: "0.55s" }}>
            Entra in lista qui
          </Link>
        </main>
      </div>
    );
  }

  return <ShopContent />;
};

const ShopContent = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 20 });
        setProducts(data?.data?.products?.edges || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col px-4 sm:px-5 py-4 sm:py-8">
      {/* Header */}
      <header className="mx-auto w-full max-w-4xl flex items-center justify-between mb-6 sm:mb-12">
        <Link to="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
          <img src={logo} alt="AstroBastardo" className="h-8 w-8 object-contain" width={32} height={32} />
          <span className="text-[0.65rem] font-extrabold uppercase tracking-[2px] text-foreground hidden sm:inline">AstroBastardo</span>
        </Link>
        <CartDrawer />
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1">
        {/* Hero */}
        <div className="mb-8 sm:mb-14 text-center">
          <h1 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight mb-2 sm:mb-3">
            Le tue stelle, <span className="text-primary">senza filtri.</span>
          </h1>
          <p className="text-[0.8rem] sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Analisi astrologiche personalizzate. Niente oroscopi da bar — solo la verità scritta nelle stelle.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-sm mb-2">Nessun prodotto disponibile al momento.</p>
            <p className="text-muted-foreground/60 text-xs">Torna presto — stiamo preparando qualcosa di grosso.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;

              return (
                <Link
                  key={product.node.id}
                  to={`/product/${product.node.handle}`}
                  className="group flex flex-col sm:flex-row rounded-xl border border-input bg-foreground/[0.02] overflow-hidden hover:border-primary/30 active:scale-[0.98] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-full sm:w-56 md:w-64 aspect-[3/2] sm:aspect-square bg-foreground/[0.04] overflow-hidden flex-shrink-0">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground/40 text-xs uppercase tracking-widest">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[0.95rem] sm:text-lg font-extrabold uppercase tracking-wide text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {getShortDescription(product.node.description)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-input/60">
                      <span className="text-base sm:text-lg font-extrabold text-primary">
                        €{parseFloat(price.amount).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                        Scopri di più
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-4xl mt-10 sm:mt-16 pt-5 sm:pt-6 border-t border-input/40 text-center pb-4">
        <p className="text-[0.65rem] text-muted-foreground/50 uppercase tracking-widest">
          AstroBastardo © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

/** Extract a clean short description from the raw Shopify text */
function getShortDescription(raw: string): string {
  // Take text before the first emoji section marker
  const markers = ["📌", "🔭", "📋", "🎯", "📦"];
  let end = raw.length;
  for (const m of markers) {
    const idx = raw.indexOf(m);
    if (idx !== -1 && idx < end) end = idx;
  }
  const intro = raw.substring(0, end).trim();
  // Cap at ~120 chars
  if (intro.length > 140) return intro.substring(0, 137).trimEnd() + "…";
  return intro || raw.substring(0, 137).trimEnd() + "…";
}

export default Shop;
