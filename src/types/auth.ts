export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  partnerName: string;
  weddingDate: string;
  isVerified: boolean;
  verificationCode?: string;
  createdAt: string;
}

export interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}
