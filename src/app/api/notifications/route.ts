// src/app/api/notifications/route.ts
// User notifications APIs

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread_only') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`\n🔔 Fetching notifications for user: ${userId}`);

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('is_read', false);
      console.log('📬 Unread only');
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('❌ Notifications fetch error:', error);

      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    console.log(`✅ Found ${notifications?.length || 0} notifications (${unreadCount} unread)\n`);

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      count: notifications?.length || 0,
      unreadCount,
    });
  } catch (error: any) {
    console.error('❌ Notifications GET error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create a notification (admin/system use)
export async function POST(request: NextRequest) {
  try {
    const {
      user_id,
      title,
      message,
      type,
      link_url,
      metadata
    } = await request.json();

    if (!user_id || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'user_id, title, and message are required' },
        { status: 400 }
      );
    }

    console.log(`\n🔔 Creating notification for user: ${user_id}`);

    const { data: notification, error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type: type || 'info',
        link_url: link_url || null,
        metadata: metadata || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Notification creation error:', insertError);

      const errorMessage = insertError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    console.log(`✅ Notification created: ${title}\n`);

    return NextResponse.json({
      success: true,
      message: 'Notification created',
      notification,
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Notification POST error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { notification_id, mark_all_read } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`\n✅ Marking notifications as read...`);

    if (mark_all_read) {
      // Mark all notifications as read
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (updateError) {
        console.error('❌ Mark all read error:', updateError);

        const errorMessage = updateError.message?.toLowerCase() || '';
        if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
          return NextResponse.json(
            { success: false, error: 'Network error. Please check your internet connection.' },
            { status: 503 }
          );
        }

        return NextResponse.json(
          { success: false, error: 'Failed to mark notifications as read' },
          { status: 500 }
        );
      }

      console.log('✅ All notifications marked as read\n');

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    if (!notification_id) {
      return NextResponse.json(
        { success: false, error: 'notification_id is required when mark_all_read is false' },
        { status: 400 }
      );
    }

    // Mark single notification as read
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notification_id)
      .eq('user_id', userId);

    if (updateError) {
      console.error('❌ Mark read error:', updateError);

      const errorMessage = updateError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to mark notification as read' },
        { status: 500 }
      );
    }

    console.log('✅ Notification marked as read\n');

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    console.error('❌ Notification PATCH error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
