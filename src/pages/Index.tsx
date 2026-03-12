import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/astrobastardo-logo.png";

const PRIAM_B64 = "data:image/jpeg;base64,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";

const R = [
  "SÌ, CAZZO. E PURE CON UNA VIOLENZA CHE NON TI ASPETTI.",
  "SÌ. MA NON PERCHÉ SEI BRAVO. PERCHÉ L'UNIVERSO OGGI HA ABBASSATO GLI STANDARD.",
  "OVVIO CHE SÌ. MA TU ORA TROVERAI IL MODO DI FOTTERTI DA SOLO, COME SEMPRE.",
  "SÌ. ORA CHIUDI STA CAZZO DI APP E VAI A FARLO PRIMA CHE CAMBI IDEA.",
  "CAZZO SÌ. ERA ORA CHE FACESSI QUALCOSA DI UTILE NELLA TUA VITA.",
  "SÌ. E NON CHIEDERMELO DUE VOLTE O TI CAGO IN TESTA.",
  "SÌ, MA NON COME TE LO IMMAGINI. TE LO IMMAGINI SEMPRE MALE.",
  "SÌ. E FANCULO A CHIUNQUE TI DICA IL CONTRARIO.",
  "SÌ. ORA. SENZA SCUSE. SENZA PIAGNISTEI. SENZA ROMPERE IL CAZZO.",
  "SÌ, MA PREPARATI. PERCHÉ QUANDO ARRIVA, ARRIVA COME UN TRENO.",
  "SÌ, SE LA PIANTI DI INCULARTI DA SOLO OGNI SANTO GIORNO.",
  "SÌ. E SARÀ LA DECISIONE MIGLIORE CHE HAI PRESO DA ANNI, FIDATI.",
  "SÌ, STRONZO. E GODITELO, CHE LA FORTUNA NON BUSSA DUE VOLTE A CASA TUA.",
  "SÌ. MA DEVI MUOVERTI, PERCHÉ LA FINESTRA SI CHIUDE E TU SEI LENTO COME LA MORTE.",
  "SÌ. ANCHE LE STELLE SONO SORPRESE, MA SÌ.",
  "SÌ, MA SOLO SE LA SMETTI DI RACCONTARTI LE STRONZATE CHE TI RACCONTI PER DORMIRE.",
  "SÌ, MA NON OGGI. OGGI HAI LA FACCIA DI CHI HA GIÀ PERSO ALLA SVEGLIA.",
  "SÌ, MA IL PREZZO È ALTO. SEI PRONTO A PAGARE O FAI IL TIRCHIO ANCHE COI SOGNI?",
  "SÌ, MA NON CON QUELLA PERSONA. LO SAI. LO SANNO TUTTI. PURE IL BARISTA.",
  "SÌ. E QUESTA VOLTA FALLO SENZA CHIEDERE IL PERMESSO A MEZZO MONDO.",
  "NO. E LO SAPEVI GIÀ PRIMA DI PREMERE.",
  "COL CAZZO. AVANTI IL PROSSIMO DRAMMA.",
  "NO. E NEANCHE DOMANI. E NEANCHE A NATALE. FATTENE UNA RAGIONE.",
  "NO. LE STELLE NON TI CAGANO. NESSUNO TI CAGA. ED È LIBERATORIO SE CI PENSI.",
  "NO. E STO NO TI BRUCERÀ IL CULO, MA TI FARÀ BENE. DI NIENTE.",
  "NO. MA TANTO LO FARAI LO STESSO PERCHÉ SEI TESTARDO COME UN COGLIONE.",
  "NO. E NON DARE LA COLPA A SATURNO. IL PROBLEMA È TRA LE TUE ORECCHIE.",
  "NO. E LA PROSSIMA VOLTA CHE FAI STA DOMANDA TI SPUTO IN UN OCCHIO.",
  "NO. MA NON PERCHÉ SEI SFORTUNATO. È PERCHÉ NON SEI PRONTO. C'È DIFFERENZA.",
  "NO. E SMETTILA DI CERCARE QUALCUNO CHE TI ACCAREZZI L'EGO.",
  "NO. CHIUDI TUTTO, VAI A DORMIRE, DOMANI NE PARLIAMO. ANZI NO, MANCO DOMANI.",
  "NO. MA IL FATTO CHE TI RODE IL CULO SIGNIFICA CHE CI TIENI. È GIÀ QUALCOSA.",
  "NO. E LO SAPEVI PRIMA DI APRIRE. VOLEVI SOLO SENTIRTI DIRE SÌ. PATETICO.",
  "NO. NON PERCHÉ L'UNIVERSO TI ODIA. È SOLO CHE ORA HAI COSE PIÙ IMPORTANTI DA FARE.",
  "NO. E STA VOLTA ASCOLTA, INVECE DI IGNORARE COME FAI CON LE RED FLAG.",
  "NO ORA. SÌ TRA SEI MESI. SE NON TI AUTODISTRUGGI EMOTIVAMENTE PRIMA.",
  "NO. E SE INSISTI LA RISPOSTA DIVENTA VAFFANCULO.",
  "NO. MA ESCE UN CAZZO DI NO TALMENTE BELLO CHE DOVRESTI RINGRAZIARE.",
  "FORSE. MA IL TUO FORSE PUZZA DI CAGATA COSMICA. COME SEMPRE.",
  "NI. CHE NEL MIO LINGUAGGIO VUOL DIRE: FALLO, MA POI NON VENIRE A PIANGERE.",
  "DIPENDE. SEI DISPOSTO A SMETTERLA DI FARE LA PUTTANA EMOTIVA?",
  "FORSE SÌ, FORSE NO. L'UNICA CERTEZZA È CHE TU HAI LE IDEE CONFUSE COME SEMPRE.",
  "CHIEDIMELO TRA UNA SETTIMANA. ORA SEI TROPPO RINCOGLIONITO PER CAPIRE LA RISPOSTA.",
  "LA RISPOSTA C'È MA NON TE LA MERITI. TORNA QUANDO HAI FATTO QUALCOSA DI CONCRETO.",
  "SÌ E NO. IN PRATICA: SEI NELLA MERDA MA CON UNA VIA D'USCITA. USALA.",
  "FORSE. MA DEVI MUOVERTI, PERCHÉ IL FORSE HA UNA SCADENZA E TU SEI SEMPRE IN RITARDO.",
  "DIPENDE DA QUANTO SEI DISPOSTO A SOFFRIRE. SPOILER: PROBABILMENTE POCO.",
  "FORSE. MA IL TUO TRACK RECORD DI DECISIONI FA VERAMENTE CAGARE.",
  "È COMPLICATO. COME TE. COME TUTTA LA TUA VITA. MA ALLA FINE CE LA FAI SEMPRE.",
  "ASPETTA. NON PERCHÉ ARRIVA IL MOMENTO GIUSTO. PERCHÉ ORA SEI TROPPO COGLIONE PER AGIRE.",
  "LA RISPOSTA È OVVIA. SEI TU CHE FAI FINTA DI NON CAPIRE UN CAZZO.",
  "L'HAI GIÀ DECISO. VUOI SOLO CHE QUALCUNO TE LO CONFERMI. IO TI DO UNO SCHIAFFO.",
  "IL PROBLEMA NON È STA CAZZO DI DOMANDA. IL PROBLEMA SEI TU. MA LO SAI GIÀ.",
  "LA RISPOSTA GIUSTA È QUELLA CHE TI FA PIÙ PAURA. FATTI DUE CONTI.",
  "STAI CHIEDENDO LA COSA SBAGLIATA. LA DOMANDA VERA TE LA STAI NASCONDENDO.",
  "COLPO DI SCENA: LA RISPOSTA NON CAMBIA UN CAZZO. SEI TU CHE DEVI CAMBIARE.",
  "LO SAI CHE STAI PROCRASTINANDO ANCHE IN QUESTO MOMENTO? PENSA UN PO'.",
  "SE DEVI CHIEDERE A UN'APP, LA RISPOSTA È GIÀ DENTRO DI TE. E FA SCHIFO PURE QUELLA.",
  "LA DOMANDA VERA È: HAI LE PALLE PER REGGERE LA RISPOSTA? SPOILER: FORSE SÌ.",
  "L'UNIVERSO TI HA RISPOSTO TRE VOLTE. TU ERI A GUARDARE LE STORIE DEL TUO EX.",
  "IL TUO ISTINTO SA GIÀ TUTTO. SEI TU CHE NON HAI IL CORAGGIO DI ASCOLTARLO.",
  "LA RISPOSTA È DENTRO DI TE. SOTTO TUTTA L'ANSIA, LA PAURA E LE STRONZATE. SCAVA.",
  "MERCURIO RETROGRADO NON C'ENTRA UN CAZZO. IL PROBLEMA È IL TUO EGO.",
  "LE STELLE STANNO RIDENDO DI TE. MA È UNA RISATA AFFETTUOSA, STRANAMENTE.",
  "SMETTERESTI DI CHIEDERE RISPOSTE SE AVESSI IL CORAGGIO DI VIVERE LE DOMANDE.",
  "HAI PIÙ PALLE DI QUANTO PENSI. IL PROBLEMA È CHE NON LE USI MAI, COGLIONE.",
  "SEI MEGLIO DI COSÌ E LO SAI. SMETTILA DI ACCONTENTARTI, PEZZO DI STRONZO.",
  "FALLO. IL RIMPIANTO FA PIÙ MALE DI QUALSIASI FIGURA DI MERDA.",
  "L'UNICA RISPOSTA SBAGLIATA È RESTARE FERMO LÌ COME UN MONUMENTO AL NIENTE.",
  "FALLO. SBAGLIERAI. PIANGERAI. E POI LO RIFARAI. PERCHÉ SEI PIÙ FORTE DI QUANTO CREDI.",
  "SÌ. E QUESTA VOLTA NON SABOTARTI. SEI STANCO DI PERDERTI DA SOLO, LO VEDO.",
  "SEI SPAVENTATO? BENE. VUOL DIRE CHE CI TIENI DAVVERO. ORA MUOVITI.",
  "LO MERITI PIÙ DI QUANTO PENSI. E STO PARLANDO SERIO, STRONZO.",
  "FALLO E SMETTILA DI CHIEDERE IL PERMESSO AL MONDO INTERO. LA TUA VITA, LE TUE STRONZATE.",
  "CE LA FARAI. NON PERCHÉ SEI SPECIALE, MA PERCHÉ SEI TROPPO TESTARDO PER MOLLARE.",
  "SEI A UN PASSO DAL FARCELA. IL PROBLEMA È CHE FAI SEMPRE QUEL PASSO NELLA DIREZIONE SBAGLIATA.",
  "HAI SBAGLIATO MILLE VOLTE E SEI ANCORA QUI. QUESTO TI DICE QUALCOSA, CRETINO? SEI TOSTO.",
  "CORAGGIO, CAZZO. LA VITA È TROPPO CORTA PER STARE A PENSARCI SU COME UN VECCHIO DI MERDA.",
  "FALLO ADESSO. TRA UN ANNO RINGRAZIERAI QUESTO MOMENTO DI CAZZATA COSMICA.",
  "LA VERITÀ? NON VUOI UNA RISPOSTA. VUOI CHE QUALCUNO TI DICA POVERINO. VAFFANCULO.",
  "MOLLA IL TELEFONO E PARLANE CON QUALCUNO IN CARNE E OSSA, SFIGATO.",
  "LA RISPOSTA È DENTRO AL FRIGO. MANGIA QUALCOSA, PIANGI, E POI DECIDI.",
  "FALLO DOMANI. OGGI SEI TALMENTE RINCOGLIONITO CHE NON DOVRESTI NEANCHE VESTIRTI DA SOLO.",
  "STAI CERCANDO UNA SCUSA PER NON FARLO. ECCOLA: NON HAI LE PALLE. CONTENTO ORA?",
  "IL DESTINO DICE SÌ. IL TUO EX DICE VAI A CAGARE. ASCOLTA IL DESTINO, PER UNA VOLTA.",
  "LE STELLE DICONO SÌ. LA TUA VITA SENTIMENTALE DI MERDA DICE SCAPPA. TU DECIDI.",
  "CHIUDI GLI OCCHI. RESPIRA. E POI FAI QUELLO CHE AVRESTI FATTO COMUNQUE, TESTA DI CAZZO.",
  "SMETTILA DI PENSARCI E FALLO. IL PEGGIO CHE PUÒ SUCCEDERE È CHE IMPARI QUALCOSA.",
  "PRENDI STA RISPOSTA, FICCATELA IN TASCA, E FANNE QUELLO CHE VUOI. TANTO FARAI DI TESTA TUA.",
  "DORMICI SU. MA SUL SERIO, NON È UNA SCUSA PER PROCRASTINARE, DORMI E POI DECIDI.",
  "LA RISPOSTA NON CONTA UN CAZZO. CONTA QUELLO CHE FAI DOPO AVER CHIUSO STA APP.",
  "PARLANE COL TUO MIGLIORE AMICO. SE NON CE L'HAI, IL PROBLEMA È PIÙ GROSSO DI STA DOMANDA.",
  "RESPIRA. NON È LA FINE DEL MONDO. ANCHE SE TU LA VIVI COME SE LO FOSSE, DRAMMA QUEEN.",
  "QUALSIASI COSA DECIDI, FALLA CON CONVINZIONE. MEZZA DECISIONE = MERDA INTERA.",
  "SE TI SERVE ANCORA UNA CONFERMA DOPO QUESTA, IL PROBLEMA NON È LA RISPOSTA. SEI TU.",
  "LA RISPOSTA È SÌ MA TU NON SEI PRONTO. COME QUELLA VOLTA CON LA TUA EX.",
  "L'UNIVERSO HA UN PIANO PER TE. IL PROBLEMA È CHE ASSOMIGLIA A UNA BARZELLETTA.",
  "IL TUO OROSCOPO DICE: STAI A CASA, CHIUDI TUTTO, NON TOCCARE NIENTE.",
  "L'ULTIMA VOLTA CHE QUALCUNO HA FATTO QUESTA DOMANDA È FINITA MALE. FAI TU.",
  "TECNICAMENTE SÌ. PRATICAMENTE SEI FOTTUTO. MA ALMENO È UN SÌ, NO?",
  "LA BUONA NOTIZIA: LA RISPOSTA È SÌ. LA CATTIVA: NON CAMBIA NIENTE DELLA TUA VITA.",
  "SÌ, MA TIPO QUEL SÌ CHE DICI AL CAMERIERE QUANDO CHIEDE SE VA TUTTO BENE E TI STA BRUCIANDO LA BOCCA.",
  "NO, MA GUARDALA DAL LATO POSITIVO: ALMENO ORA SAI. PRIMA ERI IGNORANTE E INDECISO.",
  "TIRA UNA MONETA. SE ESCE TESTA, FAI. SE ESCE CROCE, FAI LO STESSO. LA MONETA NON CONTA UN CAZZO.",
  "LA RISPOSTA ESISTE MA È RISERVATA A CHI NON CHIEDE CONFERME A UNO SCHERMO ALLE DUE DI NOTTE.",
];

