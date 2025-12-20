// components/wallet/IncreaseBalanceModal.tsx
import React, { useState } from "react";
import { X, Check, Loader2 } from 'lucide-react';

interface RechargeOptionData {
  id: number;
  title: string;
  priceTomans: number;
  priceRials: number;
  color: string;
  number :number ;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amountRials: number) => Promise<void>;
  isLoading: boolean;
}

const options: RechargeOptionData[] = [
  { id: 1, title: "شارژ پایه", number  : 5 , priceTomans: 500000, priceRials: 5000000, color: "bg-blue-500" },
  { id: 2, title: "شارژ اقتصادی", number  : 10 , priceTomans: 950000, priceRials: 9500000, color: "bg-indigo-500" },
  { id: 3, title: "شارژ ویژه",  number  : 20 , priceTomans: 1850000, priceRials: 18500000, color: "bg-blue-700" },
];

export const IncreaseBalanceModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [selected, setSelected] = useState<RechargeOptionData | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div dir="rtl" className="bg-white rounded-t-[2.5rem] sm:rounded-3xl p-6 w-full max-w-sm animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">افزایش موجودی</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt)}
              className={`flex items-center justify-between w-full p-4 rounded-2xl border-2 transition-all ${
                selected?.id === opt.id ? "border-blue-600 bg-blue-50" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10  ${opt.color} flex items-center justify-center text-white text-xl font-bold`}>
                  {opt.number}
                </div>
                <span className="font-bold text-gray-700">{opt.title}</span>
              </div>
              <span className="text-lg font-black text-blue-600">{opt.priceTomans.toLocaleString('fa-IR')} <small className="text-[10px] font-normal text-gray-400">تومان</small></span>
            </button>
          ))}
        </div>

        <button
          disabled={!selected || isLoading}
          onClick={() => selected && onConfirm(selected.priceRials)}
          className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:bg-gray-200"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : `پرداخت و شارژ`}
        </button>
      </div>
    </div>
  );
};