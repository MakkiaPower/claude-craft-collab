import { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import { loadGA4 } from "@/lib/ga4";

const CONSENT_KEY = "ab_cookie_consent";

const CookieBanner = forwardRef<HTMLDivElement>((_, ref) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      loadGA4();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    loadGA4();
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div ref={ref} className="fixed bottom-0 inset-x-0 z-50 animate-enter-up p-4">
      <div className="mx-auto max-w-[440px] rounded-lg border border-input bg-background/95 backdrop-blur-sm p-5 shadow-lg">
        <p className="text-[0.78rem] text-muted-foreground leading-relaxed mb-4">
          Questo sito utilizza cookie analitici (Google Analytics) per capire come viene utilizzato.
          Nessun dato viene usato per pubblicità. Leggi la{" "}
          <Link to="/privacy" className="text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="flex-1 rounded bg-primary px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[2px] text-primary-foreground transition-colors hover:brightness-90"
          >
            Accetta
          </button>
          <button
            onClick={reject}
            className="flex-1 rounded border border-input px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[2px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Rifiuta
          </button>
        </div>
      </div>
    </div>
  );
});

CookieBanner.displayName = "CookieBanner";

export default CookieBanner;
