import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  async function handleCheckout(plan: 'monthly' | 'yearly') {
    if (!user) { navigate('/oroscopo/login'); return }
    setLoading(plan)
    const { data: { session } } = await oroscopoSupabase.auth.getSession()
    if (!session) { navigate('/oroscopo/login'); return }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
    } catch { /* network error */ }
    setLoading(null)
  }

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"16px min(6vw,24px)"}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontSize:24,fontWeight:900,letterSpacing:-.5,margin:0}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
        </div>
        <h2 style={{fontSize:24,fontWeight:800,textAlign:"center",marginBottom:8}}>Scegli il tuo piano</h2>
        <p style={{textAlign:"center",fontSize:14,color:"rgba(246,246,244,.4)",marginBottom:32}}>Oroscopo giornaliero personalizzato, scritto per te. Ogni giorno.</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {/* Mensile */}
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.1)",borderRadius:14,padding:20,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>Mensile</div>
            <div style={{marginBottom:12}}>
              <span style={{fontSize:28,fontWeight:900}}>5,99&euro;</span>
              <span style={{fontSize:13,color:"rgba(246,246,244,.4)"}}>/mese</span>
            </div>
            <p style={{fontSize:12,color:"rgba(246,246,244,.35)",flex:1,marginBottom:16}}>Cancella quando vuoi.</p>
            <button onClick={()=>handleCheckout('monthly')} disabled={loading!==null} style={{background:"transparent",border:"1px solid rgba(244,196,48,.3)",color:"#F4C430",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:loading?0.5:1,transition:`transform .2s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>
              {loading==='monthly'?'Caricamento...':'Abbonati'}
            </button>
          </div>

          {/* Annuale */}
          <div style={{background:"rgba(244,196,48,.06)",border:"1px solid rgba(244,196,48,.3)",borderRadius:14,padding:20,display:"flex",flexDirection:"column",position:"relative"}}>
            <span style={{position:"absolute",top:-8,right:12,background:"#F4C430",color:"#0a0a0a",borderRadius:6,padding:"3px 8px",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Più conveniente</span>
            <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>Annuale</div>
            <div style={{marginBottom:12}}>
              <span style={{fontSize:28,fontWeight:900}}>49,99&euro;</span>
              <span style={{fontSize:13,color:"rgba(246,246,244,.4)"}}>/anno</span>
            </div>
            <p style={{fontSize:12,color:"rgba(246,246,244,.35)",flex:1,marginBottom:16}}>Risparmi il 30%.</p>
            <button onClick={()=>handleCheckout('yearly')} disabled={loading!==null} style={{background:"#F4C430",border:"none",color:"#0a0a0a",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:loading?0.5:1,transition:`transform .2s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>
              {loading==='yearly'?'Caricamento...':'Abbonati'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
