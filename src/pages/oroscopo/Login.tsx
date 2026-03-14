import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await oroscopoSupabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    navigate('/oroscopo/dashboard')
  }

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"16px min(6vw,24px)"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontSize:24,fontWeight:900,letterSpacing:-.5,margin:0}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
        </div>
        <h2 style={{fontSize:22,fontWeight:800,textAlign:"center",marginBottom:32}}>Bentornato, bastardo.</h2>
        <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="la@tua.email" style={{width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s"}} onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")} onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.1)")}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={{width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s"}} onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")} onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.1)")}/>
          </div>
          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .2s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
        <p style={{textAlign:"center",fontSize:13,color:"rgba(246,246,244,.4)",marginTop:24}}>
          Non hai un account? <Link to="/oroscopo/signup" style={{color:"#F4C430",textDecoration:"none"}}>Registrati</Link>
        </p>
      </div>
    </div>
  )
}
