
import React, { useState, useEffect } from 'react';
import { Order, OrderOffer, OrderStatus, OfferStatus } from '../types';
import { getCompanyOrders, createOrder, getOffersByOrderId, updateOfferStatus, updateOrder, createCompanyWalletTransaction, createDriverWalletTransaction, createPayment, createReview } from './companyService';
import { PackagePlus, FileText, Users, CheckCircle, XCircle, CreditCard, Star, Loader2 } from 'lucide-react';

interface Props { companyID?: string; }

export const OrderManagement: React.FC<Props> = ({ companyID }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [newOrder, setNewOrder] = useState<Partial<Order>>({ weightType: 'KG' });
    const [expanded, setExpanded] = useState<string | null>(null);
    const [offers, setOffers] = useState<OrderOffer[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Payment & Review Forms
    const [payForm, setPayForm] = useState({ amount: '', type: 'BANK', code: '', year: '1403', month: '01', day: '01' });
    const [reviewForm, setReviewForm] = useState({ stars: 5, strengths: '', weaknesses: '', comment: '' });

    useEffect(() => {
        if (companyID) getCompanyOrders(companyID).then(setOrders);
    }, [companyID]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyID) return;
        const o = await createOrder({ ...newOrder, companyID, status: OrderStatus.NEW, weight: Number(newOrder.weight) } as any);
        setOrders([...orders, o]);
        alert('Created');
    };

    const handleExpand = async (order: Order) => {
        setExpanded(expanded === order.id ? null : order.id);
        if (order.status === OrderStatus.NEW && expanded !== order.id) {
            getOffersByOrderId(order.id).then(setOffers);
        }
    };

    const handleAccept = async (offer: OrderOffer) => {
        if (!companyID) return;
        await updateOfferStatus(offer.id, OfferStatus.ACCEPTED);
        const upd = await updateOrder(offer.orderID, { status: OrderStatus.DRIVER_ASSIGNED, driverID: offer.driverID });
        await createCompanyWalletTransaction(companyID, -50000, 'کارمزد');
        await createDriverWalletTransaction(offer.driverID, -50000, 'کارمزد');
        setOrders(orders.map(o => o.id === offer.orderID ? upd : o));
        setExpanded(null);
        alert('Accepted');
    };

    const handlePay = async (order: Order) => {
        if (!order.driverID) return;
        await createPayment({ orderID: order.id, driverID: order.driverID, amount: Number(payForm.amount), payType: payForm.type as any, transactionCode: payForm.code, year: Number(payForm.year), month: Number(payForm.month), day: Number(payForm.day), date: new Date().toISOString() });
        alert('Paid');
    };

    const handleReview = async (order: Order) => {
        if (!order.driverID || !companyID) return;
        await createReview({ orderID: order.id, driverID: order.driverID, companyID, stars: reviewForm.stars, commentText: reviewForm.comment, strengths: [], weaknesses: [] });
        const upd = await updateOrder(order.id, { status: OrderStatus.FINISHED });
        setOrders(orders.map(o => o.id === order.id ? upd : o));
        alert('Reviewed');
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                <h2 className="font-bold mb-4 flex gap-2"><PackagePlus className="text-blue-500"/> ثبت بار</h2>
                <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-3">
                     <input placeholder="مبدا" className="input-base" onChange={e => setNewOrder({...newOrder, originCity: e.target.value})} />
                     <input placeholder="مقصد" className="input-base" onChange={e => setNewOrder({...newOrder, destinationCity: e.target.value})} />
                     <input placeholder="کالا" className="input-base" onChange={e => setNewOrder({...newOrder, goodType: e.target.value})} />
                     <input type="number" placeholder="وزن" className="input-base" onChange={e => setNewOrder({...newOrder, weight: Number(e.target.value)})} />
                     <input type="date" className="input-base" onChange={e => setNewOrder({...newOrder, deliveryDate: e.target.value})} />
                     <button className="bg-blue-600 text-white rounded px-4 py-2">ثبت</button>
                </form>
            </div>
            <div className="space-y-3">
                {orders.slice().reverse().map(o => (
                    <div key={o.id} className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold">{o.goodType} ({o.originCity} - {o.destinationCity})</h4>
                            <button onClick={() => handleExpand(o)} className="text-blue-600 font-bold">{expanded === o.id ? 'بستن' : 'مدیریت'}</button>
                        </div>
                        {expanded === o.id && (
                            <div className="mt-4 pt-4 border-t">
                                {o.status === OrderStatus.NEW ? (
                                    <div className="space-y-2">
                                        {offers.map(of => (
                                            <div key={of.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                <span>{of.price} (راننده: {of.driverName})</span>
                                                {of.state === OfferStatus.PENDING && <button onClick={() => handleAccept(of)} className="bg-green-600 text-white px-3 py-1 rounded">قبول</button>}
                                            </div>
                                        ))}
                                        {offers.length === 0 && <p>پیشنهادی نیست</p>}
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded">
                                            <h5 className="font-bold mb-2">پرداخت</h5>
                                            <input placeholder="مبلغ" className="input-base mb-2" onChange={e => setPayForm({...payForm, amount: e.target.value})} />
                                            <button onClick={() => handlePay(o)} className="bg-blue-600 text-white w-full py-1 rounded">ثبت</button>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded">
                                            <h5 className="font-bold mb-2">نظردهی</h5>
                                            <textarea placeholder="نظر" className="input-base mb-2" onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
                                            <button onClick={() => handleReview(o)} className="bg-green-600 text-white w-full py-1 rounded">ثبت و پایان</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
             <style>{`.input-base { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; }`}</style>
        </div>
    );
};
