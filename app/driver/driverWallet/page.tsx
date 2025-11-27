
// "use client"
// import React, { useEffect, useState } from 'react';
// import { WalletTransaction, SmsCreditTransaction } from '../../types';
// import { getDriverWalletTransactions, createDriverWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction } from './../driverService';
// import { Wallet, MessageSquare } from 'lucide-react';
// import { useDriverDashboardData } from '../useDriverDashboardData';
// import { useAuthStore } from '@/app/store/useAuthStore';
// // آیکون‌های جدید مورد نیاز برای طراحی جدید
// import { FiMail, FiPlus } from 'react-icons/fi';
// import { IoStatsChart } from 'react-icons/io5';
// import { TbTruckDelivery } from 'react-icons/tb';

// // --- کامپوننت های کمکی UI ---

// const BalanceDetailRow = ({ icon, label, amount, actionHandler }: { icon: React.ReactNode, label: string, amount: number | string, actionHandler: () => void }) => (
//   <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
//     <div className="flex items-center text-white">
//       {icon}
//       <div className="mr-4">
//         <p className="text-xs font-semibold">{label}</p>
//         {typeof amount === 'number' && (
//           // تبدیل ریال به تومان برای نمایش (تقسیم بر ۱۰)
//           <p className="text-sm font-bold mt-1">{(amount / 10).toLocaleString('fa-IR')} <span className="text-xs">تومان</span></p>
//         )}
//         {typeof amount === 'string' && (
//           <p className="text-sm font-bold mt-1">{amount}</p>
//         )}
//       </div>
//     </div>
//     <button
//       onClick={actionHandler}
//       className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
//     >
//       <FiPlus className="w-5 h-5" />
//     </button>
//   </div>
// );

// const ActionButton = ({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }) => (
//   <div className="flex flex-col items-center space-y-2">
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className="bg-black text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors disabled:opacity-50"
//     >
//       {icon}
//     </button>
//     <p className="text-xs font-semibold text-gray-700">{label}</p>
//   </div>
// );

// const TransactionItem = ({ tx }: { tx: WalletTransaction }) => {
//   const isCredit = tx.balance_change > 0;
//   const date = new Date(tx.timestamp).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  
//   // تبدیل ریال به تومان برای نمایش (تقسیم بر ۱۰)
//   const amountInTomans = Math.abs(tx.balance_change / 10).toLocaleString('fa-IR');

//   return (
//     <div className="flex items-center justify-between py-3 border-b last:border-b-0">
//       <div className="flex items-center">
//         <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center ml-4">
//           {isCredit ? <FiPlus className="text-green-500 w-6 h-6" /> : <MessageSquare className="text-red-500 w-6 h-6" />}
//         </div>
//         <div>
//           <p className="font-bold text-gray-800">{tx.description}</p>
//           <p className="text-xs text-gray-500 mt-1">{date}</p>
//         </div>
//       </div>
//       <p className={`font-bold text-base tracking-wider ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
//         {isCredit ? '+' : '-'} {amountInTomans} <span className="text-sm text-gray-600">تومان</span>
//       </p>
//     </div>
//   );
// };

// // --- کامپوننت اصلی ---

// const DriverWallet: React.FC = () => {
//   const { driver } = useDriverDashboardData();
//   const { currentUser } = useAuthStore();
//   const driverID = driver.id;
//   const userID = currentUser?.id;

//   const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
//   const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showTopUpOptions, setShowTopUpOptions] = useState(false); // مدیریت نمایش گزینه‌های شارژ

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       const walletPromise = driverID ? getDriverWalletTransactions(driverID) : Promise.resolve([]);
//       const smsPromise = userID ? getSmsCreditTransactions(userID) : Promise.resolve([]);

//       const [walletTx, smsTx] = await Promise.all([walletPromise, smsPromise]);
//       setTransactions(walletTx);
//       setSmsTransactions(smsTx);
//       setLoading(false);
//     };

//     if (driverID || userID) {
//       fetchTransactions();
//     }
//   }, [driverID, userID]);

//   const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
//   const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);

//   // تغییرات: ریال به تومان تبدیل شده است (تومان = ریال / ۱۰)
//   const walletBalanceInTomans = walletBalance / 10;
  
//   const handleTopUp = async (amountInRials: number) => {
//     if (!driverID) return;
//     setLoading(true);
//     try {
//       const tx = await createDriverWalletTransaction(driverID, amountInRials, 'افزایش اعتبار');
//       setTransactions(prev => [...prev, tx]);
//       alert('کیف پول شارژ شد');
//       setShowTopUpOptions(false); // بستن گزینه‌ها پس از شارژ
//     } catch (e) { alert('خطا در شارژ کیف پول'); }
//     finally { setLoading(false); }
//   };

//   const handleBuySms = async () => {
//     const costInRials = 50000; // هزینه خرید ۵۰ تایی پیامک به ریال
//     const smsCount = 50; // تعداد پیامک
//     const smsDescription = 'خرید بسته افزایشی';
//     const walletDescription = 'خرید بسته پیامک';
    
//     if (!driverID || !userID) return;
//     if (walletBalance < costInRials) { alert('موجودی کیف پول کافی نیست'); return; }
    
