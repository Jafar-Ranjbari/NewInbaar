"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Order,
  OrderOffer,
  OrderStatus, // از این به بعد از وضعیت‌های جدید استفاده می‌کنیم
  OfferStatus,
  CompanyType
} from "../../types";
import {
  getCompanyOrders,
  createOrder,
  getOffersByOrderId,
  updateOfferStatus,
  updateOrder,
  createCompanyWalletTransaction,
  getCompanyByUserId,
  createCompany
} from "../companyService";
import {
  Search,
  Filter,
  MapPin,
  Truck,
  Package,
  Scale,
  ClipboardList,
  ChevronLeft,
  Users,
  CheckCircle,
  Loader2,
  Calendar,
  FileText,
  XCircle,
  DollarSign
} from 'lucide-react';

const getStatusLabel = (status: OrderStatus): { label: string, color: string, style: string } => {
  switch (status) {
    case OrderStatus.NEW: return { label: "در جستجوی راننده", color: "text-gray-600", style: "bg-orange-500" };
    case OrderStatus.WAITING_FOR_OFFERS: return { label:  "در انتظار تایید نهایی راننده", color: "text-blue-800", style: "bg-blue-100" };
    case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION: return { label: "تایید نهایی راننده", color: "text-purple-800", style: "bg-purple-100" };
    case OrderStatus.LOADING: return { label: "راننده در مسیر انبار  مبدا", color: "text-yellow-900", style: "bg-yellow-300 text-black" };
     case OrderStatus.DELIVERED_ANBAR: return { label: "DELIVERED_ANBAR", color: "text-yellow-900", style: "bg-yellow-300 text-black" };
      case OrderStatus.DELIVERED_ANBAR_CONFIRMATION: return { label: "DELIVERED_ANBAR_CONFIRMATION", color: "text-yellow-900", style: "bg-yellow-300 text-black" };
    case OrderStatus.ON_ROAD: return { label: "راننده در مسیر انبار مقصد", color: "text-orange-800", style: "bg-[#f4a261] bg-opacity-90 text-white" };
    case OrderStatus.DELIVERED: return { label: "تحویل شده", color: "text-green-800", style: "bg-green-100" };
        case OrderStatus.DELIVERED_CONFIRMATION: return { label: "DELIVERED_CONFIRMATION", color: "text-green-800", style: "bg-green-100" };
    case OrderStatus.FINISHED: return { label: "پایان یافته", color: "text-cyan-800", style: "bg-cyan-100" };
   case OrderStatus.PAY: return { label: "مرحله  پرداخت  ", color: "text-cyan-800", style: "bg-cyan-100" };
      case OrderStatus.COMMENT_FOR_DRIVER: return { label: "مرحله نظر سنجی ", color: "text-cyan-800", style: "bg-cyan-100" };
      
    default: return { label: "نامشخص", color: "text-gray-700", style: "bg-gray-200" };
  }
};

// --- New Design Components (بدون تغییرات ظاهری) ---

const Header = () => (
  <header className="pt-6 pb-4 px-4 text-center">
    <h1 className="text-xl font-bold text-gray-900">مدیریت سفارشات  شرکت </h1>
  </header>
);

const SearchBar = () => (
  <div className="px-4 mb-4">
    <div className="relative">
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pr-10 pl-4 py-3 bg-gray-100 border-none rounded-2xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:bg-white transition-colors text-right"
        placeholder="جستجو کد سفارش"
      />
    </div>
  </div>
);

