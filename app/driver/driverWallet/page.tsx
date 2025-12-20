"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { getDriverWalletTransactions, createDriverWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction, applyInitialGift } from './../driverService';
import { useDriverDashboardData } from '../useDriverDashboardData';
import { useAuthStore } from '@/app/store/useAuthStore';
import { FiMail, FiPlus } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';

// Components
import PageLayout from '@/app/components/PageLayout';
import IncreaseBalanceModal from './IncreaseBalanceModal';
import SmsRechargeModal from './SmsRechargeModal';
import ReportFinanacrdriver from '../financeReporttDriver/ReportFinanacrdriver';
import WalletBalanceCard from './WalletBalanceCard';
import { TransactionItem } from './TransactionItem';
import { WalletTransaction, SmsCreditTransaction } from '../../types';

const DriverWallet: React.FC = () => {
  const { driver } = useDriverDashboardData();
  const { currentUser } = useAuthStore();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals State
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showSmsRechargeModal, setShowSmsRechargeModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const driverID = driver.id;
  const userID = currentUser?.id;

  console.log("driver  id" ,  driverID) ;
//   if (!driverID) {
//   // console.error("خطا: شناسه راننده یافت نشد");
//   return;
// }
  // ۱. واکشی داده‌ها و هدیه اولیه
  const fetchData = useCallback(async () => {
    if (!driverID && !userID) return;
    setLoading(true);
    try {
      if (driverID) await applyInitialGift(driverID);
      const [walletTx, smsTx] = await Promise.all([
        driverID ? getDriverWalletTransactions(driverID) : [],
        userID ? getSmsCreditTransactions(userID) : []
      ]);
      setTransactions(walletTx);
      setSmsTransactions(smsTx);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  }, [driverID, userID]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ۲. محاسبات موجودی
  const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
  const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  // ۳. عملیات‌ها
  const handleTopUp = async (amountInRials: number) => {
    if (!driverID) return;
    const tx = await createDriverWalletTransaction(driverID, amountInRials, 'افزایش اعتبار');
    setTransactions(prev => [...prev, tx]);
  };

  const handleBuySms = async () => {
    const costInRials = 300000; // ۳۰ هزار تومان
    if (walletBalance < costInRials) {
      alert(`موجودی کافی نیست. هزینه: ${costInRials / 10} تومان`);
      throw new Error('Low Balance');
    }
    const wTx = await createDriverWalletTransaction(driverID, -costInRials, 'خرید بسته پیامک');
    const sTx = await createSmsCreditTransaction(userID!, 50, costInRials, 'خرید بسته افزایشی');
    setTransactions(prev => [...prev, wTx]);
    setSmsTransactions(prev => [...prev, sTx]);
  };

  if (!driverID) return <div className="p-10 text-center">لطفاً ابتدا پروفایل خود را تکمیل کنید.</div>;

  return (
    <PageLayout title="کیف پول">
      {/* کارت موجودی (کامپوننت جدا شده) */}
      <WalletBalanceCard
        walletBalance={walletBalance}
        smsBalance={smsBalance}
        onWalletClick={() => setShowRechargeModal(true)}
        onSmsClick={() => setShowSmsRechargeModal(true)}
      />

      {/* دکمه‌های عملیاتی */}
      <div className="my-8 flex justify-around items-start text-center">
        <QuickAction icon={<FiMail size={26} />} label="شارژ پیامک" onClick={() => setShowSmsRechargeModal(true)} />
        <QuickAction icon={<FiPlus size={30} />} label="افزایش موجودی" onClick={() => setShowRechargeModal(true)} />
        <QuickAction icon={<IoStatsChart size={26} />} label="گزارش مالی" onClick={() => setShowReportModal(true)} />
      </div>

      {/* لیست تراکنش‌ها */}
      <div className="mt-8 px-2">
        <h2 className="font-bold text-lg mb-4 text-gray-800">سوابق تراکنش</h2>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {loading ? <p className="text-center text-sm">در حال بروزرسانی...</p> :
            transactions.length > 0 ?
              transactions.slice().reverse().map(tx => <TransactionItem key={tx.id} tx={tx} />) :
              <p className="text-center text-gray-400 text-sm">تراکنشی یافت نشد.</p>
          }
        </div>
      </div>

      {/* مودال‌ها */}
      <IncreaseBalanceModal isVisible={showRechargeModal} onClose={() => setShowRechargeModal(false)} onTopUp={handleTopUp} />
      <SmsRechargeModal isVisible={showSmsRechargeModal} onClose={() => setShowSmsRechargeModal(false)} onBuySms={handleBuySms} />
      <ReportFinanacrdriver isVisible={showReportModal} onClose={() => setShowReportModal(false)} />
    </PageLayout>
  );
};

// کامپوننت کوچک کمکی برای دکمه‌ها
const QuickAction = ({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <div className="flex flex-col items-center">
    <button onClick={onClick} className="bg-gray-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg active:scale-95 transition-transform">
      {icon}
    </button>
    <span className="text-[11px] font-bold text-gray-600">{label}</span>
  </div>
);

export default DriverWallet;