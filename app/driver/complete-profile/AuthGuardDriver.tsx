import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
 

export default function AuthGuardDriver({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser, token } = useAuthStore(); // اگر از persist استفاده می‌کنید

  useEffect(() => {
    // اگر توکن نباشد -> هدایت به لاگین
    if (!token) {
      router.replace("/login");
      return;
    }

    // اگر توکن هست ولی پروفایل تکمیل نیست
    if (currentUser && currentUser.isComplete === false) {
      router.replace("/driver/complete-profile");
    }
  }, [token, currentUser, router]);

  // ۱. حالت بارگذاری اولیه (برای جلوگیری از پرش صفحه قبل از لود شدن استور)
  if (token && !currentUser) {
     return <p>Loading...</p>; 
  }

  // ۲. اگر توکن وجود ندارد یا پروفایل ناقص است، چیزی رندر نشود تا ریدایرکت انجام شود
  if (!token || (currentUser && currentUser.isComplete === false)) {
    return null;
  }

  return <>{children}</>;
}