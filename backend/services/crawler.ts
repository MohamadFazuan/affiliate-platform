// AI Crawler Service
// Web scraping and AI-powered product analysis

import { Env } from '../types'

export interface CrawlProductData {
  url: string
  userId: string
}

export interface CrawledProductResult {
  success: boolean
  product?: {
    id: string
    name: string
    price: number
    category: string
    platform: string
    description: string
    image_url: string
    ai_score: number
    commission: number
    competition_level: string
    trend_score: number
    potential_score: number
  }
  error?: string
}

/**
 * Extract domain from URL to determine platform
 */
function extractPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    
    if (hostname.includes('amazon')) return 'Amazon'
    if (hostname.includes('shopee')) return 'Shopee'
    if (hostname.includes('tiktok')) return 'TikTok Shop'
    if (hostname.includes('lazada')) return 'Lazada'
    if (hostname.includes('alibaba')) return 'Alibaba'
    if (hostname.includes('etsy')) return 'Etsy'
    
    return 'Other'
  } catch {
    return 'Unknown'
  }
}

/**
 * Extract product info from URL (basic implementation)
 * In production, this would use actual web scraping
 */
async function scrapeProduct(url: string): Promise<any> {
  // Mock implementation - In production, use Cloudflare Browser Rendering API
  // or third-party scraping service
  
  const platform = extractPlatform(url)
  
  // Simulate scraping delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock extracted data
  return {
    name: 'Scraped Product Name',
    price: Math.floor(Math.random() * 200) + 20,
    description: 'Product description extracted from the web page...',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    platform,
  }
}

/**
 * Analyze product with AI scoring
 * In production, this would use Cloudflare AI Workers
 */
function analyzeProduct(productData: any): any {
  const { name, price, description, platform } = productData
  
  // Mock AI analysis
  const aiScore = Math.floor(Math.random() * 30) + 70 // 70-100
  const trendScore = Math.floor(Math.random() * 30) + 70
  const competitionLevels = ['Low', 'Medium', 'High']
  const competitionLevel = competitionLevels[Math.floor(Math.random() * 3)]
  
  // Estimate commission based on price
  let commissionRate = 15
  if (price > 100) commissionRate = 12
  if (price > 200) commissionRate = 10
  if (price < 50) commissionRate = 20
  
  const commission = commissionRate
  
  // Calculate potential score
  const competitionFactor = competitionLevel === 'Low' ? 1 : competitionLevel === 'Medium' ? 2 : 3
  const potentialScore = (aiScore * 10) + (trendScore * 5) - (competitionFactor * 100)
  
  return {
    ai_score: aiScore,
    commission,
    competition_level: competitionLevel,
    trend_score: trendScore,
    potential_score: potentialScore,
  }
}

/**
 * Categorize product based on description and name
 */
function categorizeProduct(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase()
  
  if (text.match(/phone|laptop|computer|tablet|electronic|gadget|tech/)) return 'Electronics'
  if (text.match(/skincare|beauty|makeup|cosmetic|lotion|serum/)) return 'Beauty'
  if (text.match(/cloth|fashion|shirt|dress|wear|apparel/)) return 'Fashion'
  if (text.match(/fitness|health|vitamin|supplement|yoga|exercise/)) return 'Health'
  if (text.match(/kitchen|cook|blend|appliance|utensil/)) return 'Kitchen'
  if (text.match(/book|learn|education|course/)) return 'Education'
  if (text.match(/game|gaming|console|controller/)) return 'Gaming'
  if (text.match(/home|furniture|decor|living/)) return 'Home & Garden'
  if (text.match(/pet|dog|cat|animal/)) return 'Pets'
  if (text.match(/sport|athletic|outdoor|camping/)) return 'Sports'
  
  return 'Other'
}

/**
 * Crawl and analyze product from URL
 */
export async function crawlProduct(
  data: CrawlProductData,
  env: Env
): Promise<CrawledProductResult> {
  const { url, userId } = data
  
  try {
    // Validate URL
    try {
      new URL(url)
    } catch {
      return {
        success: false,
        error: 'Invalid URL format'
      }
    }
    
    // Scrape product data
    const scrapedData = await scrapeProduct(url)
    
    // Categorize product
    const category = categorizeProduct(scrapedData.name, scrapedData.description)
    
    // AI analysis
    const analysis = analyzeProduct({ ...scrapedData, category })
    
    // Generate product ID
    const productId = `crawled_${crypto.randomUUID()}`
    
    // Save to database
    const timestamp = Math.floor(Date.now() / 1000)
    await env.DB.prepare(`
      INSERT INTO products (
        id, name, category, platform, commission, price,
        avg_monthly_sales, conversion_rate, competition_level,
        rating, trend_score, potential_score, refund_rate,
        target_age_min, target_age_max, target_gender, target_location,
        image_url, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      productId,
      scrapedData.name,
      category,
      scrapedData.platform,
      analysis.commission,
      scrapedData.price,
      1000, // Mock avg_monthly_sales
      0.035, // Mock conversion_rate
      analysis.competition_level,
      4.5, // Mock rating
      analysis.trend_score,
      analysis.potential_score,
      0.08, // Mock refund_rate
      18, 45, // Age range
      'All', // Gender
      'Global', // Location
      scrapedData.image_url,
      timestamp
    ).run()
    
    return {
      success: true,
      product: {
        id: productId,
        name: scrapedData.name,
        price: scrapedData.price,
        category,
        platform: scrapedData.platform,
        description: scrapedData.description,
        image_url: scrapedData.image_url,
        ai_score: analysis.ai_score,
        commission: analysis.commission,
        competition_level: analysis.competition_level,
        trend_score: analysis.trend_score,
        potential_score: analysis.potential_score,
      }
    }
    
  } catch (error: any) {
    console.error('Crawl error:', error)
    return {
      success: false,
      error: error.message || 'Failed to crawl product'
    }
  }
}
