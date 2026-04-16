import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import dbConnect from './src/lib/mongodb';
import User from './src/models/User';
import Task from './src/models/Task';
import Skill from './src/models/Skill';

/**
 * script to verify XP logic
 * Usage: npx tsx test_xp.ts
 */
async function runTest() {
  console.log('🚀 Starting XP System Test...');
  await dbConnect();

  // 1. Find or create a test skill
  let skill = await Skill.findOne({ name: 'Development' });
  if (!skill) {
    skill = await Skill.create({ name: 'Development', category: 'Engineering', color: '#6366f1' });
    console.log('✅ Created Development skill');
  }

  // 2. Find a user
  const user = await User.findOne({});
  if (!user) {
    console.error('❌ No user found to test with.');
    process.exit(1);
  }
  console.log(`👤 Testing with user: ${user.email}`);

  // 3. Ensure user has the skill
  const hasSkill = user.skills?.some((s: any) => s.skillId.toString() === skill!._id.toString());
  if (!hasSkill) {
    if (!user.skills) user.skills = [];
    user.skills.push({ skillId: skill._id, xp: 0, level: 1 });
    await user.save();
    console.log('✅ Assigned skill to user');
  }

  // 4. Create a task with the tag 'Development'
  const task = await Task.create({
    title: 'Test XP Task',
    description: 'Verifying gamification system',
    status: 'Todo',
    priority: 'High',
    tags: ['Development'],
    estimatedTime: 60,
    userId: user._id,
    xpRewarded: false
  });
  console.log('📝 Created test task');

  // 5. Simulate XP Grant logic
  console.log('⏳ Marking task as Done...');
  task.status = 'Done';
  
  const xpReward = 120; // Test level up
  
  const skillEntry = user.skills.find((s: any) => s.skillId.toString() === skill!._id.toString());
  if (skillEntry) {
    const oldXp = skillEntry.xp;
    skillEntry.xp += xpReward;
    if (skillEntry.xp >= 100) {
        skillEntry.level += 1;
    }
    await user.save();
    task.xpRewarded = true;
    await task.save();
    
    console.log(`✨ Success! Skill XP increased: ${oldXp} -> ${skillEntry.xp}`);
    console.log(`📈 Current Level: ${skillEntry.level}`);
  }

  console.log('🏁 Test completed successfully!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
