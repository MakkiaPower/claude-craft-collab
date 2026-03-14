import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

const S = `cubic-bezier(.22,1,.36,1)`

export default function OroscopoLanding() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    const { error } = await oroscopoSupabase
      .from('waitlist')
      .insert({ email: email.trim().toLowerCase() })
    if (error) {
      // Duplicato o altro errore
      if (error.code === '23505') setStatus('done') // già iscritto, fai finta che sia ok
      else setStatus('error')
      return
    }
    setStatus('done')
  }

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",position:"relative",padding:"max(env(safe-area-inset-top,16px),16px) min(6vw,24px) max(env(safe-area-inset-bottom,16px),16px)",boxSizing:"border-box",textAlign:"center"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseLine{0%,100%{opacity:.15}50%{opacity:.4}}
      `}</style>

      <div onClick={() => navigate("/")} style={{position:"fixed",top:"max(env(safe-area-inset-top,16px),16px)",left:16,zIndex:10,cursor:"pointer",padding:"10px 0",opacity:.4,transition:"opacity .2s"}} onMouseEnter={e=>(e.currentTarget.style.opacity="1")} onMouseLeave={e=>(e.currentTarget.style.opacity=".4")}>
        <span style={{fontSize:13,fontWeight:500,color:"#F4C430",letterSpacing:1}}>&larr; Menu</span>
      </div>

      <div style={{maxWidth:500,width:"100%"}}>
        {/* Titolo */}
        <div style={{animation:`fadeUp .8s ${S} both`}}>
          <h1 style={{fontSize:"min(12vw,56px)",fontWeight:900,letterSpacing:-1,lineHeight:1.1,margin:"0 0 24px"}}>
            STIAMO ARRIVANDO<br/>
            <span style={{color:"#F4C430"}}>BASTARDI.</span>
          </h1>
          <p style={{fontSize:"min(6vw,26px)",fontWeight:800,color:"rgba(246,246,244,.6)",lineHeight:1.3,margin:"0 0 8px"}}>
            E sarà personale.
          </p>
          <p style={{fontSize:"min(6vw,26px)",fontWeight:800,color:"rgba(246,246,244,.35)",lineHeight:1.3,margin:0}}>
            E farà ancora più male.
          </p>
        </div>

        {/* Separatore */}
        <div style={{width:60,height:1.5,background:"linear-gradient(90deg,transparent,#F4C430,transparent)",margin:"40px auto",animation:"pulseLine 3s ease-in-out infinite"}}/>

        {/* Waitlist */}
        <div style={{animation:`fadeUp .8s ${S} .2s both`}}>
          {status === 'done' ? (
            <div>
              <p style={{fontSize:18,fontWeight:800,color:"#F4C430",margin:"0 0 8px"}}>Sei dentro, bastardo.</p>
              <p style={{fontSize:13,color:"rgba(246,246,244,.35)"}}>Ti avvisiamo noi. Niente spam.</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} style={{display:"flex",gap:8,maxWidth:360,margin:"0 auto"}}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="la@tua.email"
                  style={{flex:1,background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.12)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s",minWidth:0}}
                  onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")}
                  onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.12)")}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px 20px",fontSize:14,fontWeight:800,letterSpacing:1,cursor:"pointer",flexShrink:0,opacity:status==='loading'?.5:1,transition:`transform .2s ${S}`}}
                  onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")}
                  onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}
                >
                  {status === 'loading' ? '...' : 'AVVISAMI'}
                </button>
              </form>
              {status === 'error' && (
                <p style={{fontSize:13,color:"#CC3333",marginTop:12}}>Qualcosa è andato storto. Riprova.</p>
              )}
              <p style={{fontSize:12,color:"rgba(246,246,244,.2)",marginTop:16}}>
                Niente spam. Solo una botta quando è pronto.
              </p>
            </>
          )}
        </div>
      </div>

      <div style={{position:"fixed",bottom:"max(env(safe-area-inset-bottom,10px),10px)",left:0,right:0,textAlign:"center",fontSize:"min(2vw,7px)",color:"rgba(246,246,244,.06)",letterSpacing:4,textTransform:"uppercase"}}>Le stelle non ti calcolano</div>
    </div>
  )
}
