import logo from "@/assets/astrobastardo-logo.png";

const SuccessView = () => (
  <div className="flex min-h-dvh items-center justify-center px-5 py-10">
    <div className="w-full max-w-[440px] text-center animate-enter-up">
      <div className="mb-6">
        <img src={logo} alt="AstroBastardo" className="mx-auto h-20 w-20 object-contain" loading="lazy" />
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

export default SuccessView;
