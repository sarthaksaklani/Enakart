// src/app/settings/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings as SettingsIcon, ArrowLeft, User, Lock, Globe, CreditCard, Palette, ChevronRight, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const { isAuthenticated } = useAuthStore();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <SettingsIcon className="h-20 w-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">
            Please login to access settings
          </p>
          <Link href="/account">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const themeOptions = [
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark theme for your eyes' },
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Light theme for daytime' },
    { value: 'auto' as const, label: 'Auto', icon: Monitor, description: 'Follow system preference' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account preferences</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Account Settings */}
          <div className="bg-zinc-900 rounded-lg border-2 border-zinc-800 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'account' ? null : 'account')}
              className="w-full p-6 hover:bg-zinc-800/50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <User className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Account Settings</h3>
                    <p className="text-gray-400 text-sm">Manage your personal information</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'account' ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {expandedSection === 'account' && (
              <div className="px-6 pb-6 space-y-4 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Edit Profile</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Email Preferences</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Address Book</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Theme Settings */}
          <div className="bg-zinc-900 rounded-lg border-2 border-zinc-800 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'theme' ? null : 'theme')}
              className="w-full p-6 hover:bg-zinc-800/50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <Palette className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Theme</h3>
                    <p className="text-gray-400 text-sm">Choose your preferred theme</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'theme' ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {expandedSection === 'theme' && (
              <div className="px-6 pb-6 space-y-3 border-t border-zinc-800 pt-4">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setSelectedTheme(theme.value)}
                    className={`w-full flex items-center justify-between py-4 px-4 rounded-lg transition-all duration-300 border-2 ${
                      selectedTheme === theme.value
                        ? 'bg-red-600 border-red-600'
                        : 'bg-zinc-800 border-transparent hover:border-red-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <theme.icon className={`h-5 w-5 ${selectedTheme === theme.value ? 'text-white' : 'text-gray-400'}`} />
                      <div className="text-left">
                        <p className={`font-semibold ${selectedTheme === theme.value ? 'text-white' : 'text-white'}`}>
                          {theme.label}
                        </p>
                        <p className={`text-sm ${selectedTheme === theme.value ? 'text-red-100' : 'text-gray-400'}`}>
                          {theme.description}
                        </p>
                      </div>
                    </div>
                    {selectedTheme === theme.value && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Security & Privacy */}
          <div className="bg-zinc-900 rounded-lg border-2 border-zinc-800 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'security' ? null : 'security')}
              className="w-full p-6 hover:bg-zinc-800/50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <Lock className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Security & Privacy</h3>
                    <p className="text-gray-400 text-sm">Change password and privacy settings</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'security' ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {expandedSection === 'security' && (
              <div className="px-6 pb-6 space-y-4 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Change Password</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Two-Factor Authentication</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Privacy Settings</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Language & Region */}
          <div className="bg-zinc-900 rounded-lg border-2 border-zinc-800 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'language' ? null : 'language')}
              className="w-full p-6 hover:bg-zinc-800/50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <Globe className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Language & Region</h3>
                    <p className="text-gray-400 text-sm">Set your language and location</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'language' ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {expandedSection === 'language' && (
              <div className="px-6 pb-6 space-y-4 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Language</span>
                  <span className="text-gray-400">English</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Country/Region</span>
                  <span className="text-gray-400">India</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Currency</span>
                  <span className="text-gray-400">₹ INR</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-zinc-900 rounded-lg border-2 border-zinc-800 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'payment' ? null : 'payment')}
              className="w-full p-6 hover:bg-zinc-800/50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <CreditCard className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Payment Methods</h3>
                    <p className="text-gray-400 text-sm">Manage saved payment methods</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === 'payment' ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {expandedSection === 'payment' && (
              <div className="px-6 pb-6 space-y-4 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Saved Cards</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">UPI IDs</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <span className="text-white">Wallet Balance</span>
                  <span className="text-red-500 font-semibold">₹0</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
