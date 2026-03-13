import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/astrobastardo-logo.png";
import SuccessView from "@/components/SuccessView";
import FormField from "@/components/FormField";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => /^\+?[0-9]{8,15}$/.test(v.replace(/[\s\-().]/g, ""));

const Shop = () => {
  usePageMeta({
    title: "Waitlist Drop 001 — AstroBastardo | Streetwear Limitato",
    description: "Iscriviti alla waitlist esclusiva per il Drop 001 di AstroBastardo. Pezzi limitati, niente restock. Chi è in lista entra per primo.",
    canonical: "https://astrobastardo.it/shop",
    ogTitle: "AstroBastardo — Drop 001 | Streetwear Limitato",
    ogDescription: "Pezzi limitati. Niente restock. Iscriviti alla waitlist esclusiva per il Drop 001 di AstroBastardo.",
  });
  const [formData, setFormData] = useState({ nome: "", cognome: "", email: "", telefono: "" });
  const [errors, setErrors] = useState({ nome: false, cognome: false, email: false, telefono: false, privacy: false });
  const [privacy, setPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors = {
      nome: !formData.nome.trim(),
      cognome: !formData.cognome.trim(),
      email: !isValidEmail(formData.email),
      telefono: !isValidPhone(formData.telefono),
      privacy: !privacy,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    const payload = { nome: formData.nome.trim(), cognome: formData.cognome.trim(), email: formData.email.trim(), telefono: formData.telefono.trim() };

    const attempt = async () => {
      const { data, error } = await supabase.functions.invoke("add-to-brevo", {
        body: payload,
      });
      if (error) throw error;
      if (data && !data.success) throw new Error(data.error || "Errore sconosciuto");
      return data;
    };

    try {
      let data;
      try {
        data = await attempt();
      } catch {
        data = await attempt();
      }

      if (data?.alreadyRegistered) {
        toast({ title: "Ci sei già! 🎉", description: "Questa email è già in lista. Ti avviseremo appena si apre lo shop!" });
        setSubmitting(false);
        return;
      }
      setSuccess(true);
    } catch (err) {
      console.error("Brevo error:", err);
      toast({ variant: "destructive", title: "Errore", description: "Qualcosa è andato storto. Riprova tra qualche secondo." });
      setSubmitting(false);
    }
  };

  if (success) return <SuccessView />;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 sm:px-5 py-8 sm:py-10 relative">
      {/* Back button */}
      <Link
        to="/"
        className="fixed left-4 z-10 text-[0.8rem] font-semibold text-primary hover:text-foreground transition-colors flex items-center min-h-[44px]"
        style={{ top: "max(env(safe-area-inset-top, 16px), 16px)" }}
      >
        ← Home
      </Link>

      <main className="w-full max-w-[440px] flex flex-col items-center text-center">
        <div className="mb-6 sm:mb-9 animate-enter-up" style={{ animationDelay: "0.1s" }}>
          <Link to="/">
            <img src={logo} alt="AstroBastardo" className="h-[100px] w-[100px] sm:h-[130px] sm:w-[130px] object-contain" width={130} height={130} />
          </Link>
        </div>

        <div className="mb-5 animate-enter-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] font-extrabold uppercase tracking-tight leading-[1.15]">
            L'AVETE CHIESTO IN TANTI.<br />
            <span className="text-primary">ORA SONO CAZZI VOSTRI.</span>
          </h1>
        </div>

        <p
          className="mb-3 text-base font-medium text-muted-foreground leading-normal animate-enter-up"
          style={{ animationDelay: "0.3s" }}
        >
          Roba che non sapevi di volere. Finalmente qualcosa che puoi toccare.
        </p>

        <p
          className="mb-7 sm:mb-10 max-w-[370px] text-[0.82rem] font-semibold text-foreground leading-relaxed animate-enter-up"
          style={{ animationDelay: "0.4s" }}
        >
          Pezzi limitati. Niente restock. Chi è in lista entra per primo nello shop.{" "}
          <span className="text-primary">Gli altri si attaccano.</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full animate-enter-up"
          style={{ animationDelay: "0.5s" }}
          noValidate
        >
          <FormField
            label="NOME"
            type="text"
            placeholder="Il tuo nome"
            value={formData.nome}
            error={errors.nome}
            errorMessage="Inserisci il tuo nome"
            onChange={(v) => handleChange("nome", v)}
          />
          <FormField
            label="COGNOME"
            type="text"
            placeholder="Il tuo cognome"
            value={formData.cognome}
            error={errors.cognome}
            errorMessage="Inserisci il tuo cognome"
            onChange={(v) => handleChange("cognome", v)}
          />
          <FormField
            label="EMAIL"
            type="email"
            placeholder="email@esempio.it"
            value={formData.email}
            error={errors.email}
            errorMessage="Inserisci un'email valida"
            onChange={(v) => handleChange("email", v)}
          />
          <FormField
            label="TELEFONO"
            type="tel"
            placeholder="+39 3XX XXX XXXX"
            value={formData.telefono}
            error={errors.telefono}
            errorMessage="Numero non valido"
            hint="Ti avvisiamo su WhatsApp 24h prima di tutti."
            onChange={(v) => handleChange("telefono", v)}
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2.5 w-full rounded bg-primary px-4 py-[18px] text-[0.85rem] font-extrabold uppercase tracking-[3px] text-primary-foreground transition-all duration-200 hover:brightness-90 active:brightness-75 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                STIAMO REGISTRANDO...
              </span>
            ) : "FAMMI ENTRARE"}
          </button>

          {submitting && (
            <div className="mt-2 w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ animation: "progress 2s ease-in-out infinite" }}
              />
            </div>
          )}

          <div className="mt-5 text-left">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy}
                onChange={(e) => {
                  setPrivacy(e.target.checked);
                  setErrors((prev) => ({ ...prev, privacy: false }));
                }}
                aria-label="Accetta la privacy policy"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
              />
              <span className="text-[0.72rem] text-muted-foreground leading-relaxed">
                Ho letto e accetto la{" "}
                <Link to="/privacy" className="text-foreground underline underline-offset-2">
                  Privacy Policy
                </Link>
                . Acconsento al trattamento dei miei dati personali.
              </span>
            </label>
            {errors.privacy && (
              <p className="mt-1.5 ml-7 text-[0.72rem] font-medium text-destructive" role="alert">
                Devi accettare la privacy policy
              </p>
            )}
          </div>

          <p className="mt-3 text-[0.68rem] text-muted-foreground/50 leading-relaxed">
            Niente spam, niente cazzate. Ti scriviamo solo per il drop.
          </p>
        </form>

      </main>
    </div>
  );
};

export default Shop;
