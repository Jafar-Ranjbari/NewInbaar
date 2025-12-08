
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore'; // مسیر استور خود را چک کنید
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
      router.push('/');
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
    <>
      {/* فراخوانی کامپوننت شما */}
      <DriverProfile
        driver={driverData || {}}
        userID={currentUser.id}
        onUpdate={handleUpdate}
      />
    </>

  );
}