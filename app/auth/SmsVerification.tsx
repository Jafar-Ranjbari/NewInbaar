 // SmsVerification.tsx
import React, { useState, useRef } from "react";
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
  const [code, setCode] = useState(Array(5).fill("")); // 5 رقم
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    if (value && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }

    // اگر ۵ رقم کامل شد
    if (updated.join("").length === 5) {
      if (updated.join("") === SMS_MOCK_CODE) onSuccess();
      else alert("کد اشتباه است (کد تستی: 12345)");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
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
        <div className="bg-gray-100 text-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={32} />
        </div>
        <p className="text-gray-500 mt-2 text-sm">
          کد ارسال شده به شماره {mobile} را وارد کنید
          <br />
          <span className="text-xs text-gray-400">(کد تستی: 12345)</span>
        </p>
      </div>

      {/* --- 5 DIGIT CODE INPUTS --- */}
      <div className="flex justify-between  mb-6" dir="ltr"> {/* gap-1 فاصله کم */}
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputsRef.current[index] = el; // بدون return
            }}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        ))}
      </div>

      <button
        onClick={() => {
          const full = code.join("");
          if (full === SMS_MOCK_CODE) onSuccess();
          else alert("کد اشتباه است (کد تستی: 12345)");
        }}
        className="w-full bg-black hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
      >
        تایید کد
      </button>
    </div>
  );
};
