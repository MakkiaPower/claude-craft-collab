import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getSupabase() {
  return createClient(
    process.env.VITE_OROSCOPO_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_OROSCOPO_SUPABASE_ANON_KEY!
  )
}

async function verifyUser(token: string) {
  const supabase = createClient(
    process.env.VITE_OROSCOPO_SUPABASE_URL!,
    process.env.VITE_OROSCOPO_SUPABASE_ANON_KEY!
  )
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non autenticato' })

  const authedUser = await verifyUser(token)
  if (!authedUser) return res.status(401).json({ error: 'Token non valido' })

  const supabase = getSupabase()
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', authedUser.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return res.status(400).json({ error: 'Nessun abbonamento trovato' })
  }

  const siteUrl = process.env.VITE_SITE_URL || 'https://astrobastardo.it'

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl}/oroscopo/settings`,
  })

  return res.status(200).json({ url: session.url })
}
