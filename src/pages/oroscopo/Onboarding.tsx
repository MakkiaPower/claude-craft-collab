import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { useAuth } from '@/lib/oroscopo/AuthContext'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [unknownTime, setUnknownTime] = useState(false)
  const [birthCity, setBirthCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { setError('Sessione scaduta.'); return }
    setError('')
    setLoading(true)
    const { error: err } = await oroscopoSupabase.from('profiles').update({
      birth_date: birthDate,
      birth_time: unknownTime ? null : birthTime || null,
      birth_city: birthCity,
    }).eq('id', user.id)
    if (err) { setError('Errore nel salvataggio.'); setLoading(false); return }
    await refreshProfile()
    navigate('/oroscopo/dashboard')
  }

  const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .3s ${S}, background .3s`}
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(244,196,48,.5)";e.currentTarget.style.background="rgba(246,246,244,.07)"}
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(246,246,244,.1)";e.currentTarget.style.background="rgba(246,246,244,.05)"}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 16px"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:"100%",maxWidth:400,animation:`fadeUp .8s ${S} both`}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:-.5,margin:"0 0 24px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
          <h2 style={{fontSize:28,fontWeight:900,letterSpacing:-.5,margin:"0 0 10px"}}>I tuoi dati natali</h2>
          <p style={{fontSize:14,color:"rgba(246,246,244,.35)",margin:0,lineHeight:1.5}}>Più sei preciso, più il tuo oroscopo sarà accurato.</p>
        </div>
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <label style={{fontSize:11,color:"rgba(246,246,244,.35)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Data di nascita</label>
            <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} required style={{...inputStyle,colorScheme:"dark"}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:"rgba(246,246,244,.35)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Ora di nascita</label>
            <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} disabled={unknownTime} style={{...inputStyle,colorScheme:"dark",opacity:unknownTime?.35:1}}/>
            <label style={{display:"flex",alignItems:"center",gap:12,marginTop:10,cursor:"pointer",padding:"8px 0"}}>
              <input type="checkbox" checked={unknownTime} onChange={e=>{setUnknownTime(e.target.checked);if(e.target.checked)setBirthTime('')}} style={{accentColor:"#F4C430",width:20,height:20}}/>
              <span style={{fontSize:14,color:"rgba(246,246,244,.35)"}}>Non conosco l'ora di nascita</span>
            </label>
          </div>
          <div>
            <label style={{fontSize:11,color:"rgba(246,246,244,.35)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Luogo di nascita</label>
            <input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} required placeholder="es. Milano, Italia" style={inputStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .15s ${S}, opacity .2s`,marginTop:8}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.97)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Salvataggio...' : 'Continua'}
          </button>
        </form>
      </div>
    </div>
  )
}
