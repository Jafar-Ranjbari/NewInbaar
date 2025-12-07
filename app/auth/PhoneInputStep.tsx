import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { getUserByMobile } from "../services/userService";
import { AuthStep } from "../types";
import { Smartphone, ArrowLeft, Loader2 } from "lucide-react";

export const PhoneInputStep: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const { setStep, setTempMobile, setTempUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 2) return;

    setLoading(true);
    try {
      const user = await getUserByMobile(mobile);
      setTempMobile(mobile);

      if (user) {
        setTempUser(user);
        setStep(AuthStep.LOGIN_PASSWORD);
      } else {
        // setStep(AuthStep.REGISTER);
        setStep(AuthStep.SMS_VERIFICATION); // ⬅️ FIRST SMS
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور. لطفا از اجرای json-server مطمئن شوید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <div className="bg-gray-100 text-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">ورود | ثبت نام</h2>
        <p className="text-gray-500 mt-2">
          برای شروع شماره موبایل خود را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره موبایل
          </label>
          <input
            type="tel"
            dir="ltr"
            placeholder="0912..."
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left placeholder-right"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <span>ادامه</span>
              <ArrowLeft size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
