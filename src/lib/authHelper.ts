import 'server-only';
import { headers, cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

/**
 * Extracts and verifies the user ID from the Authorization header (Mobile) or Cookies (Web).
 * Throws an error if the token is invalid or missing.
 */
export async function getUserIdFromToken(req?: Request): Promise<string> {
  const logPath = path.join(process.cwd(), 'scratch', 'bridge_debug.log');
  const log = (msg: string) => {
    try {
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] [AUTH_HELPER] ${msg}\n`);
    } catch (e) {}
  };

  let token: string | undefined;
  let authHeader: string | null = null;

  // 1. Try extracting from provided Request object (Route Handlers)
  if (req) {
    authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader) log('Found auth header in Request object');
  }

  // 2. Try extracting from next/headers (Server Actions / Route Handlers)
  if (!authHeader) {
    try {
      const headerList = await headers();
      authHeader = headerList.get('Authorization') || headerList.get('authorization');
      if (authHeader) log('Found auth header in next/headers');
    } catch (e) {
      // headers() might not be available in some contexts
    }
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 3. Try extracting from Cookies (Web App)
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
      if (token) log('Found token in cookies');
    } catch (e) {
      // cookies() might not be available in some contexts
    }
  }

  if (!token) {
    log('Unauthorized: No token found in headers or cookies');
    throw new Error('Unauthorized: Missing or invalid token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    if (!decoded || !decoded.userId) {
      log('Unauthorized: Invalid token payload');
      throw new Error('Unauthorized: Invalid token payload');
    }

    return decoded.userId;
  } catch (err: any) {
    log(`JWT Verification failed: ${err.message}`);
    console.error('JWT Verification failed:', err.message);
    throw new Error('Unauthorized: Session expired or invalid');
  }
}
