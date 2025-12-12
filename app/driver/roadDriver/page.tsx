
// "use client"
// import React, { useEffect, useState, useCallback } from 'react';
// import { 
//     OrderOffer, 
//     OfferStatus, 
//     Order, 
//     OrderStatus,
//     PaymentDriver
// } from '../../types'; 
// // ایمپورت توابع سرویس
// import { 
//     getOrdersByDriverId, 
//     getOffersByDriverId 
// } from './../driverService';
// import {
//     updateOrder 
// } from '@/app/company/companyService';
// import { 
//     ClipboardList, 
//     MapPin, 
//     Truck, 
//     Scale, 
//     DollarSign,
//     CheckCircle,
//     XCircle,
//     Loader2,
//     Route, 
//     CheckSquare,
//     // آیکون‌های جدید برای تایم‌لاین
//     Phone, 
//     CheckCircle2, 
//     Circle, 
//     MoreVertical,
//     Clock
// } from 'lucide-react';
// import { useDriverDashboardData } from '../useDriverDashboardData';

// // --- Helper Functions (تعریف شده در پاسخ قبلی) ---
// // (کدهای getDriverStatusLabel و DataItem بدون تغییر باقی می‌مانند)
// const getDriverStatusLabel = (status: OrderStatus): { label: string, color: string, style: string } => {
//   switch (status) {
//     case OrderStatus.NEW: 
//     case OrderStatus.WAITING_FOR_OFFERS: 
//         return { label: "منتظر تخصیص شرکت", color: "text-blue-800", style: "bg-blue-100" };
//     case OrderStatus.DRIVER_ASSIGNED: 
//         return { label: "منتظر تایید نهایی شما", color: "text-indigo-800", style: "bg-indigo-100" };
//     case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION: 
//         return { label: "منتظر شروع بارگیری", color: "text-purple-800", style: "bg-purple-100" };
//     case OrderStatus.LOADING: 
//         return { label: "در حال بارگیری...", color: "text-yellow-900", style: "bg-yellow-300 text-black" };
//     case OrderStatus.ON_ROAD: 
//         return { label: "در حال حمل به مقصد", color: "text-orange-800", style: "bg-[#f4a261] bg-opacity-90 text-white" };
//     case OrderStatus.DELIVERED: 
//         return { label: "تحویل داده شد", color: "text-green-800", style: "bg-green-100" };
//     case OrderStatus.FINISHED: 
//         return { label: "تسویه انجام شد", color: "text-cyan-800", style: "bg-cyan-100" };
//     case OrderStatus.PAY: 
//         return { label: "تسویه و پرداخت کامل", color: "text-lime-800", style: "bg-lime-100" }; 
//     case OrderStatus.CANCELED: 
//         return { label: "لغو شده", color: "text-red-800", style: "bg-red-100" };
//     default: return { label: "نامشخص", color: "text-gray-700", style: "bg-gray-200" };
//   }
// };

// const DataItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
//     <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
//       <Icon className="w-5 h-5 text-gray-500 mb-1 stroke-1.5" />
//       <span className="text-[10px] text-gray-400 font-medium">{label}</span>
//       <span className="text-sm font-bold text-gray-800 truncate max-w-full">{value}</span>
//     </div>
// );


// // --- NEW Timeline Components (بر اساس طرح ارائه شده توسط شما) ---

// interface DeliveryStep {
//     id: string;
//     type: 'sender' | 'driver' | 'receiver';
//     title: string;
//     subtitle: string; // معمولاً آدرس یا نام
//     address?: string;
//     isCompleted: boolean;
//     isCurrent: boolean;
//     contactEnabled: boolean;
//     personName?: string;
//     contactNumber?: string;
// }

// interface TimelineItemProps {
//     step: DeliveryStep;
//     isLast: boolean;
// }

// const TimelineItem: React.FC<TimelineItemProps> = ({ step, isLast }) => {
//     // برای وضعیت DELIVERED: هر سه مرحله کامل می‌شوند.
//     const isFinished = step.isCompleted;

//     const renderIcon = () => {
//         if (isFinished) {
//             return <CheckCircle2 className="w-6 h-6 text-green-600 bg-white rounded-full" fill="white" />;
//         }

//         switch (step.type) {
//             case 'sender': 
//                 return <CheckCircle2 className="w-6 h-6 text-gray-400 bg-white rounded-full" fill="white" />;
//             case 'driver': 
//                 return <Truck className="w-6 h-6 text-gray-800 bg-white" />; // وضعیت فعلی
//             case 'receiver': 
//                 return <div className="w-6 h-6 rounded-full border-[3px] border-black bg-white"></div>;
//             default: return null;
//         }
//     };

//     const subtitleText = step.address || step.subtitle || "";

//     return (
//         <div className="relative flex items-start gap-4 w-full">
//             {/* Connector Line */}
//             {!isLast && (
//                 <div className={`absolute right-[11px] top-8 bottom-[-20px] w-[2px] ${isFinished ? 'bg-green-600' : 'bg-gray-300'}`}></div>
//             )}

//             {/* Icon/Status Indicator */}
//             <div className="relative z-10 flex-shrink-0 mt-1">
//                 {renderIcon()}
//             </div>

