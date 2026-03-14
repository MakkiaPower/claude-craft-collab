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

export const config = { api: { bodyParser: false } }

async function buffer(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const body = await buffer(req)
  const signature = req.headers['stripe-signature']
  if (!signature) return res.status(400).json({ error: 'Missing signature' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  const supabase = getSupabase()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      let plan: 'monthly' | 'yearly' = 'monthly'
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        const interval = sub.items.data[0]?.price?.recurring?.interval
        plan = interval === 'year' ? 'yearly' : 'monthly'
      }
      await supabase.from('profiles').update({ subscription_status: 'active', subscription_plan: plan }).eq('stripe_customer_id', customerId)
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const interval = sub.items.data[0]?.price?.recurring?.interval
      const plan = interval === 'year' ? 'yearly' : 'monthly'
      let status: string = 'past_due'
      if (sub.status === 'active' || sub.status === 'trialing') status = 'active'
      else if (sub.status === 'canceled') status = 'cancelled'
      await supabase.from('profiles').update({ subscription_status: status, subscription_plan: plan }).eq('stripe_customer_id', customerId)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('profiles').update({ subscription_status: 'cancelled' }).eq('stripe_customer_id', sub.customer as string)
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase.from('profiles').update({ subscription_status: 'past_due' }).eq('stripe_customer_id', invoice.customer as string)
      break
    }
  }

  return res.status(200).json({ received: true })
}
