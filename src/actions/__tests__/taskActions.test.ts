import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleSubtaskAction } from '../taskActions';
import Task from '@/models/Task';
import dbConnect from '@/lib/mongodb';
import { getUserIdFromToken } from '@/lib/authHelper';

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}));

vi.mock('@/lib/authHelper', () => ({
  getUserIdFromToken: vi.fn(() => 'test-user-id'),
}));

vi.mock('@/models/Task', () => ({
  default: {
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('taskActions - Status Sync QA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mark main task as "Done" when all subtasks are finished', async () => {
    const mockTask = {
      _id: 'task-1',
      userId: 'test-user-id',
      status: 'InProgress',
      subTasks: [
        { _id: 'st-1', title: 'Sub 1', status: 'Done' },
        { _id: 'st-2', title: 'Sub 2', status: 'Todo' },
      ],
      save: vi.fn(),
    };

    (Task.findOne as any).mockResolvedValue(mockTask);

    // Toggle st-2 to Done
    const result = await toggleSubtaskAction('task-1', 'st-2');

    expect(mockTask.subTasks[1].status).toBe('Done');
    expect(mockTask.status).toBe('Done');
    expect(mockTask.save).toHaveBeenCalled();
  });

  it('should revert main task to "InProgress" if a "Done" task has a subtask unchecked', async () => {
    const mockTask = {
      _id: 'task-1',
      userId: 'test-user-id',
      status: 'Done',
      subTasks: [
        { _id: 'st-1', title: 'Sub 1', status: 'Done' },
        { _id: 'st-2', title: 'Sub 2', status: 'Done' },
      ],
      save: vi.fn(),
    };

    (Task.findOne as any).mockResolvedValue(mockTask);

    // Toggle st-2 to Todo
    await toggleSubtaskAction('task-1', 'st-2');

    expect(mockTask.subTasks[1].status).toBe('Todo');
    expect(mockTask.status).toBe('InProgress');
  });

  it('should move "Todo" task to "InProgress" when first subtask is checked', async () => {
    const mockTask = {
      _id: 'task-1',
      userId: 'test-user-id',
      status: 'Todo',
      subTasks: [
        { _id: 'st-1', title: 'Sub 1', status: 'Todo' },
        { _id: 'st-2', title: 'Sub 2', status: 'Todo' },
      ],
      save: vi.fn(),
    };

    (Task.findOne as any).mockResolvedValue(mockTask);

    await toggleSubtaskAction('task-1', 'st-1');

    expect(mockTask.status).toBe('InProgress');
  });
});
