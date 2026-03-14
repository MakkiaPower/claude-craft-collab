import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { Check } from 'lucide-react'

const features = [
  'Scritto per te ogni giorno, non per il tuo segno',
  'Basato sulla tua mappa natale completa',
  'Panoramica, amore, lavoro e consiglio quotidiano',
  'Accesso da web e da app (in arrivo)',
]

const S = `cubic-bezier(.22,1,.36,1)`

export default function OroscopoLanding() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",position:"relative",padding:"max(env(safe-area-inset-top,16px),16px) min(6vw,24px) max(env(safe-area-inset-bottom,16px),16px)",boxSizing:"border-box",overflowY:"auto"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes holdPulse{0%,100%{opacity:.3}50%{opacity:.7}}`}</style>

      <div onClick={() => navigate("/")} style={{position:"fixed",top:"max(env(safe-area-inset-top,16px),16px)",left:16,zIndex:10,cursor:"pointer",padding:"10px 0",opacity:.4,transition:"opacity .2s"}} onMouseEnter={e=>(e.currentTarget.style.opacity="1")} onMouseLeave={e=>(e.currentTarget.style.opacity=".4")}>
        <span style={{fontSize:13,fontWeight:500,color:"#F4C430",letterSpacing:1}}>&larr; Menu</span>
      </div>

      <div style={{maxWidth:420,width:"100%",textAlign:"center",marginTop:"min(10vh,80px)"}}>
        <div style={{animation:`fadeUp .7s ${S} both`}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(204,51,51,.12)",border:"1px solid rgba(204,51,51,.3)",borderRadius:8,padding:"4px 12px",fontSize:10,fontWeight:700,color:"#CC3333",letterSpacing:1.5,textTransform:"uppercase",marginBottom:16}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#CC3333",animation:"holdPulse 2s ease-in-out infinite"}}/>
            Novità
          </span>
          <h1 style={{fontSize:"min(9vw,38px)",fontWeight:900,letterSpacing:-.5,margin:"16px 0 12px",lineHeight:1.1}}>
            OROSCOPO<br/><span style={{color:"#F4C430"}}>SU MISURA</span>
          </h1>
          <p style={{fontSize:"min(4vw,16px)",color:"rgba(246,246,244,.5)",lineHeight:1.6,margin:"0 0 24px"}}>
            Non il solito oroscopo per tutti i Pesci del mondo. Questo è scritto guardando il tuo cielo, con i tuoi transiti, per la tua giornata.
          </p>
        </div>

        <div style={{textAlign:"left",margin:"0 auto 32px",maxWidth:340,animation:`fadeUp .7s ${S} .1s both`}}>
          {features.map((f, i) => (
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
              <Check size={14} style={{color:"#F4C430",marginTop:3,flexShrink:0}}/>
              <span style={{fontSize:14,color:"rgba(246,246,244,.7)"}}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{animation:`fadeUp .7s ${S} .2s both`,display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
          <button onClick={() => navigate(user ? "/oroscopo/dashboard" : "/oroscopo/signup")} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px 32px",fontSize:16,fontWeight:800,letterSpacing:.3,cursor:"pointer",width:"100%",maxWidth:300,transition:`transform .2s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>
            {user ? "Vai al tuo oroscopo" : "Abbonati — 5,99\u20AC/mese"}
          </button>
          <span style={{fontSize:13,color:"rgba(246,246,244,.3)"}}>oppure 49,99&euro;/anno</span>
        </div>

        {/* Mini preview */}
        <div style={{marginTop:40,background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:16,textAlign:"left",animation:`fadeUp .7s ${S} .3s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2,textTransform:"uppercase"}}>Oggi</span>
            <span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(246,246,244,.5)"}}>
              <span style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.08)",borderRadius:6,fontSize:13}}>{'\u264F'}</span>
              Scorpione
            </span>
          </div>
          <div style={{background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.06)",borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#F4C430"}}/>
              <span style={{fontSize:10,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Panoramica</span>
            </div>
            <p style={{fontSize:13,color:"rgba(246,246,244,.7)",lineHeight:1.7,margin:0}}>
              Oggi Mercurio ti guarda storto e tu, invece di farti domande, stai cercando conferme. Smettila. La verità non è quella che ti fa sentire meglio...
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.06)",borderRadius:10,padding:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#CC3333"}}/>
                <span style={{fontSize:9,color:"#CC3333",letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>Amore</span>
              </div>
              <p style={{fontSize:11,color:"rgba(246,246,244,.45)",lineHeight:1.5,margin:0}}>Stai confondendo attaccamento con amore. Di nuovo.</p>
            </div>
            <div style={{background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.06)",borderRadius:10,padding:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#D4A843"}}/>
                <span style={{fontSize:9,color:"#D4A843",letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>Lavoro</span>
              </div>
              <p style={{fontSize:11,color:"rgba(246,246,244,.45)",lineHeight:1.5,margin:0}}>Quel progetto che rimandi? Oggi è il giorno sbagliato per rimandarlo.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,minHeight:40}}/>
    </div>
  )
}