//             {/* Content */}
//             <div className="flex-1 flex justify-between items-start pt-1 pb-6">
//                 <div className="flex flex-col gap-1 text-right">
//                     <h3 className={`font-bold text-sm ${isFinished ? 'text-green-800' : 'text-gray-800'}`}>
//                         {step.title}
//                     </h3>
//                     <p className={`text-xs leading-5 ${isFinished ? 'text-green-600' : 'text-gray-500'}`}>
//                         {subtitleText}
//                     </p>
//                 </div>

//                 {/* Action Button (Call) */}
//                 {step.contactEnabled && step.contactNumber && (
//                     <a 
//                         href={`tel:${step.contactNumber}`}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-400 text-teal-500 hover:bg-teal-50 transition-colors flex-shrink-0"
//                     >
//                         <Phone className="w-4 h-4" />
//                         <span className="text-xs font-bold">تماس با گیرنده</span>
//                     </a>
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- Map & Badge Components ---

// // این بخش برای شبیه‌سازی است و از داده‌های واقعی استفاده نمی‌کند.
// const MapBackground = () => {
//     return (
//         <div className="absolute inset-0 z-0 overflow-hidden bg-gray-200">
//              <iframe 
//                 width="100%" 
//                 height="120%" 
//                 frameBorder="0" 
//                 scrolling="no" 
//                 marginHeight={0} 
//                 marginWidth={0} 
//                 src="https://www.openstreetmap.org/export/embed.html?bbox=51.30%2C35.65%2C51.50%2C35.78&amp;layer=mapnik" 
//                 style={{ 
//                     filter: 'grayscale(100%) contrast(90%) brightness(105%)',
//                     opacity: 0.8,
//                     transform: 'translateY(-10%)' 
//                 }}
//                 title="Tehran Map"
//             ></iframe>

//             <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
//                 <div className="relative">
//                     <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white transform rotate-45">
//                         <img 
//                             src="https://cdn-icons-png.flaticon.com/512/741/741407.png" 
//                             alt="Truck Top View" 
//                             className="w-10 h-10 opacity-80"
//                         />
//                     </div>
//                     <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const FloatingTimeBadge = () => {
//     // از آنجایی که فیلدی برای تخمین زمان در Order نداریم، اینجا یک مقدار ثابت قرار می‌دهیم.
//     return (
//         <div className="absolute top-1/2 left-4 z-10 transform -translate-y-[180px]">
//             <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-gray-100 flex items-center gap-2">
//                 <span className="text-gray-500 text-xs font-medium">زمان رسیدن تا مقصد:</span>
//                 <span className="text-black font-bold text-lg dir-ltr">24:25</span>
//                 <span className="text-gray-500 text-xs">دقیقه</span>
//             </div>
//         </div>
//     );
// };

// // --- Main Content Components (NEW) ---

// const generateDeliverySteps = (order: Order, currentStatus: OrderStatus): DeliveryStep[] => {
//     const isDelivered = currentStatus === OrderStatus.DELIVERED || currentStatus === OrderStatus.FINISHED || currentStatus === OrderStatus.PAY;

//     // فرض: نام فرستنده در فیلد loadDescription یا مشابه آن نگهداری می‌شود
//     const senderName = order.companyID; // یا هر نام دیگری که منطقاً فرستنده را نشان می‌دهد

//     return [
//         {
//             id: '1',
//             type: 'sender',
//             title: 'محل بارگیری (فرستنده)',
//             subtitle: `${order.originProvince}, ${order.originCity}`,
//             address: `${order.originProvince}, ${order.originCity}`,
//             isCompleted: true, // فرض می‌کنیم اگر به ON_ROAD رسیده، بارگیری تکمیل شده است
//             isCurrent: false,
//             contactEnabled: false, 
//         },
//         {
//             id: '2',
//             type: 'driver',
//             title: 'شما (در مسیر)',
//             subtitle: 'در حال حمل بار',
//             isCompleted: isDelivered, // اگر تحویل داده شده، این مرحله هم تکمیل شده
//             isCurrent: !isDelivered,
//             contactEnabled: false,
//         },
//         {
//             id: '3',
//             type: 'receiver',
//             title: 'مقصد (تحویل گیرنده)',
//             subtitle: order.unloadingAddress,
//             address: order.unloadingAddress,
//             personName: order.receiverName,
//             contactNumber: order.receiverContact,
//             isCompleted: isDelivered,
//             isCurrent: false,
//             contactEnabled: true,
//         }
//     ];
// };

// // 1. محتوای مخصوص وضعیت "در حال حمل به مقصد"
// const OnRoadContent: React.FC<{ order: Order }> = ({ order }) => {
//     const steps = generateDeliverySteps(order, OrderStatus.ON_ROAD);
//     const receiver = steps.find(s => s.type === 'receiver');

//     // ساعت کار انبار
//     const workHourInfo = order.unloadingFromHour && order.unloadingToHour 
//         ? `${order.unloadingFromHour} تا ${order.unloadingToHour}` 
//         : 'نامشخص';

//     return (
//         <div className="relative w-full h-[350px] bg-white overflow-hidden shadow-2xl flex flex-col">

