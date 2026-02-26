import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/astrobastardo-logo.png";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => /^\+?[0-9]{8,15}$/.test(v.replace(/[\s\-().]/g, ""));

const Index = () => {
  const [formData, setFormData] = useState({ nome: "", email: "", telefono: "" });
  const [errors, setErrors] = useState({ nome: false, email: false, telefono: false, privacy: false });
  const [privacy, setPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      nome: !formData.nome.trim(),
      email: !isValidEmail(formData.email),
      telefono: !isValidPhone(formData.telefono),
      privacy: !privacy,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("add-to-brevo", {
        body: { nome: formData.nome.trim(), email: formData.email.trim(), telefono: formData.telefono.trim() },
      });
      if (error) throw error;
      if (data && !data.success) throw new Error(data.error || "Errore sconosciuto");
      setSuccess(true);
    } catch (err) {
      console.error("Brevo error:", err);
      toast({ variant: "destructive", title: "Errore", description: "Qualcosa è andato storto. Riprova." });
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px] text-center animate-enter-up">
          <div className="mb-6">
            <img src={logo} alt="AstroBastardo" className="mx-auto h-20 w-20 object-contain" />
          </div>
          <h2 className="mb-3.5 text-[1.4rem] font-extrabold uppercase tracking-tight leading-tight">
            SEI DENTRO,<br /><span className="text-primary">BASTARDO.</span>
          </h2>
          <p className="mx-auto max-w-[320px] text-sm text-muted-foreground leading-relaxed">
            Sei a un passo dall'entrare nel club ufficiale di AstroBastardo. Ti avviseremo su WhatsApp prima di tutti quando lo shop aprirà.
          </p>
          <p className="mt-5 text-[0.78rem] font-bold text-foreground">
            Pochi posti, zero favoritismi. Solo chi è in lista entra per primo.
          </p>
          <span className="mt-6 inline-block rounded border border-premium/25 px-6 py-2.5 text-[0.65rem] font-bold uppercase tracking-[3px] text-premium">
            AstroBastardo — Drop 001
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-10">
      <main className="w-full max-w-[440px] flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-9 animate-enter-up" style={{ animationDelay: "0.1s" }}>
          <img src={logo} alt="AstroBastardo" className="h-[130px] w-[130px] object-contain" />
        </div>

        {/* Hero Title */}
        <div className="mb-5 animate-enter-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] font-extrabold uppercase tracking-tight leading-[1.15]">
            L'AVETE CHIESTO IN TANTI.<br />
            <span className="text-primary">ORA SONO CAZZI VOSTRI.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="mb-3 text-base font-medium text-muted-foreground leading-normal animate-enter-up"
          style={{ animationDelay: "0.3s" }}
        >
          Roba che non sapevi di volere. Finalmente qualcosa che puoi toccare.
        </p>

        {/* Urgency */}
        <p
          className="mb-10 max-w-[370px] text-[0.82rem] font-semibold text-foreground leading-relaxed animate-enter-up"
          style={{ animationDelay: "0.4s" }}
        >
          Pezzi limitati. Niente restock. Chi è in lista entra per primo nello shop.{" "}
          <span className="text-primary">Gli altri si attaccano.</span>
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full animate-enter-up"
          style={{ animationDelay: "0.5s" }}
        >
          {/* Nome */}
          <div className="mb-3.5 text-left">
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
              NOME
            </label>
            <input
              type="text"
              placeholder="Il tuo nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              className={`w-full rounded bg-transparent border px-[18px] py-4 text-[0.95rem] font-medium text-foreground placeholder:text-[#444] placeholder:font-normal outline-none transition-colors duration-200 ${
                errors.nome ? "border-destructive" : "border-input focus:border-primary"
              }`}
            />
            {errors.nome && (
              <p className="mt-1.5 text-[0.72rem] font-medium text-destructive">Inserisci il tuo nome</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3.5 text-left">
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="email@esempio.it"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full rounded bg-transparent border px-[18px] py-4 text-[0.95rem] font-medium text-foreground placeholder:text-[#444] placeholder:font-normal outline-none transition-colors duration-200 ${
                errors.email ? "border-destructive" : "border-input focus:border-primary"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-[0.72rem] font-medium text-destructive">Inserisci un'email valida</p>
            )}
          </div>

          {/* Telefono */}
          <div className="mb-3.5 text-left">
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
              TELEFONO
            </label>
            <input
              type="tel"
              placeholder="+39 3XX XXX XXXX"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              className={`w-full rounded bg-transparent border px-[18px] py-4 text-[0.95rem] font-medium text-foreground placeholder:text-[#444] placeholder:font-normal outline-none transition-colors duration-200 ${
                errors.telefono ? "border-destructive" : "border-input focus:border-primary"
              }`}
            />
            <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
              Ti avvisiamo su WhatsApp 24h prima di tutti.
            </p>
            {errors.telefono && (
              <p className="mt-1.5 text-[0.72rem] font-medium text-destructive">Numero non valido</p>
            )}
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2.5 w-full rounded bg-primary px-4 py-[18px] text-[0.85rem] font-extrabold uppercase tracking-[3px] text-primary-foreground transition-colors duration-200 hover:brightness-90 active:brightness-75 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "UN ATTIMO..." : "FAMMI ENTRARE"}
          </button>

          {/* Privacy Checkbox */}
          <div className="mt-5 text-left">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy}
                onChange={(e) => {
                  setPrivacy(e.target.checked);
                  setErrors((prev) => ({ ...prev, privacy: false }));
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
              />
              <span className="text-[0.72rem] text-muted-foreground leading-relaxed">
                Ho letto e accetto la{" "}
                <a href="#" className="text-foreground underline underline-offset-2">
                  Privacy Policy
                </a>
                . Acconsento al trattamento dei miei dati personali.
              </span>
            </label>
            {errors.privacy && (
              <p className="mt-1.5 ml-7 text-[0.72rem] font-medium text-destructive">Devi accettare la privacy policy</p>
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

export default Index;
