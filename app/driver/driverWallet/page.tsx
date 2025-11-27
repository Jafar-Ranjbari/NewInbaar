// import { TbTruckDelivery } from 'react-icons/tb';
// import { FiMail, FiPlus } from 'react-icons/fi';
// import { IoStatsChart } from 'react-icons/io5';
// import Link from "next/link";


// const BalanceDetailRow = ({ icon, label, amount }: any) => (
//   <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
//     <div className="flex items-center text-white">
//       {icon}
//       <div className="mr-4">
//         <p className="text-xs font-semibold">{label}</p>
//         {typeof amount === 'number' && (
//           <p className="text-sm font-bold mt-1">{(amount)} <span className="text-xs">تومان</span></p>
//         )}
//         {typeof amount === 'string' && (
//           <p className="text-sm font-bold mt-1">{amount}</p>
//         )}
//       </div>
//     </div>
//     <button className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md">
//       <FiPlus className="w-5 h-5" />
//     </button>
//   </div>
// );

// const ActionButton = ({ icon, label }: any) => (
//   <div className="flex flex-col items-center space-y-2">
//     <button className="bg-black text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
//       {icon}
//     </button>
//     <p className="text-xs font-semibold text-gray-700">{label}</p>
//   </div>
// );

// const wallet = () => {
//   return (
//     <div dir="rtl" className="bg-white min-h-screen font-[sans-serif] text-gray-900 w-full max-w-md mx-auto">
//       <header className="bg-black text-white text-center py-4 sticky top-0 z-10">
//         <h1 className="text-lg font-bold">کیف پول</h1>
//       </header>
//       <main className="p-4 pb-20">
//         {/* <WalletCard /> */}

//         <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
//           <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
//           <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
//           <div className="relative z-10">
//             {/* <WalletBalance /> */}

//             <div className="flex flex-col items-center text-white mb-6">
//               <p className="text-sm opacity-80">موجودی کیف پول</p>
//               <div className="flex items-baseline mt-2">
//                 <span className="text-5xl font-bold tracking-wider">{(300000)}</span>
//                 <span className="text-base font-semibold mr-2">تومان</span>
//               </div>
//             </div>

//             <BalanceDetailRow icon={<TbTruckDelivery size={24} />} label="موجودی کیف پول شارژ سفارش" amount={300000} />
//             <BalanceDetailRow icon={<FiMail size={24} />} label="موجودی کیف پول پیامکی" amount="-" />
//           </div>
//         </div>
//         {/* <ActionButtons /> */}
//         <div className="my-8 flex justify-around items-start">
//           <Link href="/driver/smsCharge">
//             <ActionButton icon={<FiMail size={28} />} label="شارژ پیامک" />
//           </Link>

//           <Link href="/driver/increaseBalance">
//             <ActionButton icon={<FiPlus size={32} />} label="افزایش موجودی" />
//           </Link>

//           <Link href="/driver/financeReport">
//             <ActionButton icon={<IoStatsChart size={28} />} label="گزارش مالی" />
//           </Link>
//         </div>

//         {/* >سوابق تراکنش */}

//         <div className="mt-8 px-2">
//           <h2 className="font-bold text-lg text-gray-800 mb-2">سوابق تراکنش</h2>
//           <div className="flex items-center justify-between py-3">
//             <div className="flex items-center">
//               <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center ml-4">
//                 <FiPlus className="text-gray-500 w-6 h-6" />
//               </div>
//               <div>
//                 <p className="font-bold text-gray-800">افزایش موجودی</p>
//                 <p className="text-xs text-gray-500 mt-1">سه شنبه - ۶ آبان ۱۴۰۴</p>
//               </div>
//             </div>
//             <p className="font-bold text-base text-gray-800 tracking-wider">
//               {(250000)} <span className="text-sm text-gray-600">تومان</span>
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default wallet;

"use client"
import React, { useEffect, useState } from 'react';
import { WalletTransaction, SmsCreditTransaction } from '../../types';
import { getDriverWalletTransactions, createDriverWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction } from './../driverService';
import { Wallet, MessageSquare } from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData';
import { useAuthStore } from '@/app/store/useAuthStore';


const DriverWallet: React.FC = () => {
  const { driver } = useDriverDashboardData();
  const { currentUser } = useAuthStore();
  const driverID = driver.id;
  const userID = currentUser?.id;


  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driverID) getDriverWalletTransactions(driverID).then(setTransactions);
    if (userID) getSmsCreditTransactions(userID).then(setSmsTransactions);
  }, [driverID, userID]);

  const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
  const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const handleTopUp = async (amount: number) => {
    if (!driverID) return;
    setLoading(true);
    try {
      const tx = await createDriverWalletTransaction(driverID, amount, 'افزایش اعتبار');
      setTransactions(prev => [...prev, tx]);
      alert('کیف پول شارژ شد');
    } catch (e) { alert('خطا'); }
    finally { setLoading(false); }
  };

  const handleBuySms = async () => {
    if (!driverID || !userID) return;
    if (walletBalance < 50000) { alert('موجودی کافی نیست'); return; }
    setLoading(true);
    try {
      const wTx = await createDriverWalletTransaction(driverID, -50000, 'خرید بسته پیامک');
      setTransactions(prev => [...prev, wTx]);
      const sTx = await createSmsCreditTransaction(userID, 50, 50000, 'خرید بسته افزایشی');
      setSmsTransactions(prev => [...prev, sTx]);
      alert('خرید موفق');
    } catch (e) { alert('خطا'); }
    finally { setLoading(false); }
  };

  if (!driverID) return <div className="p-4 text-center">پروفایل را تکمیل کنید.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div><p className="text-green-100 mb-1">موجودی کیف پول</p><h3 className="text-4xl font-bold">{walletBalance.toLocaleString()} ریال</h3></div>
            <div className="bg-white/20 p-3 rounded-full"><Wallet size={32} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleTopUp(100000)} className="bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50">شارژ ۱۰۰,۰۰۰</button>
            <button onClick={() => handleTopUp(200000)} className="bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50">شارژ ۲۰۰,۰۰۰</button>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div><p className="text-purple-100 mb-1">اعتبار پیامک</p><h3 className="text-4xl font-bold">{smsBalance} عدد</h3></div>
            <div className="bg-white/20 p-3 rounded-full"><MessageSquare size={32} /></div>
          </div>
          <button onClick={handleBuySms} disabled={loading} className="w-full bg-white text-purple-700 py-3 rounded-xl font-bold hover:bg-purple-50 disabled:opacity-50">خرید بسته ۵۰ تایی (۵۰,۰۰۰ تومان)</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">تراکنش‌های اخیر</h3>
        <div className="space-y-4">
          {transactions.slice().reverse().map(tx => (
            <div key={tx.id} className="flex justify-between p-4 bg-gray-50 rounded-lg border">
              <div><p className="font-medium">{tx.description}</p><p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString('fa-IR')}</p></div>
              <div className={`font-bold ${tx.balance_change > 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.balance_change.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverWallet;