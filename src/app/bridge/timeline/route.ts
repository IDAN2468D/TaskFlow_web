import { NextResponse } from 'next/server';
import { getRecentActivities } from '@/lib/actions/activity.actions';

/**
 * GET /bridge/timeline
 * Serves the activity timeline data to the mobile app.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const result = await getRecentActivities(limit);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
