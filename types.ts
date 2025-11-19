export enum Role {
  DRIVER = 'DRIVER',
  COMPANY = 'COMPANY'
}

export interface User {
  id: string;
  fullName: string;
  password?: string; // In a real app, this should never be exposed to frontend like this
  rolename: Role;
  mobile: string;
}

export enum AuthStep {
  PHONE_INPUT = 'PHONE_INPUT',
  LOGIN_PASSWORD = 'LOGIN_PASSWORD',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD_SMS = 'FORGOT_PASSWORD_SMS',
  FORGOT_PASSWORD_NEW = 'FORGOT_PASSWORD_NEW',
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  currentStep: AuthStep;
  tempMobile: string; // Used during auth flow
  tempUser: User | null; // Used when user is found but not logged in yet
  
  // Actions
  setStep: (step: AuthStep) => void;
  setTempMobile: (mobile: string) => void;
  setTempUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}
