import { z } from 'zod';

/**
 * Zod Schema for task creation, optimized for AI Agent parameter parsing.
 */
export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  assigneeName: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