//             {/* Map Section */}
//             <div className="flex-1 relative">
//                 <MapBackground />
//                 <FloatingTimeBadge />
//             </div>

//             {/* Bottom Sheet Card */}
//             <div className="relative z-20 bg-white rounded-t-[30px] shadow-[0_-5px_25px_rgba(0,0,0,0.1)] px-6 pt-6 pb-6 -mt-6">

//                 {/* Timeline List */}
//                 <div className="flex flex-col pr-2">
//                     {steps.map((step, index) => (
//                         <TimelineItem 
//                             key={step.id} 
//                             step={step} 
//                             isLast={index === steps.length - 1} 
//                         />
//                     ))}
//                 </div>

//                 {/* Warning/Info Banner */}
//                 <div className="mt-2 mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-center text-center">
//                     <Clock className="w-4 h-4 text-blue-500 ml-2" />
//                     <span className="text-gray-800 text-xs font-medium">
//                         ساعت کار انبار: <span className="mx-1 font-bold">{workHourInfo}</span>
//                     </span>
//                 </div>

//                 {/* Receiver Name */}
//                 <div className="flex justify-between items-center mb-4 px-1 border-t pt-3">
//                     <span className="text-gray-800 font-bold text-sm">تحویل گیرنده بار</span>
//                     <span className="text-gray-500 text-sm">{receiver?.personName || 'نامشخص'}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // 2. محتوای مخصوص وضعیت "تحویل داده شد"
// const DeliveredContent: React.FC<{ order: Order }> = ({ order }) => {
//     const steps = generateDeliverySteps(order, OrderStatus.DELIVERED);
//     const assignedOffer = order.offers?.find(o => o.state === OfferStatus.ACCEPTED);
//     const price = assignedOffer?.price || 0;

//     return (
//         <div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-inner">
//             <div className="flex items-center gap-3 border-b pb-3 mb-3">
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//                 <h3 className="text-lg font-bold text-green-800">تحویل بار با موفقیت انجام شد</h3>
//             </div>

//             {/* Timeline Summary for Delivered */}
//             <div className="flex flex-col pr-2">
//                 {steps.map((step, index) => (
//                     <TimelineItem 
//                         key={step.id} 
//                         step={step} 
//                         isLast={index === steps.length - 1} 
//                     />
//                 ))}
//             </div>

//             {/* Payment Summary */}
//             <div className="mt-4 pt-3 border-t border-green-200 grid grid-cols-2 gap-3">
//                 <div className='flex justify-between text-sm'>
//                     <span className="text-gray-600">کرایه توافق شده:</span>
//                     <span className="font-bold text-gray-900">{price.toLocaleString('fa-IR')} ر.ا</span>
//                 </div>
//                 <div className='flex justify-between text-sm'>
//                     <span className="text-gray-600">وضعیت پرداخت:</span>
//                     <span className="font-bold text-orange-600">در انتظار تسویه شرکت</span>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // 3. محتوای پیش‌فرض کارت برای سایر وضعیت‌ها
// const DefaultOrderBodyContent: React.FC<{ order: Order }> = ({ order }) => {
//     const assignedOffer = order.offers?.find(o => o.state === OfferStatus.ACCEPTED);
//     const price = assignedOffer?.price || 0;

//     return (
//         <div className="grid grid-cols-4 gap-2 border-b border-gray-100 pb-4">
//             <DataItem 
//                 icon={DollarSign} 
//                 label="مبلغ حمل" 
//                 value={price.toLocaleString('fa-IR') + ' ر.ا'} 
//             />
//             <DataItem 
//                 icon={Truck} 
//                 label="نوع خودرو" 
//                 value={order.requiredVehicleType || "ناشناس"} 
//             />
//             <DataItem 
//                 icon={Scale} 
//                 label="وزن (کیلوگرم)" 
//                 value={order.weight} 
//             />
//             <DataItem 
//                 icon={ClipboardList} 
//                 label="نوع کالا" 
//                 value={order.goodType} 
//             />
//         </div>
//     );
// };


// // --- Order Card Component (بدون تغییر منطق اصلی) ---

// interface DriverOrderCardProps {
//     order: Order;
//     onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
//     isLoading: boolean;
// }

// const DriverOrderCard: React.FC<DriverOrderCardProps> = ({ order, onStatusUpdate, isLoading }) => {
//     const statusInfo = getDriverStatusLabel(order.status);

//     const getNextStepButton = () => {
//         let label = '';
//         let newStatus: OrderStatus | null = null;
//         let style = 'bg-black text-white hover:bg-gray-800';
//         let disabled = isLoading;

