import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);

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

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant || !variant.availableForSale) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast({ title: "Aggiunto al carrello! 🛒", description: product.node.title });
  };

  return (
    <div className="flex min-h-dvh flex-col px-5 py-8">
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between mb-10">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="AstroBastardo" className="h-9 w-9 object-contain" width={36} height={36} />
          <span className="text-xs font-extrabold uppercase tracking-[2px] text-foreground hidden sm:inline">AstroBastardo</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-[2px] text-muted-foreground">Shop</span>
          <CartDrawer />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1">
        <div className="mb-10">
          <h1 className="text-2xl font-extrabold uppercase tracking-tight mb-2">
            Lo Shop di <span className="text-primary">AstroBastardo</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Pezzi limitati. Quando finiscono, finiscono.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              const variant = product.node.variants.edges[0]?.node;
              const available = variant?.availableForSale ?? false;

              return (
                <div key={product.node.id} className="rounded-lg border border-input bg-foreground/[0.02] overflow-hidden group">
                  <Link to={`/product/${product.node.handle}`} className="block">
                    <div className="w-full aspect-square bg-foreground/[0.04] overflow-hidden">
                      {image ? (
                        <img src={image.url} alt={image.altText || product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground/40 text-xs uppercase tracking-widest">No image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.node.handle}`}>
                      <h3 className="text-sm font-bold uppercase tracking-wide mb-1 text-foreground hover:text-primary transition-colors">{product.node.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.node.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!available || isCartLoading}
                        className="rounded bg-primary px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-primary-foreground hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {available ? "Aggiungi" : "Esaurito"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
