import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { LogOut } from 'lucide-react'
import { BottomNav } from './Dashboard'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Settings() {
  const { user, profile, signOut, refreshProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthCity, setBirthCity] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setBirthDate(profile.birth_date || '')
      setBirthTime(profile.birth_time || '')
      setBirthCity(profile.birth_city || '')
    }
  }, [profile])

  useEffect(() => {
    if (!authLoading && !user) navigate('/oroscopo/login')
  }, [authLoading, user, navigate])

  if (authLoading || !user) return null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true); setSuccess(false)
    await oroscopoSupabase.from('profiles').update({
      display_name: displayName || null, birth_date: birthDate, birth_time: birthTime || null, birth_city: birthCity,
    }).eq('id', user.id)
    await refreshProfile()
    setSuccess(true); setSaving(false)
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const { data: { session } } = await oroscopoSupabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
    } catch { /* network error */ }
    setPortalLoading(false)
  }

  async function handleLogout() { await signOut(); navigate('/oroscopo') }

  const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.05)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:14,padding:"16px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .3s ${S}, background .3s`}
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(244,196,48,.5)";e.currentTarget.style.background="rgba(246,246,244,.07)"}
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(246,246,244,.1)";e.currentTarget.style.background="rgba(246,246,244,.05)"}
  const planLabel = profile?.subscription_plan === 'yearly' ? 'Annuale \u2014 49,99\u20AC/anno' : 'Mensile \u2014 5,99\u20AC/mese'

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:84}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{maxWidth:440,margin:"0 auto",padding:"min(8vw,36px) min(6vw,24px) 0"}}>
        <h1 style={{fontSize:"min(7vw,28px)",fontWeight:900,marginBottom:"min(8vw,36px)",letterSpacing:-.5,animation:`fadeUp .6s ${S} both`}}>Impostazioni</h1>

        {/* Profilo */}
        <h2 style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,marginBottom:14,animation:`fadeUp .6s ${S} .05s both`}}>Profilo</h2>
        <form onSubmit={handleSave} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:16,padding:22,display:"flex",flexDirection:"column",gap:16,marginBottom:32,animation:`fadeUp .6s ${S} .1s both`}}>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Nome</label>
            <input type="text" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Come vuoi essere chiamato" style={inputStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Data di nascita</label>
            <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} style={{...inputStyle,colorScheme:"dark"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Ora di nascita</label>
            <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} style={{...inputStyle,colorScheme:"dark"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:10}}>Luogo di nascita</label>
            <input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} placeholder="es. Milano, Italia" style={inputStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
          {success && <p style={{color:"#2D8A4E",fontSize:13,margin:0}}>Profilo aggiornato.</p>}
          <button type="submit" disabled={saving} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:saving?.5:1,transition:`transform .15s ${S}`,marginTop:4}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.97)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            {saving ? 'Salvataggio...' : 'Salva modifiche'}
          </button>
        </form>

        {/* Abbonamento */}
        <h2 style={{fontSize:10,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600,marginBottom:14,animation:`fadeUp .6s ${S} .15s both`}}>Abbonamento</h2>
        <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:16,padding:22,marginBottom:32,animation:`fadeUp .6s ${S} .2s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <span style={{fontSize:14,color:"rgba(246,246,244,.35)"}}>Piano</span>
            <span style={{fontSize:14,fontWeight:700}}>{profile?.subscription_status === 'active' ? planLabel : 'Nessuno'}</span>
          </div>
          {profile?.stripe_customer_id && (
            <button onClick={handlePortal} disabled={portalLoading} style={{width:"100%",background:"transparent",border:"1px solid rgba(244,196,48,.2)",color:"#F4C430",borderRadius:14,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:portalLoading?.5:1,transition:`transform .15s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.97)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
              {portalLoading ? '...' : 'Gestisci abbonamento'}
            </button>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"transparent",border:"1px solid rgba(246,246,244,.08)",color:"rgba(246,246,244,.3)",borderRadius:14,padding:"16px",fontSize:14,fontWeight:600,cursor:"pointer",transition:`color .2s, border-color .2s`,animation:`fadeUp .6s ${S} .25s both`}} onMouseEnter={e=>{e.currentTarget.style.color="rgba(246,246,244,.6)";e.currentTarget.style.borderColor="rgba(246,246,244,.15)"}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(246,246,244,.3)";e.currentTarget.style.borderColor="rgba(246,246,244,.08)"}}>
          <LogOut size={15}/> Esci
        </button>
      </div>
      <BottomNav navigate={navigate} active="settings"/>
    </div>
  )
}
