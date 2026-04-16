import { describe, it, expect } from 'vitest';
import { serializeTask, formatDuration } from '../utils';

describe('Utility Functions', () => {
  describe('formatDuration', () => {
    it('formats minutes into a readable string', () => {
      expect(formatDuration(30)).toBe('30m');
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(120)).toBe('2h');
    });

    it('handles null or zero', () => {
      expect(formatDuration(0)).toBe('0m');
      expect(formatDuration(undefined as any)).toBe('0m');
    });
  });

  describe('serializeTask', () => {
    it('converts MongoDB _id to string', () => {
      const mockTask = {
        _id: { toString: () => 'task_123' },
        title: 'Test Task',
        status: 'Todo',
        subTasks: [
          { _id: { toString: () => 'sub_1' }, title: 'Sub 1' }
        ]
      };

      const result = serializeTask(mockTask);
      expect(result._id).toBe('task_123');
      expect(result.subTasks[0]._id).toBe('sub_1');
    });
  });
});
