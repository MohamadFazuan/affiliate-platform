// Goals Service

import { Env, Goal } from '../types'

export async function getGoal(
  userId: string,
  env: Env
): Promise<Goal | null> {
  const currentMonth = new Date().getMonth() + 1
  const goal = await env.DB.prepare(
    'SELECT * FROM goals WHERE user_id = ? AND current_month = ?'
  ).bind(userId, currentMonth).first<Goal>()
  
  return goal || null
}

export async function setGoal(
  userId: string,
  monthlyIncomeGoal: number,
  env: Env
): Promise<{ id: string }> {
  const currentMonth = new Date().getMonth() + 1
  
  // Delete existing goal for this month
  await env.DB.prepare(
    'DELETE FROM goals WHERE user_id = ? AND current_month = ?'
  ).bind(userId, currentMonth).run()
  
  // Create new goal
  const goalId = crypto.randomUUID()
  await env.DB.prepare(`
    INSERT INTO goals (id, user_id, monthly_income_goal, current_month)
    VALUES (?, ?, ?, ?)
  `).bind(goalId, userId, monthlyIncomeGoal, currentMonth).run()
  
  return { id: goalId }
}
