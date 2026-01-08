// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validations/auth';
import { otpStore } from '@/lib/utils/otpStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the registration data
    const validatedData = registrationSchema.parse(body);

    // Check if user already exists (you'll implement this with Supabase later)
    // For now, we'll just generate and send OTP

    // Generate OTP
    const otp = otpStore.generateOTP();
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes for development

    // Store OTP
    otpStore.setRegistrationOTP(validatedData.mobile, otp, expiresAt, validatedData);

    // In production, integrate with SMS service like Twilio, MSG91, etc.
    console.log(`\n🔐 REGISTRATION OTP for ${validatedData.mobile}: ${otp}`);
    console.log(`📱 Valid for 30 minutes\n`);

    // For development, we'll just log the OTP
    // In production, send SMS here
    // await sendSMS(validatedData.mobile, `Your एnakart OTP is: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Only for development - remove in production
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
