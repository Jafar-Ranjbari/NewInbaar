"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Order,
  OrderOffer,
  OrderStatus,
  OfferStatus,
  PaymentDriver,
  DriverReview,
  CompanyType
} from "../../types";
import {
  getCompanyOrders,
  createOrder,
  getOffersByOrderId,
  updateOfferStatus,
  updateOrder,
  createCompanyWalletTransaction,
  createDriverWalletTransaction,
  createPayment,
  createReview,
  getCompanyByUserId,
  createCompany // برای اطمینان از وجود شرکت
} from "../companyService"; // فرض می‌کنیم companyService در این مسیر است
import {
  PackagePlus,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  CreditCard,
  Star,
  Loader2,
  Truck,
  MapPin,
  Calendar
} from "lucide-react";

// Helper Function for Order Status Display
const getStatusLabel = (status: OrderStatus): { label: string, color: string } => {
  switch (status) {
    case OrderStatus.NEW: return { label: "در انتظار پیشنهاد", color: "bg-blue-100 text-blue-800" };
    case OrderStatus.DRIVER_ASSIGNED: return { label: "راننده انتخاب شد", color: "bg-gray-100 text-gray-800" };
    case OrderStatus.DRIVER_EN_ROUTE: return { label: "در مسیر مبدا", color: "bg-orange-100 text-orange-800" };
    case OrderStatus.ON_ROAD: return { label: "در حال حمل", color: "bg-gray-100 text-gray-800" };
    case OrderStatus.DELIVERED: return { label: "تحویل شد (در انتظار تسویه)", color: "bg-gray-100 text-gray-800" };
    case OrderStatus.FINISHED: return { label: "پایان یافته", color: "bg-gray-100 text-gray-800" };
    case OrderStatus.CANCELED: return { label: "لغو شده", color: "bg-red-100 text-red-800" };
    default: return { label: "نامشخص", color: "bg-gray-200 text-gray-700" };
  }
};

