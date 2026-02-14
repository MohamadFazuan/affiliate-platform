// Product Scoring Algorithm

import { Product } from '../types'

interface ScoringWeights {
  competitionFactor: Record<string, number>
  competitionPenalty: number
  refundPenaltyMultiplier: number
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  competitionFactor: {
    'Low': 1,
    'Medium': 2,
    'High': 3
  },
  competitionPenalty: 100,
  refundPenaltyMultiplier: 500
}

/**
 * Calculate potential score for a product
 * Formula: (Commission × Sales × Conversion × Price / 100) - (Competition × 100) + Trend - (Refund × 500)
 */
export function calculatePotentialScore(
  product: Partial<Product>,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  const competitionFactor = weights.competitionFactor[product.competition_level || 'Medium'] || 2
  
  const incomeScore = (
    (product.commission || 0) *
    (product.avg_monthly_sales || 0) *
    (product.conversion_rate || 0) *
    (product.price || 0) / 100
  )
  
  const competitionPenalty = competitionFactor * weights.competitionPenalty
  const trendBonus = product.trend_score || 0
  const refundPenalty = (product.refund_rate || 0) * weights.refundPenaltyMultiplier
  
  return incomeScore - competitionPenalty + trendBonus - refundPenalty
}

/**
 * Calculate estimated monthly income
 */
export function calculateEstimatedIncome(product: Partial<Product>): number {
  return (
    (product.commission || 0) / 100 *
    (product.avg_monthly_sales || 0) *
    (product.conversion_rate || 0) / 100 *
    (product.price || 0)
  )
}

/**
 * Get risk level based on competition and refund rate
 */
export function getRiskLevel(product: Partial<Product>): 'Low' | 'Medium' | 'High' {
  const refundRate = product.refund_rate || 0
  const competition = product.competition_level
  
  if (competition === 'High' || refundRate > 10) {
    return 'High'
  } else if (competition === 'Medium' || refundRate > 5) {
    return 'Medium'
  } else {
    return 'Low'
  }
}
