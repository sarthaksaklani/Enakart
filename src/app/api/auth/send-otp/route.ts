// src/app/api/auth/send-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/utils/otpStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Email or mobile number is required' },
        { status: 400 }
      );
    }

    // In production, check if user exists in database
    // For now, we'll just generate and send OTP

    // Generate OTP
    const otp = otpStore.generateOTP();
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes for development

    // Store OTP
    otpStore.setLoginOTP(identifier, otp, expiresAt);

    // In production, integrate with SMS/Email service
    console.log(`\n🔐 LOGIN OTP for ${identifier}: ${otp}`);
    console.log(`📱 Valid for 30 minutes\n`);

    // For development, we'll just log the OTP
    // In production, send SMS/Email here
    // await sendOTP(identifier, `Your एnakart login OTP is: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Only for development - remove in production
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
