import mongoose from 'mongoose';
import Skill from './src/models/Skill';
import dbConnect from './src/lib/mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const skillsToSeed = [
  { name: 'TypeScript', category: 'Development', color: '#3178c6' },
  { name: 'React Native', category: 'Development', color: '#61dafb' },
  { name: 'Next.js', category: 'Development', color: '#000000' },
  { name: 'MongoDB', category: 'Database', color: '#47a248' },
  { name: 'AI Engineering', category: 'AI', color: '#6366f1' },
  { name: 'RTL UI Design', category: 'Design', color: '#ec4899' },
  { name: 'Cyber Security', category: 'Security', color: '#ef4444' },
];

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to DB for seeding...');
    
    // Delete existing to avoid duplicates
    await Skill.deleteMany({});
    
    await Skill.insertMany(skillsToSeed);
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
