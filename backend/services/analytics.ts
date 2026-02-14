// Analytics Service

import { Env } from '../types'

export interface DashboardData {
  totalRevenue: number
  totalCommission: number
  totalClicks: number
  totalConversions: number
  conversionRate: string
  roi: string
  cpa: string
  revenueOverTime: Array<{ date: number; revenue: number }>
  salesByProduct: any[]
  platformPerformance: any[]
}

export async function getDashboardAnalytics(
  userId: string,
  env: Env
): Promise<DashboardData> {
  // Get all campaigns for user
  const { results: campaigns } = await env.DB.prepare(
    'SELECT id FROM campaigns WHERE user_id = ?'
  ).bind(userId).all()
  
  if (!campaigns || campaigns.length === 0) {
    return {
      totalRevenue: 0,
      totalCommission: 0,
      totalClicks: 0,
      totalConversions: 0,
      conversionRate: '0.00',
      roi: '0.00',
      cpa: '0.00',
      revenueOverTime: [],
      salesByProduct: [],
      platformPerformance: []
    }
  }
  
  const campaignIds = campaigns.map((c: any) => c.id)
  
  // Get aggregated sales data
  const placeholders = campaignIds.map(() => '?').join(',')
  const salesData = await env.DB.prepare(`
    SELECT 
      SUM(revenue) as total_revenue,
      SUM(commission_earned) as total_commission,
      SUM(clicks) as total_clicks,
      SUM(conversions) as total_conversions,
      SUM(cost) as total_cost
    FROM sales
    WHERE campaign_id IN (${placeholders})
  `).bind(...campaignIds).first<any>()
  
  // Revenue over time (last 30 days)
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 86400
  const { results: revenueOverTime } = await env.DB.prepare(`
    SELECT date, SUM(revenue) as revenue
    FROM sales
    WHERE campaign_id IN (${placeholders})
      AND date >= ?
    GROUP BY date
    ORDER BY date ASC
  `).bind(...campaignIds, thirtyDaysAgo).all()
  
  const totalRevenue = salesData?.total_revenue || 0
  const totalCommission = salesData?.total_commission || 0
  const totalClicks = salesData?.total_clicks || 0
  const totalConversions = salesData?.total_conversions || 0
  const totalCost = salesData?.total_cost || 0
  
  const conversionRate = totalClicks > 0 
    ? ((totalConversions / totalClicks) * 100).toFixed(2)
    : '0.00'
  
  const roi = totalCost > 0 
    ? (((totalRevenue - totalCost) / totalCost) * 100).toFixed(2)
    : '0.00'
  
  const cpa = totalConversions > 0 
    ? (totalCost / totalConversions).toFixed(2)
    : '0.00'
  
  return {
    totalRevenue,
    totalCommission,
    totalClicks,
    totalConversions,
    conversionRate,
    roi,
    cpa,
    revenueOverTime: revenueOverTime || [],
    salesByProduct: [],
    platformPerformance: []
  }
}

export async function getCampaignAnalytics(
  campaignId: string,
  userId: string,
  env: Env
): Promise<{ campaign: any; sales: any[] } | null> {
  // Verify ownership
  const campaign = await env.DB.prepare(
    'SELECT * FROM campaigns WHERE id = ? AND user_id = ?'
  ).bind(campaignId, userId).first()
  
  if (!campaign) {
    return null
  }
  
  const { results: sales } = await env.DB.prepare(`
    SELECT * FROM sales WHERE campaign_id = ? ORDER BY date DESC
  `).bind(campaignId).all()
  
  return { campaign, sales: sales || [] }
}
