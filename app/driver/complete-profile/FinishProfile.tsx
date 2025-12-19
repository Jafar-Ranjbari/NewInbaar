 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateUserIsComplete } from "@/app/services/userService";
import { useAuthStore } from "@/app/store/useAuthStore";

const FinishProfile = () => {
  const router = useRouter();

  const { currentUser, logout } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    if (!currentUser) {
      setError("کاربر یافت نشد");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1️⃣ تکمیل پروفایل در بک‌اند
      await updateUserIsComplete(currentUser.id, true);

      // 2️⃣ خروج کامل (پاک شدن توکن + state)
      logout();

      // 3️⃣ انتقال امن به صفحه لاگین
      router.replace("/auth");

    } catch (err) {
      setError("خطا در تکمیل اطلاعات، دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="font-bold text-lg">🎉 تکمیل ثبت‌نام</h2>

      <p className="text-sm text-gray-600">
        اطلاعات شما با موفقیت ثبت شد و حساب شما فعال گردید
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={finish}
        disabled={loading}
        className={`btn-primary w-full ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "در حال انتقال..." : "ورود مجدد"}
      </button>
    </div>
  );
};

export default FinishProfile;
