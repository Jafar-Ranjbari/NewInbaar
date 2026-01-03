"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Order, OrderOffer } from '../../types';
import { getAllOpenOrders, createOrderOffer, getOffersByDriverId } from '../driverService';
import { MapPin, Clock, DollarSign, Send, Loader2, Search, X, ChevronRight, ChevronLeft, Truck, Scale, Box, Info, CalendarCheck, Wallet } from 'lucide-react';
import { useDriverDashboardData } from '../useDriverDashboardData';

// --- Types ---
interface ProvinceItem {
  name: string;
  count: number;
}
// فیلدهای زیر برای نمایش جزئیات لازم هستند، بهتر است در یک کامپوننت جداگانه تعریف شوند.
type PaymentMethodLabel = 'نقدی' | 'اعتباری' | 'پس‌کرایه' | string;
type PackageTypeLabel = 'پالت' | 'کارتن' | 'شیرینگ' | string;


// --- Helper Components ---

/**
 * 💥 مودال جزئیات کامل سفارش (بر اساس تایپ Order شما)
 * @param order - شیء سفارش برای نمایش
 * @param hasOffered - آیا راننده برای این سفارش پیشنهاد داده است
 * @param onOfferClick - هندلر برای باز کردن مودال پیشنهاد قیمت
 * @param onClose - هندلر برای بستن مودال
 */