//     setLoading(true);
//     try {
//       // تراکنش کسر از کیف پول راننده
//       const wTx = await createDriverWalletTransaction(driverID, -costInRials, walletDescription);
//       setTransactions(prev => [...prev, wTx]);
      
//       // تراکنش افزایش اعتبار پیامکی کاربر (راننده)
//       const sTx = await createSmsCreditTransaction(userID, smsCount, costInRials, smsDescription);
//       setSmsTransactions(prev => [...prev, sTx]);
      
//       alert('خرید بسته پیامک با موفقیت انجام شد');
//     } catch (e) { 
//       alert('خطا در انجام عملیات خرید پیامک'); 
//       // در یک سناریوی واقعی، باید logic بیشتری برای بازگرداندن تراکنش های انجام شده وجود داشته باشد.
//     }
//     finally { setLoading(false); }
//   };

//   const handleNotImplemented = () => {
//       alert('این قابلیت هنوز پیاده سازی نشده است.');
//   };

//   if (!driverID) return <div className="p-4 text-center">پروفایل را تکمیل کنید.</div>;
//   if (loading && transactions.length === 0) return <div className="p-4 text-center">در حال بارگذاری...</div>;

//   return (
//     <div dir="rtl" className="bg-white min-h-screen font-[sans-serif] text-gray-900 w-full max-w-md mx-auto">
//       <header className="bg-black text-white text-center py-4 sticky top-0 z-10">
//         <h1 className="text-lg font-bold">کیف پول</h1>
//       </header>
//       <main className="p-4 pb-20">
        
//         {/* کارت کیف پول */}
//         <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
//           <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
//           <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
//           <div className="relative z-10">
            
//             {/* موجودی کل */}
//             <div className="flex flex-col items-center text-white mb-6">
//               <p className="text-sm opacity-80">موجودی کیف پول</p>
//               <div className="flex items-baseline mt-2">
//                 <span className="text-5xl font-bold tracking-wider">{walletBalanceInTomans.toLocaleString('fa-IR')}</span>
//                 <span className="text-base font-semibold mr-2">تومان</span>
//               </div>
//             </div>

//             {/* جزئیات موجودی‌ها */}
//             <BalanceDetailRow 
//                 icon={<TbTruckDelivery size={24} />} 
//                 label="موجودی کیف پول شارژ سفارش" 
//                 amount={walletBalance} 
//                 actionHandler={() => setShowTopUpOptions(true)}
//             />
            
//             <BalanceDetailRow 
//                 icon={<FiMail size={24} />} 
//                 label="اعتبار پیامک (عدد)" 
//                 amount={`${smsBalance} عدد`} 
//                 actionHandler={handleBuySms} 
//             />
            
//             {/* گزینه‌های شارژ مخفی/نمایان */}
//             {showTopUpOptions && (
//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <button 
//                   onClick={() => handleTopUp(100000)} // ۱۰۰,۰۰۰ ریال (۱۰,۰۰۰ تومان)
//                   className="bg-green-500 text-white py-2 rounded-xl font-bold hover:bg-green-600 transition-colors text-sm"
//                 >
//                   ۱۰,۰۰۰ تومان
//                 </button>
//                 <button 
//                   onClick={() => handleTopUp(200000)} // ۲۰۰,۰۰۰ ریال (۲۰,۰۰۰ تومان)
//                   className="bg-green-500 text-white py-2 rounded-xl font-bold hover:bg-green-600 transition-colors text-sm"
//                 >
//                   ۲۰,۰۰۰ تومان
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* دکمه‌های اقدام */}
//         <div className="my-8 flex justify-around items-start">
//             <ActionButton icon={<FiMail size={28} />} label="شارژ پیامک" onClick={handleBuySms} disabled={loading}/>
//             <ActionButton icon={<FiPlus size={32} />} label="افزایش موجودی" onClick={() => setShowTopUpOptions(true)} disabled={loading}/>
//             <ActionButton icon={<IoStatsChart size={28} />} label="گزارش مالی" onClick={handleNotImplemented} />
//         </div>

//         {/* سوابق تراکنش */}
//         <div className="mt-8 px-2">
//           <h2 className="font-bold text-lg text-gray-800 mb-4">سوابق تراکنش</h2>
//           <div className="space-y-2">
//             {transactions.length > 0 ? (
//                 transactions.slice().reverse().map(tx => (
//                     <TransactionItem key={tx.id} tx={tx} />
//                 ))
//             ) : (
//                 <p className="text-center text-gray-500">تراکنشی یافت نشد.</p>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DriverWallet;




// DriverWallet.jsx (نسخه به‌روزرسانی شده با مودال)

"use client"
import React, { useEffect, useState } from 'react';
import { WalletTransaction, SmsCreditTransaction } from '../../types';
import { getDriverWalletTransactions, createDriverWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction } from './../driverService';
import { Wallet, MessageSquare } from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData';
import { useAuthStore } from '@/app/store/useAuthStore';

// آیکون‌های مورد نیاز
import { FiMail, FiPlus } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import IncreaseBalanceModal from './IncreaseBalanceModal';

