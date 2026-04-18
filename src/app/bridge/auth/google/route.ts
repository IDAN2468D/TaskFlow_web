import { NextResponse } from 'next/server';
import { loginWithGoogleAction } from '@/actions/authActions';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Received Google Auth Request\n');
    const { idToken } = await req.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'ID Token is required' }, { status: 400 });
    }

    const result = await loginWithGoogleAction(idToken);
    
    if (result.error) {
      fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Google Auth Action Error: ' + result.error + '\n');
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    
    // In mobile, we might need the token explicitly returned if it's not set in cookies (which it isn't for mobile apps)
    if (result.user) {
      fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Google Auth Success: ' + result.user.email + '\n');
    } else {
      fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Google Auth Success: (No user info)\n');
    }
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Bridge Google Auth Error:', err);
    try {
      fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Google Auth Error: ' + err.message + '\n');
    } catch (logErr) {
      console.error('Failed to write to log file:', logErr);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
