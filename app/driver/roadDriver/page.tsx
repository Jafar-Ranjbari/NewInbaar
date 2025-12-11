// "use client"
// import React, { useEffect, useState, useMemo } from 'react';
// import { PaymentDriver, OrderOffer, OfferStatus } from '../../types';
// import { getPaymentsByDriverId, getOffersByDriverId } from './../driverService';
// import { ClipboardList } from 'lucide-react';
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

//   if (!driverID) return <div className="p-4 text-center">پروفایل را تکمیل کنید.</div>;

//   return (
//     <div className="space-y-8">
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


// export default DriverReports;
 

"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { 
    OrderOffer, 
    OfferStatus, 
    Order, 
    OrderStatus,
    PaymentDriver
} from '../../types'; 
// ایمپورت دو تابع برای دو بخش (سفارشات فعال و تاریخچه پیشنهادات)
import { 
    getOrdersByDriverId, 
    getOffersByDriverId 
} from './../driverService';
import {
    updateOrder 
} from '@/app/company/companyService'; // استفاده از تابع به‌روزرسانی شرکت
import { 
    ClipboardList, 
    MapPin, 
    Truck, 
    Scale, 
    DollarSign,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData';

// --- Helper Functions (تعریف شده در پاسخ قبلی) ---

const getDriverStatusLabel = (status: OrderStatus): { label: string, color: string, style: string } => {
  switch (status) {
    case OrderStatus.NEW: 
    case OrderStatus.WAITING_FOR_OFFERS: 
        return { label: "منتظر تخصیص شرکت", color: "text-blue-800", style: "bg-blue-100" };
    case OrderStatus.DRIVER_ASSIGNED: 
        // 🚨 وضعیت فعلی که راننده باید تایید کند
        return { label: "منتظر تایید نهایی شما", color: "text-indigo-800", style: "bg-indigo-100" };
    case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION: 
        return { label: "منتظر شروع بارگیری", color: "text-purple-800", style: "bg-purple-100" };
    case OrderStatus.LOADING: 
        return { label: "در حال بارگیری...", color: "text-yellow-900", style: "bg-yellow-300 text-black" };
    case OrderStatus.ON_ROAD: 
        return { label: "در حال حمل به مقصد", color: "text-orange-800", style: "bg-[#f4a261] bg-opacity-90 text-white" };
    case OrderStatus.DELIVERED: 
        return { label: "تحویل شد (منتظر تسویه شرکت)", color: "text-green-800", style: "bg-green-100" };
    case OrderStatus.FINISHED: 
        return { label: "تسویه انجام شد", color: "text-cyan-800", style: "bg-cyan-100" };
    case OrderStatus.PAY: 
        return { label: "تسویه و پرداخت کامل", color: "text-lime-800", style: "bg-lime-100" }; 
    case OrderStatus.CANCELED: 
        return { label: "لغو شده", color: "text-red-800", style: "bg-red-100" };
    default: return { label: "نامشخص", color: "text-gray-700", style: "bg-gray-200" };
  }
};

const DataItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
      <Icon className="w-5 h-5 text-gray-500 mb-1 stroke-1.5" />
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-bold text-gray-800 truncate max-w-full">{value}</span>
    </div>
);

// --- Order Card Component (بدون تغییر) ---

interface DriverOrderCardProps {
    order: Order;
    onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
    isLoading: boolean;
}

