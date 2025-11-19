import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { updateUserPassword } from '../../services/userService';
import { AuthStep } from '../../types';
import { generateMockJwt } from '../../utils/cookie';
import { KeyRound, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { SMS_MOCK_CODE } from '../../constants';

export const ForgotPasswordFlow: React.FC = () => {
  const { setStep, currentStep, tempUser, login } = useAuthStore();
  const [smsCode, setSmsCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: SMS Verification
  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsCode === SMS_MOCK_CODE) {
      setStep(AuthStep.FORGOT_PASSWORD_NEW);
    } else {
      alert('کد وارد شده صحیح نمی‌باشد (کد آزمایشی: 1234)');
    }
  };

  // Step 2: Set New Password
  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;

    setLoading(true);
    try {
      const updatedUser = await updateUserPassword(tempUser.id, newPassword);
      const token = generateMockJwt({ id: updatedUser.id, role: updatedUser.rolename });
      login(updatedUser, token);
    } catch (error) {
      alert('خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === AuthStep.FORGOT_PASSWORD_SMS) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
         <button 
          onClick={() => setStep(AuthStep.LOGIN_PASSWORD)}
          className="mb-6 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
        >
          <ArrowRight size={16} />
          بازگشت
        </button>

        <div className="text-center mb-6">
          <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">بازیابی رمز عبور</h2>
          <p className="text-gray-500 mt-2 text-sm">
            کد ارسال شده به شماره {tempUser?.mobile} را وارد کنید
            <br/>
            <span className="text-xs text-gray-400">(کد تستی: 1234)</span>
          </p>
        </div>

        <form onSubmit={handleSmsSubmit}>
          <input
            type="text"
            dir="ltr"
            placeholder="1234"
            className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-6"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all">
            تایید کد
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">رمز عبور جدید</h2>
        <p className="text-gray-500 mt-2 text-sm">لطفا رمز عبور جدید خود را وارد کنید</p>
      </div>

      <form onSubmit={handleNewPasswordSubmit}>
        <input
          type="password"
          dir="ltr"
          placeholder="رمز عبور جدید"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-6"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'ذخیره و ورود'}
        </button>
      </form>
    </div>
  );
};