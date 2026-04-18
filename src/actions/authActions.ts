'use server';
import 'server-only';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import AuthSession from '@/models/AuthSession';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

/**
 * Registers a new user.
 */
export async function registerUser(formData: z.infer<typeof AuthSchema>) {
  try {
    await dbConnect();
    
    const { email, password, name } = AuthSchema.parse(formData);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Save token as an HttpOnly cookie for Web sessions
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return {
      success: true,
      token,
      user: {
        id: (user._id as string).toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { error: err.message || 'Failed to register' };
  }
}

/**
 * Logs in an existing user.
 */
export async function loginUser(formData: z.infer<typeof AuthSchema>) {
  try {
    await dbConnect();
    
    const { email, password } = AuthSchema.parse(formData);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password' };
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid email or password' };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Save token as an HttpOnly cookie for Web sessions
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return {
      success: true,
      token,
      user: {
        id: (user._id as string).toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  } catch (err: any) {
    console.error('Login error:', err);
    return { error: err.message || 'Failed to login' };
  }
}

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Logs in or Registers a user via Google OAuth token.
 */
export async function loginWithGoogleAction(idToken: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID as string,
        process.env.GOOGLE_CLIENT_ID_ANDROID as string,
      ],
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google Token');
    }

    const { email, name, picture, sub: _googleId } = payload;

    await dbConnect();
    
    // Find or Create user
    let user = await User.findOne({ email });
    if (!user) {
      // For Google users, we set a dummy long password since they login via Auth provider
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: dummyPassword,
        avatar: picture,
      });
    } else if (picture && user.avatar !== picture) {
      // Update avatar if provided and not explicitly set or different
      user.avatar = picture;
      await user.save();
    }

    // Generate our local JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Save token as an HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return {
      success: true,
      token,
      user: {
        id: (user._id as string).toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  } catch (error: any) {
    console.error('Google login error:', error);
    return { error: 'Failed to login with Google' };
  }
}

/**
 * Logs out the current user by clearing the token cookie.
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return { success: true };
}

/**
 * Initiates a pairing request (called by Web).
 * Generates a 6-digit code and returns it.
 */
export async function initiatePairing() {
  try {
    await dbConnect();
    
    // Generate a unique 6-digit code
    let code = '';
    let isUnique = false;
    
    while (!isUnique) {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await AuthSession.findOne({ code });
      if (!existing) isUnique = true;
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const session = await AuthSession.create({
      code,
      status: 'pending',
      expiresAt,
    });

    return { 
      success: true, 
      code: session.code,
      expiresAt: session.expiresAt 
    };
  } catch (error: any) {
    console.error('Initiate pairing error:', error);
    return { error: 'Failed to initiate pairing' };
  }
}

/**
 * Checks the status of a pairing request (called by Web - Polling).
 */
export async function checkPairingStatus(code: string) {
  try {
    await dbConnect();
    
    const session = await AuthSession.findOne({ code });
    if (!session) {
      return { status: 'expired' };
    }

    if (session.status === 'authorized' && session.token) {
      // Consume the session
      session.status = 'consumed';
      await session.save();

      // Set the token cookie on the web side
      const cookieStore = await cookies();
      cookieStore.set('token', session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      return { status: 'authorized', token: session.token };
    }

    return { status: session.status };
  } catch (error: any) {
    console.error('Check pairing status error:', error);
    return { error: 'Failed to check status' };
  }
}

/**
 * Authorizes a pairing request (called by Mobile).
 */
export async function authorizePairingCode(code: string, userId: string, token: string) {
  try {
    await dbConnect();
    
    const session = await AuthSession.findOne({ code, status: 'pending' });
    if (!session) {
      return { error: 'Invalid or expired code' };
    }

    // Verify the code hasn't expired (TTL index handles deletion, but let's be safe)
    if (new Date() > session.expiresAt) {
      return { error: 'Code expired' };
    }

    session.status = 'authorized';
    session.userId = new mongoose.Types.ObjectId(userId) as any;
    session.token = token;
    await session.save();

    return { success: true };
  } catch (error: any) {
    console.error('Authorize pairing error:', error);
    return { error: 'Failed to authorize' };
  }
}
