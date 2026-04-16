import { NextResponse } from 'next/server';
import { registerUser } from '@/actions/authActions';

export async function POST(req: Request) {
  try {
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
