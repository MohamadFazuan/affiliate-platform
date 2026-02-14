// Authentication Service

import { Env, JWTPayload } from "../types";
import { hashPassword, verifyPassword } from "../utils/password";
import { validateEmail, validatePassword } from "../utils/validation";
import { createJWT } from "../utils/jwt";

export async function registerUser(
  email: string,
  password: string,
  env: Env,
): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  // Validate input
  if (!validateEmail(email)) {
    return { success: false, error: "Invalid email format" };
  }

  if (!validatePassword(password)) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  // Check if user exists
  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  // Create user
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)",
  )
    .bind(userId, email, passwordHash, "affiliate")
    .run();

  // Generate JWT
  const payload: JWTPayload = {
    id: userId,
    email,
    role: "affiliate",
    exp: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
  };

  const token = await createJWT(payload, env.JWT_SECRET);

  return {
    success: true,
    token,
    user: { id: userId, email, role: "affiliate" },
  };
}

export async function loginUser(
  email: string,
  password: string,
  env: Env,
): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first<any>();

  if (!user) {
    return { success: false, error: "Invalid credentials" };
  }

  // Use verifyPassword to properly compare bcrypt hash
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return { success: false, error: "Invalid credentials" };
  }

  const payload: JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 86400 * 30,
  };

  const token = await createJWT(payload, env.JWT_SECRET);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      subscription_tier: user.subscription_tier || "free",
      subscription_status: user.subscription_status || "active",
    },
  };
}
