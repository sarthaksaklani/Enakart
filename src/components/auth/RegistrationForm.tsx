// src/components/auth/RegistrationForm.tsx

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { Loader2, Store, Users, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { OTPVerification } from './OTPVerification';
import { SellerRegistrationForm } from './SellerRegistrationForm';
import { UserRole } from '@/types';

type RegistrationStep = 'role' | 'basic' | 'role-specific' | 'otp' | 'seller-registration';

export const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState<RegistrationStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationFormData>>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { setUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const currentRole = watch('role');

  // Step 1: Role Selection
  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
    setRegistrationData({ ...registrationData, role });

    // For sellers, use the new 4-step registration form
    if (role === 'seller') {
      setStep('seller-registration');
    } else {
      setStep('basic');
    }
  };

  // Step 2: Basic Information - Continue to role-specific
  const handleBasicInfoContinue = () => {
    const basicData = {
      first_name: watch('first_name'),
      last_name: watch('last_name'),
      gender: watch('gender'),
      mobile: watch('mobile'),
      email: watch('email'),
      address_line1: watch('address_line1'),
      address_line2: watch('address_line2'),
      city: watch('city'),
      state: watch('state'),
      pincode: watch('pincode'),
    };

    setRegistrationData({ ...registrationData, ...basicData });

    if (selectedRole === 'customer') {
      // Customers don't have role-specific fields, go straight to submission
      handleFinalSubmit();
    } else {
      setStep('role-specific');
    }
  };

  // Final submission
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = {
        ...registrationData,
        ...watch(),
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setRegistrationData(formData as RegistrationFormData);
      setSuccess('OTP sent to your mobile number!');
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onRoleSpecificSubmit = async (data: RegistrationFormData) => {
    await handleFinalSubmit();
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!registrationData) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: registrationData.mobile,
          otp,
          userData: registrationData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'OTP verification failed');
      }

      setUser(result.user);
      setSuccess('Registration successful!');
      // Redirect immediately to prevent dashboard flash
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!registrationData) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend OTP');
      }

      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Seller Registration - 4 Step Process
  if (step === 'seller-registration') {
    return (
      <SellerRegistrationForm
        onBack={() => {
          setStep('role');
          setSelectedRole(null);
          setError('');
        }}
      />
    );
  }

  // OTP Step
  if (step === 'otp') {
    return (
      <OTPVerification
        identifier={registrationData?.mobile || ''}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onBack={() => {
          setStep(selectedRole === 'customer' ? 'basic' : 'role-specific');
          setError('');
          setSuccess('');
        }}
        isLoading={isLoading}
        error={error}
        success={success}
        backButtonLabel="Back to Registration"
      />
    );
  }

  // Step 1: Role Selection
  if (step === 'role') {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-3 text-white">Create Account</h2>
        <p className="text-gray-400 mb-8">Choose your account type to get started</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Card */}
          <div
            onClick={() => handleRoleSelection('customer')}
            className="group cursor-pointer bg-gray-800/50 hover:bg-gray-800 border-2 border-gray-700 hover:border-red-500 rounded-lg p-6 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                <ShoppingBag className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Customer</h3>
              <p className="text-gray-400 text-sm">
                Shop for eyewear and accessories for personal use
              </p>
            </div>
          </div>

          {/* Seller Card */}
          <div
            onClick={() => handleRoleSelection('seller')}
            className="group cursor-pointer bg-gray-800/50 hover:bg-gray-800 border-2 border-gray-700 hover:border-red-500 rounded-lg p-6 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                <Store className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Seller</h3>
              <p className="text-gray-400 text-sm">
                Sell your optical products and manage your business
              </p>
            </div>
          </div>

          {/* Reseller Card */}
          <div
            onClick={() => handleRoleSelection('reseller')}
            className="group cursor-pointer bg-gray-800/50 hover:bg-gray-800 border-2 border-gray-700 hover:border-red-500 rounded-lg p-6 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Reseller</h3>
              <p className="text-gray-400 text-sm">
                Buy in bulk and resell optical products
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Basic Information
  if (step === 'basic') {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setStep('role')}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">Basic Information</h2>
            <p className="text-gray-400 text-sm mt-1">
              Creating account as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : ''}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-2">
                First Name *
              </label>
              <input
                {...register('first_name')}
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="John"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                {...register('last_name')}
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
              Gender *
            </label>
            <select
              {...register('gender')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number *
              </label>
              <input
                {...register('mobile')}
                type="tel"
                maxLength={10}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="9876543210"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-500">{errors.mobile.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="address_line1" className="block text-sm font-medium text-gray-300 mb-2">
              Address Line 1
            </label>
            <input
              {...register('address_line1')}
              type="text"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label htmlFor="address_line2" className="block text-sm font-medium text-gray-300 mb-2">
              Address Line 2
            </label>
            <input
              {...register('address_line2')}
              type="text"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                {...register('city')}
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <input
                {...register('state')}
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Maharashtra"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-300 mb-2">
                Pincode
              </label>
              <input
                {...register('pincode')}
                type="text"
                maxLength={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="400001"
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleBasicInfoContinue}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={isLoading || !watch('first_name') || !watch('last_name') || !watch('gender') || !watch('mobile') || !watch('email')}
          >
            {selectedRole === 'customer' ? (
              <>
                Continue to Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Step 3: Role-Specific Information
  if (step === 'role-specific') {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setStep('basic')}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">
              {selectedRole === 'seller' ? 'Business Information' : 'Company Information'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Additional details for {selectedRole} account
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onRoleSpecificSubmit)} className="space-y-6">
          {selectedRole === 'seller' && (
            <>
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name *
                </label>
                <input
                  {...register('business_name')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="ABC Optical Store"
                />
                {'business_name' in errors && errors.business_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.business_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gst_number" className="block text-sm font-medium text-gray-300 mb-2">
                  GST Number *
                </label>
                <input
                  {...register('gst_number')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="22AAAAA0000A1Z5"
                />
                {'gst_number' in errors && errors.gst_number && (
                  <p className="mt-1 text-sm text-red-500">{errors.gst_number.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="business_address" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Address *
                </label>
                <textarea
                  {...register('business_address')}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your business address"
                />
                {'business_address' in errors && errors.business_address && (
                  <p className="mt-1 text-sm text-red-500">{errors.business_address.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="business_license" className="block text-sm font-medium text-gray-300 mb-2">
                  Business License Number
                </label>
                <input
                  {...register('business_license')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </>
          )}

          {selectedRole === 'reseller' && (
            <>
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  {...register('company_name')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="XYZ Distributors"
                />
                {'company_name' in errors && errors.company_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.company_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reseller_type" className="block text-sm font-medium text-gray-300 mb-2">
                  Reseller Type *
                </label>
                <select
                  {...register('reseller_type')}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="wholesale">Wholesale Distributor</option>
                  <option value="retail">Retail Chain</option>
                  <option value="online">Online Marketplace</option>
                  <option value="other">Other</option>
                </select>
                {'reseller_type' in errors && errors.reseller_type && (
                  <p className="mt-1 text-sm text-red-500">{errors.reseller_type.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="tax_id" className="block text-sm font-medium text-gray-300 mb-2">
                  Tax ID / PAN *
                </label>
                <input
                  {...register('tax_id')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="ABCDE1234F"
                />
                {'tax_id' in errors && errors.tax_id && (
                  <p className="mt-1 text-sm text-red-500">{errors.tax_id.message}</p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Continue to Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  return null;
};
