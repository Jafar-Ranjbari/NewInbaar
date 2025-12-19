import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MessageSquare } from 'lucide-react';
import { WalletTransaction } from '../../types';

export const TransactionItem = ({ tx }: { tx: WalletTransaction }) => {
  const isCredit = tx.balance_change > 0;
  const date = new Date(tx.timestamp).toLocaleDateString('fa-IR');
  const amountInTomans = Math.abs(tx.balance_change / 10).toLocaleString('fa-IR');

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center">
        <div className="bg-gray-100 rounded-xl w-11 h-11 flex items-center justify-center ml-3">
          {isCredit ? <FiPlus className="text-green-600" /> : <MessageSquare className="text-red-500" size={18} />}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-800">{tx.description}</p>
          <p className="text-[10px] text-gray-500 mt-1">{date}</p>
        </div>
      </div>
      <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'} {amountInTomans} <span className="text-[10px]">تومان</span>
      </p>
    </div>
  );
};