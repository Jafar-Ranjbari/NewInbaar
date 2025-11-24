
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore'; // مسیر استور خود را چک کنید
// import { DriverProfile } from '@/DriverProfile'; // مسیر کامپوننت خود را چک کنید
// import { getDriverByUserId } from '@/services/driverService'; // سرویس دریافت اطلاعات
import { Driver } from '@/app/types';
import { getDriverByUserId } from '../driverService';
import { DriverProfile } from './DriverProfile';

export default function ProfilePage() {
  const { currentUser } = useAuthStore();
  const router = useRouter();
  const [driverData, setDriverData] = useState<Partial<Driver> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // اگر کاربر لاگین نبود، ریدارکت شود
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // دریافت اطلاعات راننده (یا شرکت) بر اساس آی‌دی کاربر
        const data = await getDriverByUserId(currentUser.id);
        setDriverData(data || {}); // اگر دیتایی نبود، آبجکت خالی بفرست
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, router]);

  const handleUpdate = (updatedDriver: Driver) => {
    setDriverData(updatedDriver);
    // می‌توانید اینجا یک Toast یا نوتیفیکیشن نمایش دهید
    console.log('Profile Updated:', updatedDriver);
  };

  if (loading) return <div className="p-8 text-center">در حال دریافت اطلاعات...</div>;
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* دکمه بازگشت به داشبورد */}
        <div className="mb-6">
          <Link 
            href="/auth" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowRight className="ml-2" size={20} />
            بازگشت به داشبورد
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">ویرایش پروفایل</h1>
          
          {/* فراخوانی کامپوننت شما */}
          <DriverProfile 
            driver={driverData || {}} 
            userID={currentUser.id} 
            onUpdate={handleUpdate} 
          />
        </div>
      </div>
    </div>
  );
}