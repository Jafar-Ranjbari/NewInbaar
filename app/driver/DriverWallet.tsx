
import React, { useEffect, useState } from 'react';
import { WalletTransaction, SmsCreditTransaction } from '../types';
import { getDriverWalletTransactions, createDriverWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction } from './driverService';
import { Wallet, MessageSquare } from 'lucide-react';

interface Props {
  driverID?: string;
  userID?: string;
}

export const DriverWallet: React.FC<Props> = ({ driverID, userID }) => {
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
        <div className="bg-gradient-to-r from-gray-600 to-gray-400 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div><p className="text-gray-100 mb-1">موجودی کیف پول</p><h3 className="text-4xl font-bold">{walletBalance.toLocaleString()} ریال</h3></div>
            <div className="bg-white/20 p-3 rounded-full"><Wallet size={32} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleTopUp(100000)} className="bg-white text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50">شارژ ۱۰۰,۰۰۰</button>
            <button onClick={() => handleTopUp(200000)} className="bg-white text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50">شارژ ۲۰۰,۰۰۰</button>
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
              <div className={`font-bold ${tx.balance_change > 0 ? 'text-gray-600' : 'text-red-600'}`}>{tx.balance_change.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
