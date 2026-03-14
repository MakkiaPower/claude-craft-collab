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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
    } catch { /* network error */ }
    setLoading(null)
  }

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 16px"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:"100%",maxWidth:420,animation:`fadeUp .8s ${S} both`}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:-.5,margin:"0 0 24px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
          <h2 style={{fontSize:28,fontWeight:900,letterSpacing:-.5,margin:"0 0 10px"}}>Scegli il tuo piano</h2>
          <p style={{fontSize:14,color:"rgba(246,246,244,.35)",margin:0}}>Oroscopo personalizzato, scritto per te. Ogni giorno.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:window.innerWidth>=400?"1fr 1fr":"1fr",gap:14}}>
          {/* Mensile */}
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:16,padding:22,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:15,fontWeight:800,marginBottom:6}}>Mensile</div>
            <div style={{marginBottom:14}}>
              <span style={{fontSize:30,fontWeight:900,letterSpacing:-.5}}>5,99&euro;</span>
              <span style={{fontSize:13,color:"rgba(246,246,244,.3)"}}>/mese</span>
            </div>
            <p style={{fontSize:12,color:"rgba(246,246,244,.3)",flex:1,marginBottom:18,lineHeight:1.5}}>Cancella quando vuoi.</p>
            <button onClick={()=>handleCheckout('monthly')} disabled={loading!==null} style={{background:"transparent",border:"1px solid rgba(244,196,48,.25)",color:"#F4C430",borderRadius:12,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:loading?0.5:1,transition:`transform .15s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
              {loading==='monthly'?'...':'Abbonati'}
            </button>
          </div>

          {/* Annuale */}
          <div style={{background:"rgba(244,196,48,.05)",border:"1px solid rgba(244,196,48,.25)",borderRadius:16,padding:22,display:"flex",flexDirection:"column",position:"relative"}}>
            <span style={{position:"absolute",top:-9,right:14,background:"#F4C430",color:"#0a0a0a",borderRadius:8,padding:"4px 10px",fontSize:9,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>-30%</span>
            <div style={{fontSize:15,fontWeight:800,marginBottom:6}}>Annuale</div>
            <div style={{marginBottom:14}}>
              <span style={{fontSize:30,fontWeight:900,letterSpacing:-.5}}>49,99&euro;</span>
              <span style={{fontSize:13,color:"rgba(246,246,244,.3)"}}>/anno</span>
            </div>
            <p style={{fontSize:12,color:"rgba(246,246,244,.3)",flex:1,marginBottom:18,lineHeight:1.5}}>Per i bastardi convinti.</p>
            <button onClick={()=>handleCheckout('yearly')} disabled={loading!==null} style={{background:"#F4C430",border:"none",color:"#0a0a0a",borderRadius:12,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:loading?0.5:1,transition:`transform .15s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
              {loading==='yearly'?'...':'Abbonati'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
