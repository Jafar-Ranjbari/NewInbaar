
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, UserCircle, Truck, Wallet, User as UserIcon, Save, Loader2, MapPin, Search, Send, Clock, DollarSign, MessageSquare, FileBarChart, ClipboardList, CreditCard } from 'lucide-react';
import {
  getDriverByUserId, createOrUpdateDriver,
  getCarByDriverId, createOrUpdateCar,
  getWalletTransactions, createWalletTransaction,
  getAllOpenOrders, createOrderOffer, getOffersByDriverId,
  getSmsCreditTransactions, createSmsCreditTransaction,
  getPaymentsByDriverId
} from '../services/userService';
import { Driver, DriverCar, WalletTransaction, Order, OrderOffer, SmsCreditTransaction, PaymentDriver, OfferStatus, OrderStatus } from '../types';

export const DashboardDriver: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'CAR' | 'CARGO_HALL' | 'WALLET' | 'REPORTS'>('PROFILE');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Data States
  const [driver, setDriver] = useState<Partial<Driver>>({});
  const [car, setCar] = useState<Partial<DriverCar>>({});
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [myOffers, setMyOffers] = useState<OrderOffer[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentDriver[]>([]);

  // Cargo Hall State
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState<string | null>(null); // orderID
  const [offerForm, setOfferForm] = useState({ price: '', comment: '', time: '' });

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      if (!currentUser) return;
      setInitLoading(true);
      try {
        // 1. Fetch Driver Profile
        let drv = await getDriverByUserId(currentUser.id);
        if (!drv) {
          setDriver({ userID: currentUser.id, mobile1: currentUser.mobile, firstName: '', lastName: '' });
        } else {
          setDriver(drv);
          const c = await getCarByDriverId(drv.id);
          if (c) setCar(c);

          const txs = await getWalletTransactions(drv.id, 'DRIVER');
          setTransactions(txs);

          const smsTxs = await getSmsCreditTransactions(currentUser.id);
          setSmsTransactions(smsTxs);

          if (txs.length === 0) {
            const gift = await createWalletTransaction(drv.id, 50000, 'هدیه اولین ورود', 'DRIVER');
            setTransactions([gift]);
          }

          // Load Offers
          const offers = await getOffersByDriverId(drv.id);
          setMyOffers(offers);

          // Load Payments
          const pays = await getPaymentsByDriverId(drv.id);
          setMyPayments(pays);
        }

        // Load Open Orders
        const orders = await getAllOpenOrders();
        setOpenOrders(orders);

      } catch (err) {
        console.error(err);
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
      const savedDriver = await createOrUpdateDriver({ ...driver, userID: currentUser.id });
      setDriver(savedDriver);
      alert('اطلاعات راننده ذخیره شد');

      const txs = await getWalletTransactions(savedDriver.id, 'DRIVER');
      if (txs.length === 0) {
        const gift = await createWalletTransaction(savedDriver.id, 50000, 'هدیه اولین ورود', 'DRIVER');
        setTransactions([gift]);
      }
    } catch (err) {
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver.id) {
      alert('لطفا ابتدا پروفایل راننده را تکمیل کنید');
      return;
    }
    setLoading(true);
    try {
      const savedCar = await createOrUpdateCar({ ...car, driverID: driver.id });
      setCar(savedCar);
      alert('اطلاعات خودرو ذخیره شد');
    } catch (err) {
      alert('خطا در ذخیره خودرو');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!driver.id) return;
    setLoading(true);
    try {
      const tx = await createWalletTransaction(driver.id, amount, 'افزایش اعتبار', 'DRIVER');
      setTransactions(prev => [...prev, tx]);
      alert('کیف پول شارژ شد');
    } catch (err) {
      alert('خطا در شارژ کیف پول');
    } finally {
      setLoading(false);
    }
  };

  const handleBuySmsPackage = async () => {
    if (!driver.id || !currentUser) return;
    if (walletBalance < 50000) {
      alert('موجودی کیف پول کافی نیست');
      return;
    }
    setLoading(true);
    try {
      // Deduct from wallet
      const wTx = await createWalletTransaction(driver.id, -50000, 'خرید بسته ۵۰ تایی پیامک', 'DRIVER');
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

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver.id || !offerModalOpen) return;
    setLoading(true);
    try {
      const offer = await createOrderOffer({
        driverID: driver.id,
        orderID: offerModalOpen,
        price: Number(offerForm.price),
        commentDriver: offerForm.comment,
        deliveryEstimateTime: offerForm.time,
        driverName: `${driver.firstName} ${driver.lastName}`
      });
      setMyOffers([...myOffers, offer]);
      setOfferModalOpen(null);
      setOfferForm({ price: '', comment: '', time: '' });
      alert('پیشنهاد شما ثبت شد و در انتظار تایید شرکت است.');
    } catch (err) {
      alert('خطا در ثبت پیشنهاد');
    } finally {
      setLoading(false);
    }
  };

  // Group orders by province
  const provinceCounts = openOrders.reduce((acc, order) => {
    acc[order.originProvince] = (acc[order.originProvince] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
  const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = myPayments.reduce((acc, curr) => acc + curr.amount, 0);

  if (!currentUser) return null;
  if (initLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-green-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Truck size={24} />
            </div>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">پنل رانندگان</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm font-bold border border-green-200">
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
            className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'PROFILE' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <UserIcon size={18} /> مشخصات
          </button>
          <button
            onClick={() => setActiveTab('CAR')}
            className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'CAR' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Truck size={18} /> خودرو
          </button>
          <button
            onClick={() => setActiveTab('CARGO_HALL')}
            className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'CARGO_HALL' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Search size={18} /> سالن اعلام بار
          </button>
          <button
            onClick={() => setActiveTab('WALLET')}
            className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'WALLET' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Wallet size={18} /> کیف پول
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'REPORTS' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FileBarChart size={18} /> گزارشات
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* PROFILE TAB */}
        {activeTab === 'PROFILE' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserCircle className="text-green-500" /> اطلاعات هویتی
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                  <input
                    type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={driver.firstName || ''} onChange={e => setDriver({ ...driver, firstName: e.target.value })} required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                  <input
                    type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={driver.lastName || ''} onChange={e => setDriver({ ...driver, lastName: e.target.value })} required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">موبایل اصلی</label>
                  <input
                    type="text" disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
                    value={driver.mobile1 || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
                  <input
                    type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={driver.province || ''} onChange={e => setDriver({ ...driver, province: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
                  <input
                    type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={driver.city || ''} onChange={e => setDriver({ ...driver, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شماره شبا</label>
                  <input
                    type="text" dir="ltr" placeholder="IR..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={driver.shebaNumber || ''} onChange={e => setDriver({ ...driver, shebaNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-70">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CAR TAB */}
        {activeTab === 'CAR' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Truck className="text-green-500" /> اطلاعات ناوگان
            </h2>
            {!driver.id ? (
              <div className="text-center p-8 bg-yellow-50 rounded-lg text-yellow-800">
                ابتدا اطلاعات هویتی راننده را تکمیل کنید.
              </div>
            ) : (
              <form onSubmit={handleSaveCar} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع ماشین</label>
                    <select
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      value={car.vehicleType || ''} onChange={e => setCar({ ...car, vehicleType: e.target.value })}
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="PICKUP">وانت</option>
                      <option value="TRUCK">کامیون</option>
                      <option value="TRAILER">تریلی</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">مدل ماشین</label>
                    <input
                      type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      value={car.carModel || ''} onChange={e => setCar({ ...car, carModel: e.target.value })} placeholder="مثال: آریسان"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">پلاک</label>
                    <input
                      type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      value={car.licensePlate || ''} onChange={e => setCar({ ...car, licensePlate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ظرفیت بار (تن)</label>
                    <input
                      type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      value={car.loadCapacity || ''} onChange={e => setCar({ ...car, loadCapacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-70">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    ذخیره خودرو
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* CARGO HALL TAB */}
        {activeTab === 'CARGO_HALL' && (
          <div className="space-y-6">
            {!driver.id ? (
              <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800 border border-yellow-200 text-center">
                برای مشاهده بارها ابتدا پروفایل خود را تکمیل کنید.
              </div>
            ) : !selectedProvince ? (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-green-500" /> انتخاب استان مبدا
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(provinceCounts).map(([province, count]) => (
                    <button
                      key={province}
                      onClick={() => setSelectedProvince(province)}
                      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-green-500 transition-all text-center group"
                    >
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-green-600 mb-2">{province}</h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        {count} سفارش
                      </span>
                    </button>
                  ))}
                  {Object.keys(provinceCounts).length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                      هیچ سفارش فعالی در سیستم موجود نیست.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="text-gray-500 hover:text-gray-800 font-bold"
                  >
                    بازگشت
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">
                    سفارش‌های استان {selectedProvince}
                  </h2>
                </div>
                <div className="space-y-4">
                  {openOrders.filter(o => o.originProvince === selectedProvince).map(order => {
                    const hasOffered = myOffers.some(off => off.orderID === order.id);
                    return (
                      <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-300 transition-all">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                              {order.goodType} <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{order.weight} {order.weightType}</span>
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2"><MapPin size={14} /> مبدا: {order.originProvince}، {order.originCity}</p>
                              <p className="flex items-center gap-2"><MapPin size={14} className="text-red-500" /> مقصد: {order.destinationProvince}، {order.destinationCity}</p>
                              <p className="flex items-center gap-2"><Clock size={14} /> تاریخ حمل: {order.deliveryDate}</p>
                            </div>
                            {order.expectedPriceRange && (
                              <p className="mt-3 text-sm font-bold text-green-700">مبلغ پیشنهادی شرکت: {order.expectedPriceRange} ریال</p>
                            )}
                          </div>
                          <div>
                            {hasOffered ? (
                              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm">
                                پیشنهاد ثبت شده
                              </span>
                            ) : (
                              <button
                                onClick={() => setOfferModalOpen(order.id)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                              >
                                <DollarSign size={18} />
                                ارسال قیمت
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Offer Modal */}
            {offerModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="bg-green-600 p-4 text-white font-bold text-lg flex justify-between items-center">
                    <span>ثبت پیشنهاد قیمت</span>
                    <button onClick={() => setOfferModalOpen(null)} className="hover:bg-green-700 p-1 rounded">✕</button>
                  </div>
                  <form onSubmit={handleSubmitOffer} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">قیمت پیشنهادی (ریال)</label>
                      <input
                        type="number"
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="مثلا: 25000000"
                        value={offerForm.price}
                        onChange={e => setOfferForm({ ...offerForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">زمان تقریبی تحویل</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="مثلا: 2 روز کاری"
                        value={offerForm.time}
                        onChange={e => setOfferForm({ ...offerForm, time: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات برای شرکت</label>
                      <textarea
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 h-24"
                        placeholder="توضیحات تکمیلی..."
                        value={offerForm.comment}
                        onChange={e => setOfferForm({ ...offerForm, comment: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex justify-center items-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> ارسال پیشنهاد</>}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'WALLET' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Wallet */}
              <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-green-100 mb-1">موجودی کیف پول</p>
                    <h3 className="text-4xl font-bold">{walletBalance.toLocaleString()} <span className="text-lg font-normal">ریال</span></h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Wallet size={32} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleTopUp(100000)} className="bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
                    شارژ ۱۰۰,۰۰۰
                  </button>
                  <button onClick={() => handleTopUp(200000)} className="bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
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
            {/* Income Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-2 font-bold">کل درآمد کسب شده</p>
                    <h3 className="text-3xl font-bold text-green-600 dir-ltr">{totalIncome.toLocaleString()} <span className="text-sm text-gray-500">ریال</span></h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-green-600"><CreditCard size={24} /></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-2 font-bold">تعداد کل سفارشات</p>
                    <h3 className="text-3xl font-bold text-blue-600">{myOffers.length}</h3>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><ClipboardList size={24} /></div>
                </div>
              </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2">
                <CreditCard size={18} className="text-green-500" /> دریافتی‌های شرکت
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-right min-w-[600px]">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-3">مبلغ</th>
                      <th className="p-3">روش پرداخت</th>
                      <th className="p-3">کد پیگیری</th>
                      <th className="p-3">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {myPayments.map(p => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold text-green-700">{p.amount.toLocaleString()}</td>
                        <td className="p-3">{p.payType === 'BANK' ? 'کارت به کارت' : p.payType}</td>
                        <td className="p-3 text-sm text-gray-500">{p.transactionCode}</td>
                        <td className="p-3 text-sm">{p.year}/{p.month}/{p.day}</td>
                      </tr>
                    ))}
                    {myPayments.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">موردی یافت نشد</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2">
                <ClipboardList size={18} className="text-blue-500" /> تاریخچه سفارشات
              </div>
              <div className="divide-y">
                {myOffers.map(offer => {
                  const statusColor =
                    offer.state === OfferStatus.ACCEPTED ? 'bg-green-100 text-green-700' :
                      offer.state === OfferStatus.REJECTED ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700';

                  return (
                    <div key={offer.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">پیشنهاد قیمت: {offer.price.toLocaleString()} ریال</p>
                        <p className="text-sm text-gray-500">{offer.deliveryEstimateTime}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(offer.date).toLocaleDateString('fa-IR')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor}`}>
                        {offer.state === OfferStatus.ACCEPTED ? 'تایید شده' :
                          offer.state === OfferStatus.REJECTED ? 'رد شده' : 'در انتظار'}
                      </span>
                    </div>
                  )
                })}
                {myOffers.length === 0 && <div className="p-8 text-center text-gray-500">سفارشی وجود ندارد</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
