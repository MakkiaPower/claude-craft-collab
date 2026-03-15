import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { useAuth } from '@/lib/oroscopo/AuthContext'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes glowPulse{0%,100%{opacity:.03}50%{opacity:.06}}
`

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [unknownTime, setUnknownTime] = useState(false)
  const [birthCity, setBirthCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data: { user: currentUser } } = await oroscopoSupabase.auth.getUser()
      const userId = currentUser?.id || user?.id
      if (!userId) { setError('Sessione scaduta.'); setLoading(false); return }
      const { error: err } = await oroscopoSupabase.from('profiles').update({
        birth_date: birthDate, birth_time: unknownTime ? null : birthTime || null, birth_city: birthCity,
      }).eq('id', userId)
      if (err) { setError('Errore: ' + err.message); setLoading(false); return }
      await refreshProfile()
      navigate('/oroscopo/dashboard', { replace: true })
    } catch { setError('Errore imprevisto.'); setLoading(false) }
  }, [birthDate, birthTime, unknownTime, birthCity, user, refreshProfile, navigate])

  const inputBase: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.08)",color:"#F6F6F4",borderRadius:12,padding:"17px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .25s ${S}, background .25s, box-shadow .25s`}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 30%,rgba(244,196,48,.04) 0%,transparent 60%)",animation:"glowPulse 6s ease-in-out infinite"}}/>

      <div style={{width:"100%",maxWidth:380,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:48,animation:`fadeUp .7s ${S} both`}}>
          <p style={{fontSize:13,fontWeight:700,letterSpacing:3,color:"rgba(244,196,48,.5)",textTransform:"uppercase",margin:"0 0 20px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></p>
          <h1 style={{fontSize:"min(8vw,32px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,margin:"0 0 12px"}}>I tuoi dati natali</h1>
          <p style={{fontSize:14,color:"rgba(246,246,244,.25)",margin:0,lineHeight:1.6}}>Più sei preciso, più il tuo oroscopo sarà accurato.</p>
        </div>

        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:22}}>
          <div style={{animation:`fadeUp .6s ${S} .08s both`}}>
            <label style={{fontSize:10,color:"rgba(246,246,244,.25)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Data di nascita</label>
            <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} required style={{...inputBase,colorScheme:"dark"}}/>
          </div>

          <div style={{animation:`fadeUp .6s ${S} .14s both`}}>
            <label style={{fontSize:10,color:"rgba(246,246,244,.25)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Ora di nascita</label>
            <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} disabled={unknownTime} style={{...inputBase,colorScheme:"dark",opacity:unknownTime?.3:1,transition:`border .25s ${S}, opacity .3s`}}/>
            <label style={{display:"flex",alignItems:"center",gap:12,marginTop:12,cursor:"pointer",padding:"6px 0",WebkitTapHighlightColor:"transparent"}}>
              <input type="checkbox" checked={unknownTime} onChange={e=>{setUnknownTime(e.target.checked);if(e.target.checked)setBirthTime('')}} style={{accentColor:"#F4C430",width:18,height:18}}/>
              <span style={{fontSize:14,color:"rgba(246,246,244,.3)"}}>Non conosco l'ora</span>
            </label>
          </div>

          <div style={{animation:`fadeUp .6s ${S} .2s both`}}>
            <label style={{fontSize:10,color:"rgba(246,246,244,.25)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Luogo di nascita</label>
            <input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} required placeholder="es. Milano, Italia" style={inputBase}
              onFocus={e=>{e.currentTarget.style.borderColor="rgba(244,196,48,.4)";e.currentTarget.style.background="rgba(246,246,244,.06)";e.currentTarget.style.boxShadow="0 0 0 3px rgba(244,196,48,.06)"}}
              onBlur={e=>{e.currentTarget.style.borderColor="rgba(246,246,244,.08)";e.currentTarget.style.background="rgba(246,246,244,.04)";e.currentTarget.style.boxShadow="none"}}
            />
          </div>

          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}

          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"17px",fontSize:16,fontWeight:800,letterSpacing:.3,cursor:"pointer",opacity:loading?.5:1,transition:`transform .1s ${S}, opacity .15s`,marginTop:4,WebkitTapHighlightColor:"transparent",boxShadow:"0 2px 20px rgba(244,196,48,.15)",animation:`fadeUp .6s ${S} .26s both`}}
            onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}
            onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Salvataggio...' : 'Continua'}
          </button>
        </form>
      </div>
    </div>
  )
}
