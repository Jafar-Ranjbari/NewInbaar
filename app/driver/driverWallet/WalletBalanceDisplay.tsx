import React from 'react';
import { FiMail, FiPlus } from 'react-icons/fi';
import { TbTruckDelivery } from 'react-icons/tb';

interface WalletBalanceDisplayProps {
  walletBalance: number;
  smsBalance: number;
  onRechargeWallet: () => void;
  onRechargeSms: () => void;
}

// کامپوننت داخلی برای ردیف‌های جزئیات
const BalanceDetailRow = ({ 
  icon, label, amount, isCurrency, actionHandler 
}: { 
  icon: React.ReactNode, label: string, amount: number | string, isCurrency?: boolean, actionHandler: () => void 
}) => (
  <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
    <div className="flex items-center text-white">
      {icon}
      <div className="mr-4">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-sm font-bold mt-1">
          {isCurrency 
            ? `${(Number(amount) / 10).toLocaleString('fa-IR')} تومان` 
            : `${amount} عدد`
          }
        </p>
      </div>
    </div>
    <button
      onClick={actionHandler}
      className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
    >
      <FiPlus className="w-5 h-5" />
    </button>
  </div>
);

const WalletBalanceDisplay: React.FC<WalletBalanceDisplayProps> = ({
  walletBalance,
  smsBalance,
  onRechargeWallet,
  onRechargeSms
}) => {
  const walletBalanceInTomans = walletBalance / 10;

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
      {/* دکوراسیون پس‌زمینه */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
      
      <div className="relative z-10">
        {/* نمایش موجودی کل */}
        <div className="flex flex-col items-center text-white mb-6">
          <p className="text-sm opacity-80">موجودی کیف پول</p>
          <div className="flex items-baseline mt-2">
            <span className="text-5xl font-bold tracking-wider">
              {walletBalanceInTomans.toLocaleString('fa-IR')}
            </span>
            <span className="text-base font-semibold mr-2">تومان</span>
          </div>
        </div>

        {/* جزئیات */}
        <BalanceDetailRow
          icon={<TbTruckDelivery size={24} />}
          label="موجودی کیف پول شارژ سفارش"
          amount={walletBalance}
          isCurrency
          actionHandler={onRechargeWallet}
        />

        <BalanceDetailRow
          icon={<FiMail size={24} />}
          label="اعتبار پیامک"
          amount={smsBalance}
          actionHandler={onRechargeSms}
        />
      </div>
    </div>
  );
};

export default WalletBalanceDisplay;