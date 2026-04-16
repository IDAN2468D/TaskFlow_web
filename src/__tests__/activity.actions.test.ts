import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logActivity } from '../lib/actions/activity.actions';
import ActivityLog from '../models/ActivityLog';

// Mock DB connection and model
vi.mock('../lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true)
}));
vi.mock('../models/ActivityLog');

describe('logActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an activity log entry successfully', async () => {
    (ActivityLog.create as any).mockResolvedValue({ _id: 'log123' });

    const result = await logActivity({
      userId: 'user1',
      action: 'TASK_CREATED',
      details: 'Test task created'
    });

    expect(result.success).toBe(true);
    expect(ActivityLog.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user1',
      action: 'TASK_CREATED'
    }));
  });

  it('should handle errors during activity logging', async () => {
    (ActivityLog.create as any).mockRejectedValue(new Error('DB Error'));

    const result = await logActivity({
      userId: 'user1',
      action: 'TASK_CREATED'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB Error');
  });
});
