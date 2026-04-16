import { NextRequest, NextResponse } from 'next/server';
import { toggleSubtaskAction } from '@/actions/taskActions';

/**
 * Mobile Bridge: Toggle Subtask
 */
export async function POST(req: NextRequest) {
  try {
    const { taskId, subtaskId } = await req.json();
    const updatedTask = await toggleSubtaskAction(taskId, subtaskId);
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
