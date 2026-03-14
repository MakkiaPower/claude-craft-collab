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
    if (!data.session) { setConfirmEmail(true); setLoading(false); return }
    navigate('/oroscopo/onboarding')
  }

  const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .3s ${S}, background .3s`}
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(244,196,48,.5)";e.currentTarget.style.background="rgba(246,246,244,.07)"}
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(246,246,244,.1)";e.currentTarget.style.background="rgba(246,246,244,.05)"}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px min(8vw,32px)"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes successIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{width:"100%",maxWidth:360,animation:`fadeUp .8s ${S} both`}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:-.5,margin:"0 0 24px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
          <h2 style={{fontSize:28,fontWeight:900,letterSpacing:-.5,margin:0}}>Unisciti ai<br/>bastardi.</h2>
        </div>
        {confirmEmail ? (
          <div style={{textAlign:"center",animation:`successIn .5s ${S} both`}}>
            <p style={{fontSize:18,fontWeight:800,color:"#F4C430",marginBottom:12}}>Controlla la tua email.</p>
            <p style={{fontSize:14,color:"rgba(246,246,244,.4)",lineHeight:1.6}}>Ti abbiamo inviato un link di conferma. Clicca il link, poi torna qui.</p>
            <Link to="/oroscopo/login" style={{display:"inline-block",marginTop:28,color:"#F4C430",fontSize:14,textDecoration:"none",fontWeight:700}}>Vai al login</Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <label style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="la@tua.email" style={inputStyle} onFocus={focusIn} onBlur={focusOut}/>
              </div>
              <div>
                <label style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Almeno 6 caratteri" style={inputStyle} onFocus={focusIn} onBlur={focusOut}/>
              </div>
              <div>
                <label style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Conferma password</label>
                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required placeholder="Ripeti la password" style={inputStyle} onFocus={focusIn} onBlur={focusOut}/>
              </div>
              {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
              <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .15s ${S}, opacity .2s`,marginTop:8}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.97)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
                {loading ? 'Creazione...' : 'Crea account'}
              </button>
            </form>
            <p style={{textAlign:"center",fontSize:14,color:"rgba(246,246,244,.3)",marginTop:32}}>
              Hai già un account? <Link to="/oroscopo/login" style={{color:"#F4C430",textDecoration:"none",fontWeight:600}}>Accedi</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
