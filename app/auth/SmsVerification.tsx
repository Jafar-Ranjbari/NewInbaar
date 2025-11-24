 // SmsVerification.tsx
import React, { useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { SMS_MOCK_CODE } from "@/app/constants";

interface SmsVerificationProps {
  mobile?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const SmsVerification: React.FC<SmsVerificationProps> = ({
  mobile,
  onBack,
  onSuccess,
}) => {
  const [smsCode, setSmsCode] = useState("");

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (smsCode === SMS_MOCK_CODE) {
      onSuccess();
    } else {
      alert("کد وارد شده صحیح نمی‌باشد (کد آزمایشی: 1234)");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <button
        onClick={onBack}
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
          کد ارسال شده به شماره {mobile} را وارد کنید
          <br />
          <span className="text-xs text-gray-400">(کد تستی: 1234)</span>
        </p>
      </div>

      <form onSubmit={handleSmsSubmit}>
        <input
          type="text"
          dir="ltr"
          placeholder="1234"
          className="w-full text-center text-black text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-6"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all"
        >
          تایید کد
        </button>
      </form>
    </div>
  );
};
