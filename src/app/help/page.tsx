// src/app/help/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { HeadphonesIcon, ArrowLeft, HelpCircle, Truck, RefreshCw, Shield, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HelpPage() {
  const helpTopics = [
    {
      title: 'Order & Delivery',
      icon: Truck,
      questions: [
        'How do I track my order?',
        'What is the delivery time?',
        'Can I change my delivery address?',
        'What if my order is delayed?',
      ],
    },
    {
      title: 'Returns & Refunds',
      icon: RefreshCw,
      questions: [
        'How do I return a product?',
        'What is the return policy?',
        'When will I get my refund?',
        'Can I exchange a product?',
      ],
    },
    {
      title: 'Payments',
      icon: CreditCard,
      questions: [
        'What payment methods are accepted?',
        'Is it safe to pay online?',
        'Can I pay cash on delivery?',
        'How do I get an invoice?',
      ],
    },
    {
      title: 'Product Information',
      icon: HelpCircle,
      questions: [
        'How do I choose the right frame?',
        'Are the lenses prescription-ready?',
        'What is the warranty period?',
        'How do I care for my glasses?',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <HeadphonesIcon className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Help & Support</h1>
              <p className="text-gray-400 mt-1">We're here to help you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Topics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpTopics.map((topic, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:border-red-600/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-600 rounded-lg">
                  <topic.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{topic.title}</h3>
              </div>
              <ul className="space-y-3">
                {topic.questions.map((question, qIndex) => (
                  <li key={qIndex}>
                    <button className="text-gray-400 hover:text-white transition-colors text-left w-full">
                      • {question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-400 mb-6">
            Our customer support team is available 24/7 to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                Contact Support
              </Button>
            </Link>
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3">
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
