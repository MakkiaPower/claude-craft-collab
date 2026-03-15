import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { LogOut, ArrowLeft } from 'lucide-react'
import { BottomNav } from './Dashboard'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes glowPulse{0%,100%{opacity:.03}50%{opacity:.07}}
`

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

  useEffect(() => { if (profile) { setDisplayName(profile.display_name||''); setBirthDate(profile.birth_date||''); setBirthTime(profile.birth_time||''); setBirthCity(profile.birth_city||'') } }, [profile])
  useEffect(() => { if (!authLoading && !user) navigate('/oroscopo/login', { replace: true }) }, [authLoading, user, navigate])

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true); setSuccess(false)
    await oroscopoSupabase.from('profiles').update({ display_name: displayName||null, birth_date: birthDate, birth_time: birthTime||null, birth_city: birthCity }).eq('id', user.id)
    await refreshProfile()
    setSuccess(true); setSaving(false)
  }, [user, displayName, birthDate, birthTime, birthCity, refreshProfile])

  const handlePortal = useCallback(async () => {
    setPortalLoading(true)
    try { const { data: { session } } = await oroscopoSupabase.auth.getSession(); if (!session) return; const res = await fetch('/api/stripe/portal', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` } }); const data = await res.json(); if (data.url) { window.location.href = data.url; return } } catch {}
    setPortalLoading(false)
  }, [])

  const handleLogout = useCallback(async () => { await signOut(); navigate('/oroscopo', { replace: true }) }, [signOut, navigate])

  if (authLoading || !user) return <div style={{minHeight:"100dvh",background:"#0a0a0a"}}/>

  const planLabel = profile?.subscription_plan === 'yearly' ? 'Annuale \u2014 99,99\u20AC/anno' : 'Mensile \u2014 9,99\u20AC/mese'
  const inputBase: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.06)",color:"#F6F6F4",borderRadius:12,padding:"17px 18px",fontSize:16,outline:"none",boxSizing:"border-box",transition:`border .25s ${S}, background .25s, box-shadow .25s`}
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(244,196,48,.4)";e.currentTarget.style.background="rgba(246,246,244,.06)";e.currentTarget.style.boxShadow="0 0 0 3px rgba(244,196,48,.06)"}
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {e.currentTarget.style.borderColor="rgba(246,246,244,.06)";e.currentTarget.style.background="rgba(246,246,244,.04)";e.currentTarget.style.boxShadow="none"}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:92,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 25%,rgba(244,196,48,.03) 0%,transparent 50%)",animation:"glowPulse 8s ease-in-out infinite"}}/>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"max(env(safe-area-inset-top,16px),16px) 20px 0",maxWidth:420,margin:"0 auto",position:"relative",zIndex:1,animation:`fadeUp .5s ${S} both`}}>
        <div onClick={()=>navigate('/oroscopo/dashboard')} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:"50%",transition:`background .2s ${S}`,WebkitTapHighlightColor:"transparent"}} onMouseEnter={e=>(e.currentTarget.style.background="rgba(246,246,244,.06)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
          <ArrowLeft size={18} strokeWidth={1.5} style={{color:"rgba(246,246,244,.4)"}}/>
        </div>
        <h1 style={{fontSize:20,fontWeight:900,letterSpacing:"-0.03em",margin:0}}>Impostazioni</h1>
      </div>

      <div style={{maxWidth:420,margin:"0 auto",padding:"min(6vw,28px) 20px 0",position:"relative",zIndex:1}}>
        <p style={{fontSize:10,fontWeight:700,color:"rgba(246,246,244,.15)",letterSpacing:3,textTransform:"uppercase",margin:"0 0 12px",animation:`fadeUp .5s ${S} .06s both`}}>PROFILO</p>
        <form onSubmit={handleSave} style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.05)",borderRadius:20,padding:24,display:"flex",flexDirection:"column",gap:18,marginBottom:32,animation:`fadeUp .5s ${S} .1s both`}}>
          <div><label style={{fontSize:10,color:"rgba(246,246,244,.2)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Nome</label><input type="text" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Come vuoi essere chiamato" style={inputBase} onFocus={focusIn} onBlur={focusOut}/></div>
          <div><label style={{fontSize:10,color:"rgba(246,246,244,.2)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Data di nascita</label><input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} style={{...inputBase,colorScheme:"dark"}}/></div>
          <div><label style={{fontSize:10,color:"rgba(246,246,244,.2)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Ora di nascita</label><input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} style={{...inputBase,colorScheme:"dark"}}/></div>
          <div><label style={{fontSize:10,color:"rgba(246,246,244,.2)",letterSpacing:3,textTransform:"uppercase",fontWeight:700,display:"block",marginBottom:10}}>Luogo di nascita</label><input type="text" value={birthCity} onChange={e=>setBirthCity(e.target.value)} placeholder="es. Milano, Italia" style={inputBase} onFocus={focusIn} onBlur={focusOut}/></div>
          {success && <p style={{color:"#2D8A4E",fontSize:13,margin:0}}>Profilo aggiornato.</p>}
          <button type="submit" disabled={saving} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"17px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:saving?.5:1,transition:`transform .1s ${S}`,WebkitTapHighlightColor:"transparent",boxShadow:"0 2px 20px rgba(244,196,48,.12)"}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.96)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.96)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>{saving ? 'Salvataggio...' : 'Salva modifiche'}</button>
        </form>

        <p style={{fontSize:10,fontWeight:700,color:"rgba(246,246,244,.15)",letterSpacing:3,textTransform:"uppercase",margin:"0 0 12px",animation:`fadeUp .5s ${S} .16s both`}}>ABBONAMENTO</p>
        <div style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.05)",borderRadius:20,padding:24,marginBottom:32,animation:`fadeUp .5s ${S} .2s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:profile?.stripe_customer_id?14:0}}>
            <span style={{fontSize:14,color:"rgba(246,246,244,.2)"}}>Piano</span>
            <span style={{fontSize:14,fontWeight:700}}>{profile?.subscription_status === 'active' ? planLabel : 'Nessuno'}</span>
          </div>
          {profile?.stripe_customer_id && (
            <button onClick={handlePortal} disabled={portalLoading} style={{width:"100%",background:"transparent",border:"1px solid rgba(244,196,48,.12)",color:"#F4C430",borderRadius:12,padding:"15px",fontSize:14,fontWeight:700,cursor:"pointer",opacity:portalLoading?.5:1,transition:`transform .1s ${S}`,WebkitTapHighlightColor:"transparent"}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.97)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")}>{portalLoading ? '...' : 'Gestisci abbonamento'}</button>
          )}
        </div>

        <button onClick={handleLogout} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"transparent",border:"1px solid rgba(204,51,51,.15)",color:"rgba(204,51,51,.5)",borderRadius:12,padding:"16px",fontSize:14,fontWeight:600,cursor:"pointer",transition:`color .25s, border-color .25s`,animation:`fadeUp .5s ${S} .26s both`,WebkitTapHighlightColor:"transparent"}} onMouseEnter={e=>{e.currentTarget.style.color="rgba(204,51,51,.7)";e.currentTarget.style.borderColor="rgba(204,51,51,.25)"}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(204,51,51,.5)";e.currentTarget.style.borderColor="rgba(204,51,51,.15)"}}>
          <LogOut size={15}/> Esci
        </button>
      </div>
      <BottomNav navigate={navigate} active="settings"/>
    </div>
  )
}
