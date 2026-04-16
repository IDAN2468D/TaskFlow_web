import { NextRequest, NextResponse } from 'next/server';
import { getAIUsageCountAction } from '@/actions/aiAnalyticsActions';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getUserIdFromToken } from '@/lib/authHelper';

/**
 * Mobile Bridge: Get AI and Task statistics
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    
    const activeTasksCount = await Task.countDocuments({ userId, status: { $ne: "Done" } });
    const completedTasksCount = await Task.countDocuments({ userId, status: "Done" });
    const aiUsageCount = await getAIUsageCountAction();

    // Fetch user details
    const User = (await import('@/models/User')).default;
    const user = await User.findById(userId).select('name email avatar');

    return NextResponse.json({
      user: {
        name: user?.name || 'User',
        email: user?.email || '',
        avatar: user?.avatar || null,
      },
      activeTasks: activeTasksCount,
      completedTasks: completedTasksCount,
      aiActions: aiUsageCount
    });
  } catch (error: any) {
    console.error("[Stats Bridge API Error]:", error.message);
    const isAuthError = error.message?.includes('Unauthorized');
    return NextResponse.json(
      { error: error.message }, 
      { status: isAuthError ? 401 : 500 }
    );
  }
}
