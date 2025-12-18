 // store/useAuthStore.ts

import { create } from 'zustand';
import { AuthState, AuthStep, User } from '../types';
import { setAuthData, clearAuthData, getAuthData } from '../utils/localStorage'; // ⬅️ استفاده از توابع LocalStorage
import { useEffect } from 'react';

// حالت اولیه (INITIAL_STATE):
// این آبجکت فقط شامل داده‌های اولیه است و توابع (متدها) را شامل نمی‌شود.
// ما Type Annotation (: AuthState) را حذف می کنیم تا خطای TypeScript قبلی حل شود.
const INITIAL_STATE = { 
  isAuthenticated: false,
  currentUser: null, 
  token: null,
  currentStep: AuthStep.PHONE_INPUT,
  tempMobile: '',
  tempUser: null,
  isHydrated: false, // ⬅️ حالت کلیدی برای مدیریت SSR/CSR
};

export const useAuthStore = create<AuthState>((set) => ({
  ...INITIAL_STATE,

  setHydrated: (state) => set({ isHydrated: state }),
  setStep: (step) => set({ currentStep: step }),
  setTempMobile: (mobile) => set({ tempMobile: mobile }),
  setTempUser: (user) => set({ tempUser: user }),

  login: (user, token) => {
    setAuthData(user, token);
    set({
      isAuthenticated: true,
      currentUser: user,
      token: token,
      currentStep: AuthStep.PHONE_INPUT,
    });
  },

  logout: () => {
    clearAuthData();
    set({
      isAuthenticated: false,
      currentUser: null,
      token: null,
      currentStep: AuthStep.PHONE_INPUT,
      tempMobile: '',
      tempUser: null,
    });
  },

  // ✅ متد جدید
  setCurrentUser: (user) =>
    set({
      currentUser: user,
    }),
}));

// export const useAuthStore = create<AuthState>((set) => ({
//     // 1. داده‌های اولیه
//     ...INITIAL_STATE, 

//     // 2. توابع (متدها)

//     setHydrated: (state) => set({ isHydrated: state }),
//     setStep: (step) => set({ currentStep: step }),
//     setTempMobile: (mobile) => set({ tempMobile: mobile }),
//     setTempUser: (user) => set({ tempUser: user }),
//   
//     login: (user, token) => {
//         // ⬅️ ذخیره داده‌ها در LocalStorage
//         setAuthData(user, token); 
        
//         set({ 
//             isAuthenticated: true, 
//             currentUser: user, 
//             token: token,
//             currentStep: AuthStep.PHONE_INPUT // ریست کردن برای استفاده‌های بعدی
//         });
//     },
//   
//     logout: () => {
//         // ⬅️ پاک کردن LocalStorage
//         clearAuthData(); 
        
//         set({ 
//             isAuthenticated: false, 
//             currentUser: null, 
//             token: null,
//             currentStep: AuthStep.PHONE_INPUT,
//             tempMobile: '',
//             tempUser: null,
//         });
//     }
// }));

// 💡 هوک سفارشی برای بازیابی داده‌ها از LocalStorage در زمان بارگذاری (Hydration)
// این تضمین می کند که اطلاعات کاربر پس از رفرش از بین نرود.
export const useStoreHydration = () => {
  // ما از .getState() استفاده می‌کنیم تا از وابستگی (Dependency) به Store جلوگیری کنیم 
  // و فقط یک بار اجرا شود.
  const setAuthStore = useAuthStore.getState();

  useEffect(() => {
    // این کد فقط در سمت کلاینت اجرا می شود (پس از SSR)
    const { user, token } = getAuthData();
    
    if (token && user) {
        // اگر داده در LocalStorage بود، Store را با آنها پر کن
        setAuthStore.login(user, token);
    }
    
    // ⬅️ علامتگذاری Store به عنوان هیدرات شده.
    // این باعث می‌شود RootLayout از حالت "درحال بارگذاری..." خارج شود.
    setAuthStore.setHydrated(true); 

  }, []); 
};