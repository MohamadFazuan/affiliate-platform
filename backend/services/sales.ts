// Sales Service

import { Env, Sale } from "../types";

export interface RecordSaleData {
  campaign_id: string;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  cost?: number;
}

export interface SalesFilter {
  campaign_id?: string;
  date_from?: number;
  date_to?: number;
}

export async function recordSale(
  userId: string,
  data: RecordSaleData,
  env: Env,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const {
    campaign_id,
    clicks = 0,
    conversions = 0,
    revenue = 0,
    cost = 0,
  } = data;

  // Verify campaign belongs to user
  const campaign = await env.DB.prepare(
    "SELECT id, product_id FROM campaigns WHERE id = ? AND user_id = ?",
  )
    .bind(campaign_id, userId)
    .first<any>();

  if (!campaign) {
    return { success: false, error: "Campaign not found" };
  }

  // Get product commission
  const product = await env.DB.prepare(
    "SELECT commission FROM products WHERE id = ?",
  )
    .bind(campaign.product_id)
    .first<any>();

  const commission_earned = revenue * ((product?.commission || 0) / 100);

  const saleId = crypto.randomUUID();
  const date = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `
    INSERT INTO sales (id, campaign_id, date, clicks, conversions, revenue, commission_earned, cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  )
    .bind(
      saleId,
      campaign_id,
      date,
      clicks,
      conversions,
      revenue,
      commission_earned,
      cost,
    )
    .run();

  return { success: true, id: saleId };
}

export async function getSales(
  userId: string,
  filter: SalesFilter,
  env: Env,
): Promise<any[]> {
  let query = `
    SELECT s.*, c.name as campaign_name, p.name as product_name
    FROM sales s
    JOIN campaigns c ON s.campaign_id = c.id
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  const params: any[] = [userId];

  if (filter.campaign_id) {
    query += " AND s.campaign_id = ?";
    params.push(filter.campaign_id);
  }

  if (filter.date_from) {
    query += " AND s.date >= ?";
    params.push(filter.date_from);
  }

  if (filter.date_to) {
    query += " AND s.date <= ?";
    params.push(filter.date_to);
  }

  query += " ORDER BY s.date DESC";

  const { results } = await env.DB.prepare(query)
    .bind(...params)
    .all();

  return results || [];
}

export async function getSalesStats(
  userId: string,
  filter: SalesFilter,
  env: Env,
): Promise<any> {
  let query = `
    SELECT 
      SUM(s.clicks) as total_clicks,
      SUM(s.conversions) as total_conversions,
      SUM(s.revenue) as total_revenue,
      SUM(s.commission_earned) as total_commission,
      SUM(s.cost) as total_cost,
      COUNT(DISTINCT s.campaign_id) as active_campaigns
    FROM sales s
    JOIN campaigns c ON s.campaign_id = c.id
    WHERE c.user_id = ?
  `;
  const params: any[] = [userId];

  if (filter.campaign_id) {
    query += " AND s.campaign_id = ?";
    params.push(filter.campaign_id);
  }

  if (filter.date_from) {
    query += " AND s.date >= ?";
    params.push(filter.date_from);
  }

  if (filter.date_to) {
    query += " AND s.date <= ?";
    params.push(filter.date_to);
  }

  const stats = await env.DB.prepare(query)
    .bind(...params)
    .first<any>();

  return {
    total_clicks: stats?.total_clicks || 0,
    total_conversions: stats?.total_conversions || 0,
    total_revenue: stats?.total_revenue || 0,
    total_commission: stats?.total_commission || 0,
    total_cost: stats?.total_cost || 0,
    active_campaigns: stats?.active_campaigns || 0,
    roi:
      stats?.total_revenue && stats?.total_cost
        ? ((stats.total_revenue - stats.total_cost) / stats.total_cost) * 100
        : 0,
    conversion_rate:
      stats?.total_clicks && stats?.total_conversions
        ? (stats.total_conversions / stats.total_clicks) * 100
        : 0,
  };
}

export async function getTopCampaignsBySales(
  userId: string,
  limit: number = 10,
  env: Env,
): Promise<any[]> {
  const { results } = await env.DB.prepare(
    `
    SELECT 
      c.id,
      c.name,
      p.name as product_name,
      SUM(s.revenue) as total_revenue,
      SUM(s.commission_earned) as total_commission,
      SUM(s.conversions) as total_conversions,
      SUM(s.clicks) as total_clicks
    FROM campaigns c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN sales s ON c.id = s.campaign_id
    WHERE c.user_id = ?
    GROUP BY c.id, c.name, p.name
    ORDER BY total_revenue DESC
    LIMIT ?
  `,
  )
    .bind(userId, limit)
    .all();

  return results || [];
}

export async function updateSale(
  saleId: string,
  userId: string,
  data: Partial<RecordSaleData>,
  env: Env,
): Promise<{ success: boolean; error?: string }> {
  // Verify sale belongs to user
  const sale = await env.DB.prepare(
    `
    SELECT s.id FROM sales s
    JOIN campaigns c ON s.campaign_id = c.id
    WHERE s.id = ? AND c.user_id = ?
  `,
  )
    .bind(saleId, userId)
    .first<any>();

  if (!sale) {
    return { success: false, error: "Sale not found" };
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (data.clicks !== undefined) {
    updates.push("clicks = ?");
    values.push(data.clicks);
  }
  if (data.conversions !== undefined) {
    updates.push("conversions = ?");
    values.push(data.conversions);
  }
  if (data.revenue !== undefined) {
    updates.push("revenue = ?");
    values.push(data.revenue);
  }
  if (data.cost !== undefined) {
    updates.push("cost = ?");
    values.push(data.cost);
  }

  if (updates.length === 0) {
    return { success: true };
  }

  // Recalculate commission if revenue changed
  if (data.revenue !== undefined) {
    const campaign = await env.DB.prepare(
      `
      SELECT product_id FROM campaigns WHERE id = (
        SELECT campaign_id FROM sales WHERE id = ?
      )
    `,
    )
      .bind(saleId)
      .first<any>();

    const product = await env.DB.prepare(
      "SELECT commission FROM products WHERE id = ?",
    )
      .bind(campaign?.product_id)
      .first<any>();

    const commission_earned = data.revenue * ((product?.commission || 0) / 100);
    updates.push("commission_earned = ?");
    values.push(commission_earned);
  }

  values.push(saleId);

  const query = `UPDATE sales SET ${updates.join(", ")} WHERE id = ?`;
  await env.DB.prepare(query)
    .bind(...values)
    .run();

  return { success: true };
}

export async function deleteSale(
  saleId: string,
  userId: string,
  env: Env,
): Promise<{ success: boolean; error?: string }> {
  const result = await env.DB.prepare(
    `
    DELETE FROM sales WHERE id = ? AND campaign_id IN (
      SELECT id FROM campaigns WHERE user_id = ?
    )
  `,
  )
    .bind(saleId, userId)
    .run();

  if (!result.meta.changes) {
    return { success: false, error: "Sale not found" };
  }

  return { success: true };
}
