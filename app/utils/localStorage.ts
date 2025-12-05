// utils/localStorage.ts
import { COOKIE_NAME } from '../constants';
import { User } from '../types';

/**
 * توابع کمکی برای LocalStorage
 * در سمت سرور (SSR) به هیچ وجه اجرا نمی شوند.
 */

// ⬅️ برای حفظ token و currentUser در LocalStorage
export const setAuthData = (user: User, token: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(COOKIE_NAME + '_token', token);
        // ما اطلاعات کاربر را به صورت رشته JSON ذخیره می کنیم
        localStorage.setItem(COOKIE_NAME + '_user', JSON.stringify(user)); 
    }
};

// ⬅️ برای بازیابی اطلاعات کاربر در زمان بارگذاری
export const getAuthData = (): { user: User | null, token: string | null } => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return { user: null, token: null };
    }
    
    const token = localStorage.getItem(COOKIE_NAME + '_token');
    const userJson = localStorage.getItem(COOKIE_NAME + '_user');
    
    let user: User | null = null;
    if (userJson) {
        try {
            user = JSON.parse(userJson) as User;
        } catch (e) {
            console.error("Failed to parse user data from localStorage", e);
        }
    }
    
    return { user, token };
};

// ⬅️ برای حذف داده ها در زمان خروج
export const clearAuthData = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(COOKIE_NAME + '_token');
        localStorage.removeItem(COOKIE_NAME + '_user');
    }
};