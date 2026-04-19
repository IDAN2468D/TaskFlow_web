import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { serializeTask } from '@/lib/utils';
import { getUserIdFromToken } from '@/lib/authHelper';

export const dynamic = 'force-dynamic';

/**
 * Mobile Bridge: Get Most Urgent Task
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getUserIdFromToken(req);
    
    // Fetch user's most urgent task
    const task = await Task.findOne({ userId, status: { $ne: 'Done' } })
      .sort({ priority: -1, createdAt: -1 });

    const response = NextResponse.json(task ? serializeTask(task) : null);
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error: any) {
    console.error("[GetTopTask Bridge Error]:", error.message);
    const isAuthError = error.message?.includes('Unauthorized');
    
    return NextResponse.json(
      { error: error.message }, 
      { 
        status: isAuthError ? 401 : 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
