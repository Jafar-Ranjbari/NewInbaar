
import React, { useEffect, useState } from 'react';
import { getCompanyWalletTransactions, createCompanyWalletTransaction, getSmsCreditTransactions, createSmsCreditTransaction } from './companyService';
import { WalletTransaction, SmsCreditTransaction } from '../types';
import { Wallet, MessageSquare } from 'lucide-react';

interface Props { companyID?: string; userID?: string; }

export const CompanyWallet: React.FC<Props> = ({ companyID, userID }) => {
    const [txs, setTxs] = useState<WalletTransaction[]>([]);
    const [smsTxs, setSmsTxs] = useState<SmsCreditTransaction[]>([]);

    useEffect(() => {
        if (companyID) getCompanyWalletTransactions(companyID).then(setTxs);
        if (userID) getSmsCreditTransactions(userID).then(setSmsTxs);
    }, [companyID, userID]);

    const handleTopUp = async () => {
        if(companyID) {
            const t = await createCompanyWalletTransaction(companyID, 100000, 'شارژ');
            setTxs([...txs, t]);
        }
    };

    return (
        <div className="grid gap-6">
             <div className="bg-blue-600 text-white p-6 rounded-xl">
                 <h3 className="text-2xl font-bold">{txs.reduce((a,b) => a+b.balance_change, 0).toLocaleString()} ریال</h3>
                 <button onClick={handleTopUp} className="bg-white text-blue-600 px-4 py-2 rounded mt-4">افزایش موجودی</button>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="font-bold mb-4">تراکنش‌ها</h4>
                 {txs.slice().reverse().map(t => (
                     <div key={t.id} className="flex justify-between py-2 border-b">
                         <span>{t.description}</span>
                         <span className={t.balance_change > 0 ? 'text-gray-600' : 'text-red-600'}>{t.balance_change}</span>
                     </div>
                 ))}
             </div>
        </div>
    );
};
