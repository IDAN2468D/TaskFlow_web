import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleFocusModeAction } from '../userActions';
import User from '../../models/User';
import dbConnect from '../../lib/mongodb';
import { getUserIdFromToken } from '../../lib/authHelper';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('server-only', () => ({}));
vi.mock('../../models/User');
vi.mock('../../lib/mongodb');
vi.mock('../../lib/authHelper');
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('toggleFocusModeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle focus mode successfully', async () => {
    // Setup mocks
    vi.mocked(dbConnect).mockResolvedValue({} as any);
    vi.mocked(getUserIdFromToken).mockResolvedValue('user-123');
    vi.mocked(User.findById).mockResolvedValue({
      _id: 'user-123',
      isFocusModeEnabled: false,
    } as any);
    vi.mocked(User.findByIdAndUpdate).mockResolvedValue({} as any);

    const result = await toggleFocusModeAction();

    expect(result).toEqual({ success: true, isFocusModeEnabled: true });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user-123', { isFocusModeEnabled: true });
    expect(revalidatePath).toHaveBeenCalledWith('/profile/account');
  });

  it('should throw error if unauthorized', async () => {
    vi.mocked(getUserIdFromToken).mockRejectedValue(new Error('Unauthorized'));

    await expect(toggleFocusModeAction()).rejects.toThrow('Unauthorized');
  });

  it('should throw error if user not found', async () => {
    vi.mocked(getUserIdFromToken).mockResolvedValue('user-123');
    vi.mocked(User.findById).mockResolvedValue(null);

    await expect(toggleFocusModeAction()).rejects.toThrow('User not found');
  });
});