const FP = [
  "M12 2C10.2 2 8.5 2.7 7.2 4","M16.8 4C15.5 2.7 13.8 2 12 2",
  "M12 4C10.8 4 9.6 4.5 8.7 5.3","M15.3 5.3C14.4 4.5 13.2 4 12 4",
  "M12 6C11.2 6 10.5 6.3 9.9 6.9","M14.1 6.9C13.5 6.3 12.8 6 12 6",
  "M6 8C5.2 9.5 4.8 11.2 5 13","M19 13C19.2 11.2 18.8 9.5 18 8",
  "M7 14C7.3 16 8.5 17.8 10.2 19","M13.8 19C15.5 17.8 16.7 16 17 14",
  "M5.5 15C6.2 17.8 8 20 10.5 21.2","M13.5 21.2C16 20 17.8 17.8 18.5 15",
  "M12 10C11.4 10 11 10.4 11 11L11 15C11 15.6 11.4 16 12 16",
  "M12 16C12.6 16 13 15.6 13 15L13 11C13 10.4 12.6 10 12 10",
];

const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
const SPRING_SOFT = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function useAudio() {
  const ctx = useRef<AudioContext | null>(null);
  const osc = useRef<OscillatorNode | null>(null);
  const gain = useRef<GainNode | null>(null);
  const ns = useRef<AudioBufferSourceNode | null>(null);
  const nsG = useRef<GainNode | null>(null);

  const getCtx = () => {
    if (!ctx.current) try { ctx.current = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch(e) {}
    if (ctx.current?.state === "suspended") ctx.current.resume().catch(() => {});
    return ctx.current;
  };

  const vib = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch(e) {} };

  const startCharge = (dur: number) => {
    const c = getCtx(); if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(45, c.currentTime);
      o.frequency.linearRampToValueAtTime(120, c.currentTime + dur / 1000);
      g.gain.setValueAtTime(0, c.currentTime);
      g.gain.linearRampToValueAtTime(0.15, c.currentTime + dur / 1000);
      o.connect(g); g.connect(c.destination); o.start();
      osc.current = o; gain.current = g;
      const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      const n = c.createBufferSource(); n.buffer = buf; n.loop = true;
      const ng = c.createGain(); ng.gain.setValueAtTime(0, c.currentTime);
      ng.gain.linearRampToValueAtTime(0.04, c.currentTime + dur / 1000);
      const f = c.createBiquadFilter(); f.type = "lowpass";
      f.frequency.setValueAtTime(200, c.currentTime);
      f.frequency.linearRampToValueAtTime(800, c.currentTime + dur / 1000);
      n.connect(f); f.connect(ng); ng.connect(c.destination); n.start();
      ns.current = n; nsG.current = ng;
    } catch(e) {}
  };

  const stopCharge = (fade = 0.1) => {
    const c = getCtx(); if (!c) return;
    const now = c.currentTime;
    try {
      [gain, nsG].forEach(ref => { if (ref.current) { ref.current.gain.cancelScheduledValues(now); ref.current.gain.setValueAtTime(ref.current.gain.value, now); ref.current.gain.linearRampToValueAtTime(0, now + fade); }});
      setTimeout(() => { try { osc.current?.stop(); } catch(e) {} try { ns.current?.stop(); } catch(e) {} osc.current = null; ns.current = null; gain.current = null; nsG.current = null; }, fade * 1000 + 50);
    } catch(e) {}
  };

  const playReveal = () => {
    const c = getCtx(); if (!c) return;
    try {
      const now = c.currentTime;
      const o1 = c.createOscillator(), g1 = c.createGain();
      o1.type = "sine"; o1.frequency.setValueAtTime(80, now); o1.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      g1.gain.setValueAtTime(0.35, now); g1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      o1.connect(g1); g1.connect(c.destination); o1.start(now); o1.stop(now + 0.7);
      const o2 = c.createOscillator(), g2 = c.createGain();
      o2.type = "triangle"; o2.frequency.setValueAtTime(800, now); o2.frequency.exponentialRampToValueAtTime(200, now + 0.8);
      g2.gain.setValueAtTime(0.08, now); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      o2.connect(g2); g2.connect(c.destination); o2.start(now); o2.stop(now + 0.9);
      const buf = c.createBuffer(1, c.sampleRate * 0.15, c.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const n = c.createBufferSource(); n.buffer = buf;
      const ng = c.createGain(); ng.gain.setValueAtTime(0.12, now); ng.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      const hf = c.createBiquadFilter(); hf.type = "highpass"; hf.frequency.value = 2000;
      n.connect(hf); hf.connect(ng); ng.connect(c.destination); n.start(now);
    } catch(e) {}
  };

  const playTap = () => {
    const c = getCtx(); if (!c) return;
    try {
      const now = c.currentTime;
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(600, now); o.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      g.gain.setValueAtTime(0.1, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      o.connect(g); g.connect(c.destination); o.start(now); o.stop(now + 0.12);
    } catch(e) {}
  };

  const cleanup = () => { stopCharge(0); try { ctx.current?.close(); } catch(e) {} };

  return { vib, startCharge, stopCharge, playReveal, playTap, cleanup };
}

function Oracle({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<"idle"|"charging"|"revealing"|"reveal"|"resetting">("idle");
  const [answer, setAnswer] = useState("");
  const [words, setWords] = useState<{ ch: string; delay: number }[][]>([]);
  const [lastIdx, setLastIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [bgE, setBgE] = useState(0);
  const holdT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progI = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStart = useRef<number>(0);
  const [, tick] = useState(0);
  const audio = useAudio();
  const DUR = 2000;

  const getRandom = useCallback(() => {
    let i; do { i = Math.floor(Math.random() * R.length); } while (i === lastIdx);
    setLastIdx(i); return R[i];
  }, [lastIdx]);

  const start = () => {
    if (phase === "reveal") { audio.playTap(); audio.vib(15); setPhase("resetting"); setTimeout(() => { setAnswer(""); setWords([]); setProgress(0); setBgE(0); setPhase("idle"); }, 400); return; }
    if (phase !== "idle") return;
    audio.playTap(); audio.vib(20);
    setPhase("charging"); holdStart.current = Date.now(); setBgE(0);
    audio.startCharge(DUR);
    progI.current = setInterval(() => {
      const p = Math.min((Date.now() - holdStart.current) / DUR, 1);
      setProgress(p); setBgE(p);
      if (p >= 0.5 && p < 0.52) audio.vib(25);
      if (p >= 0.85 && p < 0.87) audio.vib(40);
    }, 16);
    holdT.current = setTimeout(() => {
      clearInterval(progI.current!); audio.stopCharge(0.3);
      setProgress(1); setBgE(1);
      setPhase("revealing"); audio.vib([50, 30, 80]); audio.playReveal();
      const a = getRandom();
      let ci = 0;
      const w = a.split(" ").map(word => { const chars = word.split("").map(ch => ({ ch, delay: ci++ * 0.016 + 0.5 })); ci++; return chars; });
      setTimeout(() => { setWords(w); setAnswer(a); setPhase("reveal"); setTimeout(() => setBgE(0.15), 1000); }, 500);
    }, DUR);
  };

  const cancel = () => {
    if (phase === "charging") {
      clearTimeout(holdT.current!); clearInterval(progI.current!);
      audio.stopCharge(0.1); audio.vib(0);
      setPhase("idle"); setProgress(0); setBgE(0);
    }
  };

  useEffect(() => () => { clearTimeout(holdT.current!); clearInterval(progI.current!); audio.cleanup(); }, []);
  useEffect(() => { if (phase !== "charging") return; const id = setInterval(() => tick(x => x + 1), 16); return () => clearInterval(id); }, [phase]);

  const shake = phase === "charging" ? progress * progress * 6 : 0;
  const sx = phase === "charging" ? Math.sin(Date.now() * 0.05) * shake : 0;
  const sy = phase === "charging" ? Math.cos(Date.now() * 0.07) * shake : 0;

  const isRevealed = phase === "reveal" || phase === "revealing";
  const chargeText = progress < 0.3 ? "Concentrati, coglione..." : progress < 0.6 ? "Pensa forte, cazzo..." : progress < 0.85 ? "Tieni duro, stronzo..." : "Ci siamo, merda...";

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none" as any,overflow:"hidden",position:"relative",padding:"env(safe-area-inset-top,16px) 20px env(safe-area-inset-bottom,16px)",touchAction:"manipulation",boxSizing:"border-box"}}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
        @keyframes fpDraw{from{stroke-dashoffset:30;opacity:0}to{stroke-dashoffset:0;opacity:1}}
        @keyframes fpPulse{0%,100%{opacity:.2}50%{opacity:.45}}
        @keyframes scanP{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes charReveal{0%{opacity:0;transform:translateY(20px) scale(.7);filter:blur(8px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
        @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes gentleBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes revealGlow{0%{box-shadow:0 0 0 rgba(244,196,48,0)}40%{box-shadow:0 0 80px rgba(244,196,48,.3)}100%{box-shadow:0 0 25px rgba(244,196,48,.08)}}
        @keyframes bgPulse{0%,100%{opacity:.03}50%{opacity:.08}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse at 50% 45%,rgba(244,196,48,${bgE*.08}) 0%,transparent 55%)`,transition:"background .8s ease"}}/>
      <div style={{position:"fixed",inset:0,opacity:.035,pointerEvents:"none",animation:"bgPulse 8s ease-in-out infinite",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>

      <div onClick={onBack} style={{position:"fixed",top:"max(env(safe-area-inset-top,16px),16px)",left:16,zIndex:10,cursor:"pointer",padding:"10px 0",opacity:.4,transition:"opacity .2s"}} onMouseEnter={e => (e.currentTarget.style.opacity="1")} onMouseLeave={e => (e.currentTarget.style.opacity=".4")}>
        <span style={{fontSize:13,fontWeight:500,color:"#F4C430",letterSpacing:1}}>← Menu</span>
      </div>

      <div style={{textAlign:"center",marginBottom:isRevealed?0:"min(3vh,20px)",opacity:isRevealed?0:1,maxHeight:isRevealed?0:200,overflow:"hidden",transition:`all .6s ${SPRING}`,flexShrink:0}}>
        <h1 style={{fontSize:"min(10vw,42px)",fontWeight:900,letterSpacing:-1,margin:0,lineHeight:1.05}}>
          L'ORACOLO<br/><span style={{color:"#F4C430"}}>BASTARDO</span>
        </h1>
      </div>

      <div onMouseDown={start} onMouseUp={cancel} onMouseLeave={cancel} onTouchStart={start} onTouchEnd={cancel}
        style={{position:"relative",width:isRevealed?"min(30vw,120px)":"min(52vw,210px)",height:isRevealed?"min(30vw,120px)":"min(52vw,210px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transform:`translate(${sx}px,${sy}px)`,transition:`width .7s ${SPRING}, height .7s ${SPRING}`,animation:phase==="idle"?"gentleBob 5s ease-in-out infinite":"none"}}>

        {(phase==="charging"||isRevealed)&&<svg viewBox="0 0 200 200" style={{position:"absolute",inset:0,width:"100%",height:"100%",transform:"rotate(-90deg)",filter:`drop-shadow(0 0 ${4+progress*12}px rgba(244,196,48,${.15+progress*.45}))`}}>
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(244,196,48,.04)" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="96" fill="none" stroke="#F4C430" strokeWidth="2" strokeDasharray={`${progress*603} 603`} strokeLinecap="round"/>
        </svg>}

        <div style={{width:"78%",height:"78%",borderRadius:"50%",background:isRevealed?"radial-gradient(circle at 42% 38%,#1a1708,#0a0a0a)":phase==="charging"?`radial-gradient(circle at 42% 38%,rgba(26,23,8,${progress}),#0a0a0a)`:"radial-gradient(circle at 42% 38%,#111,#0a0a0a)",border:`1px solid rgba(244,196,48,${isRevealed?.3:.04+progress*.25})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",transition:`border .4s, background .4s, box-shadow .6s ${SPRING}`,animation:isRevealed?"revealGlow 1.2s ease-out forwards":"none"}}>

          {phase==="idle"&&<svg viewBox="0 0 24 24" style={{width:"42%",height:"42%",position:"absolute",animation:"fpPulse 4s ease-in-out infinite"}}>
            {FP.map((d,i) => <path key={i} d={d} fill="none" stroke="#F4C430" strokeWidth=".5" strokeLinecap="round" opacity={.15+(i%3)*.08} style={{animation:`fpDraw 2s ease ${i*.09}s both`,strokeDasharray:30}}/>)}
          </svg>}

          {phase==="charging"&&<>
            <svg viewBox="0 0 24 24" style={{width:"42%",height:"42%",position:"absolute"}}>
              {FP.map((d,i) => {const p=Math.max(0,Math.min(1,(progress*FP.length-i)/2.5)); return <path key={i} d={d} fill="none" stroke="#F4C430" strokeWidth={.4+p*.4} strokeLinecap="round" opacity={p*.8} style={{strokeDasharray:30,strokeDashoffset:30-p*30,filter:p>.4?`drop-shadow(0 0 ${p*3}px rgba(244,196,48,${p*.5}))`:"none"}}/>})}
            </svg>
            <div style={{position:"absolute",width:"48%",height:1.5,background:"linear-gradient(90deg,transparent,rgba(244,196,48,.8),transparent)",top:`${22+progress*56}%`,boxShadow:"0 0 14px rgba(244,196,48,.35)",borderRadius:1,animation:"scanP .7s ease-in-out infinite"}}/>
          </>}

          {(phase==="revealing"||phase==="reveal")&&<img src={logo} alt="" style={{position:"absolute",width:"65%",height:"65%",objectFit:"contain",borderRadius:"50%",opacity:phase==="reveal"?1:0,transform:phase==="reveal"?"scale(1)":"scale(.7)",transition:`all .5s ${SPRING}`,filter:"drop-shadow(0 0 20px rgba(244,196,48,.4))"}}/>}
        </div>
      </div>

      <div style={{minHeight:"min(28vh,200px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:"min(3vh,20px)",maxWidth:"min(90vw,380px)",width:"100%",textAlign:"center",flexShrink:1}}>

        {phase==="idle"&&<div style={{animation:"fadeIn .8s ease both"}}>
          <p style={{fontSize:"min(3.2vw,13px)",color:"rgba(246,246,244,.2)",fontWeight:300,letterSpacing:1,margin:0,lineHeight:1.6}}>
            Pensa alla domanda.<br/>Tieni premuto.
          </p>
        </div>}

        {phase==="charging"&&<div style={{textAlign:"center"}}>
          <p style={{fontSize:"min(3vw,12px)",fontWeight:600,letterSpacing:3,textTransform:"uppercase",color:`rgba(244,196,48,${.3+progress*.7})`,margin:0}}>{chargeText}</p>
        </div>}

        {phase==="reveal"&&<div>
          <div style={{width:"min(10vw,40px)",height:1,margin:"0 auto min(2vh,14px)",background:"linear-gradient(90deg,transparent,#F4C430,transparent)",animation:"lineGrow .4s ease .3s both",transformOrigin:"center"}}/>
          <p style={{fontSize:"min(6vw,24px)",fontWeight:800,lineHeight:1.45,margin:"0 0 min(3vh,22px) 0",letterSpacing:.2,color:"#F6F6F4",padding:"0 2px",wordSpacing:"0.12em"}}>
            {words.map((w,wi) => <span key={wi} style={{display:"inline-block",whiteSpace:"nowrap",marginRight:"0.28em"}}>{w.map((c,ci) => <span key={ci} style={{display:"inline-block",animation:`charReveal .45s ${SPRING} ${c.delay}s both`}}>{c.ch}</span>)}</span>)}
          </p>
          <div style={{opacity:0,animation:`fadeIn .4s ease ${.4+(words.reduce((a,w)=>a+w.length,0))*.016+.5}s forwards`}}>
            <p style={{fontSize:"min(2.5vw,9px)",color:"rgba(246,246,244,.15)",margin:0,letterSpacing:3,textTransform:"uppercase"}}>Tocca per un altro schiaffo</p>
          </div>
        </div>}

        {phase==="resetting"&&<div style={{animation:"fadeOut .35s ease forwards"}}><p style={{fontSize:"min(6vw,24px)",fontWeight:800,lineHeight:1.45,color:"#F6F6F4"}}>{answer}</p></div>}
      </div>

      <div style={{position:"fixed",bottom:"max(env(safe-area-inset-bottom,10px),10px)",left:0,right:0,textAlign:"center",fontSize:"min(2vw,7px)",color:"rgba(246,246,244,.06)",letterSpacing:4,textTransform:"uppercase"}}>Le stelle non ti calcolano</div>
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("home");
  const [transitioning, setTransitioning] = useState(false);

  const goOracle = () => { setTransitioning(true); setTimeout(() => setScreen("oracolo"), 400); };
  const goHome = () => { setTransitioning(false); setScreen("home"); };

  if (screen === "oracolo") return <Oracle onBack={goHome} />;

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",userSelect:"none",WebkitUserSelect:"none",position:"relative",padding:"max(env(safe-area-inset-top,20px),20px) 24px max(env(safe-area-inset-bottom,20px),24px)",boxSizing:"border-box",opacity:transitioning?0:1,transform:transitioning?"scale(1.03)":"scale(1)",transition:`all .4s ${SPRING}`,overflowY:"auto",overflowX:"hidden"}}>
      <div style={{flex:1}}/>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        @keyframes homeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes logoPulse{0%,100%{filter:drop-shadow(0 0 10px rgba(244,196,48,.15))}50%{filter:drop-shadow(0 0 22px rgba(244,196,48,.4))}}
      `}</style>

      <div style={{position:"fixed",inset:0,opacity:.035,pointerEvents:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 30%,rgba(244,196,48,.04) 0%,transparent 50%)"}}/>

      <div style={{textAlign:"center",marginBottom:"min(4vh,28px)",animation:`homeIn .7s ${SPRING} both`,flexShrink:0}}>
        <img src={PRIAM_B64} alt="" style={{width:"min(18vw,72px)",height:"min(18vw,72px)",borderRadius:"50%",objectFit:"cover",border:"1.5px solid rgba(244,196,48,.25)",animation:"logoPulse 4s ease-in-out infinite",marginBottom:12,display:"block",marginLeft:"auto",marginRight:"auto"}}/>
        <h1 style={{fontSize:"min(9vw,38px)",fontWeight:900,letterSpacing:-1,margin:0,lineHeight:1.05}}>
          ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span>
        </h1>
        <p style={{fontSize:"min(2.5vw,10px)",color:"rgba(246,246,244,.2)",letterSpacing:4,textTransform:"uppercase",marginTop:6,fontWeight:300}}>Psicologia mascherata da astrologia</p>
      </div>

      <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:10}}>

        <div onClick={goOracle} style={{background:"linear-gradient(135deg,rgba(244,196,48,.08),rgba(244,196,48,.02))",border:"1px solid rgba(244,196,48,.2)",borderRadius:14,padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",animation:`homeIn .7s ${SPRING} .1s both`,transition:`transform .2s ${SPRING}, box-shadow .2s`}} onMouseDown={e => (e.currentTarget.style.transform="scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform="scale(1)")} onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} onTouchStart={e => (e.currentTarget.style.transform="scale(0.98)")} onTouchEnd={e => (e.currentTarget.style.transform="scale(1)")}>
          <div>
            <div style={{fontSize:"min(4.5vw,17px)",fontWeight:800,letterSpacing:.3}}>L'ORACOLO BASTARDO</div>
            <div style={{fontSize:"min(2.8vw,11px)",color:"rgba(246,246,244,.35)",marginTop:3,fontWeight:300}}>Pensa. Premi. Incassa.</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(244,196,48,.4)" strokeWidth="2" strokeLinecap="round" style={{width:16,height:16,flexShrink:0}}><path d="M9 18l6-6-6-6"/></svg>
        </div>

        <div style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.06)",borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",animation:`homeIn .7s ${SPRING} .2s both`,opacity:.45}}>
          <div>
            <div style={{fontSize:"min(4.5vw,17px)",fontWeight:800,letterSpacing:.3,color:"rgba(246,246,244,.45)"}}>TAROCCHI GIORNALIERI</div>
            <div style={{fontSize:"min(2.8vw,11px)",color:"rgba(246,246,244,.2)",marginTop:3,fontWeight:300}}>La tua lettura quotidiana</div>
          </div>
          <div style={{background:"rgba(244,196,48,.12)",border:"1px solid rgba(244,196,48,.25)",borderRadius:6,padding:"3px 8px",fontSize:"min(2.3vw,8px)",fontWeight:700,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase",flexShrink:0}}>IN ARRIVO</div>
        </div>

        <div onClick={() => navigate("/shop")} style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.06)",borderRadius:14,padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",animation:`homeIn .7s ${SPRING} .3s both`,transition:`transform .2s ${SPRING}`}} onMouseDown={e => (e.currentTarget.style.transform="scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform="scale(1)")} onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} onTouchStart={e => (e.currentTarget.style.transform="scale(0.98)")} onTouchEnd={e => (e.currentTarget.style.transform="scale(1)")}>
          <div>
            <div style={{fontSize:"min(4.5vw,17px)",fontWeight:800,letterSpacing:.3}}>SHOP</div>
            <div style={{fontSize:"min(2.8vw,11px)",color:"rgba(246,246,244,.35)",marginTop:3,fontWeight:300}}>Merch ufficiale</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(246,246,244,.25)" strokeWidth="2" strokeLinecap="round" style={{width:14,height:14,flexShrink:0}}><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </div>

        <div onClick={() => window.open("https://www.instagram.com/astro.bastardo/","_blank")} style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.06)",borderRadius:14,padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",animation:`homeIn .7s ${SPRING} .4s both`,transition:`transform .2s ${SPRING}`}} onMouseDown={e => (e.currentTarget.style.transform="scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform="scale(1)")} onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} onTouchStart={e => (e.currentTarget.style.transform="scale(0.98)")} onTouchEnd={e => (e.currentTarget.style.transform="scale(1)")}>
          <div>
            <div style={{fontSize:"min(4.5vw,17px)",fontWeight:800,letterSpacing:.3}}>SEGUICI SU INSTAGRAM</div>
            <div style={{fontSize:"min(2.8vw,11px)",color:"rgba(246,246,244,.35)",marginTop:3,fontWeight:300}}>@astro.bastardo</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(246,246,244,.25)" strokeWidth="2" strokeLinecap="round" style={{width:14,height:14,flexShrink:0}}><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </div>
      </div>
      <div style={{flex:1,minHeight:20}}/>

      <div style={{position:"fixed",bottom:"max(env(safe-area-inset-bottom,10px),10px)",left:0,right:0,textAlign:"center",fontSize:"min(2vw,7px)",color:"rgba(246,246,244,.06)",letterSpacing:4,textTransform:"uppercase"}}>Le stelle non ti calcolano</div>
    </div>
  );
};

export default Index;
