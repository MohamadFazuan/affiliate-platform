// Products Service

import { Env, Product } from '../types'

export interface ProductFilters {
  category?: string
  platform?: string
  sortBy?: string
  limit?: number
}

export async function getProducts(
  filters: ProductFilters,
  env: Env
): Promise<Product[]> {
  const { category, platform, sortBy = 'potential_score', limit = 50 } = filters
  
  let query = 'SELECT * FROM products WHERE 1=1'
  const params: any[] = []
  
  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }
  
  if (platform) {
    query += ' AND platform = ?'
    params.push(platform)
  }
  
  // Validate sortBy to prevent SQL injection
  const allowedSortFields = ['potential_score', 'trend_score', 'commission', 'price', 'avg_monthly_sales', 'rating']
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'potential_score'
  
  query += ` ORDER BY ${sortField} DESC LIMIT ?`
  params.push(limit)
  
  const { results } = await env.DB.prepare(query).bind(...params).all()
  
  return results as Product[]
}

export async function getProductById(
  productId: string,
  env: Env
): Promise<Product | null> {
  const product = await env.DB.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).bind(productId).first<Product>()
  
  return product || null
}
