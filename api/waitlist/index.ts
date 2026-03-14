import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email richiesta' })

  const apiKey = process.env.BREVO_API_KEY
  const listId = parseInt(process.env.BREVO_WAITLIST_LIST_ID || '0', 10)

  if (!apiKey) return res.status(500).json({ error: 'Brevo non configurato' })

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        listIds: listId ? [listId] : [],
        updateEnabled: true,
      }),
    })

    // 201 = creato, 204 = già esistente e aggiornato — entrambi ok
    if (response.ok || response.status === 204) {
      return res.status(200).json({ ok: true })
    }

    const data = await response.json().catch(() => ({}))

    // "Contact already exist" — trattalo come successo
    if (data?.code === 'duplicate_parameter') {
      return res.status(200).json({ ok: true })
    }

    return res.status(500).json({ error: 'Errore Brevo' })
  } catch {
    return res.status(500).json({ error: 'Errore di rete' })
  }
}
