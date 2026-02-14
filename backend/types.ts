// Type Definitions for Cloudflare Worker

export interface Env {
  DB: D1Database
  ASSETS: R2Bucket
  JWT_SECRET: string
  ENVIRONMENT: string
}

export interface User {
  id: string
  email: string
  password_hash: string
  role: string
  created_at: number
  updated_at: number
}

export interface Product {
  id: string
  name: string
  category: string
  platform: string
  commission: number
  price: number
  avg_monthly_sales: number
  conversion_rate: number
  competition_level: 'Low' | 'Medium' | 'High'
  target_age_min?: number
  target_age_max?: number
  target_gender?: string
  target_location?: string
  interest_tags?: string
  refund_rate: number
  rating: number
  trend_score: number
  estimated_cpc?: number
  estimated_traffic: number
  potential_score: number
  image_url?: string
  created_at: number
  updated_at: number
}

export interface Campaign {
  id: string
  user_id: string
  product_id: string
  name: string
  promotion_platform: string
  budget: number
  content_type?: string
  start_date: number
  end_date?: number
  status: 'active' | 'paused' | 'completed'
  created_at: number
  updated_at: number
}

export interface Sale {
  id: string
  campaign_id: string
  date: number
  clicks: number
  conversions: number
  revenue: number
  commission_earned: number
  cost: number
  created_at: number
}

export interface Goal {
  id: string
  user_id: string
  monthly_income_goal: number
  current_month: number
  created_at: number
}

export interface JWTPayload {
  id: string
  email: string
  role: string
  exp: number
}
