
import React, { useEffect, useState } from 'react';
import { getCompanyOrders, getPaymentsByOrderId } from './companyService';
import { Order, PaymentDriver } from '../types';

interface Props { companyID?: string; }

export const CompanyReports: React.FC<Props> = ({ companyID }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<PaymentDriver[]>([]);

    useEffect(() => {
        if (companyID) {
            getCompanyOrders(companyID).then(async (ords) => {
                setOrders(ords);
                const allPays: PaymentDriver[] = [];
                for(const o of ords) {
                    const p = await getPaymentsByOrderId(o.id);
                    allPays.push(...p);
                }
                setPayments(allPays);
            });
        }
    }, [companyID]);

    return (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold mb-4">کل پرداختی‌ها: {payments.reduce((a,b) => a+b.amount, 0).toLocaleString()} ریال</h3>
                 {payments.map(p => (
                     <div key={p.id} className="flex justify-between py-2 border-b">
                         <span>{p.amount} ({p.payType})</span>
                         <span className="text-gray-500">{p.transactionCode}</span>
                     </div>
                 ))}
             </div>
        </div>
    );
};
