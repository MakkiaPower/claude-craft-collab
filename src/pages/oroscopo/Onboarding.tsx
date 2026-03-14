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
    navigate('/oroscopo/pricing')
  }

  const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s"}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"16px min(6vw,24px)"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontSize:24,fontWeight:900,letterSpacing:-.5,margin:0}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
        </div>
        <h2 style={{fontSize:22,fontWeight:800,textAlign:"center",marginBottom:8}}>I tuoi dati natali</h2>
        <p style={{textAlign:"center",fontSize:14,color:"rgba(246,246,244,.4)",marginBottom:32}}>Servono per calcolare la tua mappa natale. Più sei preciso, più il tuo oroscopo sarà accurato.</p>
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Data di nascita</label>
            <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} required style={{...inputStyle,colorScheme:"dark"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Ora di nascita</label>
            <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} disabled={unknownTime} style={{...inputStyle,colorScheme:"dark",opacity:unknownTime?.4:1}}/>
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:8,cursor:"pointer"}}>
              <input type="checkbox" checked={unknownTime} onChange={e=>{setUnknownTime(e.target.checked);if(e.target.checked)setBirthTime('')}} style={{accentColor:"#F4C430"}}/>
              <span style={{fontSize:13,color:"rgba(246,246,244,.4)"}}>Non conosco l'ora di nascita</span>
            </label>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Luogo di nascita</label>
            <input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} required placeholder="es. Milano, Italia" style={inputStyle} onFocus={e=>(e.currentTarget.style.borderColor="rgba(244,196,48,.4)")} onBlur={e=>(e.currentTarget.style.borderColor="rgba(246,246,244,.1)")}/>
          </div>
          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .2s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Salvataggio...' : 'Continua'}
          </button>
        </form>
      </div>
    </div>
  )
}
