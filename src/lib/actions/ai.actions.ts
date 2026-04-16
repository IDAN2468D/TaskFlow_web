'use server';

import Task from '../../models/Task';
import User from '../../models/User';
import Skill from '../../models/Skill';
import { logActivity } from './activity.actions';
import mongoose from 'mongoose';

/**
 * autoAssignTask
 * Intelligent matching between a task's description and the user's skill set.
 */
export async function autoAssignTask(taskId: string) {
  try {
    const task = await Task.findById(taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const user = await User.findById(task.userId);
    if (!user) return { success: false, error: 'User not found' };

    // 1. Combine title and description for matching
    const contextText = `${task.title} ${task.description || ''}`.toLowerCase();

    // 2. Fetch all system skills to compare keywords
    const allSkills = await Skill.find({});
    
    let bestMatch: any = null;
    let highestWeight = 0;

    for (const skill of allSkills) {
      const skillName = skill.name.toLowerCase();
      // Simple heuristic: check if skill name exists in task context
      if (contextText.includes(skillName)) {
        // Basic weighting: longer names might be more specific
        const weight = skillName.length;
        if (weight > highestWeight) {
          highestWeight = weight;
          bestMatch = skill;
        }
      }
    }

    if (bestMatch) {
      // 3. Update task with the matched skill
      task.assignedSkillId = bestMatch._id as mongoose.Types.ObjectId;
      task.aiPriorityScore = 85; // Initial confidence score
      await task.save();

      // 4. Log the AI intervention
      await logActivity({
        userId: user._id.toString(),
        action: 'AI_ASSIGNED',
        targetId: task._id.toString(),
        details: `Auto-assigned skill: ${bestMatch.name}`,
        metadata: { skillName: bestMatch.name }
      });

      return { success: true, skillName: bestMatch.name };
    }

    return { success: false, error: 'No matching skill found in database' };
  } catch (error: any) {
    console.error('Auto-assignment failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * parseVoiceToTask (Placeholder for Phase 2)
 * Will be fully implemented in the next phase.
 */
export async function parseVoiceToTask(audioData: string) {
  // Simulated processing for Phase 2 verification
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!audioData) return { success: false, error: 'No audio data received' };
  
  return { 
    success: true, 
    task: { 
      title: 'Voice Task', 
      description: 'Automatically captured via AI Suite&rlm;' 
    } 
  };
}