// --- کامپوننت IncreaseBalanceModal را در اینجا قرار دهید یا از فایل جداگانه وارد کنید ---
// (کد IncreaseBalanceModal را که در بالا ارائه شد، اینجا کپی کنید)
// ... (کد BalanceIcon، GiftIcon و RechargeOption و IncreaseBalanceModal را اینجا قرار دهید)

// فرض می‌کنیم کامپوننت‌های کمکی UI و Modal از بالا قابل دسترسی هستند.
// به دلیل محدودیت‌های محیط پاسخ، من فقط کد DriverWallet را به‌روزرسانی می‌کنم و فرض می‌کنم کد Modal و Helpers در دسترس هستند.

// -------------------------------------------------------------------------------------
// کدهای کمکی مورد نیاز در DriverWallet (برگرفته از پاسخ قبلی)

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
          {isCredit ? <FiPlus className="text-green-500 w-6 h-6" /> : <MessageSquare className="text-red-500 w-6 h-6" />}
        </div>
        <div>
          <p className="font-bold text-gray-800">{tx.description}</p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>
      <p className={`font-bold text-base tracking-wider ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'} {amountInTomans} <span className="text-sm text-gray-600">تومان</span>
      </p>
    </div>
  );
};
// -------------------------------------------------------------------------------------

const DriverWallet: React.FC = () => {
  const { driver } = useDriverDashboardData();
  const { currentUser } = useAuthStore();
  const driverID = driver.id;
  const userID = currentUser?.id;

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false); // <--- حالت جدید برای مودال

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
  
  // به‌روزرسانی تابع handleTopUp برای استفاده از مودال
  const handleTopUp = async (amountInRials: number) => {
    if (!driverID) return;
    // setLoading(true) را به داخل شبیه ساز پرداخت در مودال منتقل کردیم
    try {
      const tx = await createDriverWalletTransaction(driverID, amountInRials, 'افزایش اعتبار');
      setTransactions(prev => [...prev, tx]);
      // alert('کیف پول شارژ شد'); این را به داخل شبیه ساز پرداخت در مودال منتقل کردیم
    } catch (e) { alert('خطا در شارژ کیف پول'); }
    finally { 
        // setLoading(false);
        // setShowRechargeModal(false); این را به داخل شبیه ساز پرداخت در مودال منتقل کردیم
    }
  };

  const handleBuySms = async () => {
    // ... (منطق خرید پیامک بدون تغییر)
    const costInRials = 50000;
    const smsCount = 50;
    const smsDescription = 'خرید بسته افزایشی';
    const walletDescription = 'خرید بسته پیامک';
    
    if (!driverID || !userID) return;
    if (walletBalance < costInRials) { alert('موجودی کیف پول کافی نیست'); return; }
    
    setLoading(true);
    try {
      const wTx = await createDriverWalletTransaction(driverID, -costInRials, walletDescription);
      setTransactions(prev => [...prev, wTx]);
      const sTx = await createSmsCreditTransaction(userID, smsCount, costInRials, smsDescription);
      setSmsTransactions(prev => [...prev, sTx]);
      alert('خرید بسته پیامک با موفقیت انجام شد');
    } catch (e) { 
      alert('خطا در انجام عملیات خرید پیامک'); 
    }
    finally { setLoading(false); }
  };

  const handleNotImplemented = () => {
      alert('این قابلیت هنوز پیاده سازی نشده است.');
  };

  if (!driverID) return <div className="p-4 text-center">پروفایل را تکمیل کنید.</div>;
  if (loading && transactions.length === 0) return <div className="p-4 text-center">در حال بارگذاری...</div>;

  return (
    <div dir="rtl" className="bg-white min-h-screen font-[sans-serif] text-gray-900 w-full max-w-md mx-auto">
      <header className="bg-black text-white text-center py-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold">کیف پول</h1>
      </header>
      <main className="p-4 pb-20">
        
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
                actionHandler={() => setShowRechargeModal(true)} // <--- باز کردن مودال
            />
            
            <BalanceDetailRow 
                icon={<FiMail size={24} />} 
                label="اعتبار پیامک (عدد)" 
                amount={`${smsBalance} عدد`} 
                actionHandler={handleBuySms} 
            />
            
          </div>
        </div>
        
        {/* دکمه‌های اقدام */}
        <div className="my-8 flex justify-around items-start">
            <ActionButton icon={<FiMail size={28} />} label="شارژ پیامک" onClick={handleBuySms} disabled={loading}/>
            <ActionButton icon={<FiPlus size={32} />} label="افزایش موجودی" onClick={() => setShowRechargeModal(true)} disabled={loading}/> {/* <--- باز کردن مودال */}
            <ActionButton icon={<IoStatsChart size={28} />} label="گزارش مالی" onClick={handleNotImplemented} />
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
      </main>

      {/* کامپوننت مودال افزایش موجودی */}
      <IncreaseBalanceModal 
        isVisible={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onTopUp={handleTopUp} // ارسال تابع شارژ برای اجرا پس از شبیه سازی پرداخت موفق
      />
    </div>
  );
};

export default DriverWallet;