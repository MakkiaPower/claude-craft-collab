import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const S = `cubic-bezier(.22,1,.36,1)`

export default function OroscopoLanding() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (data.ok || res.ok) { setStatus('done'); return }
    } catch { /* network */ }
    setStatus('error')
  }

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",position:"relative",padding:"env(safe-area-inset-top,0) min(8vw,32px) env(safe-area-inset-bottom,0)",boxSizing:"border-box",textAlign:"center",overflow:"hidden"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseLine{0%,100%{opacity:.12}50%{opacity:.45}}
        @keyframes successIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
      `}</style>

      {/* Back */}
      <div onClick={() => navigate("/")} style={{position:"fixed",top:"max(env(safe-area-inset-top,16px),16px)",left:16,zIndex:10,cursor:"pointer",padding:"12px 4px",opacity:.35,transition:`opacity .3s ${S}`}} onMouseEnter={e=>(e.currentTarget.style.opacity="1")} onMouseLeave={e=>(e.currentTarget.style.opacity=".35")}>
        <span style={{fontSize:13,fontWeight:600,color:"#F4C430",letterSpacing:1.5}}>&#8592; MENU</span>
      </div>

      <div style={{maxWidth:480,width:"100%",padding:"0 4px"}}>
        {/* Headline */}
        <div style={{animation:`fadeUp 1s ${S} both`}}>
          <h1 style={{fontSize:"min(14vw,64px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.05,margin:"0 0 min(6vw,28px)"}}>
            STIAMO<br/>ARRIVANDO<br/>
            <span style={{color:"#F4C430"}}>BASTARDI.</span>
          </h1>
        </div>

        <div style={{animation:`fadeUp 1s ${S} .15s both`}}>
          <p style={{fontSize:"min(5.5vw,24px)",fontWeight:700,color:"rgba(246,246,244,.55)",lineHeight:1.35,margin:"0 0 6px"}}>
            E sarà personale.
          </p>
          <p style={{fontSize:"min(5.5vw,24px)",fontWeight:700,color:"rgba(246,246,244,.25)",lineHeight:1.35,margin:0}}>
            E farà ancora più male.
          </p>
        </div>

        {/* Separator */}
        <div style={{width:48,height:1,background:"linear-gradient(90deg,transparent,rgba(244,196,48,.6),transparent)",margin:"min(8vw,40px) auto",animation:"pulseLine 4s ease-in-out infinite"}}/>

        {/* Waitlist */}
        <div style={{animation:`fadeUp 1s ${S} .3s both`}}>
          {status === 'done' ? (
            <div style={{animation:`successIn .5s ${S} both`}}>
              <p style={{fontSize:"min(5vw,20px)",fontWeight:800,color:"#F4C430",margin:"0 0 8px",letterSpacing:-.3}}>Ci sei. Ti avvisiamo noi.</p>
              <p style={{fontSize:13,color:"rgba(246,246,244,.25)",margin:0}}>Niente spam. Solo una botta quando è pronto.</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} style={{display:"flex",gap:8,maxWidth:340,margin:"0 auto"}}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="la@tua.email"
                  style={{flex:1,background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .3s ${S}, background .3s`,minWidth:0}}
                  onFocus={e=>{e.currentTarget.style.borderColor="rgba(244,196,48,.5)";e.currentTarget.style.background="rgba(246,246,244,.07)"}}
                  onBlur={e=>{e.currentTarget.style.borderColor="rgba(246,246,244,.1)";e.currentTarget.style.background="rgba(246,246,244,.05)"}}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:14,padding:"16px 22px",fontSize:14,fontWeight:800,letterSpacing:1.5,cursor:"pointer",flexShrink:0,opacity:status==='loading'?.5:1,transition:`transform .15s ${S}, opacity .2s`}}
                  onMouseDown={e=>(e.currentTarget.style.transform="scale(0.94)")}
                  onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}
                  onTouchStart={e=>(e.currentTarget.style.transform="scale(0.94)")}
                  onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}
                >
                  {status === 'loading' ? '...' : 'AVVISAMI'}
                </button>
              </form>
              {status === 'error' && (
                <p style={{fontSize:13,color:"#CC3333",marginTop:14}}>Qualcosa è andato storto. Riprova.</p>
              )}
              <p style={{fontSize:11,color:"rgba(246,246,244,.15)",marginTop:20,letterSpacing:.5}}>
                Niente spam. Solo una botta quando è pronto.
              </p>
            </>
          )}
        </div>
      </div>

      <div style={{position:"fixed",bottom:"max(env(safe-area-inset-bottom,12px),12px)",left:0,right:0,textAlign:"center",fontSize:7,color:"rgba(246,246,244,.06)",letterSpacing:5,textTransform:"uppercase"}}>Le stelle non ti calcolano</div>
    </div>
  )
}
