import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes successIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes glowPulse{0%,100%{opacity:.03}50%{opacity:.06}}
`

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<never>((_, r) => setTimeout(() => r(new Error('TIMEOUT')), ms))])
}

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Le password non coincidono.'); return }
    if (password.length < 6) { setError('La password deve avere almeno 6 caratteri.'); return }
    setLoading(true)
    try {
      const { data, error } = await withTimeout(oroscopoSupabase.auth.signUp({ email, password }), 10000)
      if (error) { setError(error.message); setLoading(false); return }
      if (!data.session) { setConfirmEmail(true); setLoading(false); return }
      navigate('/oroscopo/onboarding', { replace: true })
    } catch (err) {
      setError(err instanceof Error && err.message === 'TIMEOUT' ? 'Timeout \u2014 riprova.' : 'Errore imprevisto.')
      setLoading(false)
    }
  }, [email, password, confirmPassword, navigate])

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 30%,rgba(244,196,48,.04) 0%,transparent 60%)",animation:"glowPulse 6s ease-in-out infinite"}}/>

      <div style={{width:"100%",maxWidth:340,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:56,animation:`fadeUp .7s ${S} both`}}>
          <p style={{fontSize:13,fontWeight:700,letterSpacing:3,color:"rgba(244,196,48,.5)",textTransform:"uppercase",margin:"0 0 20px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></p>
          <h1 style={{fontSize:"min(9vw,36px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,margin:0}}>Unisciti ai<br/><span style={{color:"#F4C430"}}>bastardi.</span></h1>
        </div>

        {confirmEmail ? (
          <div style={{textAlign:"center",animation:`successIn .5s ${S} both`}}>
            <p style={{fontSize:20,fontWeight:800,color:"#F4C430",marginBottom:14}}>Controlla la tua email.</p>
            <p style={{fontSize:15,color:"rgba(246,246,244,.35)",lineHeight:1.7}}>Ti abbiamo inviato un link di conferma.</p>
            <Link to="/oroscopo/login" style={{display:"inline-block",marginTop:32,color:"#F4C430",fontSize:15,textDecoration:"none",fontWeight:700}}>Vai al login &rarr;</Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:18,animation:`fadeUp .7s ${S} .1s both`}}>
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="la@tua.email" delay={.12}/>
              <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Almeno 6 caratteri" delay={.16}/>
              <Input label="Conferma" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Ripeti la password" delay={.2}/>
              {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
              <GoldBtn loading={loading} delay={.24}>{loading ? 'Creazione...' : 'Crea account'}</GoldBtn>
            </form>
            <p style={{textAlign:"center",fontSize:14,color:"rgba(246,246,244,.25)",marginTop:40,animation:`fadeUp .7s ${S} .3s both`}}>
              Hai già un account? <Link to="/oroscopo/login" style={{color:"#F4C430",textDecoration:"none",fontWeight:700}}>Accedi</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function Input({ label, type, value, onChange, placeholder, delay = 0 }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; delay?: number }) {
  return (
    <div style={{animation:`fadeUp .6s ${S} ${delay}s both`}}>
      <label style={{fontSize:10,color:"rgba(246,246,244,.25)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} required placeholder={placeholder}
        style={{width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.08)",color:"#F6F6F4",borderRadius:12,padding:"17px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .25s ${S}, background .25s, box-shadow .25s`}}
        onFocus={e=>{e.currentTarget.style.borderColor="rgba(244,196,48,.4)";e.currentTarget.style.background="rgba(246,246,244,.06)";e.currentTarget.style.boxShadow="0 0 0 3px rgba(244,196,48,.06)"}}
        onBlur={e=>{e.currentTarget.style.borderColor="rgba(246,246,244,.08)";e.currentTarget.style.background="rgba(246,246,244,.04)";e.currentTarget.style.boxShadow="none"}}
      />
    </div>
  )
}

function GoldBtn({ loading, children, delay = 0 }: { loading: boolean; children: React.ReactNode; delay?: number }) {
  return (
    <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"17px",fontSize:16,fontWeight:800,letterSpacing:.3,cursor:"pointer",opacity:loading?.5:1,transition:`transform .1s ${S}, opacity .15s`,marginTop:6,WebkitTapHighlightColor:"transparent",boxShadow:"0 2px 20px rgba(244,196,48,.15)",animation:`fadeUp .6s ${S} ${delay}s both`}}
      onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}
      onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
      {children}
    </button>
  )
}
