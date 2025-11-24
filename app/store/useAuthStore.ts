import { create } from 'zustand';
import { AuthState, AuthStep, User } from '../types';
import { setCookie, eraseCookie, getCookie } from '../utils/cookie';
import { COOKIE_NAME } from '../constants';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getCookie(COOKIE_NAME),
  currentUser: null, // In a real app, we would re-fetch this on load if token exists
  token: getCookie(COOKIE_NAME),
  currentStep: AuthStep.PHONE_INPUT,
  tempMobile: '',
  tempUser: null,

  setStep: (step) => set({ currentStep: step }),
  setTempMobile: (mobile) => set({ tempMobile: mobile }),
  setTempUser: (user) => set({ tempUser: user }),
  
  login: (user, token) => {
    setCookie(COOKIE_NAME, token, 7);
    set({ 
      isAuthenticated: true, 
      currentUser: user, 
      token: token,
      currentStep: AuthStep.PHONE_INPUT // Reset for next time
    });
  },
  
  logout: () => {
    eraseCookie(COOKIE_NAME);
    set({ 
      isAuthenticated: false, 
      currentUser: null, 
      token: null,
      currentStep: AuthStep.PHONE_INPUT,
      tempMobile: '',
      tempUser: null
    });
  }
}));