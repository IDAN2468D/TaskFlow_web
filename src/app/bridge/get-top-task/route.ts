import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { serializeTask } from '@/lib/utils';
import { getUserIdFromToken } from '@/lib/authHelper';

/**
 * Mobile Bridge: Get Most Urgent Task
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // We fetch globally first as per the current user preference for MVP
    const task = await Task.findOne({ status: { $ne: 'Done' } })
      .sort({ priority: -1, createdAt: -1 });

    return NextResponse.json(task ? serializeTask(task) : null);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
