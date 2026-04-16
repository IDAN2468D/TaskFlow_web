import 'server-only';
import { headers, cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

/**
 * Extracts and verifies the user ID from the Authorization header (Mobile) or Cookies (Web).
 * Throws an error if the token is invalid or missing.
 */
export async function getUserIdFromToken(): Promise<string> {
  let token: string | undefined;

  // 1. Try extracting from Authorization header (Mobile App)
  const headerList = await headers();
  const authHeader = headerList.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Try extracting from Cookies (Web App)
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) {
    throw new Error('Unauthorized: Missing or invalid token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    if (!decoded || !decoded.userId) {
      throw new Error('Unauthorized: Invalid token payload');
    }

    return decoded.userId;
  } catch (err: any) {
    console.error('JWT Verification failed:', err.message);
    throw new Error('Unauthorized: Session expired or invalid');
  }
}
