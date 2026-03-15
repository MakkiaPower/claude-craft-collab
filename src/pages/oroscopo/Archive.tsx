import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import type { Horoscope } from '@/lib/oroscopo/types'
import { BottomNav } from './Dashboard'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Archive() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [horoscopes, setHoroscopes] = useState<Horoscope[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/oroscopo/login', { replace: true }); return }
    oroscopoSupabase.from('horoscopes').select('*').eq('user_id', user.id).order('date', { ascending: false })
      .then(({ data }) => { setHoroscopes((data || []) as Horoscope[]); setLoading(false) })
  }, [user, authLoading, navigate])

  if (authLoading || loading) return <div style={{minHeight:"100dvh",background:"#0a0a0a"}}/>

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:88}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{maxWidth:640,margin:"0 auto",padding:"min(8vw,36px) 16px 0"}}>
        <h1 style={{fontSize:"min(7vw,28px)",fontWeight:900,marginBottom:"min(7vw,32px)",letterSpacing:-.5,animation:`fadeUp .5s ${S} both`}}>Archivio</h1>

        {horoscopes.length > 0 ? (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {horoscopes.map((h, i) => {
              const isOpen = expandedId === h.id
              const dateLabel = format(new Date(h.date + 'T00:00:00'), "EEEE d MMMM yyyy", { locale: it })
              const preview = h.overview.length > 80 ? h.overview.slice(0, 80) + '...' : h.overview
              return (
                <div key={h.id} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:18,overflow:"hidden",animation:`fadeUp .4s ${S} ${Math.min(i*.03,.25)}s both`}}>
                  <div onClick={()=>setExpandedId(isOpen?null:h.id)} style={{padding:"18px 24px",cursor:"pointer",transition:`background .15s`}} onMouseEnter={e=>(e.currentTarget.style.background="rgba(246,246,244,.05)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <p style={{fontSize:11,color:"rgba(246,246,244,.25)",letterSpacing:3,textTransform:"uppercase",fontWeight:600,margin:"0 0 6px"}}>{dateLabel}</p>
                    {!isOpen && <p style={{fontSize:14,color:"rgba(246,246,244,.45)",margin:0,lineHeight:1.6}}>{preview}</p>}
                  </div>
                  {isOpen && (
                    <div style={{padding:"0 24px 24px",display:"flex",flexDirection:"column",gap:16}}>
                      <Sec dot="#F4C430" label="Panoramica" text={h.overview}/>
                      {h.in_couple && <Sec dot="#CC3333" label="In coppia" text={h.in_couple}/>}
                      {h.single && <Sec dot="#B44ACE" label="Da single" text={h.single}/>}
                      {h.work && <Sec dot="#D4A843" label="Lavoro & Soldi" text={h.work}/>}
                      {h.advice && <Sec dot="#F4C430" label="Consiglio" text={h.advice} star/>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:18,padding:24,animation:`fadeUp .5s ${S} both`}}>
            <p style={{fontSize:15,color:"rgba(246,246,244,.3)",fontStyle:"italic",margin:0,lineHeight:1.7}}>Ancora nessun oroscopo nel tuo archivio. Il primo arriva domani.</p>
          </div>
        )}
      </div>
      <BottomNav navigate={navigate} active="archive"/>
    </div>
  )
}

function Sec({ dot, label, text, star }: { dot: string; label: string; text: string; star?: boolean }) {
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        {star ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dot} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> : <span style={{width:7,height:7,borderRadius:"50%",background:dot}}/>}
        <span style={{fontSize:11,color:dot,letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{label}</span>
      </div>
      <p style={{fontSize:15,lineHeight:1.8,margin:0,color:"rgba(246,246,244,.85)"}}>{text}</p>
    </div>
  )
}
