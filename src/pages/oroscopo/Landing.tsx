import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

const S = `cubic-bezier(.22,1,.36,1)`
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPhone = (v: string) => /^\+?[0-9]{8,15}$/.test(v.replace(/[\s\-().]/g, ''))

export default function OroscopoLanding() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nome: '', cognome: '', email: '', telefono: '' })
  const [errors, setErrors] = useState({ nome: false, cognome: false, email: false, telefono: false, privacy: false })
  const [privacy, setPrivacy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: false }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const newErrors = {
      nome: !formData.nome.trim(),
      cognome: !formData.cognome.trim(),
      email: !isValidEmail(formData.email),
      telefono: !isValidPhone(formData.telefono),
      privacy: !privacy,
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    setSubmitting(true)
    const payload = { nome: formData.nome.trim(), cognome: formData.cognome.trim(), email: formData.email.trim(), telefono: formData.telefono.trim() }

    const attempt = async () => {
      const { data, error } = await supabase.functions.invoke('add-to-brevo', { body: payload })
      if (error) throw error
      if (data && !data.success) throw new Error(data.error || 'Errore sconosciuto')
      return data
    }

    try {
      let data
      try { data = await attempt() } catch { data = await attempt() }

      if (data?.alreadyRegistered) {
        toast({ title: 'Ci sei già!', description: 'Questa email è già in lista. Ti avviseremo noi.' })
        setSubmitting(false)
        return
      }
      setSuccess(true)
    } catch (err) {
      console.error('Brevo error:', err)
      toast({ variant: 'destructive', title: 'Errore', description: 'Qualcosa è andato storto. Riprova.' })
      setSubmitting(false)
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(246,246,244,.05)',
    border: `1px solid ${hasError ? '#CC3333' : 'rgba(246,246,244,.1)'}`,
    color: '#F6F6F4',
    borderRadius: 14,
    padding: '14px 14px',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box',
    transition: `border .3s ${S}, background .3s`,
  })
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(244,196,48,.5)'; e.currentTarget.style.background = 'rgba(246,246,244,.07)' }
  const focusOut = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = hasError ? '#CC3333' : 'rgba(246,246,244,.1)'; e.currentTarget.style.background = 'rgba(246,246,244,.05)' }

  return (
    <div style={{minHeight:'100dvh',background:'#0a0a0a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:'#F6F6F4',position:'relative',padding:'env(safe-area-inset-top,0) 16px env(safe-area-inset-bottom,0)',boxSizing:'border-box',textAlign:'center',overflow:'hidden'}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseLine{0%,100%{opacity:.12}50%{opacity:.45}}
        @keyframes successIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
      `}</style>

      {/* Back — touch target minimo 44x44 */}
      <div onClick={() => navigate('/')} style={{position:'fixed',top:'max(env(safe-area-inset-top,12px),12px)',left:8,zIndex:10,cursor:'pointer',padding:'14px 16px',opacity:.35,transition:`opacity .3s ${S}`}} onMouseEnter={e=>(e.currentTarget.style.opacity='1')} onMouseLeave={e=>(e.currentTarget.style.opacity='.35')}>
        <span style={{fontSize:13,fontWeight:600,color:'#F4C430',letterSpacing:1.5}}>&#8592; MENU</span>
      </div>

      <div style={{maxWidth:480,width:'100%',padding:'0 4px'}}>
        {/* Headline */}
        <div style={{animation:`fadeUp 1s ${S} both`}}>
          <h1 style={{fontSize:'min(12vw,56px)',fontWeight:900,letterSpacing:'-0.03em',lineHeight:1.08,margin:'0 0 min(5vw,24px)'}}>
            STIAMO<br/>ARRIVANDO<br/>
            <span style={{color:'#F4C430'}}>BASTARDI.</span>
          </h1>
        </div>

        <div style={{animation:`fadeUp 1s ${S} .15s both`}}>
          <p style={{fontSize:'min(5.5vw,24px)',fontWeight:700,color:'rgba(246,246,244,.55)',lineHeight:1.35,margin:'0 0 6px'}}>
            E sarà personale.
          </p>
          <p style={{fontSize:'min(5.5vw,24px)',fontWeight:700,color:'rgba(246,246,244,.25)',lineHeight:1.35,margin:0}}>
            E farà ancora più male.
          </p>
        </div>

        {/* Separator */}
        <div style={{width:48,height:1,background:'linear-gradient(90deg,transparent,rgba(244,196,48,.6),transparent)',margin:'min(6vw,32px) auto',animation:'pulseLine 4s ease-in-out infinite'}}/>

        {/* Form / Success */}
        <div style={{animation:`fadeUp 1s ${S} .3s both`}}>
          {success ? (
            <div style={{animation:`successIn .5s ${S} both`}}>
              <p style={{fontSize:'min(5vw,20px)',fontWeight:800,color:'#F4C430',margin:'0 0 8px',letterSpacing:-.3}}>Ci sei. Ti avvisiamo noi.</p>
              <p style={{fontSize:13,color:'rgba(246,246,244,.25)',margin:0}}>Niente spam. Solo una botta quando è pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{maxWidth:380,margin:'0 auto',textAlign:'left'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div>
                  <label style={{fontSize:11,color:'rgba(246,246,244,.35)',letterSpacing:2,textTransform:'uppercase',fontWeight:600,display:'block',marginBottom:8}}>Nome</label>
                  <input type="text" value={formData.nome} onChange={e=>handleChange('nome',e.target.value)} placeholder="Nome" style={inputStyle(errors.nome)} onFocus={focusIn} onBlur={focusOut(errors.nome)}/>
                  {errors.nome && <p style={{fontSize:11,color:'#CC3333',margin:'6px 0 0'}}>Inserisci il nome</p>}
                </div>
                <div>
                  <label style={{fontSize:11,color:'rgba(246,246,244,.35)',letterSpacing:2,textTransform:'uppercase',fontWeight:600,display:'block',marginBottom:8}}>Cognome</label>
                  <input type="text" value={formData.cognome} onChange={e=>handleChange('cognome',e.target.value)} placeholder="Cognome" style={inputStyle(errors.cognome)} onFocus={focusIn} onBlur={focusOut(errors.cognome)}/>
                  {errors.cognome && <p style={{fontSize:11,color:'#CC3333',margin:'6px 0 0'}}>Inserisci il cognome</p>}
                </div>
              </div>

              <div style={{marginBottom:12}}>
                <label style={{fontSize:11,color:'rgba(246,246,244,.35)',letterSpacing:2,textTransform:'uppercase',fontWeight:600,display:'block',marginBottom:8}}>Email</label>
                <input type="email" value={formData.email} onChange={e=>handleChange('email',e.target.value)} placeholder="la@tua.email" style={inputStyle(errors.email)} onFocus={focusIn} onBlur={focusOut(errors.email)}/>
                {errors.email && <p style={{fontSize:11,color:'#CC3333',margin:'6px 0 0'}}>Inserisci un'email valida</p>}
              </div>

              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,color:'rgba(246,246,244,.35)',letterSpacing:2,textTransform:'uppercase',fontWeight:600,display:'block',marginBottom:8}}>Telefono</label>
                <input type="tel" value={formData.telefono} onChange={e=>handleChange('telefono',e.target.value)} placeholder="+39 333 1234567" style={inputStyle(errors.telefono)} onFocus={focusIn} onBlur={focusOut(errors.telefono)}/>
                {errors.telefono && <p style={{fontSize:11,color:'#CC3333',margin:'6px 0 0'}}>Inserisci un numero valido</p>}
              </div>

              {/* Privacy */}
              <label style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:20,cursor:'pointer',padding:'8px 0'}}>
                <input type="checkbox" checked={privacy} onChange={e=>{setPrivacy(e.target.checked);setErrors(prev=>({...prev,privacy:false}))}} style={{accentColor:'#F4C430',width:20,height:20,marginTop:1,flexShrink:0}}/>
                <span style={{fontSize:12,color:'rgba(246,246,244,.35)',lineHeight:1.5}}>
                  Accetto la <Link to="/privacy" style={{color:'#F4C430',textDecoration:'none'}}>Privacy Policy</Link>
                  {errors.privacy && <span style={{color:'#CC3333',display:'block',marginTop:4}}>Devi accettare la privacy policy</span>}
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                style={{width:'100%',background:'#F4C430',color:'#0a0a0a',border:'none',borderRadius:14,padding:'16px',fontSize:16,fontWeight:800,letterSpacing:.5,cursor:'pointer',opacity:submitting?.5:1,transition:`transform .15s ${S}, opacity .2s`}}
                onMouseDown={e=>(e.currentTarget.style.transform='scale(0.97)')}
                onMouseUp={e=>(e.currentTarget.style.transform='scale(1)')}
                onTouchStart={e=>(e.currentTarget.style.transform='scale(0.97)')}
                onTouchEnd={e=>(e.currentTarget.style.transform='scale(1)')}
              >
                {submitting ? 'INVIO IN CORSO...' : 'AVVISAMI'}
              </button>

              <p style={{fontSize:11,color:'rgba(246,246,244,.15)',marginTop:16,textAlign:'center',letterSpacing:.5}}>
                Niente spam. Solo una botta quando è pronto.
              </p>
            </form>
          )}
        </div>
      </div>

      <div style={{position:'fixed',bottom:'max(env(safe-area-inset-bottom,12px),12px)',left:0,right:0,textAlign:'center',fontSize:7,color:'rgba(246,246,244,.06)',letterSpacing:5,textTransform:'uppercase'}}>Le stelle non ti calcolano</div>
    </div>
  )
}
