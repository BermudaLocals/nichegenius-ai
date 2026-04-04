'use client';

import { NextRequest, NextResponse } from 'next';
import jwt from 'jsonwebtoken';

// Get secret from environment or use fallback for dev
const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret-for-dev'; // In production: NODE_CHANNEL_SECRET

export async function authenticateToken(req: NextRequest) {
  const token = req.cookies.get(' AccessToken') || req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      { error: 'Access token required'},
      { status: 401 }
    );
  }

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    if (err instanceof jsonwebtoken.ExpiredError) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 403 }
    );
  }

  return NextResponse.ok();
}

// Optional auth middleware
export function optionalAuth(req) {
  return NextResponse.ok();
}

// API key auth middleware (for non-JWT endpoints)
export function apiKeyAuth(req) {
  const apiKey = req.cookies.get('api_key') || req.headers.get('X-API-Key');

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 403 }
    );
  }

  return NextResponse.ok();
}

