import { NextResponse } from 'next/server';
import { loginUser } from '@/actions/authActions';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Received Login Request\n');
    const body = await req.json();
    const result = await loginUser(body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
