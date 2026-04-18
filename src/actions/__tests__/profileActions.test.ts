import { describe, it, expect, vi, beforeEach } from 'vitest';
import { upgradePlanAction, getSyncHistoryAction, logSyncEventAction, getSecurityReportAction } from '../profileActions';
import User from '../../models/User';
import SyncLog from '../../models/SyncLog';
import dbConnect from '../../lib/mongodb';
import { getUserIdFromToken } from '../../lib/authHelper';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('server-only', () => ({}));
vi.mock('../../models/User');
vi.mock('../../models/SyncLog');
vi.mock('../../lib/mongodb');
vi.mock('../../lib/authHelper');
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('profileActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('upgradePlanAction', () => {
    it('should upgrade plan and log event successfully', async () => {
      vi.mocked(dbConnect).mockResolvedValue({} as any);
      vi.mocked(getUserIdFromToken).mockResolvedValue('user-123');
      vi.mocked(User.findByIdAndUpdate).mockResolvedValue({} as any);
      vi.mocked(SyncLog.create).mockResolvedValue({} as any);

      const result = await upgradePlanAction('Pro');

      expect(result).toEqual({ success: true, plan: 'Pro' });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user-123', { plan: 'Pro' });
      expect(SyncLog.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/profile');
    });

    it('should return error if database connection fails', async () => {
      vi.mocked(dbConnect).mockRejectedValue(new Error('DB Error'));
      
      const result = await upgradePlanAction('Pro');
      expect(result).toEqual({ success: false, error: "Failed to upgrade plan" });
    });
  });

  describe('getSyncHistoryAction', () => {
    it('should return sync logs for user', async () => {
      vi.mocked(dbConnect).mockResolvedValue({} as any);
      vi.mocked(getUserIdFromToken).mockResolvedValue('user-123');
      const mockLogs = [{ _id: 'log-1', status: 'Success' }];
      vi.mocked(SyncLog.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockLogs)
      } as any);

      const result = await getSyncHistoryAction();

      expect(result).toEqual(mockLogs);
      expect(SyncLog.find).toHaveBeenCalledWith({ userId: 'user-123' });
    });

    it('should return empty array on failure', async () => {
      vi.mocked(dbConnect).mockRejectedValue(new Error('DB Error'));
      const result = await getSyncHistoryAction();
      expect(result).toEqual([]);
    });
  });

  describe('logSyncEventAction', () => {
    it('should log sync event successfully', async () => {
      vi.mocked(dbConnect).mockResolvedValue({} as any);
      vi.mocked(getUserIdFromToken).mockResolvedValue('user-123');
      vi.mocked(SyncLog.create).mockResolvedValue({} as any);

      const data = { deviceId: 'dev-1', status: 'Success' as const, type: 'Cloud' as const, details: 'Test' };
      const result = await logSyncEventAction(data);

      expect(result).toEqual({ success: true });
      expect(SyncLog.create).toHaveBeenCalledWith({ userId: 'user-123', ...data });
    });
  });

  describe('getSecurityReportAction', () => {
    it('should return user security data', async () => {
      vi.mocked(dbConnect).mockResolvedValue({} as any);
      vi.mocked(getUserIdFromToken).mockResolvedValue('user-123');
      const mockUser = { _id: 'user-123', plan: 'Pro', lastLogins: [] };
      vi.mocked(User.findById).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockUser)
      } as any);

      const result = await getSecurityReportAction();

      expect(result).toEqual(mockUser);
    });
  });
});