//         switch (order.status) {
//             case OrderStatus.DRIVER_ASSIGNED:
//                 label = 'تایید نهایی بار (شروع کار)';
//                 newStatus = OrderStatus.DRIVER_ACCEPTED_CONFIRMATION;
//                 style = 'bg-green-600 text-white hover:bg-green-700';
//                 break;
//             case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION:
//                 label = 'شروع بارگیری';
//                 newStatus = OrderStatus.LOADING;
//                 style = 'bg-orange-600 text-white hover:bg-orange-700';
//                 break;
//             case OrderStatus.LOADING:
//                 label = 'پایان بارگیری و حرکت به مقصد';
//                 newStatus = OrderStatus.ON_ROAD;
//                 style = 'bg-blue-600 text-white hover:bg-blue-700';
//                 break;
//             case OrderStatus.ON_ROAD:
//                 // این دکمه اصلی در طرح جدید است
//                 label = 'تایید تحویل بار در مقصد';
//                 newStatus = OrderStatus.DELIVERED;
//                 // دکمه شما در طرح جدید رنگ سبز کم‌رنگ داشت
//                 style = 'bg-[#d0fcf5] active:bg-[#a6f0e4] text-black hover:bg-green-100'; 
//                 break;
//             case OrderStatus.DELIVERED:
//             case OrderStatus.FINISHED:
//             case OrderStatus.PAY:
//                 return (
//                     <div className="text-center py-2 text-sm font-bold text-green-700 bg-green-50 rounded-full border border-green-300">
//                         {statusInfo.label}
//                     </div>
//                 );
//             case OrderStatus.CANCELED:
//                 return (
//                     <div className="text-center py-2 text-sm font-bold text-red-700 bg-red-50 rounded-full border border-red-300">
//                         <XCircle className="w-4 h-4 inline-block ml-1" />
//                         سفارش لغو شده است.
//                     </div>
//                 );
//             default:
//                 return null;
//         }

//         if (newStatus) {
//             return (
//                 <button
//                     onClick={() => onStatusUpdate(order.id!, newStatus!)}
//                     disabled={disabled}
//                     // این کلاس‌ها برای دکمه سبز کم‌رنگ در طرح ON_ROAD اعمال می‌شود
//                     className={`w-full py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 
//                                 ${style} ${order.status === OrderStatus.ON_ROAD ? 'text-lg py-4' : ''}`}
//                 >
//                     {disabled ? <Loader2 className="animate-spin w-5 h-5 inline-block" /> : 
//                      <CheckCircle className="w-5 h-5 inline-block ml-1" />}
//                     {label}
//                 </button>
//             );
//         }
//         return null;
//     };

//     // تابع کمکی برای رندر محتوای بدنه کارت
//     const renderCardContent = () => {
//         switch (order.status) {
//             case OrderStatus.ON_ROAD:
//                 // برای این وضعیت، رندر بدنه کاملاً متفاوت است.
//                 // کل کارت ردیابی داخل OnRoadContent است.
//                 return <OnRoadContent order={order} />; 
//             case OrderStatus.DELIVERED:
//                 return <DeliveredContent order={order} />;
//             default:
//                 return <DefaultOrderBodyContent order={order} />;
//         }
//     }

//     // اگر ON_ROAD باشد، ساختار کلی کارت متفاوت است.
//     if (order.status === OrderStatus.ON_ROAD) {
//         // چون OnRoadContent شامل Map و Bottom Sheet است، 
//         // آن را به عنوان محتوای اصلی رندر می‌کنیم و دکمه را در پایین آن قرار می‌دهیم.
//         return (
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
//                  {/* Header و Status فقط برای سادگی در اینجا حفظ می‌شوند، اما در طرح جدید، 
//                     باید در بالای MapBackground قرار گیرند که پیچیدگی اضافه می‌کند.
//                     برای سادگی پیاده‌سازی، فقط محتوای ردیابی را جایگزین می‌کنیم. */}
//                 <div className="px-5 pt-4">
//                      <div className="flex justify-between items-start border-b pb-4 mb-4">
//                         <div className={`text-[10px] px-3 py-1.5 rounded-full font-medium shadow-sm ${statusInfo.style} ${statusInfo.color}`}>
//                             {statusInfo.label}
//                         </div>
//                         <div className="flex items-center gap-1 text-gray-800">
//                             <span className="font-bold text-lg">{order.originCity}</span>
//                             <span className="text-gray-400 mx-1">|</span>
//                             <span className="text-sm text-gray-500">{order.destinationCity}</span>
//                             <MapPin className="w-5 h-5 text-gray-900 fill-transparent stroke-2 ml-1" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* محتوای ردیابی (شامل Map و Timeline) */}
//                 <div className="pb-4">
//                     {renderCardContent()}
//                 </div>

//                 {/* Action Button */}
//                 <div className="p-5 pt-0">
//                     {getNextStepButton()}
//                 </div>
//             </div>
//         );
//     }

//     // ساختار پیش‌فرض برای سایر وضعیت‌ها
//     return (
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 space-y-4 mb-6">

//             {/* Header and Status */}
//             <div className="flex justify-between items-start border-b pb-4 mb-4">
//                 <div className={`text-[10px] px-3 py-1.5 rounded-full font-medium shadow-sm ${statusInfo.style} ${statusInfo.color}`}>
//                     {statusInfo.label}
//                 </div>
//                 <div className="flex items-center gap-1 text-gray-800">
//                     <span className="font-bold text-lg">{order.originCity}</span>
//                     <span className="text-gray-400 mx-1">|</span>
//                     <span className="text-sm text-gray-500">{order.destinationCity}</span>
//                     <MapPin className="w-5 h-5 text-gray-900 fill-transparent stroke-2 ml-1" />
//                 </div>
//             </div>

