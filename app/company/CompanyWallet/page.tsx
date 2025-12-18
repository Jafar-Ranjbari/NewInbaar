 "use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  getCompanyByUserId,
  createCompany,
  getCompanyWalletTransactions,
  createCompanyWalletTransaction,
  getSmsCreditTransactions,
  createSmsCreditTransaction
} from '../companyService';
import { WalletTransaction, SmsCreditTransaction, CompanyType } from '../../types';
import { Wallet, MessageSquare, Loader2, ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiMail, FiPlus } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';

// ---------------- Constants ----------------
// مبالغ پیشنهادی شارژ کیف پول (بر حسب ریال)
const TOP_UP_AMOUNTS = [
    { amount: 250000, label: '۲۵,۰۰۰ تومان' },
    { amount: 400000, label: '۴۰,۰۰۰ تومان' },
    { amount: 800000, label: '۸۰,۰۰۰ تومان' },
];

// بسته‌های پیامک (قیمت بر حسب ریال)
const SMS_PACKAGES = [
    { count: 50, price: 50000, costInToman: 5000, label: 'بسته ۵۰ تایی' },
    { count: 100, price: 90000, costInToman: 9000, label: 'بسته ۱۰۰ تایی' },
    { count: 300, price: 250000, costInToman: 25000, label: 'بسته ۳۰۰ تایی' },
];

// ---------------- Modal Components ----------------

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto p-6 relative">
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

interface TopUpModalProps extends Omit<BaseModalProps, 'title'> {
    onSelectAmount: (amount: number) => Promise<void>;
    isLoading: boolean;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onSelectAmount, isLoading }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="افزایش موجودی کیف پول">
            <p className="text-sm text-gray-600 mb-4">مبلغ مورد نظر برای شارژ کیف پول (به ریال) را انتخاب کنید:</p>
            <div className="grid grid-cols-2 gap-3">
                {TOP_UP_AMOUNTS.map(item => (
                    <button
                        key={item.amount}
                        onClick={() => onSelectAmount(item.amount)}
                        disabled={isLoading}
                        className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            item.label
                        )}
                    </button>
                ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
                <p>تمامی مبالغ پیشنهادی به ریال هستند.</p>
            </div>
        </BaseModal>
    );
};

interface SmsBuyModalProps extends Omit<BaseModalProps, 'title'> {
    onSelectPackage: (pkg: typeof SMS_PACKAGES[0]) => Promise<void>;
    walletBalance: number;
    isLoading: boolean;
}

