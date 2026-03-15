import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { format } from 'date-fns'
import { getLocalToday } from '@/lib/oroscopo/utils'
import { it } from 'date-fns/locale'
import type { Profile } from '@/lib/oroscopo/types'

const S = `cubic-bezier(.22,1,.36,1)`

export default function AdminWrite() {
  const { userId } = useParams<{ userId: string }>()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [targetProfile, setTargetProfile] = useState<Profile | null>(null)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [overview, setOverview] = useState('')
  const [inCouple, setInCouple] = useState('')
  const [single, setSingle] = useState('')
  const [work, setWork] = useState('')
  const [advice, setAdvice] = useState('')
  const [transitsJson, setTransitsJson] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const today = getLocalToday()
  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: it })

  useEffect(() => {
    if (authLoading || !userId) return
    if (!user) { navigate('/oroscopo/login'); return }

    async function load() {
      const { data: admin } = await oroscopoSupabase.from('admin_users').select('user_id').eq('user_id', user!.id).single()
      if (!admin) { navigate('/oroscopo/dashboard'); return }

      const [{ data: prof }, { data: existing }] = await Promise.all([
        oroscopoSupabase.from('profiles').select('*').eq('id', userId!).single(),
        oroscopoSupabase.from('horoscopes').select('*').eq('user_id', userId!).eq('date', today).single(),
      ])
      setTargetProfile(prof as Profile | null)
      if (existing) {
        setExistingId(existing.id)
        setOverview(existing.overview || '')
        setInCouple(existing.in_couple || '')
        setSingle(existing.single || '')
        setWork(existing.work || '')
        setAdvice(existing.advice || '')
        setTransitsJson(existing.transits ? JSON.stringify(existing.transits, null, 2) : '')
      }
      setLoading(false)
    }
    load()
  }, [user, userId, authLoading, navigate, today])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess(false)
    let transits = null
    if (transitsJson.trim()) {
      try { transits = JSON.parse(transitsJson) } catch { setError('JSON transiti non valido.'); setSaving(false); return }
    }
    const data = { user_id: userId!, date: today, overview, in_couple: inCouple || null, single: single || null, work: work || null, advice: advice || null, transits }
    const result = existingId
      ? await oroscopoSupabase.from('horoscopes').update(data).eq('id', existingId)
      : await oroscopoSupabase.from('horoscopes').insert(data)
    if (result.error) setError('Errore: ' + result.error.message)
    else setSuccess(true)
    setSaving(false)
  }

  if (authLoading || loading) return <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#F6F6F4",fontFamily:"'Helvetica Neue',sans-serif"}}><p style={{color:"rgba(246,246,244,.4)"}}>Caricamento...</p></div>
  if (!targetProfile) return <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#F6F6F4"}}><p>Utente non trovato.</p></div>

  const textareaStyle: React.CSSProperties = {width:"100%",background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.1)",color:"#F6F6F4",borderRadius:12,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",transition:"border .2s"}

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4"}}>
      <div style={{borderBottom:"1px solid rgba(246,246,244,.06)",padding:"16px 24px"}}>
        <span style={{fontWeight:900,fontSize:16}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></span><span style={{color:"rgba(246,246,244,.3)",fontSize:12,marginLeft:8}}>Admin</span>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px"}}>
        <Link to="/oroscopo/admin" style={{color:"rgba(246,246,244,.4)",fontSize:13,textDecoration:"none",display:"inline-block",marginBottom:24}}>&larr; Torna alla lista</Link>

        <div style={{display:"grid",gridTemplateColumns:window.innerWidth<768?"1fr":"1fr 260px",gap:24}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:900,marginBottom:4}}>{targetProfile.display_name || targetProfile.email}</h1>
            <p style={{fontSize:13,color:"rgba(246,246,244,.35)",marginBottom:24}}>{formattedDate}</p>

            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Panoramica *</label>
                <textarea value={overview} onChange={e=>setOverview(e.target.value)} required rows={6} style={textareaStyle} placeholder="La panoramica dell'oroscopo di oggi..."/>
              </div>
              <div>
                <label style={{fontSize:10,color:"#CC3333",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>In coppia</label>
                <textarea value={inCouple} onChange={e=>setInCouple(e.target.value)} rows={3} style={textareaStyle} placeholder="Per chi è in relazione..."/>
              </div>
              <div>
                <label style={{fontSize:10,color:"#B44ACE",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Da single</label>
                <textarea value={single} onChange={e=>setSingle(e.target.value)} rows={3} style={textareaStyle} placeholder="Per chi è solo..."/>
              </div>
              <div>
                <label style={{fontSize:10,color:"#D4A843",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Lavoro & Soldi</label>
                <textarea value={work} onChange={e=>setWork(e.target.value)} rows={3} style={textareaStyle} placeholder="Lavoro e finanze..."/>
              </div>
              <div>
                <label style={{fontSize:10,color:"#F4C430",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Consiglio del giorno</label>
                <textarea value={advice} onChange={e=>setAdvice(e.target.value)} rows={3} style={textareaStyle} placeholder="Breve, diretto. Ultima frase in CAPS LOCK."/>
              </div>
              <div>
                <label style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,display:"block",marginBottom:8}}>Transiti (JSON)</label>
                <textarea value={transitsJson} onChange={e=>setTransitsJson(e.target.value)} rows={3} style={{...textareaStyle,fontFamily:"monospace",fontSize:13}} placeholder='[{"name": "Venere in Ariete", "description": "..."}]'/>
              </div>
              {error && <p style={{color:"#CC3333",fontSize:13,margin:0}}>{error}</p>}
              {success && <p style={{color:"#2D8A4E",fontSize:13,margin:0}}>Oroscopo salvato con successo.</p>}
              <button type="submit" disabled={saving||!overview} style={{background:"#F4C430",color:"#0a0a0a",border:"none",borderRadius:12,padding:"14px",fontSize:16,fontWeight:800,cursor:"pointer",opacity:(saving||!overview)?.5:1,transition:`transform .2s ${S}`}}>
                {saving ? 'Salvataggio...' : existingId ? 'Aggiorna oroscopo' : 'Salva oroscopo'}
              </button>
            </form>
          </div>

          {/* Sidebar dati natali */}
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:20,height:"fit-content",position:"sticky",top:24}}>
            <h3 style={{fontSize:10,color:"rgba(246,246,244,.4)",letterSpacing:2,textTransform:"uppercase",fontWeight:500,marginBottom:16}}>Dati natali</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12,fontSize:13}}>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Email</p><p style={{margin:0}}>{targetProfile.email}</p></div>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Data di nascita</p><p style={{margin:0}}>{targetProfile.birth_date ? format(new Date(targetProfile.birth_date), "d MMMM yyyy", { locale: it }) : '\u2014'}</p></div>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Ora</p><p style={{margin:0}}>{targetProfile.birth_time || 'Sconosciuta'}</p></div>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Luogo</p><p style={{margin:0}}>{targetProfile.birth_city || '\u2014'}</p></div>
              <div style={{borderTop:"1px solid rgba(246,246,244,.06)",paddingTop:12}}/>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Sole</p><p style={{margin:0}}>{targetProfile.sun_sign || 'Da inserire'}</p></div>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Luna</p><p style={{margin:0}}>{targetProfile.moon_sign || 'Da inserire'}</p></div>
              <div><p style={{color:"rgba(246,246,244,.3)",fontSize:11,margin:"0 0 2px"}}>Ascendente</p><p style={{margin:0}}>{targetProfile.rising_sign || 'Da inserire'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
