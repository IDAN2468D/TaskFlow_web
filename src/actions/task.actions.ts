'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Task from '@/lib/database/models/task.model';
import { CreateTaskSchema, type CreateTaskInput } from '@/types/task.types';

/**
 * Server Action: createTask
 * 
 * This action is designed to be called by an AI Agent or the UI.
 * It validates input using Zod, connects to MongoDB, and creates a new task.
 * 
 * @param input - The task creation parameters (inferred from CreateTaskSchema)
 * @returns { success: boolean, taskId?: string, error?: string }
 */
export async function createTask(input: CreateTaskInput) {
  try {
    // 1. Validate Input (Strict Type-Safety)
    const validatedData = CreateTaskSchema.parse(input);

    // 2. Database Connection
    await dbConnect();

    // 3. Insert into MongoDB
    // We explicitly set the default status to TODO for clarity
    const newTask = await Task.create({
      ...validatedData,
      status: 'TODO',
    });

    // 4. Update UI Cache
    revalidatePath('/');

    return {
      success: true,
      taskId: newTask._id.toString(),
    };
  } catch (error: any) {
    console.error('Agent Action [createTask] Error:', error);

    // Handle Zod Validation Errors
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: `Invalid parameters: ${error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ')}`,
      };
    }

    // Handle Generic Errors
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while creating the task.',
    };
  }
}
