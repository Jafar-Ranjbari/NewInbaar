// "use client"
// import React, { useEffect, useState, useMemo } from 'react';
// import { PaymentDriver, OrderOffer, OfferStatus } from '../../types';
// import { getPaymentsByDriverId, getOffersByDriverId } from './../driverService';
// import { CreditCard, ClipboardList, FileBarChart, TrendingUp } from 'lucide-react';
// import { useDriverDashboardData } from '../useDriverDashboardData';

// export const DriverReports: React.FC = () => {
//   const { driver } = useDriverDashboardData();
//   const driverID = driver.id;
//   const [payments, setPayments] = useState<PaymentDriver[]>([]);
//   const [offers, setOffers] = useState<OrderOffer[]>([]);

//   useEffect(() => {
//     if (driverID) {
//       getPaymentsByDriverId(driverID).then(setPayments);
//       getOffersByDriverId(driverID).then(setOffers);
//     }
//   }, [driverID]);

//   const totalIncome = payments.reduce((acc, curr) => acc + curr.amount, 0);

//   // Prepare Chart Data (Cumulative Income)
//   const chartData = useMemo(() => {
//     if (!payments.length) return [];

//     // Sort payments by date
//     const sortedPayments = [...payments].sort((a, b) =>
//       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     );

//     let cumulative = 0;
//     const data = sortedPayments.map(p => {
//       cumulative += p.amount;
//       return {
//         date: new Date(p.createdAt).toLocaleDateString('fa-IR', { month: '2-digit', day: '2-digit' }),
//         fullDate: new Date(p.createdAt).toLocaleDateString('fa-IR'),
//         value: cumulative,
//         amount: p.amount
//       };
//     });

//     // Add a starting point if only 1 point exists or to show start from 0
//     if (data.length > 0) {
//       const firstDate = new Date(sortedPayments[0].createdAt);
//       firstDate.setDate(firstDate.getDate() - 1);
//       return [{ date: 'شروع', fullDate: 'شروع فعالیت', value: 0, amount: 0 }, ...data];
//     }

//     return data;
//   }, [payments]);

//   if (!driverID) return <div className="p-4 text-center">پروفایل را تکمیل کنید.</div>;

//   return (
//     <div className="space-y-8">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-gray-500 flex justify-between items-start">
//           <div><p className="text-gray-500 mb-2 font-bold">کل درآمد</p><h3 className="text-3xl font-bold text-gray-600 dir-ltr">{totalIncome.toLocaleString()} ریال</h3></div>
//           <div className="bg-gray-50 p-3 rounded-lg text-gray-600"><CreditCard size={24} /></div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500 flex justify-between items-start">
//           <div><p className="text-gray-500 mb-2 font-bold">تعداد سفارشات</p><h3 className="text-3xl font-bold text-blue-600">{offers.length}</h3></div>
//           <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><ClipboardList size={24} /></div>
//         </div>
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="border-b pb-4 mb-6 flex items-center gap-2">
//           <TrendingUp size={20} className="text-gray-600" />
//           <h3 className="font-bold text-gray-800">روند رشد درآمد</h3>
//         </div>

//         {chartData.length > 1 ? (
//           <SimpleLineChart data={chartData} />
//         ) : (
//           <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
//             داده کافی برای نمایش نمودار وجود ندارد
//           </div>
//         )}
//       </div>

//       {/* Payments Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2"><CreditCard size={18} className="text-gray-500" /> ریز دریافتی‌ها</div>
//         <div className="p-4 overflow-x-auto">
//           <table className="w-full text-right min-w-[600px]">
//             <thead className="bg-gray-50 text-gray-600 text-sm">
//               <tr><th className="p-3">مبلغ</th><th className="p-3">روش</th><th className="p-3">کد پیگیری</th><th className="p-3">تاریخ</th></tr>
//             </thead>
//             <tbody className="divide-y">
//               {payments.slice().reverse().map(p => (
//                 <tr key={p.id}>
//                   <td className="p-3 font-bold text-gray-700">{p.amount.toLocaleString()}</td>
//                   <td className="p-3">{p.payType}</td>
//                   <td className="p-3 text-sm text-gray-500">{p.transactionCode}</td>
//                   <td className="p-3 text-sm">{p.year}/{p.month}/{p.day}</td>
//                 </tr>
//               ))}
//               {payments.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">موردی یافت نشد</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Orders History */}
//       <div className="bg-white rounded-xl shadow-sm">
//         <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2"><ClipboardList size={18} className="text-blue-500" /> تاریخچه سفارشات</div>
//         <div className="divide-y">
//           {offers.slice().reverse().map(offer => (
//             <div key={offer.id} className="p-4 flex justify-between items-center">
//               <div>
//                 <p className="font-bold text-gray-800">پیشنهاد: {offer.price.toLocaleString()} ریال</p>
//                 <p className="text-sm text-gray-500">{offer.deliveryEstimateTime}</p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-sm font-bold ${offer.state === OfferStatus.ACCEPTED ? 'bg-gray-100 text-gray-700' : offer.state === OfferStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
//                 {offer.state === OfferStatus.ACCEPTED ? 'تایید شده' : offer.state === OfferStatus.REJECTED ? 'رد شده' : 'در انتظار'}
//               </span>
//             </div>
//           ))}
//           {offers.length === 0 && <div className="p-6 text-center text-gray-500">سفارشی یافت نشد</div>}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Custom SVG Line Chart Component
// const SimpleLineChart = ({ data }: { data: { date: string; fullDate: string; value: number }[] }) => {
//   const height = 250;
//   const width = 800;
//   const paddingX = 60;
//   const paddingY = 40;
//   const chartW = width - paddingX * 2;
//   const chartH = height - paddingY * 2;