//             {/* Conditional Content Body */}
//             <div className="border-b border-gray-100 pb-4">
//                 {renderCardContent()}
//             </div>
//             {/* Action Button */}
//             <div className="pt-2">
//                 {getNextStepButton()}
//             </div>
//         </div>
//     );
// };


// // --- Main Component (بدون تغییر) ---
// export const DriverReports: React.FC = () => {
//     const { driver } = useDriverDashboardData();
//     const driverID = driver?.id;

//     // لیست سفارشات فعال (Order[]) که راننده به آن تخصیص یافته است
//     const [activeOrders, setActiveOrders] = useState<Order[]>([]); 
//     // لیست تمامی پیشنهادات (OrderOffer[]) که راننده داده است
//     const [allOffers, setAllOffers] = useState<OrderOffer[]>([]); 

//     const [loading, setLoading] = useState(true);
//     const [isUpdating, setIsUpdating] = useState(false);

//     const loadData = useCallback(async () => {
//         if (!driverID) return;
//         setLoading(true);
//         try {
//             // 1. بارگیری سفارشات فعال/تخصیص یافته
//             const fetchedOrders = await getOrdersByDriverId(driverID);
//             setActiveOrders(fetchedOrders || []);

//             // 2. بارگیری تمامی پیشنهادات ثبت شده
//             const fetchedOffers = await getOffersByDriverId(driverID);
//             setAllOffers(fetchedOffers || []);

//         } catch (error) {
//             console.error("Error loading driver data:", error);
//             setActiveOrders([]);
//             setAllOffers([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [driverID]);

//     useEffect(() => {
//         loadData();
//     }, [loadData]);


//     const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
//         setIsUpdating(true);
//         try {
//             // از تابع updateOrder شرکت برای به‌روزرسانی وضعیت استفاده می‌شود
//             const updatedOrder = await updateOrder(orderId, { status: newStatus });

//             // به‌روزرسانی لیست سفارشات فعال
//             setActiveOrders(prevOrders => 
//                 prevOrders.map(order => order.id === orderId ? { ...order, ...updatedOrder } : order)
//             );

//             alert(`وضعیت سفارش با موفقیت به "${getDriverStatusLabel(newStatus).label}" تغییر یافت.`);
//         } catch (error) {
//             console.error("Error updating order status:", error);
//             alert("خطا در به‌روزرسانی وضعیت سفارش. لطفاً دوباره تلاش کنید.");
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     if (!driverID) return <div className="p-4 text-center text-red-500">پروفایل راننده یافت نشد.</div>;

//     // فیلتر برای نمایش سفارشاتی که راننده باید آن‌ها را پیش ببرد (شامل DELIVERED برای نمایش نهایی)
//     const activeWorkflowOrders = activeOrders.filter(o => 
//         o.status === OrderStatus.DRIVER_ASSIGNED || 
//         o.status === OrderStatus.DRIVER_ACCEPTED_CONFIRMATION ||
//         o.status === OrderStatus.LOADING ||
//         o.status === OrderStatus.ON_ROAD ||
//         o.status === OrderStatus.DELIVERED // DELIVERED را نیز در بخش فعال نگه می‌داریم تا دکمه تسویه شرکت را ببیند
//     );

//     // فیلتر برای تاریخچه (سفارشات نهایی شده، تسویه شده یا لغو شده)
//     const historyOrders = activeOrders.filter(o => 
//         o.status === OrderStatus.FINISHED || 
//         o.status === OrderStatus.PAY || 
//         o.status === OrderStatus.CANCELED
//     );

//     return (
//         <div dir="rtl" className="space-y-8 p-4 bg-gray-50 min-h-screen">
//             <h2 className="text-2xl font-extrabold text-gray-900 mb-6">پنل رانندگان - مدیریت سفارش</h2>

//             {/* --------------------- A. Active Orders (سفارشات فعال) --------------------- */}
//             <div className="space-y-4">
//                 <div className="font-bold text-xl text-gray-800 flex items-center gap-2 border-b pb-2">
//                     <Truck size={20} className="text-orange-500" /> سفارشات فعال (مراحل پیشرفت)
//                 </div>
//                 {loading ? (
//                     <div className="text-center py-10 text-gray-500">
//                         <Loader2 className="animate-spin w-6 h-6 inline-block mb-2" />
//                         در حال بارگذاری سفارشات فعال...
//                     </div>
//                 ) : activeWorkflowOrders.length > 0 ? (
//                     activeWorkflowOrders.slice().reverse().map(order => (
//                         <DriverOrderCard 
//                             key={order.id} 
//                             order={order} 
//                             onStatusUpdate={handleStatusUpdate} 
//                             isLoading={isUpdating}
//                         />
//                     ))
//                 ) : (
//                     <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm">
//                         در حال حاضر سفارش فعالی برای پیشبرد ثبت نشده است.
//                     </div>
//                 )}
//             </div>

