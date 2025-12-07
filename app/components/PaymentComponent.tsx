// // components/PaymentComponent.tsx
// import React, { useState } from 'react';
// import { Order, OrderStatus, PaymentDriver } from '../types';
// import { createPayment, updateOrder } from '../company/companyService';
// import { CreditCard, CheckCircle } from 'lucide-react';

// interface PaymentProps {
//   order: Order;
//   onPaymentSuccess?: () => void;
// }

// export const PaymentComponent: React.FC<PaymentProps> = ({ order, onPaymentSuccess }) => {
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handlePay = async () => {
//     if (!order.driverID) return;
//     setLoading(true);
//     try {
//       await createPayment({
//         orderID: order.id,
//         driverID: order.driverID,
//         amount: Number(amount),
//         payType: 'BANK',
//         transactionCode: `TRX-${Date.now()}`,
//         date: new Date().toISOString(),
//         // ... سایر فیلدهای مورد نیاز
//       });
      
//       alert(`مبلغ ${amount} با موفقیت پرداخت شد.`);
//       if (onPaymentSuccess) onPaymentSuccess();
//       setAmount('');
//     } catch (err) {
//       alert("خطا در پرداخت");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//       <h3 className="font-bold flex items-center gap-2 text-gray-800 mb-3">
//         <CreditCard className="text-gray-600" /> پنل پرداخت
//       </h3>
      
//       <div className="mb-4 text-sm text-gray-600">
//         <p>شناسه سفارش: {order.id}</p>
//         <p>مبلغ توافق شده: {order.price.toLocaleString()} ریال</p>
//       </div>

//       <div className="space-y-3">
//         <input 
//           type="number" 
//           placeholder="مبلغ پرداختی (ریال)" 
//           className="w-full border p-2 rounded-lg"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//         <button 
//           onClick={handlePay}
//           disabled={loading || !amount}
//           className="w-full bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700 disabled:opacity-50"
//         >
//           {loading ? "در حال پردازش..." : "ثبت پرداخت"}
//         </button>
//       </div>
//     </div>
//   );
// };