//   const maxY = Math.max(...data.map(d => d.value)) * 1.1 || 100;
//   const maxX = data.length - 1;

//   const getX = (index: number) => paddingX + (index / (maxX || 1)) * chartW;
//   const getY = (value: number) => height - paddingY - (value / maxY) * chartH;

//   const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');

//   // Calculate Y-axis ticks (5 steps)
//   const yTicks = [0, 1, 2, 3, 4].map(i => {
//     const val = (maxY / 4) * i;
//     return { y: getY(val), value: val };
//   });

//   return (
//     <div className="w-full overflow-x-auto pb-2">
//       <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px] h-auto select-none font-sans">
//         {/* Background Grid */}
//         {yTicks.map((tick, i) => (
//           <g key={i}>
//             <line x1={paddingX} y1={tick.y} x2={width - paddingX} y2={tick.y} stroke="#f3f4f6" strokeWidth="1" />
//             <text x={paddingX - 10} y={tick.y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
//               {(tick.value / 1000000).toFixed(1)}M
//             </text>
//           </g>
//         ))}

//         {/* Area Fill (Gradient) */}
//         <defs>
//           <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
//             <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
//             <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
//           </linearGradient>
//         </defs>
//         <path
//           d={`M${paddingX},${height - paddingY} ${points.split(' ').map((p, i) => i === 0 ? `L${p}` : `L${p}`).join(' ')} L${getX(maxX)},${height - paddingY} Z`}
//           fill="url(#chartGradient)"
//           stroke="none"
//         />

//         {/* Line */}
//         <polyline fill="none" stroke="#10b981" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />

//         {/* Dots & Tooltips */}
//         {data.map((d, i) => (
//           <g key={i} className="group cursor-pointer">
//             <circle cx={getX(i)} cy={getY(d.value)} r="5" fill="white" stroke="#10b981" strokeWidth="2" className="transition-all group-hover:r-7" />

//             {/* Tooltip */}
//             <g className="opacity-0 group-hover:opacity-100 transition-opacity">
//               <rect x={getX(i) - 60} y={getY(d.value) - 45} width="120" height="35" rx="6" fill="#1f2937" />
//               <text x={getX(i)} y={getY(d.value) - 23} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
//                 {d.value.toLocaleString()} ریال
//               </text>
//               <path d={`M${getX(i)},${getY(d.value) - 10} L${getX(i) - 5},${getY(d.value) - 18} L${getX(i) + 5},${getY(d.value) - 18} Z`} fill="#1f2937" />
//             </g>

//             {/* X Axis Labels */}
//             <text x={getX(i)} y={height - 15} textAnchor="middle" fontSize="11" fill="#6b7280">
//               {d.date}
//             </text>
//           </g>
//         ))}

//         {/* Axis Labels */}
//         <text x={width / 2} y={height - 2} textAnchor="middle" fontSize="10" fill="#9ca3af">تاریخ</text>
//         <text x={20} y={height / 2} transform={`rotate(-90, 20, ${height / 2})`} textAnchor="middle" fontSize="10" fill="#9ca3af">میلیون ریال</text>
//       </svg>
//     </div>
//   )
// }


// export default DriverReports;


"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { PaymentDriver, OrderOffer, OfferStatus } from '../../types'; // Assuming types are in this path
import { getPaymentsByDriverId, getOffersByDriverId } from './../driverService'; // Assuming service is in this path
import { CreditCard, ClipboardList, FileBarChart, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData'; // Assuming hook is in this path

// Enumهای وضعیت سفارشات و پیشنهادات برای در دسترس بودن در این فایل
export enum OfferStatusFa {
  PENDING = 'در انتظار بررسی',
  ACCEPTED = 'تایید شده',
  REJECTED = 'رد شده'
}

// کامپوننت کارت آمار (برای استفاده در موبایل)
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-b-2" style={{ borderColor: color }}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <h3 className={`text-xl font-bold`} style={{ color: color }}>{value}</h3>
      </div>
      <div className="p-2 rounded-full opacity-75" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
    </div>
  </div>
);

