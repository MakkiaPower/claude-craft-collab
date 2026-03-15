import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import logo from '@/assets/astrobastardo-logo.png'

const S = `cubic-bezier(.22,1,.36,1)`

export default function OroscopoLanding() {
  const navigate = useNavigate()

  // Se già loggato, vai diritto alla dashboard
  useEffect(() => {
    oroscopoSupabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate('/oroscopo/dashboard', { replace: true })
    }).catch(() => {})
  }, [navigate])

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:.03}50%{opacity:.06}}
        @keyframes logoPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(244,196,48,.08))}50%{filter:drop-shadow(0 0 16px rgba(244,196,48,.2))}}
      `}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 35%,rgba(244,196,48,.04) 0%,transparent 55%)",animation:"glowPulse 8s ease-in-out infinite"}}/>

      <div style={{maxWidth:340,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{animation:`fadeUp .6s ${S} both`}}>
          <img src={logo} alt="AstroBastardo" style={{width:56,height:56,borderRadius:"50%",objectFit:"contain",border:"1px solid rgba(244,196,48,.15)",animation:"logoPulse 5s ease-in-out infinite",display:"block",margin:"0 auto 32px"}}/>
        </div>

        {/* Title */}
        <div style={{animation:`fadeUp .6s ${S} .08s both`,marginBottom:48}}>
          <h1 style={{fontSize:"min(9vw,36px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,margin:0}}>
            Entra nella<br/>tua area.
          </h1>
        </div>

        {/* Buttons */}
        <div style={{display:"flex",flexDirection:"column",gap:12,animation:`fadeUp .6s ${S} .16s both`}}>
          <Link to="/oroscopo/login" style={{display:"block",background:"transparent",border:"1px solid rgba(244,196,48,.3)",color:"#F4C430",borderRadius:12,padding:"17px",fontSize:16,fontWeight:800,letterSpacing:.3,textAlign:"center",textDecoration:"none",transition:`transform .1s ${S}, border-color .25s`,WebkitTapHighlightColor:"transparent"}}
            onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}
            onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}
            onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.5)")} onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.3)")}>
            Accedi
          </Link>
          <Link to="/oroscopo/signup" style={{display:"block",background:"#F4C430",border:"none",color:"#0a0a0a",borderRadius:12,padding:"17px",fontSize:16,fontWeight:800,letterSpacing:.3,textAlign:"center",textDecoration:"none",transition:`transform .1s ${S}`,WebkitTapHighlightColor:"transparent",boxShadow:"0 2px 20px rgba(244,196,48,.15)"}}
            onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}
            onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            Registrati gratis
          </Link>
        </div>

        {/* Bastard note */}
        <p style={{fontSize:13,color:"rgba(246,246,244,.2)",marginTop:40,fontStyle:"italic",animation:`fadeUp .6s ${S} .24s both`}}>
          È gratis. Per ora.
        </p>
      </div>
    </div>
  )
}
