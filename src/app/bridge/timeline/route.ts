import { NextResponse } from 'next/server';
import { getRecentActivities } from '@/lib/actions/activity.actions';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * GET /bridge/timeline
 * Serves the activity timeline data to the mobile app.
 */
export async function GET(request: Request) {
  const logPath = path.join(process.cwd(), 'scratch', 'bridge_debug.log');
  const log = (msg: string) => {
    try {
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] TIMELINE: ${msg}\n`);
    } catch (e) {}
  };

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  log(`Request: limit=${limit}`);

  try {
    const result = await getRecentActivities(limit);
    const response = NextResponse.json(result.data || { error: result.error }, { 
      status: result.success ? 200 : 500 
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error: any) {
    log(`Exception: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
