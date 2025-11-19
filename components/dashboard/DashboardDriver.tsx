import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, UserCircle, Truck } from 'lucide-react';

export const DashboardDriver: React.FC = () => {
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Truck size={24} />
            </div>
            <h1 className="text-lg font-bold text-gray-800">
              پنل رانندگان
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{currentUser.fullName}</p>
              <p className="text-xs text-gray-500">{currentUser.mobile}</p>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-4 mb-6">
             <UserCircle size={48} className="text-gray-300" />
             <div>
                <h2 className="text-2xl font-bold text-gray-800">خوش آمدید، {currentUser.fullName}</h2>
                <p className="text-gray-500">شما با نقش <span className="font-bold text-green-600">راننده</span> وارد شده‌اید.</p>
             </div>
          </div>

          <div className="p-6 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
            <h3 className="text-lg font-bold text-green-800 mb-2">فرم مخصوص رانندگان</h3>
            <p className="text-green-700 mb-4">در این بخش رانندگان می‌توانند بارهای جدید را مشاهده کنند و وضعیت سفر خود را تغییر دهند.</p>
            <div className="space-y-3">
                <div className="h-12 bg-green-200/50 rounded w-full animate-pulse"></div>
                <div className="h-12 bg-green-200/50 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};