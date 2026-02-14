// Campaigns Service

import { Env, Campaign } from "../types";

export interface CreateCampaignData {
  product_id: string;
  name: string;
  promotion_platform: string;
  budget?: number;
  content_type?: string;
  start_date: number;
  end_date?: number;
  description?: string;
  target_audience?: string;
  hashtags?: string;
  status?: string;
}

export interface UpdateCampaignData {
  name?: string;
  promotion_platform?: string;
  budget?: number;
  content_type?: string;
  start_date?: number;
  end_date?: number;
  description?: string;
  target_audience?: string;
  hashtags?: string;
  status?: string;
}

export async function getCampaigns(userId: string, env: Env): Promise<any[]> {
  const { results } = await env.DB.prepare(
    `
    SELECT c.*, p.name as product_name, p.commission, p.price
    FROM campaigns c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `,
  )
    .bind(userId)
    .all();

  return results || [];
}

export async function createCampaign(
  userId: string,
  data: CreateCampaignData,
  env: Env,
): Promise<{ id: string }> {
  const {
    product_id,
    name,
    promotion_platform,
    budget = 0,
    content_type,
    start_date,
    end_date,
    description,
    target_audience,
    hashtags,
    status = "active",
  } = data;

  const campaignId = crypto.randomUUID();
  const timestamp = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `
    INSERT INTO campaigns (
      id, user_id, product_id, name, promotion_platform, 
      budget, content_type, start_date, end_date, status, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  )
    .bind(
      campaignId,
      userId,
      product_id,
      name,
      promotion_platform,
      budget,
      content_type || null,
      start_date,
      end_date || null,
      status,
      timestamp,
    )
    .run();

  return { id: campaignId };
}

export async function updateCampaign(
  campaignId: string,
  userId: string,
  data: UpdateCampaignData,
  env: Env,
): Promise<boolean> {
  const updates: string[] = [];
  const values: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (updates.length === 0) {
    return false;
  }

  values.push(campaignId, userId);

  const query = `UPDATE campaigns SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`;
  await env.DB.prepare(query)
    .bind(...values)
    .run();

  return true;
}

export async function deleteCampaign(
  campaignId: string,
  userId: string,
  env: Env,
): Promise<boolean> {
  await env.DB.prepare("DELETE FROM campaigns WHERE id = ? AND user_id = ?")
    .bind(campaignId, userId)
    .run();

  return true;
}

export async function getCampaignById(
  campaignId: string,
  userId: string,
  env: Env,
): Promise<Campaign | null> {
  const campaign = await env.DB.prepare(
    "SELECT * FROM campaigns WHERE id = ? AND user_id = ?",
  )
    .bind(campaignId, userId)
    .first<Campaign>();

  return campaign || null;
}
