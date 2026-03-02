import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error: fnError } = await supabase.functions.invoke(
        "verify-shop-password",
        { body: { password: password.trim() } }
      );

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

  // === PASSWORD GATE ===
  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-5 py-10">
        <main className="w-full max-w-[380px] flex flex-col items-center text-center">
          <div className="mb-8 animate-enter-up" style={{ animationDelay: "0.1s" }}>
            <img
              src={logo}
              alt="AstroBastardo"
              className="h-[100px] w-[100px] object-contain"
              width={100}
              height={100}
            />
          </div>

          <h1
            className="mb-3 text-xl font-extrabold uppercase tracking-tight animate-enter-up"
            style={{ animationDelay: "0.2s" }}
          >
            Area Riservata
          </h1>
          <p
            className="mb-8 text-sm text-muted-foreground animate-enter-up"
            style={{ animationDelay: "0.3s" }}
          >
            Inserisci il codice che hai ricevuto per accedere allo shop.
          </p>

          <form
            onSubmit={handleUnlock}
            className="w-full animate-enter-up"
            style={{ animationDelay: "0.4s" }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Codice di accesso"
              autoFocus
              className="w-full rounded bg-foreground/5 border border-input px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />

            {error && (
              <p className="mt-2 text-[0.78rem] font-medium text-destructive" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="mt-4 w-full rounded bg-primary px-4 py-[16px] text-[0.82rem] font-extrabold uppercase tracking-[3px] text-primary-foreground transition-all duration-200 hover:brightness-90 active:brightness-75 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  VERIFICO...
                </span>
              ) : (
                "ENTRA"
              )}
            </button>
          </form>
        </main>
      </div>
    );
  }

  // === SHOP CONTENT (placeholder) ===
  return (
    <div className="flex min-h-dvh flex-col px-5 py-10">
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between mb-12">
        <img src={logo} alt="AstroBastardo" className="h-10 w-10 object-contain" width={40} height={40} />
        <span className="text-xs font-bold uppercase tracking-[2px] text-muted-foreground">Shop</span>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight mb-2">
          Lo Shop di <span className="text-primary">AstroBastardo</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Pezzi limitati. Quando finiscono, finiscono.
        </p>

        {/* Product grid placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-input bg-foreground/[0.03] p-5 flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square rounded bg-foreground/[0.06] mb-4 flex items-center justify-center">
                <span className="text-muted-foreground/40 text-xs uppercase tracking-widest">Coming Soon</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-1">Prodotto {i}</h3>
              <p className="text-xs text-muted-foreground">In arrivo</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
