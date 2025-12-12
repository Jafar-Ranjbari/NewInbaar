
"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { WalletTransaction, SmsCreditTransaction } from '../../types';
import { getDriverWalletTransactions, createDriverWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction, applyInitialGift } from './../driverService';
import { Wallet, MessageSquare, Link } from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData';
import { useAuthStore } from '@/app/store/useAuthStore';

// آیکون‌های مورد نیاز
import { FiMail, FiPlus } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import IncreaseBalanceModal from './IncreaseBalanceModal'; // کامپوننت موجود
import SmsRechargeModal from './SmsRechargeModal';
import ReportFinanacrdriver from '../financeReporttDriver/ReportFinanacrdriver';
import PageLayout from '@/app/components/PageLayout';

const BalanceDetailRow = ({ icon, label, amount, actionHandler }: { icon: React.ReactNode, label: string, amount: number | string, actionHandler: () => void }) => (
  <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
    <div className="flex items-center text-white">
      {icon}
      <div className="mr-4">
        <p className="text-xs font-semibold">{label}</p>
        {typeof amount === 'number' && (
          <p className="text-sm font-bold mt-1">{(amount / 10).toLocaleString('fa-IR')} <span className="text-xs">تومان</span></p>
        )}
        {typeof amount === 'string' && (
          <p className="text-sm font-bold mt-1">{amount}</p>
        )}
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

const ActionButton = ({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }) => (
  <div className="flex flex-col items-center space-y-2">
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-black text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors disabled:opacity-50"
    >
      {icon}
    </button>
    <p className="text-xs font-semibold text-gray-700">{label}</p>
  </div>
);

const TransactionItem = ({ tx }: { tx: WalletTransaction }) => {
  const isCredit = tx.balance_change > 0;
  const date = new Date(tx.timestamp).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  const amountInTomans = Math.abs(tx.balance_change / 10).toLocaleString('fa-IR');

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center">
        <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center ml-4">
          {isCredit ? <FiPlus className="text-gray-500 w-6 h-6" /> : <MessageSquare className="text-red-500 w-6 h-6" />}
        </div>
        <div>
          <p className="font-bold text-gray-800">{tx.description}</p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>
      <p className={`font-bold text-base tracking-wider ${isCredit ? 'text-gray-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'} {amountInTomans} <span className="text-sm text-gray-600">تومان</span>
      </p>
    </div>
  );
};

// ********** درج کد SmsRechargeModal در اینجا برای کامپایل کامل **********
// (کد SmsRechargeModal که در بخش ۱ ارائه شد، در این مکان قرار می‌گیرد.)
// ... (SmsRechargeModal Code) ...

// -------------------------------------------------------------------------------------
// کامپوننت اصلی DriverWallet
// -------------------------------------------------------------------------------------

const DriverWallet: React.FC = () => {
  const { driver } = useDriverDashboardData();
  const { currentUser } = useAuthStore();
  const driverID = driver.id;
  const userID = currentUser?.id;

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showSmsRechargeModal, setShowSmsRechargeModal] = useState(false); // <--- حالت جدید برای مودال پیامک
  const [showreportFinacaeModal, setshowreportFinacaeModal] = useState(false); // <--- حالت جدید برای مودال پیامک
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const walletPromise = driverID ? getDriverWalletTransactions(driverID) : Promise.resolve([]);
      const smsPromise = userID ? getSmsCreditTransactions(userID) : Promise.resolve([]);

      const [walletTx, smsTx] = await Promise.all([walletPromise, smsPromise]);
      setTransactions(walletTx);
      setSmsTransactions(smsTx);
      setLoading(false);
    };

    if (driverID || userID) {
      fetchTransactions();
    }
  }, [driverID, userID]);

  const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
  const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const walletBalanceInTomans = walletBalance / 10;

  const handleTopUp = async (amountInRials: number) => {
    if (!driverID) return;
    try {
      const tx = await createDriverWalletTransaction(driverID, amountInRials, 'افزایش اعتبار');
      setTransactions(prev => [...prev, tx]);
    } catch (e) { alert('خطا در شارژ کیف پول'); }
    finally {
    }
  };

  const handleBuySms = useCallback(async () => {
    // <--- منطق قیمت جدید: ۳۰,۰۰۰ تومان = ۳۰۰,۰۰۰ ریال
    const costInRials = 300000;
    const smsCount = 50;
    const smsDescription = 'خرید بسته افزایشی';
    const walletDescription = 'خرید بسته پیامک';

    if (!driverID || !userID) {
      alert('اطلاعات راننده یا کاربر ناقص است.');
      throw new Error('Missing ID');
    }
    if (walletBalance < costInRials) {
      alert(`موجودی کیف پول کافی نیست. هزینه خرید ${smsCount} پیامک ${costInRials / 10} تومان است. لطفا ابتدا کیف پول را شارژ کنید.`);
      throw new Error('Insufficient balance');
    }

    try {
      // تراکنش کسر از کیف پول راننده
      const wTx = await createDriverWalletTransaction(driverID, -costInRials, walletDescription);
      setTransactions(prev => [...prev, wTx]);

      // تراکنش افزایش اعتبار پیامکی کاربر (راننده)
      const sTx = await createSmsCreditTransaction(userID, smsCount, costInRials, smsDescription);
      setSmsTransactions(prev => [...prev, sTx]);

      // توجه: پیام موفقیت توسط مودال نمایش داده می‌شود
      // alert('خرید بسته پیامک با موفقیت انجام شد'); 
    } catch (e) {
      alert('خطا در انجام عملیات خرید پیامک.');
      throw e; // برای اینکه مودال متوجه شکست شود
    }
  }, [driverID, userID, walletBalance]);

 //  هدیه  اولین  شارژ پرداختی  

useEffect(() => {
  const fetchTransactions = async () => {
    setLoading(true);

    if (driverID) {
      // --- ۱. اعمال هدیه اولیه در صورت نیاز ---
      try {
        const giftTx = await applyInitialGift(driverID);
        if (giftTx) {
          console.log('هدیه اولیه با موفقیت اعمال شد:', giftTx);
          // اگر هدیه‌ای اعمال شد، آن را به لیست تراکنش‌ها اضافه می‌کنیم (برای نمایش فوری)
        }
      } catch (error) {
        console.error('خطا در اعمال هدیه اولیه:', error);
      }
    }

    // --- ۲. بارگذاری مجدد تراکنش‌ها (یا ادامه با لیست جدید) ---
    const walletPromise = driverID ? getDriverWalletTransactions(driverID) : Promise.resolve([]);
    const smsPromise = userID ? getSmsCreditTransactions(userID) : Promise.resolve([]);

    const [walletTx, smsTx] = await Promise.all([walletPromise, smsPromise]);

    // اگر هدیه اعمال شده باشد، در این خط در لیست walletTx دیده خواهد شد
    setTransactions(walletTx); 
    setSmsTransactions(smsTx);
    setLoading(false);
  };

  if (driverID || userID) {
    fetchTransactions();
  }
}, [driverID, userID]); // دیپندنس‌ها تغییری نکرده‌اند
 

  if (!driverID) return <div className="p-4 text-center">پروفایل را تکمیل کنید.</div>;
  if (loading && transactions.length === 0) return <div className="p-4 text-center">در حال بارگذاری...</div>;

  return (
    <PageLayout title="کیف پول">
      {/* کارت کیف پول */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
        <div className="relative z-10">

          {/* موجودی کل */}
          <div className="flex flex-col items-center text-white mb-6">
            <p className="text-sm opacity-80">موجودی کیف پول</p>
            <div className="flex items-baseline mt-2">
              <span className="text-5xl font-bold tracking-wider">{walletBalanceInTomans.toLocaleString('fa-IR')}</span>
              <span className="text-base font-semibold mr-2">تومان</span>
            </div>
          </div>

          {/* جزئیات موجودی‌ها */}
          <BalanceDetailRow
            icon={<TbTruckDelivery size={24} />}
            label="موجودی کیف پول شارژ سفارش"
            amount={walletBalance}
            actionHandler={() => setShowRechargeModal(true)}
          />

          <BalanceDetailRow
            icon={<FiMail size={24} />}
            label="اعتبار پیامک (عدد)"
            amount={`${smsBalance} عدد`}
            actionHandler={() => setShowSmsRechargeModal(true)} // <--- باز کردن مودال پیامک
          />

        </div>
      </div>

      {/* دکمه‌های اقدام */}
      <div className="my-8 flex justify-around items-start">
        <ActionButton
          icon={<FiMail size={28} />}
          label="شارژ پیامک"
          onClick={() => setShowSmsRechargeModal(true)} // <--- باز کردن مودال پیامک
          disabled={loading}
        />
        <ActionButton
          icon={<FiPlus size={32} />}
          label="افزایش موجودی"
          onClick={() => setShowRechargeModal(true)}
          disabled={loading}
        />
        <ActionButton
          icon={<IoStatsChart size={28} />}
          label="گزارش مالی"
          onClick={() => setshowreportFinacaeModal(true)}
        />

      </div>

      {/* سوابق تراکنش */}
      <div className="mt-8 px-2">
        <h2 className="font-bold text-lg text-gray-800 mb-4">سوابق تراکنش</h2>
        <div className="space-y-2">
          {transactions.length > 0 ? (
            transactions.slice().reverse().map(tx => (
              <TransactionItem key={tx.id} tx={tx} />
            ))
          ) : (
            <p className="text-center text-gray-500">تراکنشی یافت نشد.</p>
          )}
        </div>
      </div>

      {/* کامپوننت مودال افزایش موجودی (Wallet) */}
      <IncreaseBalanceModal
        isVisible={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onTopUp={handleTopUp}
      />

      {/* کامپوننت مودال شارژ پیامک (SMS) */}
      <SmsRechargeModal
        isVisible={showSmsRechargeModal}
        onClose={() => setShowSmsRechargeModal(false)}
        onBuySms={handleBuySms} // اتصال به تابع جدید خرید پیامک
      />

      {/*  کامپوننت  گزارش  فروش  .... */}
      <ReportFinanacrdriver
        isVisible={showreportFinacaeModal}
        onClose={() => setshowreportFinacaeModal(false)}
      />
    </PageLayout>
  );
};


export default DriverWallet;