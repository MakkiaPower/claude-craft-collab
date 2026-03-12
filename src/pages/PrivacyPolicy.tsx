import logo from "@/assets/astrobastardo-logo.png";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-dvh justify-center px-4 sm:px-5 py-8 sm:py-10" style={{paddingTop:"max(env(safe-area-inset-top, 32px), 32px)"}}>
      <div className="w-full max-w-[640px]">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <Link to="/" className="inline-block">
            <img src={logo} alt="AstroBastardo" className="mx-auto mb-5 h-14 w-14 sm:h-16 sm:w-16 object-contain" />
          </Link>
          <h1 className="text-xl font-extrabold uppercase tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-[0.75rem] text-muted-foreground">Ultimo aggiornamento: Febbraio 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-[0.85rem] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento dei dati personali è AstroBastardo. Per qualsiasi domanda relativa alla privacy, puoi contattarci all'indirizzo email:{" "}
              <a href="mailto:info@astrobastardo.it" className="text-primary underline underline-offset-2">info@astrobastardo.it</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">2. Dati raccolti</h2>
            <p>Raccogliamo i seguenti dati personali forniti volontariamente dall'utente tramite il modulo di iscrizione:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Nome e Cognome</li>
              <li>Indirizzo email</li>
              <li>Numero di telefono</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">3. Finalità del trattamento</h2>
            <p>I dati personali vengono trattati per le seguenti finalità:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Iscrizione alla lista d'attesa per l'accesso anticipato allo shop</li>
              <li>Invio di comunicazioni relative ai drop e alle novità di AstroBastardo tramite email e WhatsApp</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">4. Base giuridica</h2>
            <p>
              Il trattamento dei dati si basa sul consenso esplicito dell'utente, espresso al momento della compilazione del modulo di iscrizione.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">5. Conservazione dei dati</h2>
            <p>
              I dati personali saranno conservati per il tempo necessario al raggiungimento delle finalità sopra indicate, e comunque non oltre 24 mesi dall'ultimo contatto o interazione con l'utente.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">6. Condivisione dei dati</h2>
            <p>I dati possono essere condivisi con i seguenti soggetti terzi, esclusivamente per le finalità indicate:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Brevo (Sendinblue)</strong> — piattaforma di email marketing e gestione contatti</li>
            </ul>
            <p className="mt-2">I dati non saranno ceduti a terzi per finalità di marketing non correlate ad AstroBastardo.</p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">7. Diritti dell'utente</h2>
            <p>In conformità al GDPR (Regolamento UE 2016/679), l'utente ha diritto a:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Accedere ai propri dati personali</li>
              <li>Richiedere la rettifica o la cancellazione dei dati</li>
              <li>Revocare il consenso in qualsiasi momento</li>
              <li>Opporsi al trattamento dei dati</li>
              <li>Richiedere la portabilità dei dati</li>
            </ul>
            <p className="mt-2">
              Per esercitare i tuoi diritti, scrivi a{" "}
              <a href="mailto:info@astrobastardo.it" className="text-primary underline underline-offset-2">info@astrobastardo.it</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">8. Cookie</h2>
            <p>
              Questo sito utilizza cookie tecnici necessari al funzionamento e cookie analitici di terze parti (Google Analytics 4) per comprendere come il sito viene utilizzato. I cookie analitici vengono attivati solo dopo il consenso esplicito dell'utente tramite il banner cookie. Nessun dato viene utilizzato per finalità pubblicitarie.
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block text-[0.75rem] font-semibold uppercase tracking-[2px] text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          >
            ← Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
