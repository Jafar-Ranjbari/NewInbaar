 // IncreaseBalanceModal.tsx

import React, { useState } from "react";
import { X, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // وارد کردن Type برای آیکون

// --- ۱. تعریف Interfaces ---

interface GiftIconProps {
    className?: string;
}

interface BalanceIconProps {
    color: string;
    amount: number;
}

interface RechargeOptionData {
    id: number;
    title: string;
    description: string;
    priceTomans: number;
    priceRials: number;
    color: string;
}

interface RechargeOptionProps {
    option: RechargeOptionData;
    isSelected: boolean;
    onSelect: () => void;
}

interface IncreaseBalanceModalProps {
    isVisible: boolean;
    onClose: () => void;
    // تابعی که مبلغ را به ریال دریافت و اجرا می‌کند
    onTopUp: (amountInRials: number) => Promise<void> | void; 
}


// ---------- ICONS ----------
const GiftIcon: React.FC<GiftIconProps> = ({ className }) => (
    <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-white/20 rounded-lg transform -rotate-6"></div>
        <div className="relative w-full h-full bg-white rounded-lg shadow p-2">
            <div className="w-full h-full bg-indigo-50 rounded-md">
                <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <rect x="10" y="30" width="44" height="28" rx="4" fill="#A5B4FC" />
                    <rect x="26" y="30" width="12" height="28" fill="#6366F1" />
                    <path
                        d="M18 18C18 11.3726 23.3726 6 30 6H34C40.6274 6 46 11.3726 46 18V30H18V18Z"
                        fill="#818CF8"
                    />
                    <path
                        d="M32 6C25.3726 6 20 11.3726 20 18V30H44V18C44 11.3726 38.6274 6 32 6Z"
                        fill="#6366F1"
                    />
                </svg>
            </div>
        </div>
    </div>
);

const BalanceIcon: React.FC<BalanceIconProps> = ({ color, amount }) => (
    <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${color} ml-3`}>
        <span className="text-xl font-bold text-white">{(amount / 1000).toLocaleString('fa-IR')}K</span>
    </div>
);


// ---------- DATA (با تعریف صریح نوع) ----------
const rechargeOptions: RechargeOptionData[] = [
    {
        id: 1,
        title: "افزایش موجودی پایه",
        description: "مناسب برای شروع",
        priceTomans: 250000,
        priceRials: 2500000,
        color: "bg-green-500",
    },
    {
        id: 2,
        title: "بسته اقتصادی",
        description: "بهترین انتخاب",
        priceTomans: 450000,
        priceRials: 4500000,
        color: "bg-indigo-500",
    },
    {
        id: 3,
        title: "شارژ ویژه",
        description: "برای رانندگان فعال",
        priceTomans: 850000,
        priceRials: 8500000,
        color: "bg-amber-500",
    },
];

// ---------- COMPONENT: PlanOption برای مودال ----------
const RechargeOption: React.FC<RechargeOptionProps> = ({ option, isSelected, onSelect }) => (
    <button
        onClick={onSelect}
        className={`flex items-center justify-between w-full p-3 mb-3 bg-white border-2 rounded-2xl shadow-sm transition-all duration-300 ${
            isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
        }`}
    >
        <div className="flex items-center">
            <BalanceIcon color={option.color} amount={option.priceTomans} />
            <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">{option.title}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
            </div>
        </div>
        <div className="text-left">
            <p className="text-xs text-gray-500">تومان</p>
            <p className="text-lg font-bold text-indigo-600">
                {option.priceTomans.toLocaleString('fa-IR')}
            </p>
        </div>
    </button>
);

// ---------- COMPONENT: Modal اصلی ----------
const IncreaseBalanceModal: React.FC<IncreaseBalanceModalProps> = ({ isVisible, onClose, onTopUp }) => {
    // استفاده از نوع تعریف شده برای useState
    const [selectedOption, setSelectedOption] = useState<RechargeOptionData | null>(null);
    const [isPaying, setIsPaying] = useState<boolean>(false);
    const [paymentDone, setPaymentDone] = useState<boolean>(false);

    if (!isVisible) return null;

    const handlePaymentSimulation = () => {
        if (!selectedOption) return;

        // --- شروع شبیه سازی پرداخت ---
        setIsPaying(true);

        setTimeout(() => {
            // شبیه سازی موفقیت پرداخت
            setIsPaying(false);
            setPaymentDone(true);

            // فراخوانی تابع اصلی افزایش موجودی در DriverWallet
            onTopUp(selectedOption.priceRials);

            // بعد از 3 ثانیه، مودال بسته شود و حالت‌ها ریست شود
            setTimeout(() => {
                setPaymentDone(false);
                setSelectedOption(null);
                onClose();
            }, 3000);
        }, 2000);
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (e.target === e.currentTarget && !isPaying) onClose();
            }}
        >
            <div 
                dir="rtl" 
                className="bg-gray-50 rounded-t-3xl sm:rounded-2xl p-4 w-full max-w-sm transform transition-all duration-300 shadow-2xl animate-slide-up"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <h2 className="text-lg font-bold text-gray-800">افزایش موجودی کیف پول</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        disabled={isPaying}
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                
                {/* Banner (با استفاده از طرح شما) */}
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white mb-6 shadow-lg">
                    <div className="relative flex items-center justify-between">
                        <div className="w-16 h-16">
                            <GiftIcon className="w-full h-full" />
                        </div>
                        <div className="text-right mr-2">
                            <h2 className="text-sm font-extrabold">هدیه اولین شارژ</h2>
                            <p className="text-xs mt-1">
                                از هر شارژ 10% اعتبار هدیه دریافت کنید!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                    {rechargeOptions.map((option: RechargeOptionData) => (
                        <RechargeOption
                            key={option.id}
                            option={option}
                            isSelected={selectedOption?.id === option.id}
                            onSelect={() => setSelectedOption(option)}
                        />
                    ))}
                </div>

                {/* Info */}
                <ul className="mt-4 space-y-1 text-xs text-gray-600 pr-4">
                    <li className="flex"><span className="text-indigo-500 ml-2 mt-1">•</span><span>مبالغ بر اساس **تومان** است.</span></li>
                    <li className="flex"><span className="text-indigo-500 ml-2 mt-1">•</span><span>پس از پرداخت، موجودی کیف پول شما افزایش می‌یابد.</span></li>
                </ul>

                {/* Footer / Payment Button */}
                <footer className="mt-6">
                    <button
                        onClick={handlePaymentSimulation}
                        disabled={!selectedOption || isPaying}
                        className={`w-full py-3 rounded-xl text-base font-bold transition duration-300 flex items-center justify-center ${
                            selectedOption
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {isPaying ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                در حال اتصال به درگاه...
                            </>
                        ) : paymentDone ? (
                            <>
                                <Check size={20} className="ml-2" />
                                پرداخت موفق
                            </>
                        ) : (
                            `پرداخت ${selectedOption ? selectedOption.priceTomans.toLocaleString('fa-IR') + ' تومان' : ''}`
                        )}
                    </button>
                </footer>

            </div>
        </div>
    );
};

export default IncreaseBalanceModal;