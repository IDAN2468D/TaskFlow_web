import { describe, it, expect, vi, beforeEach } from 'vitest';
import { autoAssignTask } from '../lib/actions/ai.actions';
import Task from '../models/Task';
import User from '../models/User';
import Skill from '../models/Skill';
import ActivityLog from '../models/ActivityLog';

// Mock the models
vi.mock('../models/Task');
vi.mock('../models/User');
vi.mock('../models/Skill');
vi.mock('../models/ActivityLog');
vi.mock('../lib/actions/activity.actions', () => ({
  logActivity: vi.fn().mockResolvedValue({ success: true })
}));

describe('autoAssignTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly match a task description with a skill name', async () => {
    const mockTaskId = 'task123';
    const mockTask = {
      _id: mockTaskId,
      title: 'Fix React Bug',
      description: 'The frontend is broken',
      userId: 'user456',
      save: vi.fn().mockResolvedValue(true)
    };

    const mockUser = { _id: 'user456' };
    const mockSkills = [
      { _id: 'skill1', name: 'React' },
      { _id: 'skill2', name: 'Python' }
    ];

    (Task.findById as any).mockResolvedValue(mockTask);
    (User.findById as any).mockResolvedValue(mockUser);
    (Skill.find as any).mockResolvedValue(mockSkills);

    const result = await autoAssignTask(mockTaskId);

    expect(result.success).toBe(true);
    expect(result.skillName).toBe('React');
    expect(mockTask.save).toHaveBeenCalled();
  });

  it('should return error if no match is found', async () => {
    (Task.findById as any).mockResolvedValue({
      title: 'Cook dinner',
      userId: 'user456'
    });
    (User.findById as any).mockResolvedValue({ _id: 'user456' });
    (Skill.find as any).mockResolvedValue([{ name: 'React' }]);

    const result = await autoAssignTask('unknown');

    expect(result.success).toBe(false);
    expect(result.error).toBe('No matching skill found in database');
  });
});
