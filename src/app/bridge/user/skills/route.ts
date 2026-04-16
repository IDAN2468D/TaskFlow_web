import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Skill from '@/models/Skill';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

/**
 * Mobile Bridge for Skills Management
 * Path: /bridge/user/skills
 */

async function getUserIdFromRequest(req: Request) {
  let token = '';
  const authHeader = req.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value || '';
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch all available skills and user skills in parallel
    const [allSkills, user] = await Promise.all([
      Skill.find({}).sort({ name: 1 }),
      User.findById(userId).populate('skills.skillId')
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const mappedUserSkills = user.skills?.map((s: any) => {
      if (!s.skillId) return null;
      return {
        ...(s.skillId._doc || s.skillId),
        xp: s.xp,
        level: s.level,
        assignedAt: s.assignedAt
      };
    }).filter(Boolean) || [];

    return NextResponse.json({
      success: true,
      allSkills,
      userSkills: mappedUserSkills
    });
  } catch (error: any) {
    console.error('[Bridge Skills GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillId, action } = await req.json();
    
    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId).populate('skills.skillId');
    if (action === 'remove') {
      user.skills = user.skills.filter((s: any) => s.skillId._id.toString() !== skillId);
    } else {
      const exists = user.skills.some((s: any) => s.skillId._id.toString() === skillId);
      if (!exists) {
        user.skills.push({ skillId, xp: 0, level: 1 });
      }
    }
    await user.save();
    
    // Refresh to get populated data
    const updatedUser = await User.findById(userId).populate('skills.skillId');
    const mappedUserSkills = updatedUser.skills?.map((s: any) => {
      if (!s.skillId) return null;
      return {
        ...(s.skillId._doc || s.skillId),
        xp: s.xp,
        level: s.level
      };
    }).filter(Boolean) || [];

    return NextResponse.json({
      success: true,
      userSkills: mappedUserSkills
    });
  } catch (error: any) {
    console.error('[Bridge Skills POST] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
