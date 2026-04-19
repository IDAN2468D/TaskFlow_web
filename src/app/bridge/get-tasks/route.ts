import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { serializeTask } from '@/lib/utils';
import { getUserIdFromToken } from '@/lib/authHelper';

export const dynamic = 'force-dynamic';

/**
 * Mobile Bridge: Get Tasks
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getUserIdFromToken(req);
    
    // Fetch only user's tasks to ensure synchronization
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    const response = NextResponse.json(tasks.map(serializeTask));

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 401 : 500;
    const response = NextResponse.json({ error: error.message }, { status });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
