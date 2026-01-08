// src/lib/utils/otpStore.ts

// In-memory OTP storage (in production, use Redis or database)
interface OTPData {
  otp: string;
  expiresAt: number;
  data?: any;
}

class OTPStore {
  private registrationStore = new Map<string, OTPData>();
  private loginStore = new Map<string, OTPData>();

  // Registration OTP methods
  setRegistrationOTP(mobile: string, otp: string, expiresAt: number, data?: any) {
    console.log(`📝 Storing registration OTP for ${mobile}`);
    this.registrationStore.set(mobile, { otp, expiresAt, data });
    console.log(`📊 Registration store size: ${this.registrationStore.size}`);
  }

  getRegistrationOTP(mobile: string): OTPData | undefined {
    console.log(`🔍 Looking up registration OTP for ${mobile}`);
    console.log(`📊 Registration store size: ${this.registrationStore.size}`);
    console.log(`📋 Keys in store:`, Array.from(this.registrationStore.keys()));
    return this.registrationStore.get(mobile);
  }

  deleteRegistrationOTP(mobile: string) {
    this.registrationStore.delete(mobile);
  }

  // Login OTP methods
  setLoginOTP(identifier: string, otp: string, expiresAt: number) {
    console.log(`📝 Storing login OTP for ${identifier}`);
    this.loginStore.set(identifier, { otp, expiresAt });
    console.log(`📊 Login store size: ${this.loginStore.size}`);
  }

  getLoginOTP(identifier: string): OTPData | undefined {
    console.log(`🔍 Looking up login OTP for ${identifier}`);
    console.log(`📊 Login store size: ${this.loginStore.size}`);
    return this.loginStore.get(identifier);
  }

  deleteLoginOTP(identifier: string) {
    this.loginStore.delete(identifier);
  }

  // Generate OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Use global object to persist across module reloads in development
declare global {
  var otpStoreInstance: OTPStore | undefined;
}

// Export a singleton instance that persists across hot reloads
export const otpStore = global.otpStoreInstance || new OTPStore();

if (process.env.NODE_ENV === 'development') {
  global.otpStoreInstance = otpStore;
}
