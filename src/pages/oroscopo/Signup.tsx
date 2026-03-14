import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Le password non coincidono.'); return }
    if (password.length < 6) { setError('La password deve avere almeno 6 caratteri.'); return }
    setLoading(true)
    const { data, error } = await oroscopoSupabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    // Se Supabase richiede conferma email, data.session sarà null
    if (!data.session) {
      setError('')
      setLoading(false)
      setConfirmEmail(true)
      return
    }
    navigate('/oroscopo/onboarding')
  }

  const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s"}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"16px min(6vw,24px)"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontSize:24,fontWeight:900,letterSpacing:-.5,margin:0}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
        </div>
        <h2 style={{fontSize:22,fontWeight:800,textAlign:"center",marginBottom:32}}>Unisciti ai bastardi.</h2>
        {confirmEmail ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>Controlla la tua email.</p>
            <p style={{fontSize:14,color:"rgba(246,246,244,.5)",lineHeight:1.6}}>Ti abbiamo inviato un link di conferma. Clicca il link nell'email, poi torna qui per accedere.</p>
            <Link to="/oroscopo/login" style={{display:"inline-block",marginTop:24,color:"#F4C430",fontSize:14,textDecoration:"none",fontWeight:600}}>Vai al login</Link>
          </div>
        ) : null}
        <form onSubmit={handleSignup} style={{display:confirmEmail?"none":"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="la@tua.email" style={inputStyle} onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")} onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.1)")}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Almeno 6 caratteri" style={inputStyle} onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")} onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.1)")}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Conferma password</label>
            <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required placeholder="Ripeti la password" style={inputStyle} onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")} onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.1)")}/>
          </div>
          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .2s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Creazione...' : 'Crea account'}
          </button>
        </form>
        <p style={{textAlign:"center",fontSize:13,color:"rgba(246,246,244,.4)",marginTop:24}}>
          Hai già un account? <Link to="/oroscopo/login" style={{color:"#F4C430",textDecoration:"none"}}>Accedi</Link>
        </p>
      </div>
    </div>
  )
}
