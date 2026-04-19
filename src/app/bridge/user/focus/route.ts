import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getUserIdFromToken } from '@/lib/authHelper';
import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'scratch', 'bridge_debug.log');
const log = (msg: string) => {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] [FOCUS_BRIDGE] ${msg}\n`);
  } catch (e) {}
};

export const dynamic = 'force-dynamic';

/**
 * GET: Fetch focus mode status
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(req);
    log(`GET - UserID: ${userId}`);

    const user = await User.findById(userId).select('isFocusModeEnabled');
    
    const response = NextResponse.json({ isFocusModeEnabled: user?.isFocusModeEnabled || false });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error: any) {
    log(`GET Error: ${error.message}`);
    return NextResponse.json(
      { error: error.message }, 
      { 
        status: error.message.includes('Unauthorized') ? 401 : 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}

/**
 * POST: Toggle focus mode status
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(req);
    log(`POST - UserID: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { 
          status: 404,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    const newStatus = !user.isFocusModeEnabled;
    await User.findByIdAndUpdate(userId, { isFocusModeEnabled: newStatus });

    const response = NextResponse.json({ success: true, isFocusModeEnabled: newStatus });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error: any) {
    log(`POST Error: ${error.message}`);
    return NextResponse.json(
      { error: error.message }, 
      { 
        status: error.message.includes('Unauthorized') ? 401 : 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
