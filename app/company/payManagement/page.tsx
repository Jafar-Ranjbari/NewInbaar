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
  getOffersByOrderId,
  updateOfferStatus,
  updateOrder,
  createPayment,
  createReview,
  getCompanyByUserId,
  createCompany // برای اطمینان از وجود شرکت
} from "../companyService"; // فرض می‌کنیم companyService در این مسیر است
import {
  FileText,
  CreditCard,
  Star,
  Loader2,
  Truck,
  MapPin,
  Calendar
} from "lucide-react";

// --- Component ---
export default function OrderManagement() {
  const { currentUser } = useAuthStore();
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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
      // 5. به‌روزرسانی لیست سفارش‌ها
      setOrders((prev) => prev.map((o) => (o.id === offer.orderID ? upd : o)));
      setExpanded(null);
    } catch (err) {
      console.error(err);
      alert("خطا در قبول پیشنهاد. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Handle Payment Submission
  const handlePay = async (order: Order) => {
    if (!order.driverID) return alert("راننده برای این سفارش تخصیص داده نشده است.");
    const amount = Number(payForm.amount);
    if (amount <= 0) return alert("مبلغ پرداخت باید مثبت باشد.");

    setIsSaving(true);
    try {
      // 1. ثبت پرداخت
      await createPayment({
        orderID: order.id,
        driverID: order.driverID,
        amount: amount,
        payType: payForm.type,
        transactionCode: payForm.code,
        year: 1403, // مقادیر ثابت سال و ماه و روز را حذف کردم
        month: 1,
        day: 1,
        date: new Date().toISOString(),
      } as Omit<PaymentDriver, 'id' | 'createdAt'>);

      // 2. آپدیت وضعیت سفارش به تحویل شد (اگر پرداخت اولیه بود)
      const upd = await updateOrder(order.id, { status: OrderStatus.DELIVERED });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? upd : o)));

      alert(`پرداخت مبلغ ${amount.toLocaleString('fa-IR')} ریال با موفقیت ثبت شد.`);
      setPayForm({ amount: "", type: "BANK", code: "" });
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت پرداخت");
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Handle Review Submission and Order Finish
  const handleReview = async (order: Order) => {
    if (!order.driverID || !companyID) return alert("اطلاعات ناقص است");

    setIsSaving(true);
    try {
      // 1. ثبت نظردهی
      await createReview({
        orderID: order.id,
        driverID: order.driverID,
        companyID,
        stars: reviewForm.stars,
        commentText: reviewForm.comment,
        strengths: reviewForm.strengths ? [reviewForm.strengths] : [],
        weaknesses: reviewForm.weaknesses ? [reviewForm.weaknesses] : [],
      } as Omit<DriverReview, 'id' | 'createdAt'>);

      // 2. آپدیت وضعیت به پایان یافته
      const upd = await updateOrder(order.id, { status: OrderStatus.FINISHED });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? upd : o)));

      alert("نظردهی انجام و سفارش بسته شد.");
      setReviewForm({ stars: 5, strengths: "", weaknesses: "", comment: "" });
      setExpanded(null);
    } catch (err) {
      console.error(err);
      alert("خطا در نظردهی");
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
        <Truck className="text-blue-600" />  مدیریت  رانندگان
      </h1>
      {/* 2. Orders List */}
      <div className="space-y-4">
        {orders.length === 0 && !loading ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow-sm">هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          orders.slice().reverse().map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow-md border-t-4 border-gray-300 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-gray-800 text-lg">
                  شماره  راننده  :    {o.driverID}
                </h3>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-medium">مسیر:</span> {o.originCity} ← {o.destinationCity}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">تاریخ تحویل:</span> {o.deliveryDate}
                  <span className="font-medium">  نام  بار :</span> {o.goodType}
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
                {expanded === o.id ? "▲ بستن " : "▼ پرداخت  و نظر سنجی"}
              </button>

              {/* Expanded Content */}
              {expanded === o.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {(o.status === OrderStatus.DELIVERED || o.status === OrderStatus.DRIVER_ASSIGNED) && o.driverID && (
                    <ManagementActions
                      order={o}
                      payForm={payForm}
                      setPayForm={setPayForm}
                      handlePay={handlePay}
                      reviewForm={reviewForm}
                      setReviewForm={setReviewForm}
                      handleReview={handleReview}
                      isSaving={isSaving}
                    // اینجا می‌توانستیم جزئیات راننده را هم بیاوریم
                    />
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

interface ManagementProps {
  order: Order;
  payForm: { amount: string; type: PaymentDriver['payType']; code: string };
  setPayForm: React.Dispatch<React.SetStateAction<{ amount: string; type: PaymentDriver['payType']; code: string }>>;
  handlePay: (order: Order) => Promise<void>;
  reviewForm: { stars: number; strengths: string; weaknesses: string; comment: string };
  setReviewForm: React.Dispatch<React.SetStateAction<{ stars: number; strengths: string; weaknesses: string; comment: string }>>;
  handleReview: (order: Order) => Promise<void>;
  isSaving: boolean;
}

const ManagementActions: React.FC<ManagementProps> = ({
  order,
  payForm,
  setPayForm,
  handlePay,
  reviewForm,
  setReviewForm,
  handleReview,
  isSaving
}) => {

  const isReadyForFinish = order.status === OrderStatus.DELIVERED;

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Payment Section */}
      <div className={`p-4 rounded-xl shadow-inner ${isReadyForFinish ? 'bg-gray-50' : 'bg-red-50 border border-red-200'}`}>
        <h5 className="font-bold mb-3 text-gray-700 flex items-center gap-2 border-b pb-2">
          <CreditCard className="w-4 h-4 text-red-500" /> ثبت پرداخت (تسویه)
        </h5>
        <input
          type="number"
          placeholder="مبلغ (ریال)"
          className="input-base mb-3"
          value={payForm.amount}
          onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
        />
        <select
          className="input-base mb-3 bg-white"
          value={payForm.type}
          onChange={(e) => setPayForm({ ...payForm, type: e.target.value as PaymentDriver['payType'] })}
        >
          <option value="BANK">کارت به کارت</option>
          <option value="CASH">نقدی</option>
          <option value="POS">دستگاه پوز</option>
        </select>
        <input
          placeholder="کد رهگیری/توضیحات"
          className="input-base mb-3"
          value={payForm.code}
          onChange={(e) => setPayForm({ ...payForm, code: e.target.value })}
        />
        <button
          onClick={() => handlePay(order)}
          disabled={isSaving}
          className="bg-red-600 text-white w-full py-2 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : null}
          ثبت پرداخت
        </button>
        {!isReadyForFinish && <p className="text-xs text-red-600 mt-2">سفارش هنوز تحویل نشده است. ثبت پرداخت صرفاً برای پیگیری داخلی است.</p>}
      </div>

      {/* Review Section */}
      <div className={`p-4 rounded-xl shadow-inner ${isReadyForFinish ? 'bg-gray-50 border border-gray-200' : 'bg-gray-50'}`}>
        <h5 className="font-bold mb-3 text-gray-700 flex items-center gap-2 border-b pb-2">
          <Star className="w-4 h-4 text-gray-600" /> نظردهی و اتمام سفارش
        </h5>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">امتیاز:</span>
          <input
            type="number"
            min="1"
            max="5"
            className="input-base w-16 text-center"
            value={reviewForm.stars}
            onChange={(e) => setReviewForm({ ...reviewForm, stars: Number(e.target.value) })}
          /> / ۵ ستاره
        </div>
        <textarea
          placeholder="نظرات، نقاط قوت و ضعف راننده..."
          className="input-base mb-3"
          value={reviewForm.comment}
          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
        />
        <button
          onClick={() => handleReview(order)}
          disabled={isSaving || !isReadyForFinish}
          className="bg-gray-600 text-white w-full py-2 rounded-xl font-bold hover:bg-gray-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : null}
          ثبت نهایی و اتمام سفارش
        </button>
        {!isReadyForFinish && <p className="text-xs text-red-600 mt-2">ابتدا باید وضعیت سفارش به "تحویل شد" تغییر یابد.</p>}
      </div>
    </div>
  );
};