const DriverOrderCard: React.FC<DriverOrderCardProps> = ({ order, onStatusUpdate, isLoading }) => {
    const statusInfo = getDriverStatusLabel(order.status);

    const getNextStepButton = () => {
        let label = '';
        let newStatus: OrderStatus | null = null;
        let style = 'bg-black text-white hover:bg-gray-800';
        let disabled = isLoading;

        switch (order.status) {
            case OrderStatus.DRIVER_ASSIGNED:
                // این همان دکمه "تایید نهایی" است که شما نیاز دارید
                label = 'تایید نهایی بار (شروع کار)';
                newStatus = OrderStatus.DRIVER_ACCEPTED_CONFIRMATION;
                style = 'bg-green-600 text-white hover:bg-green-700';
                break;
            case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION:
                label = 'شروع بارگیری';
                newStatus = OrderStatus.LOADING;
                style = 'bg-orange-600 text-white hover:bg-orange-700';
                break;
            case OrderStatus.LOADING:
                label = 'پایان بارگیری و حرکت به مقصد';
                newStatus = OrderStatus.ON_ROAD;
                style = 'bg-blue-600 text-white hover:bg-blue-700';
                break;
            case OrderStatus.ON_ROAD:
                label = 'تحویل بار در مقصد';
                newStatus = OrderStatus.DELIVERED;
                style = 'bg-teal-600 text-white hover:bg-teal-700';
                break;
            case OrderStatus.DELIVERED:
            case OrderStatus.FINISHED:
            case OrderStatus.PAY:
                return (
                    <div className="text-center py-2 text-sm font-bold text-green-700 bg-green-50 rounded-full border border-green-300">
                        {statusInfo.label}
                    </div>
                );
            case OrderStatus.CANCELED:
                return (
                    <div className="text-center py-2 text-sm font-bold text-red-700 bg-red-50 rounded-full border border-red-300">
                        <XCircle className="w-4 h-4 inline-block ml-1" />
                        سفارش لغو شده است.
                    </div>
                );
            default:
                return null;
        }

        if (newStatus) {
            return (
                <button
                    onClick={() => onStatusUpdate(order.id!, newStatus!)}
                    disabled={disabled}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${style}`}
                >
                    {disabled ? <Loader2 className="animate-spin w-5 h-5 inline-block" /> : <CheckCircle className="w-5 h-5 inline-block ml-1" />}
                    {label}
                </button>
            );
        }
        return null;
    };

    const assignedOffer = order.offers?.find(o => o.state === OfferStatus.ACCEPTED);
    const price = assignedOffer?.price || 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 space-y-4 mb-6">
            
            {/* Header and Status */}
            <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div className={`text-[10px] px-3 py-1.5 rounded-full font-medium shadow-sm ${statusInfo.style} ${statusInfo.color}`}>
                    {statusInfo.label}
                </div>
                <div className="flex items-center gap-1 text-gray-800">
                    <span className="font-bold text-lg">{order.originCity}</span>
                    <span className="text-gray-400 mx-1">|</span>
                    <span className="text-sm text-gray-500">{order.destinationCity}</span>
                    <MapPin className="w-5 h-5 text-gray-900 fill-transparent stroke-2 ml-1" />
                </div>
            </div>

            {/* Details Grid (جزییات بار) */}
            <div className="grid grid-cols-4 gap-2 border-b border-gray-100 pb-4">
                <DataItem 
                    icon={DollarSign} 
                    label="مبلغ حمل" 
                    value={price.toLocaleString('fa-IR') + ' ر.ا'} 
                />
                <DataItem 
                    icon={Truck} 
                    label="نوع خودرو" 
                    value={order.requiredVehicleType || "ناشناس"} 
                />
                <DataItem 
                    icon={Scale} 
                    label="وزن (کیلوگرم)" 
                    value={order.weight} 
                />
                <DataItem 
                    icon={ClipboardList} 
                    label="نوع کالا" 
                    value={order.goodType} 
                />
            </div>

            {/* Action Button */}
            <div className="pt-2">
                {getNextStepButton()}
            </div>
        </div>
    );
};


// --- Main Component ---

export const DriverReports: React.FC = () => {
    const { driver } = useDriverDashboardData();
    const driverID = driver?.id;
    
    // لیست سفارشات فعال (Order[]) که راننده به آن تخصیص یافته است
    const [activeOrders, setActiveOrders] = useState<Order[]>([]); 
    // لیست تمامی پیشنهادات (OrderOffer[]) که راننده داده است
    const [allOffers, setAllOffers] = useState<OrderOffer[]>([]); 
    
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const loadData = useCallback(async () => {
        if (!driverID) return;
        setLoading(true);
        try {
            // 1. بارگیری سفارشات فعال/تخصیص یافته
            const fetchedOrders = await getOrdersByDriverId(driverID);
            setActiveOrders(fetchedOrders || []);

            // 2. بارگیری تمامی پیشنهادات ثبت شده
            const fetchedOffers = await getOffersByDriverId(driverID);
            setAllOffers(fetchedOffers || []);
            
        } catch (error) {
            console.error("Error loading driver data:", error);
            setActiveOrders([]);
            setAllOffers([]);
        } finally {
            setLoading(false);
        }
    }, [driverID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        setIsUpdating(true);
        try {
            // از تابع updateOrder شرکت برای به‌روزرسانی وضعیت استفاده می‌شود
            const updatedOrder = await updateOrder(orderId, { status: newStatus });
            
            // به‌روزرسانی لیست سفارشات فعال
            setActiveOrders(prevOrders => 
                prevOrders.map(order => order.id === orderId ? { ...order, ...updatedOrder } : order)
            );
            
            alert(`وضعیت سفارش با موفقیت به "${getDriverStatusLabel(newStatus).label}" تغییر یافت.`);
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("خطا در به‌روزرسانی وضعیت سفارش. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!driverID) return <div className="p-4 text-center text-red-500">پروفایل راننده یافت نشد.</div>;

    // فیلتر برای نمایش سفارشاتی که راننده باید آن‌ها را پیش ببرد
    const activeWorkflowOrders = activeOrders.filter(o => 
        o.status === OrderStatus.DRIVER_ASSIGNED || // 🚨 شامل همین وضعیت است
        o.status === OrderStatus.DRIVER_ACCEPTED_CONFIRMATION ||
        o.status === OrderStatus.LOADING ||
        o.status === OrderStatus.ON_ROAD
    );
    
    // فیلتر برای تاریخچه (سفارشات نهایی شده، تسویه شده یا لغو شده)
    const historyOrders = activeOrders.filter(o => 
        o.status === OrderStatus.DELIVERED || // تحویل شده نیز بخشی از تاریخچه نهایی است
        o.status === OrderStatus.FINISHED || 
        o.status === OrderStatus.PAY || 
        o.status === OrderStatus.CANCELED
    );

    return (
        <div dir="rtl" className="space-y-8 p-4 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">پنل رانندگان - مدیریت سفارش</h2>
            
            {/* --------------------- A. Active Orders (سفارشات فعال) --------------------- */}
            <div className="space-y-4">
                <div className="font-bold text-xl text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Truck size={20} className="text-orange-500" /> سفارشات فعال (مراحل پیشرفت)
                </div>
                {loading ? (
                    <div className="text-center py-10 text-gray-500">
                        <Loader2 className="animate-spin w-6 h-6 inline-block mb-2" />
                        در حال بارگذاری سفارشات فعال...
                    </div>
                ) : activeWorkflowOrders.length > 0 ? (
                    activeWorkflowOrders.slice().reverse().map(order => (
                        <DriverOrderCard 
                            key={order.id} 
                            order={order} 
                            onStatusUpdate={handleStatusUpdate} 
                            isLoading={isUpdating}
                        />
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                        در حال حاضر سفارش فعالی برای پیشبرد ثبت نشده است.
                    </div>
                )}
            </div>

            {/* --------------------- B. History (تاریخچه پیشنهادات و سفارشات نهایی) --------------------- */}
            <div className="space-y-4 pt-6">
                <div className="font-bold text-xl text-gray-800 flex items-center gap-2 border-b pb-2">
                    <ClipboardList size={20} className="text-blue-500" /> تاریخچه پیشنهادات و سفارشات نهایی
                </div>
                <div className="divide-y divide-gray-100 bg-white rounded-xl shadow-sm">
                    
                    {/* نمایش تاریخچه پیشنهادات (رد شده یا در انتظار) */}
                    {allOffers.length > 0 ? (
                        allOffers.slice().reverse().map(offer => {
                            const isAccepted = offer.state === OfferStatus.ACCEPTED;
                            const statusColor = isAccepted ? 'bg-green-100 text-green-700' : offer.state === OfferStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
                            const statusLabel = isAccepted ? 'تایید شده' : offer.state === OfferStatus.REJECTED ? 'رد شده' : 'در انتظار';
                            
                            // اگر پیشنهاد پذیرفته شده و سفارش فعال باشد، دیگر در این بخش نباید تکرار شود.
                            // اگر این پیشنهاد ACCEPTED باشد و جزو activeOrders باشد، نباید تکرار شود (برای سادگی نمایش می‌دهیم).

                            return (
                                <div key={offer.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
                                    <div className='flex flex-col'>
                                        <p className="font-bold text-gray-800">
                                            پیشنهاد به سفارش: <span className="text-gray-500">{offer.orderID}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            مبلغ پیشنهادی: {offer.price.toLocaleString('fa-IR')} ریال
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 mt-2 sm:mt-0 rounded-full text-xs font-bold ${statusColor}`}>
                                        {statusLabel}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center text-gray-500">تاریخچه‌ای از پیشنهادات یا سفارشات نهایی یافت نشد.</div>
                    )}

                    {/* می‌توان سفارشات نهایی شده را نیز در اینجا نمایش داد (اختیاری) */}
                    {/* {finishedOrders.map(order => <div ...> نمایش سفارش نهایی </div>)} */}
                </div>
            </div>
        </div>
    );
};

export default DriverReports;