// کامپوننت گزارشات راننده
export const DriverReports: React.FC = () => {
  const { driver } = useDriverDashboardData();
  const driverID = driver?.id;
  const [payments, setPayments] = useState<PaymentDriver[]>([]);
  const [offers, setOffers] = useState<OrderOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (driverID) {
      setIsLoading(true);
      Promise.all([
        getPaymentsByDriverId(driverID).then(setPayments),
        getOffersByDriverId(driverID).then(setOffers)
      ]).finally(() => setIsLoading(false));
    }
  }, [driverID]);

  // محاسبات آماری (useMemo برای بهینه‌سازی)
  const { totalIncome, acceptedOffers, rejectedOffers, pendingOffers, totalOffers } = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const accepted = offers.filter(o => o.state === OfferStatus.ACCEPTED).length;
    const rejected = offers.filter(o => o.state === OfferStatus.REJECTED).length;
    const pending = offers.filter(o => o.state === OfferStatus.PENDING).length;

    return {
      totalIncome: total,
      acceptedOffers: accepted,
      rejectedOffers: rejected,
      pendingOffers: pending,
      totalOffers: offers.length
    };
  }, [payments, offers]);

  if (!driverID) return <div className="p-4 text-center text-gray-600">پروفایل راننده یافت نشد.</div>;
  if (isLoading) return <div className="p-4 text-center text-gray-600">در حال بارگیری گزارشات...</div>;

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto dir-rtl"> {/* Max-width و mx-auto برای شبیه‌سازی موبایل */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileBarChart size={20} className="text-indigo-600" /> گزارش عملکرد
      </h2>

      {/* Stats Cards - تمرکز بر درآمد و کل سفارشات */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="کل درآمد"
          value={`${totalIncome.toLocaleString()} ریال`}
          icon={<CreditCard size={18} />}
          color="#1e3a8a" // رنگ آبی تیره
        />
        <StatCard
          title="تعداد پیشنهادات"
          value={totalOffers}
          icon={<ClipboardList size={18} />}
          color="#059669" // رنگ سبز
        />
      </div>

      {/* Offer Status Stats - آمار وضعیت پیشنهادات */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="تایید شده"
          value={acceptedOffers}
          icon={<CheckCircle size={16} />}
          color="#10b981" // سبز روشن‌تر
        />
        <StatCard
          title="در انتظار"
          value={pendingOffers}
          icon={<Clock size={16} />}
          color="#f59e0b" // زرد/نارنجی
        />
        <StatCard
          title="رد شده"
          value={rejectedOffers}
          icon={<XCircle size={16} />}
          color="#ef4444" // قرمز
        />
      </div>

      {/* Payments History - ریز دریافتی‌ها */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2 bg-gray-50">
          <CreditCard size={18} className="text-indigo-500" /> ریز دریافتی‌ها
        </div>
        <div className="divide-y max-h-60 overflow-y-auto">
          {payments.slice().reverse().map(p => (
            <div key={p.id} className="p-3 flex justify-between items-center text-sm">
              <div className="font-bold text-gray-800">{p.amount.toLocaleString()} ریال</div>
              <div className="text-xs text-gray-500 text-left">
                <p>{p.payType}</p>
                <p>{p.year}/{p.month}/{p.day}</p>
              </div>
            </div>
          ))}
          {payments.length === 0 && <div className="p-4 text-center text-gray-500">موردی برای نمایش وجود ندارد.</div>}
        </div>
      </div>

      {/* Orders History - تاریخچه پیشنهادات (به صورت کارت لیست) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2 bg-gray-50">
          <ClipboardList size={18} className="text-blue-500" /> تاریخچه پیشنهادات
        </div>
        <div className="divide-y max-h-80 overflow-y-auto">
          {offers.slice().reverse().map(offer => {
            const statusText = OfferStatusFa[offer.state as keyof typeof OfferStatusFa];
            const statusColor = offer.state === OfferStatus.ACCEPTED ? 'text-green-700 bg-green-100' :
                                offer.state === OfferStatus.REJECTED ? 'text-red-700 bg-red-100' :
                                'text-yellow-700 bg-yellow-100';

            return (
              <div key={offer.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{offer.price.toLocaleString()} ریال</p>
                  <p className="text-xs text-gray-500 mt-1">تخمین تحویل: {offer.deliveryEstimateTime || 'نامشخص'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {statusText}
                </span>
              </div>
            );
          })}
          {offers.length === 0 && <div className="p-4 text-center text-gray-500">پیشنهادی ثبت نشده است.</div>}
        </div>
      </div>
      
       {/* جایگاه نمودار (در صورت نیاز به نمایش روند رشد درآمد در موبایل - باید کامپوننت ساده‌تری به جای SimpleLineChart سفارشی استفاده شود) */}
       {/* <div className="bg-white rounded-lg shadow-md p-4">
          <div className="border-b pb-3 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-600" />
            <h3 className="font-bold text-gray-800 text-base">روند رشد درآمد (نمونه)</h3>
          </div>
          <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed text-sm">
             نمودار ساده (مثلاً یک نمودار میله‌ای ساده شده) در اینجا قرار می‌گیرد.
          </div>
        </div>
        */}

    </div>
  );
};

export default DriverReports;