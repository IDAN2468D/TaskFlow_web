'use server';

import ActivityLog from '../../models/ActivityLog';
import dbConnect from '../mongodb'; // Assuming dbConnect exists based on common project structure

/**
 * logActivity
 * Records a system or user event in the database.
 */
export async function logActivity({
  userId,
  action,
  targetId,
  details,
  metadata
}: {
  userId: string;
  action: string;
  targetId?: string;
  details?: string;
  metadata?: any;
}) {
  try {
    await dbConnect();
    const log = await ActivityLog.create({
      userId,
      action,
      targetId,
      details,
      metadata
    });
    return { success: true, logId: log._id };
  } catch (error: any) {
    console.error('Failed to log activity:', error);
    return { success: false, error: error.message };
  }
}

/**
 * getRecentActivities
 * Fetches the most recent logs for the timeline view.
 */
export async function getRecentActivities(limit = 20) {
  try {
    await dbConnect();
    const logs = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'name avatar');
    
    return { success: true, data: JSON.parse(JSON.stringify(logs)) };
  } catch (error: any) {
    console.error('Failed to fetch activity logs:', error);
    return { success: false, error: error.message };
  }
}
