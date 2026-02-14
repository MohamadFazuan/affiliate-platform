// Authentication Middleware

import { Env, JWTPayload } from '../types'
import { verifyJWT } from '../utils/jwt'

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload
}

export async function authenticate(
  request: Request,
  env: Env
): Promise<{ authorized: boolean; user?: JWTPayload; response?: Response }> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  const token = authHeader.substring(7)
  const user = await verifyJWT(token, env.JWT_SECRET)
  
  if (!user) {
    return {
      authorized: false,
      response: new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return { authorized: true, user }
}
