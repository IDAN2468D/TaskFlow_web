import { NextResponse } from 'next/server';
import { registerUser } from '@/actions/authActions';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' - Received Register Request\n');
    const body = await req.json();
    const result = await registerUser(body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
