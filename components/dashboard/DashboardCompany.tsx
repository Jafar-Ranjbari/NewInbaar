
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, UserCircle, Building2, Wallet, PackagePlus, Save, Loader2, FileText, Users, CheckCircle, XCircle, CreditCard, Star, MessageSquare, FileBarChart, Coins } from 'lucide-react';
import { 
  getCompanyByUserId, createCompany, 
  getCompanyDetail, createOrUpdateCompanyDetail,
  getWalletTransactions, createWalletTransaction,
  getCompanyOrders, createOrder,
  getOffersByOrderId, updateOfferStatus, updateOrder,
  createPayment, createReview, getReviewByOrderId, getPaymentsByOrderId,
  getSmsCreditTransactions, createSmsCreditTransaction
} from '../../services/userService';
import { Company, CompanyDetail, CompanyType, WalletTransaction, Order, OrderStatus, OrderOffer, OfferStatus, SmsCreditTransaction, PaymentDriver, DriverReview } from '../../types';

export const DashboardCompany: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'WALLET' | 'REPORTS'>('PROFILE');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Data
  const [company, setCompany] = useState<Partial<Company>>({});
  const [details, setDetails] = useState<Partial<CompanyDetail>>({});
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Reporting Data Helpers
  const [allPayments, setAllPayments] = useState<PaymentDriver[]>([]);
  const [orderReviews, setOrderReviews] = useState<Record<string, DriverReview>>({});

  // Interactions State
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderOffers, setOrderOffers] = useState<OrderOffer[]>([]);
  const [viewMode, setViewMode] = useState<'OFFERS' | 'MANAGE'>('OFFERS');
  
  // Forms
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
      weightType: 'KG', goodType: '', originProvince: '', originCity: '', destinationProvince: '', destinationCity: '', receiverName: '', expectedPriceRange: '', deliveryDate: ''
  });
  
  const [paymentForm, setPaymentForm] = useState({ 
    amount: '', type: 'BANK', code: '', 
    year: '1403', month: '01', day: '01' 
  });
  
  const [reviewForm, setReviewForm] = useState({ stars: 5, strengths: '', weaknesses: '', comment: '' });

  useEffect(() => {
    const init = async () => {
        if (!currentUser) return;
        setInitLoading(true);
        try {
            let comp = await getCompanyByUserId(currentUser.id);
            if (!comp) {
                 setCompany({ userID: currentUser.id, type: CompanyType.REAL });
            } else {
                setCompany(comp);
                const det = await getCompanyDetail(comp.id);
                if (det) setDetails(det);

                const txs = await getWalletTransactions(comp.id, 'COMPANY');
                setTransactions(txs);
                
                const smsTxs = await getSmsCreditTransactions(currentUser.id);
                setSmsTransactions(smsTxs);

                if (txs.length === 0) {
                     const gift = await createWalletTransaction(comp.id, 100000, 'هدیه اولین ورود', 'COMPANY');
                     setTransactions([gift]);
                }

                const ords = await getCompanyOrders(comp.id);
                setOrders(ords);

                // Load report data on init for simplicity (could be lazy loaded)
                const allPays: PaymentDriver[] = [];
                const reviewsMap: Record<string, DriverReview> = {};
                
                for (const o of ords) {
                    const pays = await getPaymentsByOrderId(o.id);
                    allPays.push(...pays);
                    const revs = await getReviewByOrderId(o.id);
                    if (revs.length > 0) reviewsMap[o.id] = revs[0];
                }
                setAllPayments(allPays);
                setOrderReviews(reviewsMap);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setInitLoading(false);
        }
    };
    init();
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
        let currentComp = company;
        if (!company.id) {
             const newComp = await createCompany(currentUser.id, company.type || CompanyType.REAL);
             setCompany(newComp);
             currentComp = newComp;
             const gift = await createWalletTransaction(newComp.id, 100000, 'هدیه اولین ورود', 'COMPANY');
             setTransactions([gift]);
        }

        if (currentComp.id) {
            const savedDetails = await createOrUpdateCompanyDetail({ ...details, companyID: currentComp.id });
            setDetails(savedDetails);
            alert('اطلاعات شرکت ذخیره شد');
        }
    } catch (err) {
        alert('خطا در ذخیره اطلاعات');
    } finally {
        setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!company.id) {
          alert('لطفا ابتدا پروفایل شرکت را تکمیل کنید');
          return;
      }
      setLoading(true);
      try {
          const orderPayload: any = {
              ...newOrder,
              companyID: company.id,
              weight: Number(newOrder.weight),
              status: OrderStatus.NEW
          };
          const savedOrder = await createOrder(orderPayload);
          setOrders([...orders, savedOrder]);
          setNewOrder({ weightType: 'KG', goodType: '', originProvince: '', originCity: '', destinationProvince: '', destinationCity: '', receiverName: '' }); 
          alert('بار جدید ثبت شد');
      } catch (err) {
          alert('خطا در ثبت بار');
      } finally {
          setLoading(false);
      }
  };

  const handleExpandOrder = async (order: Order) => {
      if (expandedOrder === order.id) {
          setExpandedOrder(null);
          return;
      }
      setExpandedOrder(order.id);
      setLoading(true);
      
      if (order.status === OrderStatus.NEW) {
          setViewMode('OFFERS');
          try {
              const offers = await getOffersByOrderId(order.id);
              setOrderOffers(offers);
          } catch (e) { console.error(e); }
      } else {
          setViewMode('MANAGE');
      }
      setLoading(false);
  };

  const handleAcceptOffer = async (offer: OrderOffer) => {
      if (!company.id) return;
      setLoading(true);
      try {
          // 1. Update Offer Status
          await updateOfferStatus(offer.id, OfferStatus.ACCEPTED);
          
          // 2. Update Order Status
          const updatedOrder = await updateOrder(offer.orderID, { 
              status: OrderStatus.DRIVER_ASSIGNED,
              driverID: offer.driverID
          });

          // 3. Deduct Commission from Company (-50,000)
          const compTx = await createWalletTransaction(company.id, -50000, `کارمزد تخصیص سفارش ${updatedOrder.goodType}`, 'COMPANY');
          setTransactions(prev => [...prev, compTx]);

          // 4. Deduct Commission from Driver (-50,000)
          await createWalletTransaction(offer.driverID, -50000, `کارمزد دریافت بار ${updatedOrder.goodType}`, 'DRIVER');

          // Update Local State
          setOrders(orders.map(o => o.id === offer.orderID ? updatedOrder : o));
          setExpandedOrder(null);
          alert('پیشنهاد تایید شد و راننده تخصیص یافت. مبلغ ۵۰,۰۰۰ تومان کارمزد از طرفین کسر گردید.');
      } catch (err) {
          alert('خطا در عملیات');
      } finally {
          setLoading(false);
      }
  };

  const handleRejectOffer = async (offerID: string) => {
      try {
          await updateOfferStatus(offerID, OfferStatus.REJECTED);
          setOrderOffers(prev => prev.map(o => o.id === offerID ? { ...o, state: OfferStatus.REJECTED } : o));
      } catch (e) { alert('خطا'); }
  };

  const handleRegisterPayment = async (order: Order) => {
      if (!order.driverID) return;
      setLoading(true);
      try {
          const newPay = await createPayment({
              orderID: order.id,
              driverID: order.driverID,
              amount: Number(paymentForm.amount),
              payType: paymentForm.type as any,
              transactionCode: paymentForm.code,
              year: Number(paymentForm.year),
              month: Number(paymentForm.month),
              day: Number(paymentForm.day),
              date: new Date().toISOString()
          });
          setAllPayments(prev => [...prev, newPay]);
          alert('پرداخت ثبت شد');
          setPaymentForm({ amount: '', type: 'BANK', code: '', year: '1403', month: '01', day: '01' });
      } catch (e) { alert('خطا در ثبت پرداخت'); } 
      finally { setLoading(false); }
  };

  const handleRegisterReview = async (order: Order) => {
      if (!company.id || !order.driverID) return;
      setLoading(true);
      try {
          const rev = await createReview({
              orderID: order.id,
              driverID: order.driverID,
              companyID: company.id,
              stars: reviewForm.stars,
              commentText: reviewForm.comment,
              strengths: reviewForm.strengths.split(',').map(s => s.trim()),
              weaknesses: reviewForm.weaknesses.split(',').map(s => s.trim())
          });
          setOrderReviews(prev => ({ ...prev, [order.id]: rev }));
          
          if (order.status !== OrderStatus.FINISHED) {
              const updated = await updateOrder(order.id, { status: OrderStatus.FINISHED });
              setOrders(orders.map(o => o.id === order.id ? updated : o));
          }
          
          alert('نظر شما ثبت شد و سفارش پایان یافت');
          setExpandedOrder(null);
      } catch (e) { alert('خطا در ثبت نظر'); } 
      finally { setLoading(false); }
  };

  const handleTopUp = async (amount: number) => {
    if (!company.id) return;
    setLoading(true);
    try {
        const tx = await createWalletTransaction(company.id, amount, 'افزایش اعتبار', 'COMPANY');
        setTransactions(prev => [...prev, tx]);
        alert('کیف پول شارژ شد');
    } catch (err) {
        alert('خطا در شارژ کیف پول');
    } finally {
        setLoading(false);
    }
  };

  const handleBuySmsPackage = async () => {
    if (!company.id || !currentUser) return;
    if (walletBalance < 50000) {
        alert('موجودی کیف پول کافی نیست');
        return;
    }
    setLoading(true);
    try {
        // Deduct from wallet
        const wTx = await createWalletTransaction(company.id, -50000, 'خرید بسته ۵۰ تایی پیامک', 'COMPANY');
        setTransactions(prev => [...prev, wTx]);

        // Add SMS Credit
        const sTx = await createSmsCreditTransaction(currentUser.id, 50, 50000, 'خرید بسته افزایشی');
        setSmsTransactions(prev => [...prev, sTx]);

        alert('بسته پیامک با موفقیت خریداری شد');
    } catch (err) {
        alert('خطا در خرید بسته');
    } finally {
        setLoading(false);
    }
  };

  const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
  const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = allPayments.reduce((acc, curr) => acc + curr.amount, 0);

  if (!currentUser) return null;
  if (initLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Building2 size={24} />
            </div>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">پنل شرکت‌ها</h1>
          </div>

           <div className="flex items-center gap-2">
             <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-bold border border-blue-200">
                اعتبار: {walletBalance.toLocaleString()} ریال
             </div>
             <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('PROFILE')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'PROFILE' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <UserCircle size={18} /> مشخصات
            </button>
            <button 
                onClick={() => setActiveTab('ORDERS')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'ORDERS' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <PackagePlus size={18} /> مدیریت بار
            </button>
            <button 
                onClick={() => setActiveTab('WALLET')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'WALLET' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Wallet size={18} /> کیف پول
            </button>
            <button 
                onClick={() => setActiveTab('REPORTS')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'REPORTS' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <FileBarChart size={18} /> گزارشات
            </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* PROFILE TAB */}
        {activeTab === 'PROFILE' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Building2 className="text-blue-500" /> اطلاعات حساب
                    </h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                           onClick={() => setCompany({...company, type: CompanyType.REAL})}
                           className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${company.type === CompanyType.REAL ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            حقیقی
                        </button>
                        <button 
                           onClick={() => setCompany({...company, type: CompanyType.LEGAL})}
                           className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${company.type === CompanyType.LEGAL ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            حقوقی
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 mb-3">اطلاعات عمومی و نماینده</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="نام تجاری / برند" className="input-base" value={details.brandName || ''} onChange={e => setDetails({...details, brandName: e.target.value})} />
                            <input placeholder="نام نماینده" className="input-base" value={details.repFirstName || ''} onChange={e => setDetails({...details, repFirstName: e.target.value})} />
                            <input placeholder="نام خانوادگی نماینده" className="input-base" value={details.repLastName || ''} onChange={e => setDetails({...details, repLastName: e.target.value})} />
                            <input placeholder="موبایل نماینده" className="input-base" value={details.repMobile1 || ''} onChange={e => setDetails({...details, repMobile1: e.target.value})} />
                             <input placeholder="استان" className="input-base" value={details.province || ''} onChange={e => setDetails({...details, province: e.target.value})} />
                             <input placeholder="شهر" className="input-base" value={details.city || ''} onChange={e => setDetails({...details, city: e.target.value})} />
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-bold text-blue-600 mb-3">
                            {company.type === CompanyType.REAL ? 'اطلاعات شخص حقیقی' : 'اطلاعات شخص حقوقی'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {company.type === CompanyType.REAL ? (
                                <>
                                    <input placeholder="کد ملی" className="input-base" value={details.real_nationalId || ''} onChange={e => setDetails({...details, real_nationalId: e.target.value})} />
                                    <input placeholder="کد بیمه" className="input-base" value={details.real_socialSecurityCode || ''} onChange={e => setDetails({...details, real_socialSecurityCode: e.target.value})} />
                                </>
                            ) : (
                                <>
                                    <input placeholder="نام رسمی شرکت" className="input-base" value={details.legal_companyName || ''} onChange={e => setDetails({...details, legal_companyName: e.target.value})} />
                                    <input placeholder="شناسه ملی" className="input-base" value={details.legal_nationalId || ''} onChange={e => setDetails({...details, legal_nationalId: e.target.value})} />
                                    <input placeholder="شماره ثبت" className="input-base" value={details.legal_registrationNumber || ''} onChange={e => setDetails({...details, legal_registrationNumber: e.target.value})} />
                                    <input placeholder="نام مدیر عامل" className="input-base" value={details.legal_ceoName || ''} onChange={e => setDetails({...details, legal_ceoName: e.target.value})} />
                                </>
                            )}
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : 'ثبت تغییرات'}
                    </button>
                </form>
            </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'ORDERS' && (
             <div className="space-y-8">
                {/* New Order */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                     <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <PackagePlus className="text-blue-500"/> ثبت بار جدید
                     </h2>
                     <form onSubmit={handleCreateOrder} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input placeholder="استان مبدا" className="input-base" value={newOrder.originProvince || ''} onChange={e => setNewOrder({...newOrder, originProvince: e.target.value})} required />
                            <input placeholder="شهر مبدا" className="input-base" value={newOrder.originCity || ''} onChange={e => setNewOrder({...newOrder, originCity: e.target.value})} required />
                            <input placeholder="نام گیرنده" className="input-base" value={newOrder.receiverName || ''} onChange={e => setNewOrder({...newOrder, receiverName: e.target.value})} required />
                            <input placeholder="استان مقصد" className="input-base" value={newOrder.destinationProvince || ''} onChange={e => setNewOrder({...newOrder, destinationProvince: e.target.value})} required />
                            <input placeholder="شهر مقصد" className="input-base" value={newOrder.destinationCity || ''} onChange={e => setNewOrder({...newOrder, destinationCity: e.target.value})} required />
                            <input placeholder="نوع کالا" className="input-base" value={newOrder.goodType || ''} onChange={e => setNewOrder({...newOrder, goodType: e.target.value})} required />
                            <div className="flex gap-2">
                                <input type="number" placeholder="وزن" className="input-base flex-1" value={newOrder.weight || ''} onChange={e => setNewOrder({...newOrder, weight: Number(e.target.value)})} required />
                                <select className="input-base w-20" value={newOrder.weightType} onChange={e => setNewOrder({...newOrder, weightType: e.target.value as any})}>
                                    <option value="KG">KG</option>
                                    <option value="TON">TON</option>
                                </select>
                            </div>
                            <input placeholder="مبلغ پیشنهادی (ریال)" className="input-base" value={newOrder.expectedPriceRange || ''} onChange={e => setNewOrder({...newOrder, expectedPriceRange: e.target.value})} />
                            <input type="date" className="input-base" value={newOrder.deliveryDate || ''} onChange={e => setNewOrder({...newOrder, deliveryDate: e.target.value})} required />
                        </div>
                        <div className="flex justify-end">
                             <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                                 {loading ? '...' : 'ثبت درخواست'}
                             </button>
                        </div>
                     </form>
                </div>

                {/* List */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-4">مدیریت بارها</h3>
                    <div className="space-y-3">
                        {orders.slice().reverse().map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="bg-blue-50 p-3 rounded-lg"><FileText className="text-blue-600" /></div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{order.goodType} ({order.weight} {order.weightType})</h4>
                                            <p className="text-sm text-gray-500">{order.originCity} به {order.destinationCity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                         <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === OrderStatus.NEW ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                             {order.status === OrderStatus.NEW ? 'منتظر راننده' : order.status}
                                         </span>
                                         <button onClick={() => handleExpandOrder(order)} className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1 rounded-lg">
                                            {expandedOrder === order.id ? 'بستن' : 'مدیریت'}
                                         </button>
                                    </div>
                                </div>
                                
                                {expandedOrder === order.id && (
                                    <div className="p-6 border-t border-gray-200 animate-fadeIn">
                                        {viewMode === 'OFFERS' ? (
                                            <div className="space-y-4">
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18}/> پیشنهادات رانندگان</h4>
                                                {loading && <Loader2 className="animate-spin text-blue-600"/>}
                                                {!loading && orderOffers.length === 0 && <p className="text-gray-500">هنوز پیشنهادی ثبت نشده است.</p>}
                                                
                                                <div className="grid gap-4">
                                                    {orderOffers.map(offer => (
                                                        <div key={offer.id} className={`p-4 rounded-xl border flex justify-between items-center ${offer.state === OfferStatus.REJECTED ? 'bg-gray-100 opacity-50' : 'bg-white border-blue-200'}`}>
                                                            <div>
                                                                <p className="font-bold">{offer.driverName}</p>
                                                                <p className="text-blue-700 font-mono font-bold text-lg">{offer.price.toLocaleString()} ریال</p>
                                                                <p className="text-sm text-gray-500">{offer.commentDriver}</p>
                                                                <p className="text-xs text-gray-400 mt-1">زمان تحویل: {offer.deliveryEstimateTime}</p>
                                                            </div>
                                                            {offer.state === OfferStatus.PENDING && (
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleRejectOffer(offer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><XCircle/></button>
                                                                    <button onClick={() => handleAcceptOffer(offer)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"><CheckCircle size={18}/> قبول</button>
                                                                </div>
                                                            )}
                                                            {offer.state === OfferStatus.ACCEPTED && <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={16}/> تایید شده</span>}
                                                            {offer.state === OfferStatus.REJECTED && <span className="text-red-500 font-bold text-sm">رد شده</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Payment Form */}
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard size={18}/> ثبت پرداختی</h4>
                                                    <div className="space-y-3">
                                                        <input type="number" placeholder="مبلغ (ریال)" className="input-base" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <input placeholder="روز" className="input-base text-center" value={paymentForm.day} onChange={e => setPaymentForm({...paymentForm, day: e.target.value})} />
                                                            <input placeholder="ماه" className="input-base text-center" value={paymentForm.month} onChange={e => setPaymentForm({...paymentForm, month: e.target.value})} />
                                                            <input placeholder="سال" className="input-base text-center" value={paymentForm.year} onChange={e => setPaymentForm({...paymentForm, year: e.target.value})} />
                                                        </div>
                                                        <select className="input-base" value={paymentForm.type} onChange={e => setPaymentForm({...paymentForm, type: e.target.value})}>
                                                            <option value="BANK">کارت به کارت / پایا</option>
                                                            <option value="CASH">نقدی</option>
                                                            <option value="POS">دستگاه پوز</option>
                                                            <option value="CHARGE">کسر از اعتبار</option>
                                                        </select>
                                                        <input type="text" placeholder="کد پیگیری / ارجاع" className="input-base" value={paymentForm.code} onChange={e => setPaymentForm({...paymentForm, code: e.target.value})} />
                                                        <button onClick={() => handleRegisterPayment(order)} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">ثبت سند مالی</button>
                                                    </div>
                                                </div>

                                                {/* Review Form */}
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Star size={18}/> ثبت نظر و پایان سفارش</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex gap-2 justify-center mb-2">
                                                            {[1,2,3,4,5].map(s => (
                                                                <button key={s} onClick={() => setReviewForm({...reviewForm, stars: s})} className={`text-2xl ${s <= reviewForm.stars ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                                                            ))}
                                                        </div>
                                                        <input placeholder="نقاط قوت (با کاما جدا کنید)" className="input-base" value={reviewForm.strengths} onChange={e => setReviewForm({...reviewForm, strengths: e.target.value})} />
                                                        <input placeholder="نقاط ضعف (با کاما جدا کنید)" className="input-base" value={reviewForm.weaknesses} onChange={e => setReviewForm({...reviewForm, weaknesses: e.target.value})} />
                                                        <textarea placeholder="توضیحات..." className="input-base h-20" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
                                                        <button onClick={() => handleRegisterReview(order)} disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold">ثبت و اتمام سفارش</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {orders.length === 0 && <p className="text-center text-gray-500 mt-8">هنوز باری ثبت نکرده‌اید.</p>}
                    </div>
                </div>
             </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'WALLET' && (
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Main Wallet */}
                     <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white shadow-lg">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-blue-100 mb-1">موجودی کیف پول</p>
                                <h3 className="text-4xl font-bold">{walletBalance.toLocaleString()} <span className="text-lg font-normal">ریال</span></h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <Wallet size={32} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleTopUp(100000)} className="bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                                شارژ ۱۰۰,۰۰۰
                            </button>
                            <button onClick={() => handleTopUp(200000)} className="bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                                شارژ ۲۰۰,۰۰۰
                            </button>
                        </div>
                    </div>

                    {/* SMS Panel */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl p-8 text-white shadow-lg">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-purple-100 mb-1">اعتبار پیامک</p>
                                <h3 className="text-4xl font-bold">{smsBalance} <span className="text-lg font-normal">عدد</span></h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <MessageSquare size={32} />
                            </div>
                        </div>
                        <button onClick={handleBuySmsPackage} disabled={loading} className="w-full bg-white text-purple-700 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors disabled:opacity-50">
                            خرید بسته ۵۰ تایی (۵۰,۰۰۰ تومان)
                        </button>
                    </div>
                 </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">تراکنش‌های اخیر</h3>
                    <div className="space-y-4">
                        {transactions.slice().reverse().map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">{tx.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(tx.timestamp).toLocaleDateString('fa-IR')}</p>
                                </div>
                                <div className={`font-bold ${tx.balance_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.balance_change > 0 ? '+' : ''}{tx.balance_change.toLocaleString()}
                                </div>
                            </div>
                        ))}
                         {transactions.length === 0 && <p className="text-center text-gray-500">تراکنشی یافت نشد.</p>}
                    </div>
                </div>
            </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'REPORTS' && (
            <div className="space-y-8">
                {/* Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-red-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 mb-2 font-bold">کل پرداختی به رانندگان</p>
                                <h3 className="text-3xl font-bold text-red-600 dir-ltr">{totalExpenses.toLocaleString()} <span className="text-sm text-gray-500">ریال</span></h3>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg text-red-600"><Coins size={24}/></div>
                        </div>
                    </div>
                </div>

                {/* Orders Report */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2">
                        <FileBarChart size={18} className="text-blue-500"/> وضعیت و نظرات سفارشات
                    </div>
                    <div className="divide-y">
                        {orders.slice().reverse().map(order => {
                            const rev = orderReviews[order.id];
                            return (
                                <div key={order.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{order.goodType}</h4>
                                            <p className="text-sm text-gray-500">{order.originCity} به {order.destinationCity}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === OrderStatus.FINISHED ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    {rev ? (
                                        <div className="bg-gray-50 p-3 rounded-lg text-sm mt-2">
                                            <div className="flex text-yellow-500 mb-1">{'★'.repeat(rev.stars)}<span className="text-gray-300">{'★'.repeat(5 - rev.stars)}</span></div>
                                            <p className="text-gray-700">{rev.commentText}</p>
                                            {rev.strengths.length > 0 && <p className="text-xs text-green-600 mt-1">قوت: {rev.strengths.join('، ')}</p>}
                                            {rev.weaknesses.length > 0 && <p className="text-xs text-red-500 mt-1">ضعف: {rev.weaknesses.join('، ')}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 mt-2">نظری ثبت نشده است</p>
                                    )}
                                </div>
                            );
                        })}
                        {orders.length === 0 && <div className="p-8 text-center text-gray-500">داده‌ای موجود نیست</div>}
                    </div>
                </div>
            </div>
        )}
      </main>
      
      <style>{`
        .input-base { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; }
        .input-base:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
