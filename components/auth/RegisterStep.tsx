import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { createUser } from '../../services/userService';
import { AuthStep, Role } from '../../types';
import { UserPlus, Truck, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { generateMockJwt } from '../../utils/cookie';

export const RegisterStep: React.FC = () => {
  const { setStep, tempMobile, login } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.DRIVER);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await createUser({
        fullName,
        password,
        rolename: role,
        mobile: tempMobile
      });
      
      const token = generateMockJwt({ id: newUser.id, role: newUser.rolename });
      login(newUser, token);
    } catch (error) {
      alert('خطا در ثبت نام');
    } finally {
      setLoading(false);
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

      <div className="text-center mb-6">
        <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">ثبت نام حساب جدید</h2>
        <p className="text-gray-500 mt-1 text-sm">شماره موبایل: {tempMobile}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            onClick={() => setRole(Role.DRIVER)}
            className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${role === Role.DRIVER ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            <Truck size={24} />
            <span className="font-medium">راننده</span>
          </div>
          <div 
            onClick={() => setRole(Role.COMPANY)}
            className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${role === Role.COMPANY ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            <Building2 size={24} />
            <span className="font-medium">شرکت</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رمز عبور
          </label>
          <input
            type="password"
            dir="ltr"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all mt-4 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'ثبت نام و ورود'}
        </button>
      </form>
    </div>
  );
};