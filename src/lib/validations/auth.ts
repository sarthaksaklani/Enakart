// src/lib/validations/auth.ts

import { z } from 'zod';

// Base registration schema (common fields)
const baseRegistrationSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select a gender',
  }),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['customer', 'seller', 'reseller'], {
    message: 'Please select a user role',
  }),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode').optional().or(z.literal('')),
});

// Seller specific fields
const sellerFields = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  gst_number: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number').optional().or(z.literal('')),
  business_address: z.string().min(5, 'Business address is required'),
  business_license: z.string().optional(),
  gst_otp: z.string().optional(),
  bank_account_number: z.string().optional(),
  ifsc_code: z.string().optional(),
  account_holder_name: z.string().optional(),
});

// Reseller specific fields
const resellerFields = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  reseller_type: z.string().min(2, 'Reseller type is required'),
  tax_id: z.string().min(5, 'Tax ID is required'),
});

// Dynamic registration schema that validates based on role
export const registrationSchema = baseRegistrationSchema.and(
  z.discriminatedUnion('role', [
    z.object({ role: z.literal('customer') }),
    z.object({ role: z.literal('seller') }).merge(sellerFields),
    z.object({ role: z.literal('reseller') }).merge(resellerFields),
  ])
);

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Please enter your email or mobile number')
    .refine(
      (value) => {
        // Check if it's a valid email or mobile number
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;
        return emailRegex.test(value) || mobileRegex.test(value);
      },
      {
        message: 'Please enter a valid email or 10-digit mobile number',
      }
    ),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
