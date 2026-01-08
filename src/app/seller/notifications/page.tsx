'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell, Package, AlertCircle, CheckCircle, TrendingUp, DollarSign, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'payment' | 'alert' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function SellerNotificationsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
    } else {
      // Mock notifications - Replace with API call
      setNotifications([
        {
          id: '1',
          type: 'order',
          title: 'New Order Received',
          message: 'You have received a new order #ORD-2024-1234 worth ₹2,500',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
          read: false,
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of ₹5,000 has been credited to your account',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false,
        },
        {
          id: '3',
          type: 'alert',
          title: 'Low Stock Alert',
          message: 'Product "Aviator Sunglasses" is running low on stock (5 items remaining)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: false,
        },
        {
          id: '4',
          type: 'success',
          title: 'Order Delivered',
          message: 'Order #ORD-2024-1230 has been successfully delivered',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
        },
        {
          id: '5',
          type: 'info',
          title: 'Sales Milestone',
          message: 'Congratulations! You have completed 100 orders this month',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          read: true,
        },
      ]);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'info':
        return <TrendingUp className="h-6 w-6 text-purple-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Bell className="h-10 w-10 text-red-500" />
              Notifications
            </h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? (
                <span>You have <span className="text-red-500 font-semibold">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}</span>
              ) : (
                <span>All caught up!</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-zinc-900 rounded-lg p-12 text-center">
              <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Notifications</h3>
              <p className="text-gray-400">You're all caught up! No new notifications.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-zinc-900 rounded-lg p-6 border transition-all duration-300 hover:border-gray-700 ${
                  notification.read ? 'border-gray-800' : 'border-red-500/50 bg-red-900/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${
                    notification.read ? 'bg-gray-800' : 'bg-gray-800/50'
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        notification.read ? 'text-white' : 'text-white'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-400 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{getTimeAgo(notification.timestamp)}</span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-red-500 hover:text-red-400 transition-colors font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
