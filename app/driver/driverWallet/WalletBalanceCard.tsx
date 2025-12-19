import React from 'react';
import { FiMail, FiPlus } from 'react-icons/fi';
import { TbTruckDelivery } from 'react-icons/tb';

interface Props {
  walletBalance: number;
  smsBalance: number;
  onWalletClick: () => void;
  onSmsClick: () => void;
}

const WalletBalanceCard: React.FC<Props> = ({ walletBalance, smsBalance, onWalletClick, onSmsClick }) => {
  const walletInTomans = walletBalance / 10;

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center text-white mb-6">
          <p className="text-sm opacity-80">موجودی کیف پول</p>
          <div className="flex items-baseline mt-2">
            <span className="text-5xl font-bold tracking-wider">{walletInTomans.toLocaleString('fa-IR')}</span>
            <span className="text-base font-semibold mr-2">تومان</span>
          </div>
        </div>

        {/* موجودی سفارش */}
        <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
          <div className="flex items-center text-white">
            <TbTruckDelivery size={24} />
            <div className="mr-4">
              <p className="text-xs font-semibold">موجودی شارژ سفارش</p>
              <p className="text-sm font-bold mt-1">{walletInTomans.toLocaleString('fa-IR')} تومان</p>
            </div>
          </div>
          <button onClick={onWalletClick} className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md"><FiPlus /></button>
        </div>

        {/* موجودی پیامک */}
        <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl">
          <div className="flex items-center text-white">
            <FiMail size={24} />
            <div className="mr-4">
              <p className="text-xs font-semibold">اعتبار پیامک</p>
              <p className="text-sm font-bold mt-1">{smsBalance} عدد</p>
            </div>
          </div>
          <button onClick={onSmsClick} className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md"><FiPlus /></button>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;