export interface Profile {
  id: string
  email: string
  display_name: string | null
  birth_date: string
  birth_time: string | null
  birth_city: string
  birth_lat: number | null
  birth_lng: number | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
  natal_chart: Record<string, unknown> | null
  stripe_customer_id: string | null
  subscription_status: 'none' | 'active' | 'cancelled' | 'past_due'
  subscription_plan: 'monthly' | 'yearly' | null
  subscription_end: string | null
  created_at: string
  updated_at: string
}

export interface Horoscope {
  id: string
  user_id: string
  date: string
  overview: string
  love: string | null
  work: string | null
  advice: string | null
  transits: { name: string; description: string }[] | null
  created_at: string
}

export const ZODIAC_SIGNS: Record<string, string> = {
  ariete: '\u2648', toro: '\u2649', gemelli: '\u264A', cancro: '\u264B',
  leone: '\u264C', vergine: '\u264D', bilancia: '\u264E', scorpione: '\u264F',
  sagittario: '\u2650', capricorno: '\u2651', acquario: '\u2652', pesci: '\u2653',
}
