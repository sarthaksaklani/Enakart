// src/app/api/auth/verify-otp/route.ts

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
    const { mobile, otp, userData } = body;

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    console.log(`\n🔍 Verifying OTP for mobile: ${mobile}`);
    const storedData = otpStore.getRegistrationOTP(mobile);

    if (!storedData) {
      console.log(`❌ No OTP found in store for: ${mobile}`);
      return NextResponse.json(
        { success: false, error: 'OTP expired or invalid. Please request a new OTP.' },
        { status: 400 }
      );
    }

    console.log(`✅ OTP found in store`);
    console.log(`📅 Expires at: ${new Date(storedData.expiresAt).toISOString()}`);
    console.log(`⏰ Current time: ${new Date().toISOString()}`);

    if (storedData.expiresAt < Date.now()) {
      console.log(`❌ OTP expired`);
      otpStore.deleteRegistrationOTP(mobile);
      return NextResponse.json(
        { success: false, error: 'OTP expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    console.log(`🔢 Stored OTP: ${storedData.otp}, Provided OTP: ${otp}`);

    if (storedData.otp !== otp) {
      console.log(`❌ OTP mismatch`);
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    console.log(`✅ OTP verified successfully!\n`);

    // OTP verified successfully, create user in database
    const fullName = `${userData.first_name} ${userData.last_name}`.trim();

    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', userData.mobile)
      .single();

    // Check for network errors during user lookup
    if (lookupError && lookupError.code !== 'PGRST116') {
      // PGRST116 = not found (expected), other errors are problems
      const errorMessage = lookupError.message?.toLowerCase() || '';
      const errorDetails = lookupError.details?.toLowerCase() || '';

      if (
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('eai_again') ||
        errorDetails.includes('eai_again') ||
        errorDetails.includes('getaddrinfo') ||
        errorMessage.includes('network')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Network connection error. Please check your internet connection and try again.'
          },
          { status: 503 }
        );
      }
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this phone number' },
        { status: 400 }
      );
    }

    // Create user in database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: userData.email,
          phone: userData.mobile,
          full_name: fullName,
          role: userData.role || 'customer',
          // Seller-specific fields
          business_name: userData.business_name || null,
          gst_number: userData.gst_number || null,
          business_address: userData.business_address || null,
          business_license: userData.business_license || null,
          // Reseller-specific fields
          company_name: userData.company_name || null,
          reseller_type: userData.reseller_type || null,
          tax_id: userData.tax_id || null,
          is_verified: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
      });

      // Check for network-related errors
      const errorMessage = insertError.message?.toLowerCase() || '';
      const errorDetails = insertError.details?.toLowerCase() || '';

      if (
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('eai_again') ||
        errorDetails.includes('eai_again') ||
        errorDetails.includes('getaddrinfo') ||
        errorMessage.includes('network')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Network connection error. Please check your internet connection and try again.'
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create user. Please try again.' },
        { status: 500 }
      );
    }

    // Clean up OTP
    otpStore.deleteRegistrationOTP(mobile);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: newUser,
    });
  } catch (error) {
    console.error('OTP verification error:', error);

    return NextResponse.json(
      { success: false, error: 'OTP verification failed' },
      { status: 500 }
    );
  }
}
