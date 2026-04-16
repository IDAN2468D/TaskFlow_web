import { NextRequest, NextResponse } from 'next/server';
import { generateTaskInsights } from '@/actions/aiActions';

/**
 * Mobile Bridge: Generate Task Insights
 */
export async function POST(req: NextRequest) {
  try {
    const { taskId } = await req.json();
    const updatedTask = await generateTaskInsights(taskId);
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
