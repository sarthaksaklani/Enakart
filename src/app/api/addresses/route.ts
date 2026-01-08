// src/app/api/addresses/route.ts
// User saved addresses management

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Get user's saved addresses
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`\n📍 Fetching addresses for user: ${userId}`);

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Addresses fetch error:', error);

      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch addresses' },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${addresses?.length || 0} addresses\n`);

    return NextResponse.json({
      success: true,
      addresses: addresses || [],
      count: addresses?.length || 0,
    });
  } catch (error: any) {
    console.error('❌ Addresses GET error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const {
      address_type,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`\n📍 Creating new address for user: ${userId}`);

    // Validate required fields
    if (!full_name || !phone || !address_line1 || !city || !state || !postal_code) {
      return NextResponse.json(
        { success: false, error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    // Create address
    const { data: address, error: insertError } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        address_type: address_type || 'home',
        full_name,
        phone,
        address_line1,
        address_line2: address_line2 || null,
        city,
        state,
        postal_code,
        country: country || 'India',
        is_default: is_default || false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Address creation error:', insertError);

      const errorMessage = insertError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create address' },
        { status: 500 }
      );
    }

    console.log(`✅ Address created (${address_type})\n`);

    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      address,
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Address POST error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create address' },
      { status: 500 }
    );
  }
}

// PUT - Update an address
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const {
      address_id,
      address_type,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!address_id) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      );
    }

    console.log(`\n📍 Updating address: ${address_id}`);

    // If this is set as default, unset other defaults
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    // Update address
    const updateData: any = {};
    if (address_type) updateData.address_type = address_type;
    if (full_name) updateData.full_name = full_name;
    if (phone) updateData.phone = phone;
    if (address_line1) updateData.address_line1 = address_line1;
    if (address_line2 !== undefined) updateData.address_line2 = address_line2;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (postal_code) updateData.postal_code = postal_code;
    if (country) updateData.country = country;
    if (is_default !== undefined) updateData.is_default = is_default;

    const { data: address, error: updateError } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', address_id)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Address update error:', updateError);

      const errorMessage = updateError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to update address' },
        { status: 500 }
      );
    }

    console.log('✅ Address updated\n');

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  } catch (error: any) {
    console.error('❌ Address PUT error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an address
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { address_id } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!address_id) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      );
    }

    console.log(`\n🗑️ Deleting address: ${address_id}`);

    const { error: deleteError } = await supabase
      .from('addresses')
      .delete()
      .eq('id', address_id)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('❌ Address delete error:', deleteError);

      const errorMessage = deleteError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to delete address' },
        { status: 500 }
      );
    }

    console.log('✅ Address deleted\n');

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Address DELETE error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
