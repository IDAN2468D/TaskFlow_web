import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserIdFromToken } from '@/lib/authHelper';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const logPath = path.join(process.cwd(), 'scratch', 'bridge_debug.log');
  const log = (msg: string) => {
    try {
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) {}
  };

  try {
    const userId = await getUserIdFromToken(req);
    
    log(`Profile Request - UserID: ${userId}`);

    await dbConnect();
    const user = await User.findById(userId).select('name email avatar');

    if (!user) {
      log('Profile Request - User not found in DB');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    log(`Profile Request - Success. Avatar: ${user.avatar ? 'Found' : 'Null'}`);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (err: any) {
    log(`Profile Request - Error: ${err.message}`);
    console.error('Bridge Profile Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

