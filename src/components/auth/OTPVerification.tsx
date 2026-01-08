// src/components/auth/OTPVerification.tsx

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OTPFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface OTPVerificationProps {
  identifier: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string;
  success: string;
  backButtonLabel?: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  identifier,
  onVerify,
  onResend,
  onBack,
  isLoading,
  error,
  success,
  backButtonLabel = 'Change Number',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OTPFormData) => {
    await onVerify(data.otp);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-white">Verify OTP</h2>
      <p className="text-gray-300 mb-6">
        Enter the 6-digit OTP sent to {identifier}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
            OTP
          </label>
          <input
            {...register('otp')}
            type="text"
            maxLength={6}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter 6-digit OTP"
          />
          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
          disabled={isLoading}
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

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {backButtonLabel}
          </button>
          <button
            type="button"
            onClick={onResend}
            disabled={isLoading}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
};
