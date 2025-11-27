import React from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiMail, FiPlus } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';
import Link from "next/link";

// Helper function to format numbers with Persian numerals and commas
const formatNumber = (num:any) => {
  return num.toLocaleString('fa-IR');
};

const Header = () => (
  <header className="bg-black text-white text-center py-4 sticky top-0 z-10">
    <h1 className="text-lg font-bold">کیف پول</h1>
  </header>
);

const WalletBalance = () => (
  <div className="flex flex-col items-center text-white mb-6">
    <p className="text-sm opacity-80">موجودی کیف پول</p>
    <div className="flex items-baseline mt-2">
      <span className="text-5xl font-bold tracking-wider">{formatNumber(300000)}</span>
      <span className="text-base font-semibold mr-2">تومان</span>
    </div>
  </div>
);

const BalanceDetailRow = ({ icon, label, amount }:any) => (
  <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
    <div className="flex items-center text-white">
      {icon}
      <div className="mr-4">
        <p className="text-xs font-semibold">{label}</p>
        {typeof amount === 'number' && (
          <p className="text-sm font-bold mt-1">{formatNumber(amount)} <span className="text-xs">تومان</span></p>
        )}
        {typeof amount === 'string' && (
          <p className="text-sm font-bold mt-1">{amount}</p>
        )}
      </div>
    </div>
    <button className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md">
      <FiPlus className="w-5 h-5" />
    </button>
  </div>
);

const WalletCard = () => (
  <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
    <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
    <div className="relative z-10">
      <WalletBalance />
      <BalanceDetailRow icon={<TbTruckDelivery size={24} />} label="موجودی کیف پول شارژ سفارش" amount={300000} />
      <BalanceDetailRow icon={<FiMail size={24} />} label="موجودی کیف پول پیامکی" amount="-" />
    </div>
  </div>
);

const ActionButton = ({ icon, label }:any) => (
  <div className="flex flex-col items-center space-y-2">
    <button className="bg-black text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
      {icon}
    </button>
    <p className="text-xs font-semibold text-gray-700">{label}</p>
  </div>
);

const ActionButtons = () => (
  <div className="my-8 flex justify-around items-start">
    <Link href="/driver/smsCharge">
      <ActionButton icon={<FiMail size={28} />} label="شارژ پیامک" />
    </Link>

    <Link href="/driver/increaseBalance">
      <ActionButton icon={<FiPlus size={32} />} label="افزایش موجودی" />
    </Link>

    <Link href="/driver/financeReport">
      <ActionButton icon={<IoStatsChart size={28} />} label="گزارش مالی" />
    </Link>
  </div>
);

const TransactionItem = () => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center">
      <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center ml-4">
        <FiPlus className="text-gray-500 w-6 h-6" />
      </div>
      <div>
        <p className="font-bold text-gray-800">افزایش موجودی</p>
        <p className="text-xs text-gray-500 mt-1">سه شنبه - ۶ آبان ۱۴۰۴</p>
      </div>
    </div>
    <p className="font-bold text-base text-gray-800 tracking-wider">
      {formatNumber(250000)} <span className="text-sm text-gray-600">تومان</span>
    </p>
  </div>
);


const TransactionHistory = () => (
  <div className="mt-8 px-2">
    <h2 className="font-bold text-lg text-gray-800 mb-2">سوابق تراکنش</h2>
    <TransactionItem />
  </div>
);


const wallet = () => {
  return (
    <div dir="rtl" className="bg-white min-h-screen font-[sans-serif] text-gray-900 w-full max-w-md mx-auto">
      <Header />
      <main className="p-4 pb-20">
        <WalletCard />
        <ActionButtons />
        <TransactionHistory />
      </main>
    </div>
  );
};

export default wallet;
