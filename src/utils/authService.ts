import { UserProfile } from '../types/auth';
import { getSupabase } from './supabaseClient';

const USERS_STORAGE_KEY = 'weddingwise_registered_users';
const CURRENT_SESSION_KEY = 'weddingwise_current_session';

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentSessionUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentSessionUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } else {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
  }
}

export function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Register a new user with live Supabase Authentication
 */
export async function registerUserAsync(data: {
  name: string;
  partnerName: string;
  email: string;
  password: string;
  weddingDate: string;
}): Promise<{ success: boolean; message: string; user?: UserProfile; code?: string }> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const supabase = getSupabase();

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: data.password,
      options: {
        data: {
          name: data.name.trim(),
          partnerName: data.partnerName.trim(),
          weddingDate: data.weddingDate,
        },
      },
    });

    if (error) {
      // If error occurs, fallback cleanly
      console.warn('Supabase sign up response:', error);
      return { success: false, message: error.message };
    }

    const supabaseUser = authData.user;
    const isConfirmed = Boolean(supabaseUser?.email_confirmed_at);

    const newUser: UserProfile = {
      id: supabaseUser?.id || `usr-${Date.now()}`,
      name: data.name.trim(),
      partnerName: data.partnerName.trim(),
      email: normalizedEmail,
      weddingDate: data.weddingDate,
      isVerified: isConfirmed,
      createdAt: new Date().toISOString(),
    };

    if (isConfirmed) {
      setCurrentSessionUser(newUser);
    }

    return {
      success: true,
      message: 'Confirmation email sent! Please check your email inbox and enter the 6-digit confirmation code.',
      user: newUser,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Registration error.' };
  }
}

/**
 * Verify email via OTP code
 */
export async function verifyUserEmailAsync(
  email: string,
  code: string
): Promise<{ success: boolean; message: string; user?: UserProfile }> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: code.trim(),
      type: 'signup',
    });

    if (error) {
      // Also try email type if signup type gave error
      const retry = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: code.trim(),
        type: 'email',
      });

      if (retry.error) {
        return { success: false, message: retry.error.message || error.message };
      }

      const sbUser = retry.data.user;
      const verifiedProfile: UserProfile = {
        id: sbUser?.id || `usr-${Date.now()}`,
        name: sbUser?.user_metadata?.name || 'Couple',
        partnerName: sbUser?.user_metadata?.partnerName || 'Partner',
        email: normalizedEmail,
        weddingDate: sbUser?.user_metadata?.weddingDate || '',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      setCurrentSessionUser(verifiedProfile);
      return {
        success: true,
        message: 'Email successfully verified! Welcome to WeddingWise.',
        user: verifiedProfile,
      };
    }

    const sbUser = data.user;
    const verifiedProfile: UserProfile = {
      id: sbUser?.id || `usr-${Date.now()}`,
      name: sbUser?.user_metadata?.name || 'Couple',
      partnerName: sbUser?.user_metadata?.partnerName || 'Partner',
      email: normalizedEmail,
      weddingDate: sbUser?.user_metadata?.weddingDate || '',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    setCurrentSessionUser(verifiedProfile);
    return {
      success: true,
      message: 'Email successfully verified! Welcome to WeddingWise.',
      user: verifiedProfile,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'OTP verification error.' };
  }
}

/**
 * Login user via Supabase
 */
export async function loginUserAsync(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: UserProfile; requiresVerification?: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return {
          success: false,
          message: 'Email verification pending. Please verify via the 6-digit OTP code or confirmation link sent to your email.',
          requiresVerification: true,
        };
      }
      return { success: false, message: error.message };
    }

    const sbUser = data.user;
    const userProfile: UserProfile = {
      id: sbUser.id,
      name: sbUser.user_metadata?.name || 'Couple',
      partnerName: sbUser.user_metadata?.partnerName || 'Partner',
      email: normalizedEmail,
      weddingDate: sbUser.user_metadata?.weddingDate || '',
      isVerified: Boolean(sbUser.email_confirmed_at),
      createdAt: sbUser.created_at || new Date().toISOString(),
    };

    setCurrentSessionUser(userProfile);
    return {
      success: true,
      message: 'Logged in successfully.',
      user: userProfile,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Authentication failed.' };
  }
}

/**
 * Resend verification code
 */
export async function resendVerificationCodeAsync(
  email: string
): Promise<{ success: boolean; message: string; code?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabase();

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'New verification email dispatched to your inbox!',
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Logout
 */
export async function logoutUserAsync() {
  const supabase = getSupabase();
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // ignore
  }
  setCurrentSessionUser(null);
}
