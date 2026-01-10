'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Building2, CreditCard, FileCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { OTPVerification } from './OTPVerification';

type SellerRegistrationStep = 1 | 2 | 3 | 4 | 'otp';

interface SellerRegistrationFormProps {
  onBack: () => void;
}

export const SellerRegistrationForm: React.FC<SellerRegistrationFormProps> = ({ onBack }) => {
  const [step, setStep] = useState<SellerRegistrationStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationFormData>>({ role: 'seller' });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [hasGST, setHasGST] = useState<boolean | null>(null);
  const [gstOtpSent, setGstOtpSent] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'seller',
    },
  });

  // Progress Indicator Component
  const ProgressIndicator = () => {
    const steps = [
      { number: 1, label: 'Seller Details' },
      { number: 2, label: 'GST Details' },
      { number: 3, label: 'Business Info' },
      { number: 4, label: 'Review' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === 'otp'
                      ? s.number === 4
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                      : step > s.number
                      ? 'bg-green-600 text-white'
                      : step === s.number
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step === 'otp' ? (
                    s.number === 4 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )
                  ) : step > s.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    s.number
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    step === s.number || step === 'otp' ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    step === 'otp' || (typeof step === 'number' && step > s.number)
                      ? 'bg-green-600'
                      : 'bg-gray-700'
                  }`}
                  style={{ maxWidth: '100px' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Step 1: Seller Details with Business Address
  const handleStep1Continue = async () => {
    const fieldsToValidate = [
      'first_name',
      'last_name',
      'gender',
      'mobile',
      'email',
    ] as const;

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      const step1Data = {
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
      setRegistrationData({ ...registrationData, ...step1Data });
      setStep(2);
      setError('');
    }
  };

  // Step 2: GST Verification
  const handleGSTChoice = (choice: boolean) => {
    setHasGST(choice);
    setError('');
  };

  const handleSendGSTOTP = async () => {
    const gstNumber = watch('gst_number');
    if (!gstNumber) {
      setError('Please enter your GST number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate GST OTP sending - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setGstOtpSent(true);
      setSuccess('OTP sent to registered mobile number with GST');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyGSTOTP = async () => {
    const gstOtp = watch('gst_otp');
    if (!gstOtp) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate GST OTP verification - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setGstVerified(true);
      setSuccess('GST verified successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Continue = () => {
    if (hasGST === null) {
      setError('Please select whether you have GST number or not');
      return;
    }

    if (hasGST && !gstVerified) {
      setError('Please verify your GST number first');
      return;
    }

    const step2Data = {
      gst_number: hasGST ? watch('gst_number') : undefined,
    };
    setRegistrationData({ ...registrationData, ...step2Data });
    setStep(3);
    setError('');
  };

  // Step 3: Business Information
  const handleStep3Continue = async () => {
    const fieldsToValidate = ['business_name', 'business_address'] as const;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      const step3Data = {
        business_name: watch('business_name'),
        business_address: watch('business_address'),
        business_license: watch('business_license'),
        bank_account_number: watch('bank_account_number'),
        ifsc_code: watch('ifsc_code'),
        account_holder_name: watch('account_holder_name'),
      };
      setRegistrationData({ ...registrationData, ...step3Data });
      setStep(4);
      setError('');
    }
  };

  // Step 4: Review and Submit
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = {
        ...registrationData,
        role: 'seller' as const,
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

  // OTP Step
  if (step === 'otp') {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
        <ProgressIndicator />
        <OTPVerification
          identifier={registrationData?.mobile || ''}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onBack={() => {
            setStep(4);
            setError('');
            setSuccess('');
          }}
          isLoading={isLoading}
          error={error}
          success={success}
          backButtonLabel="Back to Review"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
      <ProgressIndicator />

      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            if (step === 1) {
              onBack();
            } else if (typeof step === 'number') {
              setStep((step - 1) as SellerRegistrationStep);
              setError('');
            }
          }}
          className="mr-4 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white">
            {step === 1 && 'Seller Details'}
            {step === 2 && 'GST Information'}
            {step === 3 && 'Business Information'}
            {step === 4 && 'Review & Confirm'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1 && 'Enter your personal and business address details'}
            {step === 2 && 'GST verification for your business'}
            {step === 3 && 'Business and account details'}
            {step === 4 && 'Review your information before submitting'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Step 1: Seller Details */}
      {step === 1 && (
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

          {/* Business Address Section */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-semibold text-white">Business Address</h3>
            </div>

            <div className="space-y-6">
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
            </div>
          </div>

          <Button
            type="button"
            onClick={handleStep1Continue}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={!watch('first_name') || !watch('last_name') || !watch('gender') || !watch('mobile') || !watch('email')}
          >
            Continue to GST Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Step 2: GST Information */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Do you have a GST number?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleGSTChoice(true)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  hasGST === true
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${hasGST === true ? 'text-red-500' : 'text-gray-500'}`} />
                  <p className="font-semibold text-white">Yes, I have GST</p>
                  <p className="text-sm text-gray-400 mt-1">I can expand my business across India</p>
                </div>
              </button>

              <button
                onClick={() => handleGSTChoice(false)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  hasGST === false
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${hasGST === false ? 'text-red-500' : 'text-gray-500'}`} />
                  <p className="font-semibold text-white">No, I don&apos;t have GST</p>
                  <p className="text-sm text-gray-400 mt-1">Intra-state business only</p>
                </div>
              </button>
            </div>
          </div>

          {hasGST === true && (
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 space-y-4">
              <div>
                <label htmlFor="gst_number" className="block text-sm font-medium text-gray-300 mb-2">
                  GST Number *
                </label>
                <input
                  {...register('gst_number')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="22AAAAA0000A1Z5"
                  disabled={gstVerified}
                />
                {'gst_number' in errors && errors.gst_number && (
                  <p className="mt-1 text-sm text-red-500">{errors.gst_number.message}</p>
                )}
              </div>

              {!gstOtpSent && !gstVerified && (
                <Button
                  type="button"
                  onClick={handleSendGSTOTP}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={isLoading || !watch('gst_number')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP for Verification'
                  )}
                </Button>
              )}

              {gstOtpSent && !gstVerified && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="gst_otp" className="block text-sm font-medium text-gray-300 mb-2">
                      Enter OTP *
                    </label>
                    <input
                      {...register('gst_otp')}
                      type="text"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyGSTOTP}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    disabled={isLoading || !watch('gst_otp')}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                </div>
              )}

              {gstVerified && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  GST Number Verified Successfully!
                </div>
              )}
            </div>
          )}

          {hasGST === false && (
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Important Notice</p>
                  <p className="text-sm">
                    According to Government guidelines, without a GST number you can only conduct intra-state business.
                    You won&apos;t be eligible to expand your business outside your state. Only inter-state business is allowed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleStep2Continue}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={hasGST === null || (hasGST && !gstVerified)}
          >
            Continue to Business Information
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 3: Business Information */}
      {step === 3 && (
        <form className="space-y-6">
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
            <label htmlFor="business_address" className="block text-sm font-medium text-gray-300 mb-2">
              Business Address *
            </label>
            <textarea
              {...register('business_address')}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your complete business address"
            />
            {'business_address' in errors && errors.business_address && (
              <p className="mt-1 text-sm text-red-500">{errors.business_address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="business_license" className="block text-sm font-medium text-gray-300 mb-2">
              Business License Number (Optional)
            </label>
            <input
              {...register('business_license')}
              type="text"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>

          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-semibold text-white">Bank Account Details</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="account_holder_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Account Holder Name
                </label>
                <input
                  {...register('account_holder_name')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bank_account_number" className="block text-sm font-medium text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    {...register('bank_account_number')}
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="ifsc_code" className="block text-sm font-medium text-gray-300 mb-2">
                    IFSC Code
                  </label>
                  <input
                    {...register('ifsc_code')}
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="ABCD0123456"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleStep3Continue}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={!watch('business_name') || !watch('business_address')}
          >
            Continue to Review
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Personal Details</h3>
              <button
                onClick={() => setStep(1)}
                className="text-red-500 hover:text-red-400 text-sm font-medium"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-white font-medium">
                  {registrationData.first_name} {registrationData.last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Gender</p>
                <p className="text-white font-medium capitalize">{registrationData.gender}</p>
              </div>
              <div>
                <p className="text-gray-400">Mobile</p>
                <p className="text-white font-medium">{registrationData.mobile}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white font-medium">{registrationData.email}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">Business Address</p>
                <p className="text-white font-medium">
                  {registrationData.address_line1}
                  {registrationData.address_line2 && `, ${registrationData.address_line2}`}
                  {registrationData.city && `, ${registrationData.city}`}
                  {registrationData.state && `, ${registrationData.state}`}
                  {registrationData.pincode && ` - ${registrationData.pincode}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">GST Details</h3>
              <button
                onClick={() => setStep(2)}
                className="text-red-500 hover:text-red-400 text-sm font-medium"
              >
                Edit
              </button>
            </div>
            <div className="text-sm">
              {hasGST ? (
                <div>
                  <p className="text-gray-400">GST Number</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    {(registrationData as any).gst_number}
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="w-4 h-4" />
                  <p>No GST - Intra-state business only</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Business Information</h3>
              <button
                onClick={() => setStep(3)}
                className="text-red-500 hover:text-red-400 text-sm font-medium"
              >
                Edit
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Business Name</p>
                <p className="text-white font-medium">{(registrationData as any).business_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Business Address</p>
                <p className="text-white font-medium">{(registrationData as any).business_address}</p>
              </div>
              {(registrationData as any).business_license && (
                <div>
                  <p className="text-gray-400">Business License</p>
                  <p className="text-white font-medium">{(registrationData as any).business_license}</p>
                </div>
              )}
              {(registrationData as any).account_holder_name && (
                <>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-gray-400 mb-2">Bank Account Details</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Account Holder</p>
                    <p className="text-white font-medium">{(registrationData as any).account_holder_name}</p>
                  </div>
                  {(registrationData as any).bank_account_number && (
                    <div>
                      <p className="text-gray-400">Account Number</p>
                      <p className="text-white font-medium">{(registrationData as any).bank_account_number}</p>
                    </div>
                  )}
                  {(registrationData as any).ifsc_code && (
                    <div>
                      <p className="text-gray-400">IFSC Code</p>
                      <p className="text-white font-medium">{(registrationData as any).ifsc_code}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleFinalSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Submit & Verify
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
