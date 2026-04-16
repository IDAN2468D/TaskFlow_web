import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { serializeTask } from '@/lib/utils';
import { getUserIdFromToken } from '@/lib/authHelper';

/**
 * Mobile Bridge: Get Tasks
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getUserIdFromToken();
    
    // Fetch only user's tasks to ensure synchronization
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks.map(serializeTask));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
