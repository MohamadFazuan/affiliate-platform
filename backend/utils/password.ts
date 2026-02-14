import { compare, hash } from "bcrypt-ts";

/**
 * Hash a password using bcrypt-ts
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hashValue: string,
): Promise<boolean> {
  return await compare(password, hashValue);
}
