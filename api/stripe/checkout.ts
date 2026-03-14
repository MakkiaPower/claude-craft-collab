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

  // Verifica autenticazione
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non autenticato' })

  const authedUser = await verifyUser(token)
  if (!authedUser) return res.status(401).json({ error: 'Token non valido' })

  const { plan } = req.body
  const userId = authedUser.id
  const email = authedUser.email

  const priceId = plan === 'yearly'
    ? process.env.STRIPE_PRICE_YEARLY!
    : process.env.STRIPE_PRICE_MONTHLY!

  const supabase = getSupabase()

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { supabase_user_id: userId },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId)
  }

  const siteUrl = process.env.VITE_SITE_URL || 'https://astrobastardo.it'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/oroscopo/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/oroscopo/pricing`,
  })

  return res.status(200).json({ url: session.url })
}
