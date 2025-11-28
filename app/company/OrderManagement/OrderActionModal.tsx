"use client";

import React, { useState, useEffect } from "react";
import { Order, OrderOffer, OrderStatus, OfferStatus, PaymentDriver } from "../../types";
import { 
    getOffersByOrderId, 
    updateOrder, 
    updateOfferStatus, 
    createCompanyWalletTransaction, 
    createDriverWalletTransaction,
    createPayment,
    createReview
} from "../companyService"; // توابع سرویس
import { X, Users, CreditCard, Star, Loader2, AlertCircle, FileText, CheckCircle } from "lucide-react";
import { getStatusLabel } from "./orderUtils";

// (منطق و استیت‌های PayForm و ReviewForm را از کامپوننت قبلی در اینجا استفاده می‌کنیم)
// ... (PayForm and ReviewForm state definitions)

interface OrderActionModalProps {
    order: Order;
    companyID: string | null;
    isOpen: boolean;
    onClose: () => void;
    onOrderUpdate: (order: Order) => void;
}

const OrderActionModal: React.FC<OrderActionModalProps> = ({ order, companyID, isOpen, onClose, onOrderUpdate }) => {
    const [currentOrder, setCurrentOrder] = useState<Order>(order);
    const [offers, setOffers] = useState<OrderOffer[]>([]);
    const [loading, setLoading] = useState(false);
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

    // 1. Load Offers on mount/update for NEW orders
    useEffect(() => {
        setCurrentOrder(order);
        if (order.status === OrderStatus.NEW) {
            setLoading(true);
            getOffersByOrderId(order.id)
                .then(res => setOffers(res.filter(offer => offer.state === OfferStatus.PENDING) || []))
                .catch(() => setOffers([]))
                .finally(() => setLoading(false));
        } else {
            setOffers([]);
        }
    }, [order]);
    
    // 2. Handle Order Update and Close Modal
    const updateAndClose = (updatedOrder: Order) => {
        onOrderUpdate(updatedOrder);
        setCurrentOrder(updatedOrder);
        // onClose(); // بهتر است پس از پایان موفقیت آمیز اقدام (مثل پایان سفارش) بسته شود
    };

    // 3. Handle Offer Acceptance (منطق از کامپوننت قبلی)
    const handleAccept = async (offer: OrderOffer) => {
        if (!companyID) return alert("اطلاعات شرکت ناقص است.");
        setIsSaving(true);
        try {
            // ... (منطق به‌روزرسانی پیشنهاد، به‌روزرسانی سفارش، کسر کارمزد)
            await updateOfferStatus(offer.id, OfferStatus.ACCEPTED);
            const upd = await updateOrder(offer.orderID, { status: OrderStatus.DRIVER_ASSIGNED, driverID: offer.driverID });
            await createCompanyWalletTransaction(companyID, -50000, "کارمزد تخصیص راننده");
            
            updateAndClose(upd);
            alert(`قبول شد. 50,000 ریال کارمزد کسر شد.`);
        } catch (err) {
            console.error(err);
            alert("خطا در قبول پیشنهاد");
        } finally {
            setIsSaving(false);
        }
    };

    // 4. Handle Payment (منطق از کامپوننت قبلی)
    const handlePay = async () => {
        if (!currentOrder.driverID || !companyID) return alert("راننده یا شرکت نامشخص است.");
        const amount = Number(payForm.amount);
        if (amount <= 0) return alert("مبلغ پرداخت باید مثبت باشد.");
        
        setIsSaving(true);
        try {
            await createPayment({
                orderID: currentOrder.id,
                driverID: currentOrder.driverID,
                amount: amount,
                payType: payForm.type,
                transactionCode: payForm.code,
                year: 1403, month: 1, day: 1, date: new Date().toISOString(),
            } as any);
            
            // وضعیت را به Delivered تغییر می‌دهد اگر قبلا این اتفاق نیفتاده باشد
            if (currentOrder.status !== OrderStatus.DELIVERED && currentOrder.status !== OrderStatus.FINISHED) {
                const upd = await updateOrder(currentOrder.id, { status: OrderStatus.DELIVERED });
                updateAndClose(upd);
            } else {
                 // فقط استیت داخلی را آپدیت می‌کنیم اگر تغییری در وضعیت کلی سفارش ندادیم
                 onOrderUpdate(currentOrder);
            }
            alert(`پرداخت مبلغ ${amount.toLocaleString('fa-IR')} ریال ثبت شد.`);
        } catch (err) {
            console.error(err);
            alert("خطا در ثبت پرداخت");
        } finally {
            setIsSaving(false);
        }
    };

    // 5. Handle Review and Finish (منطق از کامپوننت قبلی)
    const handleReview = async () => {
        if (!currentOrder.driverID || !companyID) return alert("اطلاعات ناقص است");
        
        setIsSaving(true);
        try {
            await createReview({
                orderID: currentOrder.id,
                driverID: currentOrder.driverID,
                companyID,
                stars: reviewForm.stars,
                commentText: reviewForm.comment,
                strengths: reviewForm.strengths ? [reviewForm.strengths] : [],
                weaknesses: reviewForm.weaknesses ? [reviewForm.weaknesses] : [],
            } as any);
            
            const upd = await updateOrder(currentOrder.id, { status: OrderStatus.FINISHED });
            updateAndClose(upd);
            
            alert("نظردهی انجام و سفارش بسته شد.");
            onClose(); // بستن مودال پس از اتمام سفارش
        } catch (err) {
            console.error(err);
            alert("خطا در نظردهی");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;
    
    const isReadyForFinish = currentOrder.status === OrderStatus.DELIVERED || currentOrder.status === OrderStatus.DRIVER_ASSIGNED;
    const isFinished = currentOrder.status === OrderStatus.FINISHED;

    return (
        // Nested Modal Wrapper
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4" dir="rtl">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300 transform scale-100 opacity-100">
                
                {/* Modal Header */}
                <div className="p-4 sm:p-6 sticky top-0 bg-white border-b z-10 rounded-t-xl flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-blue-600 w-5 h-5" /> جزئیات و اقدام ({currentOrder.goodType})
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-4 sm:p-6 space-y-6">
                    
                    {/* Status Display */}
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                        <span className="font-semibold text-gray-700">وضعیت فعلی:</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusLabel(currentOrder.status).color}`}>
                            {getStatusLabel(currentOrder.status).label}
                        </span>
                    </div>

                    {/* Section 1: Offers (If NEW) */}
                    {currentOrder.status === OrderStatus.NEW && (
                        <div className="border p-4 rounded-xl space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-blue-700"><Users className="w-5 h-5" /> پیشنهادات رانندگان</h3>
                            {loading ? (
                                <div className="text-center py-2"><Loader2 className="animate-spin inline-block w-5 h-5 text-blue-600" /></div>
                            ) : offers.length === 0 ? (
                                <p className="text-center text-gray-500">در حال حاضر پیشنهادی نیست.</p>
                            ) : (
                                offers.map((of) => (
                                    <div key={of.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xl text-green-600">{of.price.toLocaleString('fa-IR')} ریال</span>
                                            <span className="text-sm text-gray-600">راننده: {of.driverName || of.driverID}</span>
                                        </div>
                                        <button onClick={() => handleAccept(of)} disabled={isSaving} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold transition disabled:opacity-50">
                                            قبول
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Section 2: Payment (Always visible if not finished) */}
                    {!isFinished && (
                        <div className={`border p-4 rounded-xl space-y-3 ${isReadyForFinish ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                            <h3 className="font-bold text-lg flex items-center gap-2 text-red-700"><CreditCard className="w-5 h-5" /> ثبت پرداخت</h3>
                            <input type="number" placeholder="مبلغ (ریال)" className="input-base" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
                            <select className="input-base bg-white" value={payForm.type} onChange={(e) => setPayForm({ ...payForm, type: e.target.value as PaymentDriver['payType'] })}>
                                <option value="BANK">کارت به کارت</option>
                                <option value="CASH">نقدی</option>
                                <option value="POS">دستگاه پوز</option>
                            </select>
                            <input placeholder="کد رهگیری/توضیحات" className="input-base" value={payForm.code} onChange={(e) => setPayForm({ ...payForm, code: e.target.value })} />
                            
                            <button onClick={handlePay} disabled={isSaving} className="bg-red-600 text-white w-full py-2 rounded-xl font-bold transition disabled:opacity-50 flex justify-center items-center gap-2">
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                                ثبت پرداخت
                            </button>
                        </div>
                    )}

                    {/* Section 3: Review and Finish (If Delivered/Assigned) */}
                    {!isFinished && isReadyForFinish && (
                        <div className="border p-4 rounded-xl space-y-3 border-green-400 bg-green-50">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-green-700"><Star className="w-5 h-5" /> ثبت نظر و پایان سفارش</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">امتیاز:</span>
                                <input type="number" min="1" max="5" className="input-base w-16 text-center" value={reviewForm.stars} onChange={(e) => setReviewForm({ ...reviewForm, stars: Number(e.target.value) })} /> / ۵
                            </div>
                            <textarea placeholder="نظرات و توضیحات..." className="input-base" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                            <button onClick={handleReview} disabled={isSaving} className="bg-green-600 text-white w-full py-2 rounded-xl font-bold transition disabled:opacity-50 flex justify-center items-center gap-2">
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                                ثبت نظر و پایان نهایی
                            </button>
                        </div>
                    )}
                    
                    {isFinished && (
                         <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> این سفارش پایان یافته است.
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .input-base { 
                    width: 100%; 
                    padding: 0.65rem 1rem; 
                    border: 1px solid #d1d5db; 
                    border-radius: 0.75rem; 
                    outline: none; 
                    font-size: 0.95rem;
                }
            `}</style>
        </div>
    );
};

export default OrderActionModal ;