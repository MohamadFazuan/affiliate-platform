// Input Validation Utilities

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 8
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validateRequired(fields: Record<string, any>): { valid: boolean; missing?: string[] } {
  const missing = Object.entries(fields)
    .filter(([_, value]) => value === undefined || value === null || value === '')
    .map(([key]) => key)
  
  return missing.length > 0 
    ? { valid: false, missing } 
    : { valid: true }
}
