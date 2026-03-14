import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { Sun, CalendarDays, User, LogOut } from 'lucide-react'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Settings() {
  const { user, profile, signOut, refreshProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '')
  const [birthTime, setBirthTime] = useState(profile?.birth_time || '')
  const [birthCity, setBirthCity] = useState(profile?.birth_city || '')
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
    } catch { /* network error */ }
    setPortalLoading(false)
  }

  async function handleLogout() {
    await signOut()
    navigate('/oroscopo')
  }

  const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s"}
  const planLabel = profile?.subscription_plan === 'yearly' ? 'Annuale — 49,99\u20AC/anno' : 'Mensile — 5,99\u20AC/mese'

  const nav = [
    { icon: Sun, label: 'Oroscopo', path: '/oroscopo/dashboard', active: false },
    { icon: CalendarDays, label: 'Archivio', path: '/oroscopo/archive', active: false },
    { icon: User, label: 'Profilo', path: '/oroscopo/settings', active: true },
  ]

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:80}}>
      <div style={{maxWidth:440,margin:"0 auto",padding:"32px min(6vw,24px) 0"}}>
        <h1 style={{fontSize:24,fontWeight:900,marginBottom:32}}>Impostazioni</h1>

        {/* Profilo */}
        <h2 style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,marginBottom:16}}>Profilo</h2>
        <form onSubmit={handleSave} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:20,display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Nome</label>
            <input type="text" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Come vuoi essere chiamato" style={inputStyle}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Data di nascita</label>
            <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} style={{...inputStyle,colorScheme:"dark"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Ora di nascita</label>
            <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} style={{...inputStyle,colorScheme:"dark"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Luogo di nascita</label>
            <input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} placeholder="es. Milano, Italia" style={inputStyle}/>
          </div>
          {success && <p style={{color:"#2D8A4E",fontSize:13,margin:0}}>Profilo aggiornato.</p>}
          <button type="submit" disabled={saving} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:saving?.5:1}}>
            {saving ? 'Salvataggio...' : 'Salva modifiche'}
          </button>
        </form>

        {/* Abbonamento */}
        <h2 style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,marginBottom:16}}>Abbonamento</h2>
        <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:20,marginBottom:32}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:"rgba(246,246,244,.4)"}}>Piano</span>
            <span style={{fontSize:13,fontWeight:600}}>{profile?.subscription_status === 'active' ? planLabel : 'Nessuno'}</span>
          </div>
          {profile?.stripe_customer_id && (
            <button onClick={handlePortal} disabled={portalLoading} style={{width:"100%",background:"transparent",border:"1px solid rgba(244,196,48,.3)",color:"#F4C430",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:portalLoading?.5:1}}>
              {portalLoading ? 'Caricamento...' : 'Gestisci abbonamento'}
            </button>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"transparent",border:"1px solid rgba(246,246,244,.1)",color:"rgba(246,246,244,.4)",borderRadius:12,padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer"}}>
          <LogOut size={16}/> Esci
        </button>
      </div>

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,10,.95)",borderTop:"1px solid rgba(246,246,244,.06)",display:"flex",justifyContent:"space-around",alignItems:"center",height:64,zIndex:50,backdropFilter:"blur(10px)"}}>
        {nav.map(n => (<div key={n.path} onClick={()=>navigate(n.path)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"8px 16px",color:n.active?"#F4C430":"rgba(246,246,244,.25)"}}><n.icon size={20}/><span style={{fontSize:10}}>{n.label}</span></div>))}
      </nav>
    </div>
  )
}
