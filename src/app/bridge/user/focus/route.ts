import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

async function getUserIdFromBridge() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

/**
 * GET: Fetch focus mode status
 */
export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserIdFromBridge();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(userId).select('isFocusModeEnabled');
    return NextResponse.json({ isFocusModeEnabled: user?.isFocusModeEnabled || false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Toggle focus mode status
 */
export async function POST() {
  try {
    await dbConnect();
    const userId = await getUserIdFromBridge();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const newStatus = !user.isFocusModeEnabled;
    await User.findByIdAndUpdate(userId, { isFocusModeEnabled: newStatus });

    return NextResponse.json({ success: true, isFocusModeEnabled: newStatus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
