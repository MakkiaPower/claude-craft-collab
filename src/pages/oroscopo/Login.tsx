import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await Promise.race([
        oroscopoSupabase.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 10000)),
      ])
      if (error) { setError(error.message); setLoading(false); return }
      navigate('/oroscopo/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error && err.message === 'TIMEOUT' ? 'Timeout \u2014 riprova.' : 'Errore imprevisto.')
      setLoading(false)
    }
  }, [email, password, navigate])

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 16px"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:"100%",maxWidth:360,animation:`fadeUp .6s ${S} both`}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:-.5,margin:"0 0 24px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
          <h2 style={{fontSize:"min(7.5vw,28px)",fontWeight:900,letterSpacing:-.5,margin:0}}>Bentornato,<br/>bastardo.</h2>
        </div>
        <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:16}}>
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="la@tua.email"/>
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••"/>
          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .1s ${S}, opacity .15s`,marginTop:8,WebkitTapHighlightColor:"transparent"}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.97)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
        <p style={{textAlign:"center",fontSize:14,color:"rgba(246,246,244,.3)",marginTop:32}}>
          Non hai un account? <Link to="/oroscopo/signup" style={{color:"#F4C430",textDecoration:"none",fontWeight:600}}>Registrati</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label style={{fontSize:11,color:"rgba(246,246,244,.3)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} required placeholder={placeholder}
        style={{width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .2s ${S}, background .2s`}}
        onFocus={e=>{e.currentTarget.style.borderColor="rgba(244,196,48,.5)";e.currentTarget.style.background="rgba(246,246,244,.07)"}}
        onBlur={e=>{e.currentTarget.style.borderColor="rgba(246,246,244,.1)";e.currentTarget.style.background="rgba(246,246,244,.05)"}}
      />
    </div>
  )
}
