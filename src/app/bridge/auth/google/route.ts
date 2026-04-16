import { NextResponse } from 'next/server';
import { loginWithGoogleAction } from '@/actions/authActions';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'ID Token is required' }, { status: 400 });
    }

    const result = await loginWithGoogleAction(idToken);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    
    // In mobile, we might need the token explicitly returned if it's not set in cookies (which it isn't for mobile apps)
    // Wait, loginWithGoogleAction sets a cookie. For mobile, we should probably also return the token.
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Bridge Google Auth Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
