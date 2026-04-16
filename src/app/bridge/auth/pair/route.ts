import { NextResponse } from 'next/server';
import { authorizePairingCode } from '@/actions/authActions';
import dbConnect from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { code, userId, token } = await request.json();

    if (!code || !userId || !token) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const result = await authorizePairingCode(code, userId, token);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bridge auth pair error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
