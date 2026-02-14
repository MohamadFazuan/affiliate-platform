// AI-Powered Product Recommendations Service

import { Env } from "../types";

interface ProductScore {
  id: string;
  name: string;
  category: string;
  platform: string;
  commission: number;
  potential_score: number;
  relevance_score: number;
  final_score: number;
}

/**
 * Get personalized product recommendations for a user
 * Based on their campaign history, sales performance, and interests
 */
export async function getProductRecommendations(
  userId: string,
  limit: number = 10,
  env: Env,
): Promise<ProductScore[]> {
  // Get user's campaign history to understand preferences
  const { results: userCampaigns } = await env.DB.prepare(
    `
    SELECT DISTINCT 
      p.category,
      p.platform,
      SUM(COALESCE(s.revenue, 0)) as total_revenue,
      COUNT(s.id) as sale_count
    FROM campaigns c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN sales s ON c.id = s.campaign_id
    WHERE c.user_id = ?
    GROUP BY p.category, p.platform
  `,
  )
    .bind(userId)
    .all();

  // Calculate user's preferred categories and platforms
  const categoryWeights: Record<string, number> = {};
  const platformWeights: Record<string, number> = {};

  userCampaigns.forEach((campaign: any) => {
    const revenueWeight = campaign.total_revenue || 1;
    const saleWeight = campaign.sale_count || 1;
    const weight = Math.log(revenueWeight + 1) + saleWeight;

    categoryWeights[campaign.category] =
      (categoryWeights[campaign.category] || 0) + weight;
    platformWeights[campaign.platform] =
      (platformWeights[campaign.platform] || 0) + weight;
  });

  // Get products user hasn't promoted yet
  const { results: products } = await env.DB.prepare(
    `
    SELECT p.*
    FROM products p
    WHERE p.id NOT IN (
      SELECT DISTINCT product_id
      FROM campaigns
      WHERE user_id = ?
    )
    ORDER BY p.potential_score DESC
    LIMIT 100
  `,
  )
    .bind(userId)
    .all();

  // Score each product based on relevance
  const scoredProducts: ProductScore[] = products.map((product: any) => {
    const categoryScore = categoryWeights[product.category] || 0;
    const platformScore = platformWeights[product.platform] || 0;

    // Calculate relevance score (0-100)
    const relevance_score = categoryScore * 0.6 + platformScore * 0.4;

    // Combine with product's potential score
    const final_score = product.potential_score * 0.7 + relevance_score * 0.3;

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      platform: product.platform,
      commission: product.commission,
      potential_score: product.potential_score,
      relevance_score: Math.min(relevance_score, 100),
      final_score: Math.min(final_score, 100),
    };
  });

  // Sort by final score and return top products
  return scoredProducts
    .sort((a, b) => b.final_score - a.final_score)
    .slice(0, limit);
}

/**
 * Get trending products based on recent sales data
 */
export async function getTrendingProducts(
  limit: number = 10,
  env: Env,
): Promise<any[]> {
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  const { results } = await env.DB.prepare(
    `
    SELECT 
      p.*,
      COUNT(DISTINCT c.id) as campaign_count,
      SUM(s.revenue) as total_revenue,
      SUM(s.conversions) as total_conversions
    FROM products p
    LEFT JOIN campaigns c ON p.id = c.product_id
    LEFT JOIN sales s ON c.id = s.campaign_id AND s.date >= ?
    GROUP BY p.id
    HAVING campaign_count > 0
    ORDER BY total_revenue DESC, campaign_count DESC
    LIMIT ?
  `,
  )
    .bind(thirtyDaysAgo, limit)
    .all();

  return results;
}

/**
 * Get similar products based on category and attributes
 */
export async function getSimilarProducts(
  productId: string,
  limit: number = 5,
  env: Env,
): Promise<any[]> {
  // Get the base product
  const baseProduct = await env.DB.prepare(
    "SELECT * FROM products WHERE id = ?",
  )
    .bind(productId)
    .first<any>();

  if (!baseProduct) {
    return [];
  }

  // Find similar products in same category with similar attributes
  const { results } = await env.DB.prepare(
    `
    SELECT *,
      ABS(commission - ?) as commission_diff,
      ABS(price - ?) as price_diff,
      ABS(potential_score - ?) as score_diff
    FROM products
    WHERE id != ?
      AND category = ?
      AND platform = ?
    ORDER BY 
      (commission_diff + price_diff * 0.1 + score_diff) ASC
    LIMIT ?
  `,
  )
    .bind(
      baseProduct.commission,
      baseProduct.price,
      baseProduct.potential_score,
      productId,
      baseProduct.category,
      baseProduct.platform,
      limit,
    )
    .all();

  return results;
}

/**
 * Get product recommendations for a specific campaign
 * Based on campaign goals and target audience
 */
export async function getCampaignProductRecommendations(
  campaignGoal: string,
  targetAudience: string,
  limit: number = 10,
  env: Env,
): Promise<any[]> {
  // Parse campaign goals (e.g., "high-commission", "trending", "beginner-friendly")
  let orderBy = "potential_score DESC";
  let whereClause = "1=1";

  if (campaignGoal.includes("high-commission")) {
    orderBy = "commission DESC, potential_score DESC";
  } else if (campaignGoal.includes("trending")) {
    orderBy = "trend_score DESC";
  } else if (campaignGoal.includes("low-competition")) {
    whereClause = "competition_level = 'Low'";
  }

  const { results } = await env.DB.prepare(
    `
    SELECT *
    FROM products
    WHERE ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ?
  `,
  )
    .bind(limit)
    .all();

  return results;
}
