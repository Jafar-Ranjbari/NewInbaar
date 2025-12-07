import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthStep } from '../types';
import { Lock, ArrowRight } from 'lucide-react';
import { generateMockJwt } from '../utils/cookie';

export const PasswordStep: React.FC = () => {
  const [password, setPassword] = useState('');
  const { setStep, tempUser, login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;

    if (password === tempUser.password) {
      const token = generateMockJwt({ id: tempUser.id, role: tempUser.rolename });
      login(tempUser, token);
    } else {
      alert('رمز عبور اشتباه است');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <button 
        onClick={() => setStep(AuthStep.PHONE_INPUT)}
        className="mb-6 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
      >
        <ArrowRight size={16} />
        بازگشت
      </button>

      <div className="text-center mb-8">
        <div className="bg-gray-100 text-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">خوش آمدید</h2>
        <p className="text-gray-500 mt-2">
          {tempUser?.fullName} عزیز، لطفا رمز عبور خود را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>
          <input
            type="password"
            dir="ltr"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
        >
          ورود به پنل
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setStep(AuthStep.FORGOT_PASSWORD_SMS)}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            رمز عبور را فراموش کرده‌اید؟
          </button>
        </div>
      </form>
    </div>
  );
};