'use client';

import { Store, TrendingUp, ShieldCheck, Users, Wallet, Headphones, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BecomeASellerPage() {
  const router = useRouter();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Reach millions of customers across the country and expand your market presence',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Platform',
      description: 'Safe and secure transactions with buyer protection and verified payments',
    },
    {
      icon: Wallet,
      title: 'Quick Payments',
      description: 'Get paid quickly with our streamlined payment processing system',
    },
    {
      icon: Users,
      title: 'Large Customer Base',
      description: 'Access to a vast network of active buyers looking for quality products',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated seller support team available round the clock to help you succeed',
    },
    {
      icon: Store,
      title: 'Easy Store Setup',
      description: 'Simple onboarding process to get your store up and running quickly',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Register as Seller',
      description: 'Fill out the seller registration form with your business details',
    },
    {
      step: '2',
      title: 'Verify Documents',
      description: 'Submit required documents for verification and approval',
    },
    {
      step: '3',
      title: 'Setup Your Store',
      description: 'Add your products, set prices, and customize your store',
    },
    {
      step: '4',
      title: 'Start Selling',
      description: 'Go live and start receiving orders from customers',
    },
  ];

  const features = [
    'Zero listing fees for the first month',
    'Advanced analytics dashboard',
    'Inventory management tools',
    'Marketing and promotion support',
    'Flexible commission structure',
    'Multiple payment options',
    'Mobile app for sellers',
    'Training and resources',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 mb-6 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-red-600/20 border border-red-600 rounded-full">
              <span className="text-red-500 font-semibold">Start Your Journey</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become a Seller on <span className="text-red-600">एnakart</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of successful sellers and grow your business with India's fastest-growing e-commerce platform
            </p>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Register Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Why Sell on Enakart?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Discover the advantages of partnering with us
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-black border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How to Get Started</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Follow these simple steps to start selling
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-zinc-900 border border-gray-800 rounded-lg p-6 text-center hover:border-red-600 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-red-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-gray-400 text-center mb-12">
            Exclusive benefits and features for our sellers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-black border border-gray-800 rounded-lg p-4 hover:border-red-600 transition-all"
              >
                <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join Enakart today and take your business to the next level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Register as Seller <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-12 px-4 bg-zinc-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Have questions? Our seller support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="text-sm">
              <span className="text-gray-500">Email:</span>{' '}
              <a href="mailto:sellers@enakart.com" className="text-red-500 hover:text-red-400">
                sellers@enakart.com
              </a>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Phone:</span>{' '}
              <a href="tel:+911800000000" className="text-red-500 hover:text-red-400">
                1800-000-000
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
