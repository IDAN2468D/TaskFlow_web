import { NextRequest, NextResponse } from 'next/server';
import { updateTaskStatusAction, deleteTaskAction } from '@/actions/taskActions';

/**
 * Mobile Bridge: Update/Delete Task
 */
import { getUserIdFromToken } from '@/lib/authHelper';
import Task from '@/models/Task';
import dbConnect from '@/lib/mongodb';
import { serializeTask } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

/**
 * Mobile Bridge: Update/Delete Task
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    const body = await req.json();
    
    // Handle both direct status and nested updates object
    const taskId = body.taskId;
    const updates = body.updates || { status: body.status };

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId },
      updates,
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json(serializeTask(task));
  } catch (error: any) {
    console.error("[Bridge Update] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { taskId } = await req.json();
    await deleteTaskAction(taskId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
