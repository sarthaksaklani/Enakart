// src/app/api/auth/verify-login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/utils/otpStore';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, otp } = body;

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, error: 'Identifier and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const storedData = otpStore.getLoginOTP(identifier);

    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'OTP expired or invalid' },
        { status: 400 }
      );
    }

    if (storedData.expiresAt < Date.now()) {
      otpStore.deleteLoginOTP(identifier);
      return NextResponse.json(
        { success: false, error: 'OTP expired' },
        { status: 400 }
      );
    }

    if (storedData.otp !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP verified, find user in database
    const isEmail = identifier.includes('@');
    const query = isEmail
      ? supabase.from('users').select('*').eq('email', identifier)
      : supabase.from('users').select('*').eq('phone', identifier);

    const { data: user, error: fetchError } = await query.single();

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found. Please register first.' },
        { status: 404 }
      );
    }

    // Clean up OTP
    otpStore.deleteLoginOTP(identifier);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Login verification error:', error);

    return NextResponse.json(
      { success: false, error: 'Login verification failed' },
      { status: 500 }
    );
  }
}