const OrderDetailModal: React.FC<{ order: Order; hasOffered: boolean; onOfferClick: () => void; onClose: () => void }> = ({ order, hasOffered, onOfferClick, onClose }) => {
  // تبدیل مقادیر انگلیسی به فارسی برای نمایش
  const getPaymentLabel = (method: string): PaymentMethodLabel => {
    if (method.toLowerCase().includes('cash')) return 'نقدی';
    if (method.toLowerCase().includes('credit')) return 'اعتباری';
    if (method.toLowerCase().includes('receiver')) return 'پس‌کرایه';
    return method;
  };

  const getPackageTypeLabel = (type: string): PackageTypeLabel => {
    if (type.toLowerCase().includes('pallet')) return 'پالت';
    if (type.toLowerCase().includes('carton')) return 'کارتن';
    if (type.toLowerCase().includes('shrink')) return 'شیرینگ';
    return type;
  };

  const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number | undefined; isEnglish?: boolean }> = ({ icon, label, value, isEnglish = false }) => (
    <div className="flex justify-between items-start py-3 px-4 bg-gray-50 first:rounded-t-xl last:rounded-b-xl odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-gray-900 font-bold text-sm ${isEnglish ? 'font-english' : ''}`} dir={isEnglish ? 'ltr' : 'rtl'}>
        {value !== undefined ? String(value) : 'نامشخص'}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-[430px] h-[90vh] sm:h-[800px] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-y-auto pointer-events-auto relative animate-slide-up no-scrollbar">
        <div className="w-full flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        <button onClick={onClose} className="absolute top-5 left-5 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="px-6 pt-2 pb-24">
          <h2 className="text-right text-2xl font-extrabold text-gray-900 mb-2">{order.goodType}</h2>
          <p className="text-right text-gray-500 text-sm mb-6">جزئیات کامل سفارش حمل و نقل</p>

          {/* Map / Route Section */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 relative overflow-hidden">
            {/* Vertical Route Line */}
            <div className="relative pr-8">
              {/* The vertical connector line */}
              <div className="absolute right-[5px] top-2 bottom-6 w-0.5 bg-gray-300"></div>

              {/* Origin */}
              <div className="relative mb-8">
                <div className="absolute -right-[27px] top-1 w-3 h-3 border-2 border-gray-800 bg-white rounded-full z-10"></div>
                <span className="font-bold text-gray-900 text-base">مبدا:</span>
                <p className="text-gray-500 text-sm">{order.originProvince}، {order.originCity}</p>
              </div>

              {/* Destination */}
              <div className="relative">
                <div className="absolute -right-[27px] top-1 w-3 h-3 bg-gray-800 rounded-full z-10 shadow-[0_0_0_3px_rgba(255,255,255,1)]"></div>
                <span className="font-bold text-gray-900 text-base">مقصد:</span>
                <p className="text-gray-500 text-sm">{order.destinationProvince}، {order.destinationCity}</p>
              </div>
            </div>
            {/* Date & Vehicle */}
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600"><CalendarCheck size={16} /> تاریخ تحویل: <span className='font-bold text-gray-800'>{order.deliveryDate}</span></span>
              <span className="flex items-center gap-2 text-gray-600"><Truck size={16} /> خودرو مورد نیاز: <span className='font-bold text-gray-800'>{order.requiredVehicleType}</span></span>
            </div>
          </div>

          {/* General Info */}
          <h3 className="font-bold text-gray-900 mb-3 text-lg">اطلاعات حمل</h3>
          <div className="space-y-1 mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <DetailRow icon={<Scale size={16} />} label="وزن بار" value={`${order.weight} ${order.weightType}`} />
            <DetailRow icon={<Box size={16} />} label="نوع بار (Load Type)" value={order.loadType} />
            <DetailRow icon={<Box size={16} />} label="نوع بسته‌بندی" value={getPackageTypeLabel(order.packageType)} />
            <DetailRow icon={<Box size={16} />} label="تعداد بسته" value={order.packageCount} />
            <DetailRow icon={<DollarSign size={16} />} label="ارزش کالا" value={order.goodsValue ? order.goodsValue.toLocaleString('fa-IR') + ' ریال' : 'نامشخص'} />
            <DetailRow icon={<Wallet size={16} />} label="نحوه پرداخت کرایه" value={getPaymentLabel(order.paymentMethod)} />
          </div>

          {/* Contact & Address Info */}
          <h3 className="font-bold text-gray-900 mb-3 text-lg">اطلاعات تحویل و تماس</h3>
          <div className="space-y-1 mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <DetailRow icon={<MapPin size={16} />} label="آدرس تخلیه" value={order.unloadingAddress} />
            <DetailRow icon={<Clock size={16} />} label="ساعت کار انبار (شروع)" value={order.unloadingFromHour} />
            <DetailRow icon={<Clock size={16} />} label="ساعت کار انبار (پایان)" value={order.unloadingToHour} />
            <DetailRow icon={<Info size={16} />} label="نام گیرنده" value={order.receiverName} />
            <DetailRow icon={<Info size={16} />} label="شماره تماس گیرنده" value={order.receiverContact} isEnglish={true} />
          </div>

          {/* Load Description */}
          {order.loadDescription && (
            <>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">توضیحات اضافی</h3>
              <div className="p-4 bg-gray-50 rounded-xl mb-8 text-gray-700 text-sm">
                {order.loadDescription}
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 pb-8">
          {order.expectedPriceRange && (
            <div className="bg-gray-100 rounded-xl p-3 flex justify-between items-center mb-4 text-gray-700">
              <span className="text-sm font-medium">محدوده قیمت پیشنهادی</span>
              <span className="font-bold text-lg" dir="rtl">{order.expectedPriceRange}</span>
            </div>
          )}
          {hasOffered ? (
            <span className="inline-block px-4 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg w-full text-center shadow-md">پیشنهاد شما ثبت شده است</span>
          ) : (
            <button onClick={onOfferClick} className="w-full bg-gray-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-700 transition-colors shadow-lg flex justify-center items-center gap-2">
              <DollarSign size={20} /> ارسال پیشنهاد قیمت
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 💥 کارت سفارش در لیست شهرها (شبیه به CargoCard)
 */
const OrderItemCardInCity: React.FC<{ order: Order, hasOffered: boolean, onDetailsClick: () => void, onOfferClick: () => void }> = ({ order, hasOffered, onDetailsClick, onOfferClick }) => {
  return (
    <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 relative">
      {/* Tag */}
      <div className="absolute top-4 right-4 bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
        {order.weight} {order.weightType}
      </div>

      {/* Header Info */}
      <div className="mr-24 pt-1">
        <h3 className="text-gray-900 font-extrabold text-lg">
          {order.goodType}
        </h3>
        <p className="text-gray-400 text-xs mt-1 text-left pl-2 flex items-center gap-1">
          <Truck size={12} className='text-blue-500' />
          {order.requiredVehicleType}
        </p>
      </div>

      {/* Location Row */}
      <div className="flex justify-between items-center mt-6 px-1">
        <div className="text-xs text-gray-700 font-medium flex items-center gap-1">
          <MapPin size={14} className='text-red-500' />
          <span className="text-gray-500">مبدا:</span> {order.originCity}
        </div>
        <div className="text-xs text-gray-700 font-medium flex items-center gap-1">
          <MapPin size={14} className='text-green-500' />
          <span className="text-gray-500">مقصد:</span> {order.destinationCity}
        </div>
      </div>

      {/* Suggested Price */}
      {order.expectedPriceRange && (
        <div className="mt-4 text-center text-sm font-bold text-gray-600 bg-gray-50 py-2 rounded-xl">
          <DollarSign size={16} className='inline ml-1 text-green-600' />
          محدوده قیمت: {order.expectedPriceRange}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onDetailsClick}
          className="flex-1 text-gray-800 text-sm font-bold py-3 border-b-2 border-gray-300 hover:border-gray-800 transition-colors pb-1"
        >
          مشاهده جزییات
        </button>
        {hasOffered ? (
          <span className="flex-[1.5] bg-gray-200 text-gray-700 text-sm font-bold py-3 rounded-2xl text-center shadow-sm">پیشنهاد ثبت شده</span>
        ) : (
          <button onClick={onOfferClick} className="flex-[1.5] bg-gray-600 border text-white text-sm font-bold py-3 rounded-2xl hover:bg-gray-700 transition-colors">
            ارسال قیمت
          </button>
        )}
      </div>
    </div>
  );
};


/**
 * 💥 لیست سفارش‌های یک استان (نمای جدید)
 */
const CityOrdersList: React.FC<{
  orders: Order[];
  myOffers: OrderOffer[];
  selectedProvince: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onBack: () => void;
  onOffer: (orderId: string) => void;
}> = ({ orders, myOffers, selectedProvince, searchTerm, setSearchTerm, onBack, onOffer }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (!selectedProvince) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();
    return orders.filter(o =>
      o.destinationProvince === selectedProvince &&
      (o.originCity.toLowerCase().includes(lowerCaseSearch) || o.destinationCity.toLowerCase().includes(lowerCaseSearch) || o.goodType.toLowerCase().includes(lowerCaseSearch))
    );
  }, [orders, selectedProvince, searchTerm]);

  const currentOrderHasOffered = selectedOrder ? myOffers.some(off => off.orderID === selectedOrder.id) : false;

  return (
    <>
      {/* Header for City Orders List */}
      <header className="pt-6 pb-2 px-6 bg-white shrink-0 z-10 shadow-sm sticky top-0">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors p-1">
            <ChevronRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 absolute left-0 right-0 text-center pointer-events-none">
            سفارش‌ها
          </h1>
          <div className="w-6"></div>
        </div>

        <div className="space-y-1 text-right">
          <h2 className="text-lg font-bold text-gray-900">
            سفارش‌های {selectedProvince}
          </h2>
          <p className="text-sm text-gray-500">
            تعداد کل سفارش‌ها: {filteredOrders.length.toLocaleString('fa-IR')}
          </p>
        </div>
      </header>

      {/* Main List Section */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24 bg-gray-50">
        <div className="space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const hasOffered = myOffers.some(off => off.orderID === order.id);
              return (
                <OrderItemCardInCity
                  key={order.id}
                  order={order}
                  hasOffered={hasOffered}
                  onDetailsClick={() => setSelectedOrder(order)}
                  onOfferClick={() => onOffer(order.id!)}
                />
              );
            })
          ) : (
            <div className="text-center text-gray-400 py-10">
              سفارشی در این استان یافت نشد.
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          hasOffered={currentOrderHasOffered}
          onClose={() => setSelectedOrder(null)}
          onOfferClick={() => {
            setSelectedOrder(null); // بستن مودال جزئیات
            onOffer(selectedOrder.id!); // باز کردن مودال پیشنهاد
          }}
        />
      )}
    </>
  );
};


// --- Component: CargoHall (با منطق جدید) ---

const CargoHall: React.FC = () => {
  // --- Hooks: تمام Hooks در سطح بالا تعریف می‌شوند ---

  const { driver } = useDriverDashboardData();
  const driverID = driver?.id;
  const [orders, setOrders] = useState<Order[]>([]);
  const [myOffers, setMyOffers] = useState<OrderOffer[]>([]);

  // وضعیت جدید: نمایش استان‌ها (null) یا لیست سفارش‌های یک استان (string)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks مربوط به مودال ارسال پیشنهاد
  const [offerModalOpen, setOfferModalOpen] = useState<string | null>(null); // OrderID
  const [offerForm, setOfferForm] = useState({ price: '', comment: '', time: '' });
  const [loading, setLoading] = useState(false);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (driverID) {
      getAllOpenOrders().then(setOrders);
      getOffersByDriverId(driverID).then(setMyOffers);
    }
  }, [driverID]);

  // --- Province Calculation and Filtering (useMemo) ---

  const provinceCounts = useMemo(() => orders.reduce((acc, order) => {
    acc[order.destinationProvince] = (acc[order.destinationProvince] || 0) + 1;
    return acc;
  }, {} as Record<string, number>), [orders]);

  const allProvinces: ProvinceItem[] = useMemo(() =>
    Object.keys(provinceCounts).map(name => ({ name, count: provinceCounts[name] }))
    , [provinceCounts]);

  const filteredProvinces = useMemo(() => {
    if (selectedProvince) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();
    return allProvinces.filter((p) =>
      p.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [allProvinces, searchTerm, selectedProvince]);


  // --- Offer Submission Logic (useCallback) ---
  const handleSubmitOffer = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverID || !offerModalOpen || !driver) return;
    setLoading(true);
    try {
      const offer = await createOrderOffer({
        driverID: driverID,
        orderID: offerModalOpen,
        price: Number(offerForm.price),
        commentDriver: offerForm.comment,
        deliveryEstimateTime: offerForm.time,
        driverName: driver.firstName
      });
      setMyOffers(prevOffers => [...prevOffers, offer]);
      setOfferModalOpen(null);
      setOfferForm({ price: '', comment: '', time: '' });
      alert('پیشنهاد ثبت شد.');
    } catch (err) {
      console.error(err);
      alert('خطا در ثبت پیشنهاد');
    } finally {
      setLoading(false);
    }
  }, [driverID, offerModalOpen, driver, offerForm]);

  // --- Helper Components (Province Card) ---

  const ProvinceItemCard: React.FC<{ province: ProvinceItem }> = ({ province }) => {
    const isActive = province.count > 0;
    return (
      <button
        onClick={() => { setSelectedProvince(province.name); setSearchTerm(''); }}
        className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-2xl p-4 cursor-pointer w-full group"
      >
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-5 h-5 text-gray-800" />
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all ${isActive ? 'bg-gray-600 text-white shadow-gray-300' : 'bg-gray-400 text-white'}`}
          >
            {province.count === 0 ? '۰' : province.count.toLocaleString('fa-IR')}
          </div>
        </div>
        <span className="text-lg font-bold text-gray-800 group-hover:text-black">
          {province.name}
        </span>
      </button>
    );
  };


  // 2. --- Conditional Return: (Authentication) ---
  if (!driverID) return (
    <div className="min-h-screen bg-white flex justify-center items-center p-4" dir="rtl">
      <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-xl shadow">
        برای مشاهده بارها پروفایل را تکمیل کنید.
      </div>
    </div>
  );


  // --- Dynamic Variables ---
  const headerTitle = selectedProvince ? `سفارش‌های ${selectedProvince}` : 'انتخاب استان بر اساس مقصد';
  const headerSubtitle = selectedProvince ?
    `تعداد کل سفارش‌ها: ${provinceCounts[selectedProvince] || 0}` :
    'با توجه به مقصد بار خود یک استان را انتخاب کنید';
  const searchPlaceholder = selectedProvince ?
    "جستجو در شهر، مقصد یا نوع بار..." :
    "جستجو در استان‌ها";
  const currentViewCount = selectedProvince ? 0 : filteredProvinces.length; // تعداد در نمایش استان‌ها


  // --- Main Render Logic ---
  return (
    <div className="min-h-screen bg-white flex justify-center" dir="rtl">
      <div className="w-full max-w-md bg-white flex flex-col h-screen relative overflow-hidden">

        {/* View: Province Selection */}
        {!selectedProvince ? (
          <>
            {/* Header Section (Province View) */}
            <header className="pt-6 pb-2 px-6 bg-white shrink-0 z-10 shadow-sm sticky top-0">
              <div className="flex items-center justify-between mb-6">
                {/* Placeholder for alignment in this view */}
                <div className="w-6"></div>
                <h1 className="text-xl font-bold text-gray-900 absolute left-0 right-0 text-center pointer-events-none">
                  شهرها
                </h1>
                <div className="w-6"></div>
              </div>

              <div className="space-y-1 text-right">
                <h2 className="text-lg font-bold text-gray-900">
                  {headerTitle}
                </h2>
                <p className="text-sm text-gray-500">
                  {headerSubtitle}
                </p>
              </div>
            </header>

            {/* Scrollable List Section (Province View) */}
            <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24 no-scrollbar bg-gray-50">
              <div className="space-y-3">
                {currentViewCount > 0 ? (
                  filteredProvinces.map((province) => (
                    <ProvinceItemCard key={province.name} province={province} />
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-10">
                    {Object.keys(provinceCounts).length === 0 ? 'هیچ سفارش فعالی موجود نیست.' : 'استان مورد نظر یافت نشد.'}
                  </div>
                )}
              </div>
            </main>
          </>
        ) : (

          <CityOrdersList
            orders={orders}
            myOffers={myOffers}
            selectedProvince={selectedProvince}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onBack={() => { setSelectedProvince(null); setSearchTerm(''); }}
            onOffer={setOfferModalOpen}
          />
        )}


        {/* Fixed Search Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-20">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pr-12 pl-4 py-4 bg-gray-100 border-none rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-600 focus:bg-white transition-all outline-none text-right"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Offer Modal (unchanged) */}
        {offerModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gray-600 p-4 text-white font-bold text-lg flex justify-between items-center">
                <span>ثبت پیشنهاد قیمت</span>
                <button onClick={() => setOfferModalOpen(null)} className="hover:bg-gray-700 p-1 rounded">✕</button>
              </div>
              <form onSubmit={handleSubmitOffer} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قیمت پیشنهادی (ریال)</label>
                  <input type="number" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-gray-500 text-right" value={offerForm.price} onChange={e => setOfferForm({ ...offerForm, price: e.target.value })} required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-all flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} />  تایید </>}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


export default CargoHall;