// --- Component ---
export default function OrderManagement() {
  const { currentUser } = useAuthStore();
  const [companyID, setCompanyID] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({ weightType: "KG", loadType: "عمومی", receiverName: "" });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [offers, setOffers] = useState<OrderOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Payment & Review Forms
  const [payForm, setPayForm] = useState({
    amount: "",
    type: "BANK" as PaymentDriver['payType'],
    code: "",
  });
  const [reviewForm, setReviewForm] = useState({
    stars: 5,
    strengths: "",
    weaknesses: "",
    comment: "",
  });

  // 1. Load CompanyID and Orders
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
          // فرض می‌کنیم شرکت در این مرحله برای کاربر ساخته می‌شود
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


  // 3. Handle Expand and Load Offers
  const handleExpand = async (order: Order) => {
    const next = expanded === order.id ? null : order.id;
    setExpanded(next);

    if (next === order.id && order.status === OrderStatus.NEW) {
      setOffers([]); // Clear old offers
      setIsSaving(true); // Using saving state for offers loading
      try {
        const res = await getOffersByOrderId(order.id);
        setOffers(res.filter(offer => offer.state === OfferStatus.PENDING) || []); // Only show PENDING offers
      } catch (err) {
        console.error(err);
        setOffers([]);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // 4. Handle Offer Acceptance
  const handleAccept = async (offer: OrderOffer) => {
    if (!companyID) return alert("اطلاعات شرکت ناقص است.");
    if (offer.price <= 0) return alert("قیمت پیشنهاد معتبر نیست.");

    setIsSaving(true);
    try {
      // 1. آپدیت وضعیت پیشنهاد به Accepted
      await updateOfferStatus(offer.id, OfferStatus.ACCEPTED);

      // 2. آپدیت وضعیت سفارش و تخصیص راننده
      const upd = await updateOrder(offer.orderID, {
        status: OrderStatus.DRIVER_ASSIGNED,
        driverID: offer.driverID,
      });

      // 3. کسر کارمزد از شرکت (مثلا 50,000 ریال)
      await createCompanyWalletTransaction(companyID, -50000, "کارمزد تخصیص راننده");

      // 4. کسر کارمزد از راننده (اختیاری - اگر راننده هم کارمزد می‌دهد)
      // await createDriverWalletTransaction(offer.driverID, -50000, "کارمزد تخصیص بار");

      // 5. به‌روزرسانی لیست سفارش‌ها
      setOrders((prev) => prev.map((o) => (o.id === offer.orderID ? upd : o)));
      setExpanded(null);
      alert(`پیشنهاد راننده ${offer.driverName || offer.driverID} با موفقیت قبول شد. مبلغ 50,000 ریال بابت کارمزد از کیف پول کسر گردید.`);
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
      <div className="flex justify-center items-center h-48 bg-gray-100 p-6">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        <p className="mr-2 text-gray-600">در حال بارگذاری سفارشات...</p>
      </div>
    );
  }

  if (!currentUser) return <div className="p-6 text-center text-red-500">لطفا ابتدا وارد شوید.</div>;

  return (
    <div dir="rtl" className="max-w-xl mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
        <Truck className="text-blue-600" /> مدیریت بارها و سفارشات
      </h1>


      {/* 2. Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
          <FileText className="text-gray-500" /> لیست سفارشات ({orders.length})
        </h2>

        {orders.length === 0 && !loading ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow-sm">هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          orders.slice().reverse().map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow-md border-t-4 border-gray-300 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-extrabold text-gray-800 text-lg">
                  {o.goodType}
                </h4>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusLabel(o.status).color}`}>
                  {getStatusLabel(o.status).label}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-medium">مسیر:</span> {o.originCity} ← {o.destinationCity}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">تاریخ تحویل:</span> {o.deliveryDate}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">وزن:</span> {o.weight} {o.weightType}
                </div>
              </div>

              <button
                onClick={() => handleExpand(o)}
                className="w-full text-blue-600 font-bold py-2 border-t mt-2 hover:bg-blue-50 transition rounded-b-lg"
              >
                {expanded === o.id ? "▲ بستن جزئیات" : "▼ مدیریت سفارش"}
              </button>

              {/* Expanded Content */}
              {expanded === o.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">

                  {o.status === OrderStatus.NEW && (
                    <OffersSection
                      offers={offers}
                      handleAccept={handleAccept}
                      isLoading={isSaving}
                      orderID={o.id}
                    />
                  )}

                  
                  {o.status === OrderStatus.FINISHED && (
                    <div className="bg-gray-50 text-gray-700 p-3 rounded-lg text-center font-bold">
                      ✅ این سفارش با موفقیت پایان یافته است.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>


      <style jsx>{`
                .input-base { 
                    width: 100%; 
                    padding: 0.65rem 1rem; 
                    border: 1px solid #d1d5db; /* gray-300 */
                    border-radius: 0.75rem; 
                    outline: none; 
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-size: 0.95rem;
                }
                .input-base:focus { 
                    border-color: #3b82f6; /* blue-500 */
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); 
                }
                textarea.input-base {
                    min-height: 80px;
                }
            `}</style>
    </div>
  );
}

// --------------------------- Helper Components ---------------------------

// 1. Offers Section (For OrderStatus.NEW)
interface OffersProps {
  offers: OrderOffer[];
  handleAccept: (offer: OrderOffer) => Promise<void>;
  isLoading: boolean;
  orderID: string;
}

const OffersSection: React.FC<OffersProps> = ({ offers, handleAccept, isLoading, orderID }) => (
  <div className="space-y-3">
    <h5 className="font-bold text-gray-700 flex items-center gap-2 mb-2">
      <Users className="w-4 h-4 text-blue-500" /> پیشنهادات فعال
    </h5>
    {isLoading ? (
      <div className="text-center py-4 text-blue-600">
        <Loader2 className="animate-spin inline-block w-5 h-5" /> در حال بارگذاری پیشنهادات...
      </div>
    ) : offers.length > 0 ? (
      offers.map((of) => (
        <div key={of.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg border">
          <div className="flex flex-col">
            <span className="font-bold text-blue-600 text-lg">
              {of.price.toLocaleString('fa-IR')} ریال
            </span>
            <span className="text-sm text-gray-600">
              راننده: {of.driverName || 'ناشناس'}
              {of.deliveryEstimateTime && ` | تحویل: ${of.deliveryEstimateTime}`}
            </span>
          </div>
          {of.state === OfferStatus.PENDING && (
            <button
              onClick={() => handleAccept(of)}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-xl font-bold mt-2 sm:mt-0 hover:bg-gray-700 transition disabled:opacity-50 flex items-center gap-1"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              قبول
            </button>
          )}
        </div>
      ))
    ) : (
      <div className="bg-gray-50 text-gray-700 p-3 rounded-lg">
        <p>در حال حاضر پیشنهادی برای این بار ثبت نشده است.</p>
      </div>
    )}
  </div>
);

 
 