//             {/* --------------------- B. History (تاریخچه پیشنهادات و سفارشات نهایی) --------------------- */}
//             <div className="space-y-4 pt-6">
//                 <div className="font-bold text-xl text-gray-800 flex items-center gap-2 border-b pb-2">
//                     <ClipboardList size={20} className="text-blue-500" /> تاریخچه پیشنهادات و سفارشات نهایی
//                 </div>
//                 <div className="divide-y divide-gray-100 bg-white rounded-xl shadow-sm">

//                     {allOffers.length > 0 ? (
//                         allOffers.slice().reverse().map(offer => {
//                             const isAccepted = offer.state === OfferStatus.ACCEPTED;
//                             const statusColor = isAccepted ? 'bg-green-100 text-green-700' : offer.state === OfferStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
//                             const statusLabel = isAccepted ? 'تایید شده' : offer.state === OfferStatus.REJECTED ? 'رد شده' : 'در انتظار';

//                             return (
//                                 <div key={offer.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
//                                     <div className='flex flex-col'>
//                                         <p className="font-bold text-gray-800">
//                                             پیشنهاد به سفارش: <span className="text-gray-500">{offer.orderID}</span>
//                                         </p>
//                                         <p className="text-sm text-gray-500 mt-1">
//                                             مبلغ پیشنهادی: {offer.price.toLocaleString('fa-IR')} ریال
//                                         </p>
//                                     </div>
//                                     <span className={`px-3 py-1 mt-2 sm:mt-0 rounded-full text-xs font-bold ${statusColor}`}>
//                                         {statusLabel}
//                                     </span>
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <div className="p-6 text-center text-gray-500">تاریخچه‌ای از پیشنهادات یا سفارشات نهایی یافت نشد.</div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
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
// ایمپورت توابع سرویس
import {
  getOrdersByDriverId,
  getOffersByDriverId
} from './../driverService';
import {
  updateOrder
} from '@/app/company/companyService';
import {
  ClipboardList,
  MapPin,
  Truck,
  Scale,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  CheckSquare,
  // آیکون‌های جدید برای تایم‌لاین
  Phone,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData';

// --- Helper Functions (بدون تغییر منطق اصلی) ---

const getDriverStatusLabel = (status: OrderStatus): { label: string, color: string, style: string } => {
  switch (status) {
    case OrderStatus.NEW:
    case OrderStatus.WAITING_FOR_OFFERS:
      return { label: "منتظر تخصیص شرکت", color: "text-blue-800", style: "bg-blue-100" };
    case OrderStatus.DRIVER_ASSIGNED:
      return { label: "منتظر تایید نهایی شما", color: "text-indigo-800", style: "bg-indigo-100" };
    case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION:
      return { label: "منتظر شروع بارگیری", color: "text-purple-800", style: "bg-purple-100" };
    case OrderStatus.LOADING:
      return { label: "در حال بارگیری...", color: "text-yellow-900", style: "bg-yellow-300 text-black" };
    case OrderStatus.ON_ROAD:
      return { label: "در حال حمل به مقصد", color: "text-orange-800", style: "bg-[#f4a261] bg-opacity-90 text-white" };
    case OrderStatus.DELIVERED:
      return { label: "تحویل داده شد", color: "text-green-800", style: "bg-green-100" };
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


// --- Timeline Types & Components ---

interface DeliveryStep {
  id: string;
  type: 'sender' | 'driver' | 'receiver';
  title: string;
  subtitle: string;
  address?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  contactEnabled: boolean;
  personName?: string;
  contactNumber?: string;
}

interface TimelineItemProps {
  step: DeliveryStep;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ step, isLast }) => {
  const isFinished = step.isCompleted;

  const renderIcon = () => {
    if (isFinished) {
      return <CheckCircle2 className="w-6 h-6 text-green-600 bg-white rounded-full" fill="white" />;
    }

    switch (step.type) {
      case 'sender':
        return <CheckCircle2 className="w-6 h-6 text-gray-400 bg-white rounded-full" fill="white" />;
      case 'driver':
        return <Truck className="w-6 h-6 text-gray-800 bg-white" />; // وضعیت فعلی
      case 'receiver':
        return <div className="w-6 h-6 rounded-full border-[3px] border-black bg-white"></div>;
      default: return null;
    }
  };

  const subtitleText = step.address || step.subtitle || "";

  return (
    <div className="relative flex items-start gap-4 w-full">
      {/* Connector Line */}
      {!isLast && (
        <div className={`absolute right-[11px] top-8 bottom-[-20px] w-[2px] ${isFinished ? 'bg-green-600' : 'bg-gray-300'}`}></div>
      )}

      {/* Icon/Status Indicator */}
      <div className="relative z-10 flex-shrink-0 mt-1">
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-between items-start pt-1 pb-6">
        <div className="flex flex-col gap-1 text-right">
          <h3 className={`font-bold text-sm ${isFinished ? 'text-green-800' : 'text-gray-800'}`}>
            {step.title}
          </h3>
          <p className={`text-xs leading-5 ${isFinished ? 'text-green-600' : 'text-gray-500'}`}>
            {subtitleText}
          </p>
        </div>

        {/* Action Button (Call) */}
        {step.contactEnabled && step.contactNumber && (
          <a
            href={`tel:${step.contactNumber}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-400 text-teal-500 hover:bg-teal-50 transition-colors flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span className="text-xs font-bold">تماس</span>
          </a>
        )}
      </div>
    </div>
  );
};

// --- NEW Placeholder for Map ---

const MapPlaceholder = ({ origin, destination }: { origin: string, destination: string }) => {
  return (
    <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-200">
      {/* Background image/gradient simulation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-teal-50 opacity-50"></div>

      {/* Route path simulation */}
      <div className="relative z-10 flex items-center justify-between w-4/5">
        <div className="flex flex-col items-center">
          <MapPin className="w-6 h-6 text-green-600 fill-green-100 stroke-2" />
          <span className="text-xs font-bold mt-1 text-gray-800">{origin}</span>
        </div>

        <div className="flex-1 flex flex-col items-center mx-2">
          {/* Simulated Truck Marker */}
          <Truck className="w-8 h-8 text-blue-600 fill-blue-100 animate-pulse" />
          <div className="h-0.5 w-full bg-blue-300 -mt-1"></div>
          <span className="text-xs text-gray-500 mt-1">در مسیر...</span>
        </div>

        <div className="flex flex-col items-center">
          <MapPin className="w-6 h-6 text-red-600 fill-red-100 stroke-2" />
          <span className="text-xs font-bold mt-1 text-gray-800">{destination}</span>
        </div>
      </div>
    </div>
  );
};

// --- Data Generation Helper ---

const generateDeliverySteps = (order: Order, currentStatus: OrderStatus): DeliveryStep[] => {
  const isDelivered = currentStatus === OrderStatus.DELIVERED || currentStatus === OrderStatus.FINISHED || currentStatus === OrderStatus.PAY;

  // فرض: نام فرستنده در فیلد companyID است
  const senderName = "شرکت حمل و نقل"; // Placeholder برای فرستنده

  return [
    {
      id: '1',
      type: 'sender',
      title: 'محل بارگیری',
      subtitle: `${order.originProvince}, ${order.originCity}`,
      address: `${order.originProvince}, ${order.originCity}`,
      isCompleted: true, // اگر به ON_ROAD رسیده، بارگیری تکمیل شده است
      isCurrent: false,
      contactEnabled: false,
    },
    {
      id: '2',
      type: 'driver',
      title: 'موقعیت فعلی شما',
      subtitle: 'در حال حمل بار',
      isCompleted: isDelivered, // اگر تحویل داده شده، این مرحله هم تکمیل شده
      isCurrent: !isDelivered,
      contactEnabled: false,
    },
    {
      id: '3',
      type: 'receiver',
      title: 'مقصد (تحویل گیرنده)',
      subtitle: order.unloadingAddress,
      address: order.unloadingAddress,
      personName: order.receiverName,
      contactNumber: order.receiverContact,
      isCompleted: isDelivered,
      isCurrent: false,
      contactEnabled: true,
    }
  ];
};

// 1. محتوای مخصوص وضعیت "در حال حمل به مقصد"
const OnRoadContent: React.FC<{ order: Order }> = ({ order }) => {
  const steps = generateDeliverySteps(order, OrderStatus.ON_ROAD);
  const receiver = steps.find(s => s.type === 'receiver');

  // ساعت کار انبار
  const workHourInfo = order.unloadingFromHour && order.unloadingToHour
    ? `${order.unloadingFromHour} تا ${order.unloadingToHour}`
    : 'نامشخص';

  return (
    <div className="relative w-full bg-white flex flex-col">

      {/* Map Placeholder Section (Height reduced) */}
      <div className="relative mb-2">
        <MapPlaceholder origin={order.originCity} destination={order.destinationCity} />
        {/* <FloatingTimeBadge /> // حذف شد */}
      </div>

      {/* Bottom Sheet Card Content */}
      <div className="relative z-20 bg-white rounded-t-2xl px-4 pt-4 pb-0">

        {/* Timeline List */}
        <div className="flex flex-col pr-2">
          {steps.map((step, index) => (
            <TimelineItem
              key={step.id}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Warning/Info Banner */}
        <div className="mt-2 mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-center text-center">
          <Clock className="w-4 h-4 text-blue-500 ml-2 flex-shrink-0" />
          <span className="text-gray-800 text-xs font-medium">
            ساعت کار انبار: <span className="mx-1 font-bold">{workHourInfo}</span>
          </span>
        </div>

        {/* Receiver Name */}
        <div className="flex justify-between items-center mb-4 px-1 border-t pt-3">
          <span className="text-gray-800 font-bold text-sm">تحویل گیرنده بار</span>
          <span className="text-gray-500 text-sm">{receiver?.personName || 'نامشخص'}</span>
        </div>
      </div>
    </div>
  );
};

// 2. محتوای مخصوص وضعیت "تحویل داده شد"
const DeliveredContent: React.FC<{ order: Order }> = ({ order }) => {
  const steps = generateDeliverySteps(order, OrderStatus.DELIVERED);
  const assignedOffer = order.offers?.find(o => o.state === OfferStatus.ACCEPTED);
  const price = assignedOffer?.price || 0;

  return (
    <div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-inner">
      <div className="flex items-center gap-3 border-b pb-3 mb-3">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-green-800">تحویل بار با موفقیت انجام شد</h3>
      </div>

      {/* Timeline Summary for Delivered */}
      <div className="flex flex-col pr-2">
        {steps.map((step, index) => (
          <TimelineItem
            key={step.id}
            step={step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* Payment Summary */}
      <div className="mt-4 pt-3 border-t border-green-200 grid grid-cols-2 gap-3 text-sm">
        <div className='flex justify-between'>
          <span className="text-gray-600">کرایه توافق شده:</span>
          <span className="font-bold text-gray-900">{price.toLocaleString('fa-IR')} ر.ا</span>
        </div>
        <div className='flex justify-between'>
          <span className="text-gray-600">وضعیت پرداخت:</span>
          <span className="font-bold text-orange-600">در انتظار تسویه شرکت</span>
        </div>
      </div>
    </div>
  );
};


// 3. محتوای پیش‌فرض کارت برای سایر وضعیت‌ها
const DefaultOrderBodyContent: React.FC<{ order: Order }> = ({ order }) => {
  const assignedOffer = order.offers?.find(o => o.state === OfferStatus.ACCEPTED);
  const price = assignedOffer?.price || 0;

  return (
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
  );
};


// --- Order Card Component (اصلاح برای موبایل و ON_ROAD) ---

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
        label = 'تایید تحویل بار در مقصد';
        newStatus = OrderStatus.DELIVERED;
        style = 'bg-[#d0fcf5] active:bg-[#a6f0e4] text-black hover:bg-green-100';
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
          // کلاس‌های سفارشی برای دکمه ON_ROAD
          className={`w-full py-3 rounded-xl font-bold transition-colors disabled:opacity-50 
                                ${style} ${order.status === OrderStatus.ON_ROAD ? 'text-lg py-4' : 'text-sm'}`}
        >
          {disabled ? <Loader2 className="animate-spin w-5 h-5 inline-block" /> :
            <CheckCircle className="w-5 h-5 inline-block ml-1" />}
          {label}
        </button>
      );
    }
    return null;
  };

  // تابع کمکی برای رندر محتوای بدنه کارت
  const renderCardContent = () => {
    switch (order.status) {
      case OrderStatus.ON_ROAD:
      case OrderStatus.DELIVERED:
        return <div className="p-0 sm:p-5">{order.status === OrderStatus.ON_ROAD ? <OnRoadContent order={order} /> : <DeliveredContent order={order} />}</div>;
      default:
        return <DefaultOrderBodyContent order={order} />;
    }
  }

  // ساختار اصلی برای تمامی وضعیت‌ها
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">

      {/* Header and Status (خارج از بخش محتوای شرطی) */}
      <div className={`flex justify-between items-start border-b pb-4 pt-5 px-5 ${order.status !== OrderStatus.ON_ROAD ? 'mb-4' : 'mb-0'}`}>
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

      {/* Conditional Content Body - حذف border-b برای OnRoadContent/DeliveredContent */}
      <div className={`${order.status !== OrderStatus.ON_ROAD && order.status !== OrderStatus.DELIVERED ? 'px-5 border-b border-gray-100 pb-4' : ''}`}>
        {renderCardContent()}
      </div>

      {/* Action Button */}
      <div className={`pt-2 ${order.status !== OrderStatus.ON_ROAD && order.status !== OrderStatus.DELIVERED ? 'p-5 pt-2' : 'p-5 pt-0'}`}>
        {getNextStepButton()}
      </div>
    </div>
  );
};


// --- Main Component (بدون تغییر) ---
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
      const fetchedOrders = await getOrdersByDriverId(driverID);
      setActiveOrders(fetchedOrders || []);
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
      const updatedOrder = await updateOrder(orderId, { status: newStatus });

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

  const activeWorkflowOrders = activeOrders.filter(o =>
    o.status === OrderStatus.DRIVER_ASSIGNED ||
    o.status === OrderStatus.DRIVER_ACCEPTED_CONFIRMATION ||
    o.status === OrderStatus.LOADING ||
    o.status === OrderStatus.ON_ROAD ||
    o.status === OrderStatus.DELIVERED
  );

  const historyOrders = activeOrders.filter(o =>
    o.status === OrderStatus.FINISHED ||
    o.status === OrderStatus.PAY ||
    o.status === OrderStatus.CANCELED
  );

  return (
    <div dir="rtl" className="space-y-8 p-4 bg-gray-50 min-h-screen max-w-lg mx-auto">

      {/* --------------------- A. Active Orders (سفارشات فعال) --------------------- */}
      <div className="space-y-4">
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

          {allOffers.length > 0 ? (
            allOffers.slice().reverse().map(offer => {
              const isAccepted = offer.state === OfferStatus.ACCEPTED;
              const statusColor = isAccepted ? 'bg-green-100 text-green-700' : offer.state === OfferStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
              const statusLabel = isAccepted ? 'تایید شده' : offer.state === OfferStatus.REJECTED ? 'رد شده' : 'در انتظار';

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
        </div>
      </div>
    </div>
  );
};

export default DriverReports;