const SmsBuyModal: React.FC<SmsBuyModalProps> = ({ isOpen, onClose, onSelectPackage, walletBalance, isLoading }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="خرید بسته پیامک">
            <p className="text-sm text-gray-600 mb-4">بسته مورد نظر خود را انتخاب کنید:</p>
            <div className="grid gap-3">
                {SMS_PACKAGES.map(pkg => {
                    const isDisabled = isLoading || walletBalance < pkg.price;
                    return (
                        <button
                            key={pkg.count}
                            onClick={() => onSelectPackage(pkg)}
                            disabled={isDisabled}
                            className={`w-full py-3 rounded-lg font-bold transition-colors flex justify-between items-center px-4 text-right border ${
                                isDisabled
                                    ? 'bg-gray-100 text-gray-400 border-gray-200'
                                    : 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                            }`}
                        >
                            <span>{pkg.label}</span>
                            <span className="flex items-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="animate-spin w-5 h-5 text-purple-700" />
                                ) : (
                                    <>
                                        {pkg.price.toLocaleString('fa-IR')} ریال
                                        {isDisabled && walletBalance < pkg.price && (
                                            <span className="text-xs font-normal bg-red-500 text-white px-2 py-0.5 rounded">
                                                کسر موجودی
                                            </span>
                                        )}
                                    </>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
            <p className="mt-4 text-xs text-gray-500 text-center">
                موجودی کیف پول شما: **{(walletBalance / 10).toLocaleString('fa-IR')} تومان**
            </p>
        </BaseModal>
    );
};

// ---------------- Helper Components ----------------
// ... (BalanceDetailRow, ActionButton, TransactionItem remains the same)
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
  
  // ---------------- Helper Component for Transaction Item ----------------
  interface TransactionItemProps {
    tx: WalletTransaction;
    isWallet: boolean;
  }
  
  const TransactionItem: React.FC<TransactionItemProps> = ({ tx, isWallet }) => {
    // از آنجایی که SmsCreditTransaction نوع متفاوتی دارد، باید تفاوت را در مبلغ اعمال کنیم
    const isPositive = isWallet ? tx.balance_change > 0 : (tx as unknown as SmsCreditTransaction).amount > 0;
  
    const amountValue = isWallet ? tx.balance_change : (tx as unknown as SmsCreditTransaction).amount;
  
    // نمایش مبلغ/تعداد با واحد مناسب
    const amountDisplay = isWallet
      ? `${Math.abs(amountValue).toLocaleString('fa-IR')} ریال`
      : `${Math.abs(amountValue).toLocaleString('fa-IR')} عدد`;
  
    const desc = tx.description || (isPositive ? (isWallet ? 'شارژ' : 'افزایش اعتبار') : (isWallet ? 'کسر موجودی' : 'استفاده از پیامک'));
  
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? <ArrowUpCircle className="w-5 h-5 text-green-600" /> : <ArrowDownCircle className="w-5 h-5 text-red-600" />}
          </div>
          <div>
            <p className="font-medium text-gray-800">{desc}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(tx.timestamp).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>
        <span className={`font-bold dir-ltr ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{amountDisplay}
        </span>
      </div>
    );
  };
  

// ---------------- Main Component ----------------
const CompanyWallet: React.FC = () => {

  const { currentUser } = useAuthStore();

  const [companyID, setCompanyID] = useState<string | undefined>(undefined);
  const [txs, setTxs] = useState<WalletTransaction[]>([]);
  const [smsTxs, setSmsTxs] = useState<SmsCreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isSmsBuyLoading, setIsSmsBuyLoading] = useState(false);

  // حالت های جدید برای مدیریت Modal
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isSmsBuyModalOpen, setIsSmsBuyModalOpen] = useState(false);


  // محاسبات موجودی
  const walletBalance = txs.reduce((a, b) => a + b.balance_change, 0); // موجودی به ریال
  const walletBalanceInTomans = walletBalance / 10;
  // در تراکنش پیامک، از فیلد 'amount' استفاده می‌کنیم
  const smsBalance = smsTxs.reduce((a, b) => a + b.amount, 0);

  // ۱. بارگذاری داده‌های شرکت و تراکنش‌ها (بدون تغییر)
  useEffect(() => {
    const loadData: any = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        let comp = await getCompanyByUserId(currentUser.id);
        if (!comp) {
          comp = await createCompany(currentUser.id, CompanyType.REAL);
        }
        const cID = comp.id;
        setCompanyID(cID);

        // بارگذاری تراکنش‌های کیف پول و پیامک به صورت موازی
        const [walletTxs, smsCreditTxs] = await Promise.all([
          getCompanyWalletTransactions(cID),
          getSmsCreditTransactions(currentUser.id)
        ]);

        setTxs(walletTxs);
        setSmsTxs(smsCreditTxs);

      } catch (e) {
        console.error("خطا در بارگذاری کیف پول:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  // ۲. مدیریت شارژ کیف پول (با دریافت مبلغ از Modal) - تغییر یافته
  const handleTopUp = async (amount: number) => {
    if (!companyID) return;
    setIsTopUpLoading(true);
    setIsTopUpModalOpen(false); // بستن Modal

    try {
      const t = await createCompanyWalletTransaction(companyID, amount, `شارژ ${amount.toLocaleString('fa-IR')} ریالی`);
      setTxs(prevTxs => [...prevTxs, t]);
      alert(`کیف پول با موفقیت شارژ شد: ${amount.toLocaleString('fa-IR')} ریال`);
    } catch (e) {
      alert('خطا در شارژ کیف پول');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  // ۳. مدیریت خرید بسته پیامک (با دریافت شیء بسته از Modal) - تغییر یافته
  const handleBuySmsPackage = async (smsPackage: typeof SMS_PACKAGES[0]) => {
    if (!currentUser || !companyID) return;
    setIsSmsBuyLoading(true);
    setIsSmsBuyModalOpen(false); // بستن Modal

    const { count: smsCount, price, costInToman, label } = smsPackage;

    try {
      if (walletBalance < price) {
        alert('موجودی کیف پول کافی نیست.');
        return;
      }

      // ۱. کسر از کیف پول (تراکنش منفی)
      const walletTx = await createCompanyWalletTransaction(companyID, -price, `خرید ${label}`);
      setTxs(prevTxs => [...prevTxs, walletTx]);

      // ۲. افزودن اعتبار پیامک
      const smsTx = await createSmsCreditTransaction(currentUser.id, smsCount, costInToman, `خرید ${label}`);
      setSmsTxs(prevSmsTxs => [...prevSmsTxs, smsTx]);

      alert(`${label} با موفقیت خریداری شد. ${price.toLocaleString('fa-IR')} ریال از کیف پول کسر گردید.`);
    } catch (e) {
      alert('خطا در خرید بسته پیامک');
    } finally {
      setIsSmsBuyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 p-6">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        <p className="mr-2 text-gray-600">در حال بارگذاری اطلاعات کیف پول...</p>
      </div>
    );
  }

  if (!currentUser || !companyID) {
    return <div className="p-6 text-center text-red-500">مشکلی در شناسایی شرکت وجود دارد.</div>;
  }

  // --- UI Rendering ---

  return (
    <PageLayout title="کیف پول">

        {/* ---------------- Modals ---------------- */}
        <TopUpModal
            isOpen={isTopUpModalOpen}
            onClose={() => setIsTopUpModalOpen(false)}
            onSelectAmount={handleTopUp}
            isLoading={isTopUpLoading}
        />

        <SmsBuyModal
            isOpen={isSmsBuyModalOpen}
            onClose={() => setIsSmsBuyModalOpen(false)}
            onSelectPackage={handleBuySmsPackage}
            walletBalance={walletBalance}
            isLoading={isSmsBuyLoading}
        />
        {/* ---------------- End Modals ---------------- */}

      {/* کارت کیف پول */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
        <div className="relative z-10">

          {/* موجودی کل */}
          <div className="flex flex-col items-center text-white mb-6">
            <p className="text-sm opacity-80">موجودی کیف پول</p>
            <div className="flex items-baseline mt-2">
              <span className="text-5xl font-bold tracking-wider">  {walletBalanceInTomans.toLocaleString('fa-IR')} </span>
              <span className="text-base font-semibold mr-2">تومان</span>
            </div>
          </div>

          {/* جزئیات موجودی‌ها */}
          <BalanceDetailRow
            icon={<TbTruckDelivery size={24} />}
            label="موجودی کیف پول شارژ سفارش"
            amount={walletBalance} // مقدار عددی به BalanceDetailRow ارسال می‌شود
            actionHandler={() => setIsTopUpModalOpen(true)} // <-- باز کردن مودال شارژ
          />

          <BalanceDetailRow
            icon={<FiMail size={24} />}
            label="اعتبار پیامک (عدد)"
            amount={`${smsBalance.toLocaleString('fa-IR')}  عدد`}
            actionHandler={() => setIsSmsBuyModalOpen(true)} // <-- باز کردن مودال پیامک
          />

        </div>
      </div>

      {/* دکمه‌های اقدام */}
      <div className="my-8 flex justify-around items-start">
        <ActionButton
          icon={<FiMail size={28} />}
          label="شارژ پیامک"
          onClick={() => setIsSmsBuyModalOpen(true)} // <-- باز کردن مودال پیامک

          disabled={loading}
        />
        <ActionButton
          icon={<FiPlus size={32} />}
          label="افزایش موجودی"
          onClick={() => setIsTopUpModalOpen(true)} // <-- باز کردن مودال شارژ
          disabled={loading}
        />
        <ActionButton
          icon={<IoStatsChart size={28} />}
          label="گزارش مالی"
          onClick={() => (true)}
        />

      </div>

      {/* سوابق تراکنش */}
      <div dir="rtl" className="max-w-md mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">

        <div className="grid gap-6">

          {/* 1. Wallet Top-Up Button - حذف شده و جایگزین شده با مودال */}
          {/* 2. SMS Buy Button - حذف شده و جایگزین شده با مودال */}
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            disabled={isTopUpLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isTopUpLoading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            {isTopUpLoading ? 'در حال شارژ...' : 'شارژ کیف پول'}
          </button>
          <button
            onClick={() => setIsSmsBuyModalOpen(true)}
            disabled={isSmsBuyLoading}
            className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSmsBuyLoading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            {isSmsBuyLoading ? 'در حال خرید...' : 'خرید بسته پیامک'}
          </button>


          {/* 3. Transactions List */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              تراکنش‌های اخیر
            </h4>
            <div className="space-y-3">
              {txs.length === 0 && smsTxs.length === 0 && (
                <p className="text-center text-gray-500 p-4">هنوز تراکنشی ثبت نشده است.</p>
              )}

              {/* نمایش تراکنش‌های مالی */}
              {txs.length > 0 && (
                <>
                  <h5 className="font-semibold text-gray-600 mt-4 mb-2">تراکنش‌های مالی</h5>
                  {/* نمایش جدیدترین‌ها در ابتدا */}
                  {txs.slice().reverse().map(t => (
                    <TransactionItem key={`w-${t.id}`} tx={t} isWallet={true} />
                  ))}
                </>
              )}

              {/* نمایش تراکنش‌های پیامک */}
              {smsTxs.length > 0 && (
                <>
                  <h5 className="font-semibold text-gray-600 mt-6 mb-2">تراکنش‌های پیامکی</h5>
                  {/* نمایش جدیدترین‌ها در ابتدا */}
                  {smsTxs.slice().reverse().map(t => (
                    <TransactionItem
                      key={`s-${t.id}`}
                      // تبدیل ساختار برای نمایش در TransactionItem
                      tx={{
                        ...t,
                        ownerID: t.userID,
                        balance_change: t.amount,
                        orders_change: 0
                      } as WalletTransaction}
                      isWallet={false}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
 
    </PageLayout>


  );
};

export default CompanyWallet;