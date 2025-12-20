// components/wallet/SmsPackageModal.tsx
import React, { useState } from "react";
import { X, Mail, Loader2, AlertCircle } from 'lucide-react';

interface SmsPackage {
  count: number;
  priceRials: number;
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pkg: SmsPackage) => Promise<void>;
  walletBalanceRials: number;
  isLoading: boolean;
}

const smsPackages: SmsPackage[] = [
  { count: 50, priceRials: 500000, label: "بسته ۵۰ عددی" }

];

export const SmsPackageModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, walletBalanceRials, isLoading }) => {
  const [selected, setSelected] = useState<SmsPackage | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div dir="rtl" className="bg-white rounded-t-[2.5rem] sm:rounded-3xl p-6 w-full max-w-sm animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">خرید بسته پیامک</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          {smsPackages.map((pkg) => {
            const hasEnoughMoney = walletBalanceRials >= pkg.priceRials;
            return (
              <button
                key={pkg.count}
                disabled={!hasEnoughMoney}
                onClick={() => setSelected(pkg)}
                className={`flex items-center justify-between w-full p-4 rounded-2xl border-2 transition-all ${selected?.count === pkg.count ? "border-purple-600 bg-purple-50" : "border-gray-100"
                  } ${!hasEnoughMoney ? "opacity-50 grayscale" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <Mail size={20} />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-700">{pkg.label}</p>
                    {!hasEnoughMoney && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle size={10} /> موجودی ناکافی</p>}
                  </div>
                </div>
                <span className="font-black text-purple-700">{(pkg.priceRials / 10).toLocaleString('fa-IR')} <small className="text-[10px] font-normal text-gray-400">تومان</small></span>
              </button>
            );
          })}

          <span> هزینه 50  پیامگ  :50.000 تومان  </span>
        </div>

        <button
          disabled={!selected || isLoading}
          onClick={() => selected && onConfirm(selected)}
          className="w-full mt-8 py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:bg-gray-200"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : `تایید و کسر از کیف پول`}
        </button>
      </div>
    </div>
  );
};