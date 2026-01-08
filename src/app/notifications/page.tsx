'use client';

import { useState } from 'react';
import { Bell, Package, ShoppingBag, TrendingUp, Gift, Settings, Trash2, CheckCircle, Circle } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  type: 'order' | 'promotion' | 'account' | 'reward';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #12345 has been delivered successfully',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 50% off on all eyewear. Limited time offer!',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'reward',
      title: 'Enak Coins Earned',
      message: 'You earned 150 Enak Coins from your recent purchase',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #12344 is on the way',
      time: '2 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'account',
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully',
      time: '3 days ago',
      read: true,
    },
    {
      id: 6,
      type: 'promotion',
      title: 'New Arrivals',
      message: 'Check out the latest collection of premium sunglasses',
      time: '4 days ago',
      read: true,
    },
    {
      id: 7,
      type: 'reward',
      title: 'Referral Bonus',
      message: 'You earned 500 Enak Coins for referring a friend',
      time: '5 days ago',
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return Package;
      case 'promotion':
        return ShoppingBag;
      case 'reward':
        return Gift;
      case 'account':
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-600/20 text-blue-500';
      case 'promotion':
        return 'bg-red-600/20 text-red-500';
      case 'reward':
        return 'bg-yellow-600/20 text-yellow-500';
      case 'account':
        return 'bg-green-600/20 text-green-500';
      default:
        return 'bg-gray-600/20 text-gray-500';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-red-500 hover:text-red-400 mb-4 inline-block">
            ← Back
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Bell className="w-10 h-10 text-red-500" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-gray-400">Stay updated with your orders and offers</p>
            </div>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-zinc-900 border border-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'unread'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-500 rounded-lg hover:bg-green-600/30 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Clear all</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-zinc-900 border border-gray-800 rounded-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-400">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' ? "You're all caught up!" : 'Check back later for updates'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`bg-zinc-900 border rounded-lg p-4 transition-all hover:border-red-600 ${
                    notification.read ? 'border-gray-800' : 'border-red-600/50 bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold flex items-center gap-2">
                          {notification.title}
                          {!notification.read && (
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{notification.message}</p>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs text-green-500 hover:text-green-400 transition-all"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Settings className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Notification Preferences</h3>
              <p className="text-sm text-gray-400 mb-3">
                Customize which notifications you want to receive. Manage your email and push notification settings.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
