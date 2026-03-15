import { useState, useCallback } from 'react'
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user: currentUser } } = await oroscopoSupabase.auth.getUser()
      const userId = currentUser?.id || user?.id
      if (!userId) { setError('Sessione scaduta. Torna al login.'); setLoading(false); return }

      const { error: updateErr } = await oroscopoSupabase.from('profiles').update({
        birth_date: birthDate,
        birth_time: unknownTime ? null : birthTime || null,
        birth_city: birthCity,
      }).eq('id', userId)

      if (updateErr) {
        console.error('[Onboarding] Update error:', updateErr)
        setError('Errore: ' + updateErr.message)
        setLoading(false)
        return
      }

      await refreshProfile()
      navigate('/oroscopo/dashboard', { replace: true })
    } catch (err) {
      console.error('[Onboarding] Unexpected error:', err)
      setError('Errore imprevisto. Riprova.')
      setLoading(false)
    }
  }, [birthDate, birthTime, unknownTime, birthCity, user, refreshProfile, navigate])

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",padding:"24px 16px"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:"100%",maxWidth:400,animation:`fadeUp .6s ${S} both`}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:-.5,margin:"0 0 24px"}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></h1>
          <h2 style={{fontSize:"min(7.5vw,28px)",fontWeight:900,letterSpacing:-.5,margin:"0 0 10px"}}>I tuoi dati natali</h2>
          <p style={{fontSize:14,color:"rgba(246,246,244,.3)",margin:0,lineHeight:1.5}}>Più sei preciso, più il tuo oroscopo sarà accurato.</p>
        </div>
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <label style={{fontSize:11,color:"rgba(246,246,244,.3)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Data di nascita</label>
            <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} required style={{width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box" as const,colorScheme:"dark",transition:`border .2s ${S}`}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:"rgba(246,246,244,.3)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Ora di nascita</label>
            <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} disabled={unknownTime} style={{width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box" as const,colorScheme:"dark",opacity:unknownTime?.35:1,transition:`border .2s ${S}, opacity .2s`}}/>
            <label style={{display:"flex",alignItems:"center",gap:12,marginTop:10,cursor:"pointer",padding:"8px 0",WebkitTapHighlightColor:"transparent"}}>
              <input type="checkbox" checked={unknownTime} onChange={e=>{setUnknownTime(e.target.checked);if(e.target.checked)setBirthTime('')}} style={{accentColor:"#F4C430",width:20,height:20}}/>
              <span style={{fontSize:14,color:"rgba(246,246,244,.35)"}}>Non conosco l'ora di nascita</span>
            </label>
          </div>
          <div>
            <label style={{fontSize:11,color:"rgba(246,246,244,.3)",letterSpacing:2,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Luogo di nascita</label>
            <input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} required placeholder="es. Milano, Italia"
              style={{width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box" as const,transition:`border .2s ${S}, background .2s`}}
              onFocus={e=>{e.currentTarget.style.borderColor="rgba(244,196,48,.5)";e.currentTarget.style.background="rgba(246,246,244,.07)"}}
              onBlur={e=>{e.currentTarget.style.borderColor="rgba(246,246,244,.1)";e.currentTarget.style.background="rgba(246,246,244,.05)"}}
            />
          </div>
          {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:loading?.5:1,transition:`transform .1s ${S}, opacity .15s`,marginTop:8,WebkitTapHighlightColor:"transparent"}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.97)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            {loading ? 'Salvataggio...' : 'Continua'}
          </button>
        </form>
      </div>
    </div>
  )
}
