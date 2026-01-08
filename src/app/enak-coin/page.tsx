'use client';

import { useState } from 'react';
import { Coins, TrendingUp, Gift, ShoppingBag, History, Info, ArrowRight, Award, Zap } from 'lucide-react';
import Link from 'next/link';

export default function EnakCoinPage() {
  const [coinBalance] = useState(2500);
  const [coinValue] = useState(2500); // 1 Enak Coin = 1 Rupee

  const transactions = [
    {
      id: 1,
      type: 'earned',
      description: 'Purchase reward from Order #12345',
      amount: 150,
      date: '2024-01-15',
    },
    {
      id: 2,
      type: 'redeemed',
      description: 'Used for Order #12346',
      amount: -200,
      date: '2024-01-14',
    },
    {
      id: 3,
      type: 'earned',
      description: 'Referral bonus',
      amount: 500,
      date: '2024-01-13',
    },
    {
      id: 4,
      type: 'earned',
      description: 'Daily check-in bonus',
      amount: 50,
      date: '2024-01-12',
    },
    {
      id: 5,
      type: 'earned',
      description: 'Purchase reward from Order #12340',
      amount: 200,
      date: '2024-01-10',
    },
  ];

  // Calculate redeemed coins from transactions
  const totalRedeemed = transactions.reduce((sum, transaction) => {
    return transaction.type === 'redeemed' ? sum + Math.abs(transaction.amount) : sum;
  }, 0);

  // Calculate total earned coins from transactions
  const totalEarned = transactions.reduce((sum, transaction) => {
    return transaction.type === 'earned' ? sum + transaction.amount : sum;
  }, 0);

  const earningWays = [
    {
      icon: ShoppingBag,
      title: 'Shop & Earn',
      description: 'Earn 5% coins on every purchase',
      coins: '5%',
    },
    {
      icon: Gift,
      title: 'Refer Friends',
      description: 'Get 500 coins for each referral',
      coins: '500',
    },
    {
      icon: Award,
      title: 'Complete Challenges',
      description: 'Special rewards for tasks',
      coins: 'Up to 1000',
    },
    {
      icon: Zap,
      title: 'Daily Check-in',
      description: 'Login daily to earn bonus coins',
      coins: '50',
    },
  ];

  const benefits = [
    'Use coins to get instant discounts on orders',
    'Coins never expire - save and use anytime',
    'Transfer coins to family members',
    'Get exclusive access to coin-only deals',
    'Earn bonus coins on special occasions',
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-red-500 hover:text-red-400 mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Coins className="w-10 h-10 text-yellow-500" />
            Enak Coin
          </h1>
          <p className="text-gray-400">Earn, save, and redeem coins on every purchase</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20" />
          <div className="relative z-10">
            <p className="text-yellow-100 mb-2 text-sm font-medium">Your Balance</p>
            <div className="flex items-end gap-4 mb-6">
              <h2 className="text-5xl font-bold text-white">{coinBalance.toLocaleString()}</h2>
              <span className="text-2xl text-yellow-100 mb-2">Coins</span>
            </div>

            {/* Coin Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Available for Redeem */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-white" />
                  <p className="text-yellow-100 text-xs font-medium">Available for Redeem</p>
                </div>
                <p className="text-2xl font-bold text-white">{coinBalance.toLocaleString()}</p>
                <p className="text-yellow-100 text-xs mt-1">Worth ₹{coinValue.toLocaleString()}</p>
              </div>

              {/* Redeemed Coins */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <p className="text-yellow-100 text-xs font-medium">Redeemed Coins</p>
                </div>
                <p className="text-2xl font-bold text-white">{totalRedeemed.toLocaleString()}</p>
                <p className="text-yellow-100 text-xs mt-1">Worth ₹{totalRedeemed.toLocaleString()}</p>
              </div>

              {/* Total Earned */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <p className="text-yellow-100 text-xs font-medium">Total Earned</p>
                </div>
                <p className="text-2xl font-bold text-white">{totalEarned.toLocaleString()}</p>
                <p className="text-yellow-100 text-xs mt-1">All time earnings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ways to Earn */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              Ways to Earn Coins
            </h2>
            <div className="space-y-4">
              {earningWays.map((way, index) => {
                const Icon = way.icon;
                return (
                  <div
                    key={index}
                    className="bg-zinc-900 border border-gray-800 rounded-lg p-4 hover:border-yellow-600 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-600/30 transition-all">
                        <Icon className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{way.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{way.description}</p>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-500 font-semibold">{way.coins} Coins</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-red-500" />
              Coin Benefits
            </h2>
            <div className="bg-zinc-900 border border-gray-800 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 to-yellow-600/20 border border-red-600/50 rounded-lg p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-red-500" />
                How to Redeem
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Use your Enak Coins at checkout to get instant discounts. 100 coins = ₹100 discount
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              >
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <History className="w-6 h-6 text-red-500" />
            Transaction History
          </h2>
          <div className="bg-zinc-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Description</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-zinc-800 transition-all">
                      <td className="py-4 px-6 text-sm text-gray-400">{transaction.date}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'earned' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">{transaction.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`font-semibold ${
                            transaction.type === 'earned' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {transaction.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-yellow-600/10 to-red-600/10 border border-yellow-600/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Terms & Conditions</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Coins can be redeemed on orders above ₹500</li>
                <li>• Maximum 50% of order value can be paid using coins</li>
                <li>• Coins are non-transferable and non-refundable</li>
                <li>• Coins earned on promotional items may have different terms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