// FilterTabs (به‌روزرسانی شده برای گروه‌های وضعیت جدید)
const FilterTabs = ({ activeTab, setActiveTab }: { activeTab: OrderStatus, setActiveTab: (t: OrderStatus) => void }) => {
  const tabs: { id: OrderStatus; label: string }[] = [
    { id: OrderStatus.WAITING_FOR_OFFERS, label: 'جاری ' },
    { id: OrderStatus.DRIVER_ASSIGNED, label: 'ارسال شده ' },
    { id: OrderStatus.DELIVERED, label: 'تحویل  شده ' },
    { id: OrderStatus.CANCELED, label: 'لغو شده' },
  ];

  return (
    <div className="flex items-center px-4 mb-6 gap-2">
      <button className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
        <Filter className="w-5 h-5" />
      </button>

      <div className="flex-1 overflow-x-auto no-scrollbar flex gap-2 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab.id
              ? 'bg-black text-white shadow-md'
              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const DataItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex flex-col items-center justify-center text-center gap-1">
    <Icon className="w-6 h-6 text-gray-600 mb-1 stroke-1.5" />
    <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    <span className="text-sm font-bold text-gray-800 truncate max-w-[90%]">{value}</span>
  </div>
);

// OrderCard (به‌روزرسانی منطق دکمه‌ها)
const OrderCard = ({ order, onManageClick }: { order: Order, onManageClick: (order: Order) => void }) => {
  const statusInfo = getStatusLabel(order.status);

  const getActionButtons = () => {
    switch (order.status) {
      case OrderStatus.NEW:
      case OrderStatus.WAITING_FOR_OFFERS:
      case OrderStatus.DRIVER_ACCEPTED_CONFIRMATION:
      case OrderStatus.DRIVER_ASSIGNED:
      case OrderStatus.LOADING:
        return (
          <>
            <button
              onClick={() => onManageClick(order)}
              className="flex-1 bg-black text-white py-3 px-4 rounded-full flex items-center justify-between group active:scale-95 transition-transform"
            >
              <span className="font-medium text-sm">مدیریت پیشنهادات</span>
              <div className="bg-white/20 rounded-full p-0.5">
                <ChevronLeft className="w-4 h-4 text-white" />
              </div>
            </button>
            <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-2 rounded-full text-sm font-bold active:bg-gray-50 transition-colors">
              لغو سفارش
            </button>
          </>
        );
      case OrderStatus.ON_ROAD:
        return (
          <button
            onClick={() => onManageClick(order)}
            className="flex-1 bg-black text-white py-3 px-4 rounded-full flex items-center justify-between group active:scale-95 transition-transform"
          >
            <span className="font-medium text-sm">پیگیری و وضعیت</span>
            <div className="bg-white/20 rounded-full p-0.5">
              <ChevronLeft className="w-4 h-4 text-white" />
            </div>
          </button>
        );

      case OrderStatus.DELIVERED:
        return (
          <button
            onClick={() => onManageClick(order)}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-full flex items-center justify-between group active:scale-95 transition-transform"
          >
            <span className="font-medium text-sm">تسویه و امتیازدهی</span>
            <div className="bg-white/20 rounded-full p-0.5">
              <ChevronLeft className="w-4 h-4 text-white" />
            </div>
          </button>
        );
      case OrderStatus.FINISHED:
      case OrderStatus.CANCELED:
        return (
          <div className="flex-1 flex justify-center items-center py-3 bg-gray-50 rounded-full text-xs text-gray-400 font-medium">
            {statusInfo.label}
          </div>
        );
      default:
        return (
          <div className="flex-1 flex justify-center items-center py-3 bg-gray-50 rounded-full text-xs text-gray-400 font-medium">
            جزئیات سفارش
          </div>
        );
    }
  };

  return (
    <div className="mx-4 bg-white rounded-[2rem] border border-[#d69e66] p-5 shadow-sm relative overflow-hidden mb-6">
      {/* Header Row */}
      <div className="flex justify-between items-start mb-6">
        {/* Status Badge */}
        <div className={`text-[10px] px-3 py-1.5 rounded-full font-medium shadow-sm ${statusInfo.style} ${statusInfo.color}`}>
          {statusInfo.label}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-800">
          <span className="font-bold text-lg">{order.originCity}</span>
          <span className="text-gray-400 mx-1">|</span>
          <span className="text-sm text-gray-500">{order.destinationCity}</span>
          <MapPin className="w-5 h-5 text-gray-900 fill-transparent stroke-2 ml-1" />
        </div>
      </div>

      {/* Details Grid - شامل 5 ستون */}
      <div className="grid grid-cols-5 gap-2 mb-6 border-b border-gray-100 pb-6 border-dashed">

        {/* شماره فاکتور */}
        <DataItem
          icon={FileText}
          label="ش فاکتور"
          value={order.invoiceNumber || '---'}
        />

        <DataItem
          icon={Truck}
          label="نوع خودرو"
          value={order.requiredVehicleType || "نامشخص"}
        />
        <DataItem
          icon={Package}
          label="تعداد بسته"
          value={order.packageCount || "نامشخص"}
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

      {/* Footer Actions */}
      <div className="flex items-center gap-2 mt-2">
        {getActionButtons()}
      </div>
    </div>
  );
};


// Offers Section (Used inside the Modal)
interface OffersProps {
  offers: OrderOffer[];
  handleAccept: (offer: OrderOffer) => Promise<void>;
  isLoading: boolean;
  orderID: string;
}

const OffersSection: React.FC<OffersProps> = ({ offers, handleAccept, isLoading, orderID }) => (
  <div className="space-y-4">
    <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
      <Users className="w-5 h-5 text-blue-500" /> پیشنهادات فعال
    </h3>
    {isLoading ? (
      <div className="text-center py-6 text-blue-600">
        <Loader2 className="animate-spin inline-block w-6 h-6" /> در حال بارگذاری پیشنهادات...
      </div>
    ) : offers.length > 0 ? (
      offers.map((of) => (
        <div key={of.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border-r-4 border-blue-500">
          <div className="flex flex-col">
            <span className="font-extrabold text-blue-600 text-xl flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {of.price.toLocaleString('fa-IR')} ریال
            </span>
            <span className="text-sm text-gray-600 mt-1">
              راننده: <span className="font-medium">{of.driverName || 'ناشناس'}</span>
              {of.deliveryEstimateTime && ` | زمان تقریبی: ${of.deliveryEstimateTime}`}
            </span>
          </div>
          {of.state === OfferStatus.PENDING && (
            <button
              onClick={() => handleAccept(of)}
              disabled={isLoading}
              className="bg-green-600 text-white px-5 py-2.5 rounded-full font-bold mt-3 sm:mt-0 hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1 text-sm shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              قبول و تخصیص
            </button>
          )}
        </div>
      ))
    ) : (
      <div className="bg-yellow-50 text-gray-700 p-4 rounded-lg border border-yellow-200">
        <p className="text-center font-medium">⚠️ در حال حاضر پیشنهادی برای این بار ثبت نشده است.</p>
      </div>
    )}
  </div>
);


// OrderDetailsModal (به‌روزرسانی منطق نمایش وضعیت)
interface ModalProps {
  order: Order | null;
  offers: OrderOffer[];
  onClose: () => void;
  handleAccept: (offer: OrderOffer) => Promise<void>;
  isLoading: boolean;
}

const OrderDetailsModal: React.FC<ModalProps> = ({ order, offers, onClose, handleAccept, isLoading }) => {
  if (!order) return null;

  const statusInfo = getStatusLabel(order.status);

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="bg-gray-50 w-full max-w-xl h-[90%] rounded-t-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-5 border-b shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-700" /> جزئیات سفارش
            </h2>
            <button onClick={onClose} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <XCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <span className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.style} ${statusInfo.color}`}>
            وضعیت: {statusInfo.label}
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">

          {/* Basic Info */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">اطلاعات پایه</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> <span className="font-medium">مبدا:</span> {order.originCity} ({order.originProvince})</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> <span className="font-medium">مقصد:</span> {order.destinationCity} ({order.destinationProvince})</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> <span className="font-medium">تاریخ تحویل:</span> {order.deliveryDate}</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-gray-500" /> <span className="font-medium">نوع خودرو:</span> {order.requiredVehicleType}</div>
              <div className="flex items-center gap-2"><Scale className="w-4 h-4 text-gray-500" /> <span className="font-medium">وزن/کالا:</span> {order.weight} {order.weightType} / {order.goodType}</div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-yellow-600" /> <span className="font-medium">بازه قیمت:</span> {order.expectedPriceRange}</div>

              {/* Additional Details */}
              <div className="col-span-2 mt-2 pt-2 border-t border-dashed">
                <p className="font-medium text-gray-700">توضیحات بار: <span className="font-normal text-gray-500">{order.loadDescription || 'ندارد'}</span></p>
              </div>
            </div>
          </div>

          {/* 1. Offers Section (فقط برای وضعیت NEW و WAITING_FOR_OFFERS) */}
          {(order.status === OrderStatus.NEW || order.status === OrderStatus.WAITING_FOR_OFFERS) && (
            <OffersSection
              offers={offers}
              handleAccept={handleAccept}
              isLoading={isLoading}
              orderID={order.id || ''}
            />
          )}

          {/* 2. Status specific messages and Driver/Tracking Info (به‌روزرسانی شده) */}

          {(order.status === OrderStatus.DRIVER_ASSIGNED || order.status === OrderStatus.DRIVER_ACCEPTED_CONFIRMATION || order.status === OrderStatus.LOADING || order.status === OrderStatus.ON_ROAD) && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-300">
              <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" /> پیگیری و وضعیت فعلی
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>وضعیت فعلی: <span className="font-bold">{statusInfo.label}</span></p>
                <p>راننده تخصیص یافته: **[نام راننده]**</p>
                <p>شماره تماس: **[شماره تماس راننده]**</p>
              </div>

              {/* نمایش دکمه پیگیری در صورت لزوم */}
              {(order.status === OrderStatus.LOADING || order.status === OrderStatus.ON_ROAD) && (
                <button className="w-full mt-4 bg-orange-500 text-white py-2 rounded-full font-bold hover:bg-orange-600 transition">
                  مشاهده موقعیت لحظه‌ای
                </button>
              )}
            </div>
          )}

          {order.status === OrderStatus.DELIVERED && (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold border border-green-300">
              ✅ بار تحویل داده شده. لطفاً تسویه و امتیازدهی را انجام دهید.
            </div>
          )}

          {order.status === OrderStatus.FINISHED && (
            <div className="bg-cyan-100 text-cyan-800 p-4 rounded-xl text-center font-bold border border-cyan-300">
              ✅ این سفارش با موفقیت پایان یافته است.
            </div>
          )}

          {order.status === OrderStatus.CANCELED && (
            <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold border border-red-300">
              ❌ این سفارش لغو شده است.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// --- Main Component (به‌روزرسانی منطق فیلتر و پذیرش پیشنهاد) ---
export default function OrderManagement() {
  const { currentUser } = useAuthStore();
  const [companyID, setCompanyID] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // از WAITING_FOR_OFFERS به عنوان تب پیش‌فرض استفاده می‌کنیم
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.WAITING_FOR_OFFERS);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [offers, setOffers] = useState<OrderOffer[]>([]);

  // 1. Load CompanyID and Orders (بدون تغییر)
  useEffect(() => {
    let mounted = true;
    const loadCompanyAndOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        let comp = await getCompanyByUserId(currentUser.id);
        if (!comp) {
          comp = await createCompany(currentUser.id, CompanyType.REAL);
        }
        const cID = comp.id;
        setCompanyID(cID);

        if (mounted) {
          const res = await getCompanyOrders(cID);
          setOrders(res || []);
        }
      } catch (err) {
        console.error("Error loading company or orders:", err);
        if (mounted) setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCompanyAndOrders();

    return () => {
      mounted = false;
    };
  }, [currentUser]);


  // 3. Handle Manage Click (فقط برای NEW و WAITING_FOR_OFFERS لیست پیشنهادات لود شود)
  const handleManageClick = async (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);

    if (order.status === OrderStatus.NEW || order.status === OrderStatus.WAITING_FOR_OFFERS) {
      setOffers([]);
      setIsSaving(true);
      try {
        const res = await getOffersByOrderId(order.id!);
        setOffers(res.filter(offer => offer.state === OfferStatus.PENDING) || []);
      } catch (err) {
        console.error(err);
        setOffers([]);
      } finally {
        setIsSaving(false);
      }
    } else {
      setOffers([]);
    }
  };

  // 4. Handle Offer Acceptance (تغییر وضعیت به DRIVER_ASSIGNED)
  const handleAccept = async (offer: OrderOffer) => {
    if (!companyID) return alert("اطلاعات شرکت ناقص است.");
    if (offer.price <= 0) return alert("قیمت پیشنهاد معتبر نیست.");
    if (!selectedOrder) return alert("سفارش انتخاب نشده است.");

    setIsSaving(true);
    try {
      // 1. آپدیت وضعیت پیشنهاد به Accepted
      await updateOfferStatus(offer.id, OfferStatus.PENDING);

      // 2. آپدیت وضعیت سفارش و تخصیص راننده به: DRIVER_ASSIGNED
      const upd = await updateOrder(offer.orderID, {
        status: OrderStatus.DRIVER_ASSIGNED, // وضعیت جدید
        driverID: offer.driverID,
      });

      // 3. کسر کارمزد از شرکت (مثلا 50,000 ریال)
      // این بخش باید بر اساس منطق کسب و کار شما بررسی شود.
      await createCompanyWalletTransaction(companyID, -50000, "کارمزد تخصیص راننده");

      // 4. به‌روزرسانی لیست سفارش‌ها
      setOrders((prev) => prev.map((o) => (o.id === offer.orderID ? upd : o)));

      setSelectedOrder(upd);
      setOffers([]);

      alert(`پیشنهاد راننده ${offer.driverName || offer.driverID} با موفقیت قبول شد. راننده باید تخصیص را تایید نهایی کند.`);
    } catch (err) {
      console.error(err);
      alert("خطا در قبول پیشنهاد. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- UI Rendering ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white p-6">
        <Loader2 className="animate-spin text-black w-8 h-8" />
        <p className="mr-2 text-gray-600 font-medium">در حال بارگذاری سفارشات...</p>
      </div>
    );
  }

  if (!currentUser) return <div className="p-6 text-center text-red-500">لطفا ابتدا وارد شوید.</div>;

  //   تب  ها           
  const filteredOrders = orders.filter(o => {
    switch (activeTab) {
      case OrderStatus.WAITING_FOR_OFFERS:
        // جدید  -   پیشنهاد  -  در  انتظار   -  در مسیر  انبار  
        return o.status === OrderStatus.NEW ||
          o.status === OrderStatus.WAITING_FOR_OFFERS ||
          o.status === OrderStatus.DRIVER_ACCEPTED_CONFIRMATION ||
          o.status === OrderStatus.LOADING ||
          o.status === OrderStatus.DRIVER_ASSIGNED;

      case OrderStatus.DRIVER_ASSIGNED:
        //    در مسیر مقصد  
        return o.status === OrderStatus.ON_ROAD;
      case OrderStatus.DELIVERED:
        /// 
        return o.status === OrderStatus.DELIVERED || o.status === OrderStatus.FINISHED;
      case OrderStatus.CANCELED:
        // تب لغو شده
        return o.status === OrderStatus.CANCELED;
      default:
        return true; // اگر تب دیگری انتخاب شد، همه را نمایش بده
    }
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 max-w-xl mx-auto shadow-2xl overflow-hidden font-vazirmatn pb-10">
      <Header />
      <SearchBar />
      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Orders List */}
      <div className="mt-2 space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 p-8 bg-white mx-4 rounded-2xl shadow-sm">
            هیچ سفارشی در وضعیت **{getStatusLabel(activeTab).label}** یافت نشد.
          </p>
        ) : (
          filteredOrders.slice().reverse().map((o) => (
            <OrderCard key={o.id} order={o} onManageClick={handleManageClick} />
          ))
        )}
      </div>

      {/* The Modal Component */}
      <OrderDetailsModal
        order={selectedOrder}
        offers={offers}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
          setOffers([]);
        }}
        handleAccept={handleAccept}
        isLoading={isSaving}
      />
    </div>
  );
}
