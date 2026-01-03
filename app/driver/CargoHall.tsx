
import React, { useEffect, useState } from 'react';
import { Order, OrderOffer } from '../types';
import { getAllOpenOrders, createOrderOffer, getOffersByDriverId } from './driverService';
import { MapPin, Clock, DollarSign, Send, Loader2, Search, X, Filter } from 'lucide-react';

interface Props {
  driverID?: string;
  driverName?: string;
}

export const CargoHall: React.FC<Props> = ({ driverID, driverName }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [myOffers, setMyOffers] = useState<OrderOffer[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState({ price: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (driverID) {
      getAllOpenOrders().then(setOrders);
      getOffersByDriverId(driverID).then(setMyOffers);
    }
  }, [driverID]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverID || !offerModalOpen) return;
    setLoading(true);
    try {
      const offer = await createOrderOffer({
        driverID: driverID,
        orderID: offerModalOpen,
        price: Number(offerForm.price),
        driverName: driverName
      });
      setMyOffers([...myOffers, offer]);
      setOfferModalOpen(null);
      setOfferForm({ price: '' });
      alert('پیشنهاد ثبت شد.');
    } catch (err) {
      alert('خطا در ثبت پیشنهاد');
    } finally {
      setLoading(false);
    }
  };

  if (!driverID) return <div className="p-4 text-center text-gray-500">برای مشاهده بارها پروفایل را تکمیل کنید.</div>;

  const provinceCounts = orders.reduce((acc, order) => {
    acc[order.originProvince] = (acc[order.originProvince] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allProvinces = Object.keys(provinceCounts);

  // Filter Logic
  const filteredProvinces = allProvinces.filter((province) =>
    province.includes(searchTerm)
  );

  const filteredOrders = orders.filter(o =>
    o.originProvince === selectedProvince &&
    (o.originCity.includes(searchTerm) || o.destinationCity.includes(searchTerm) || o.goodType.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-white transition duration-150 ease-in-out"
            placeholder={selectedProvince ? "جستجو در شهر، مقصد یا نوع بار..." : "جستجو نام استان..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="w-full md:w-64 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedProvince || ''}
            onChange={(e) => {
              setSelectedProvince(e.target.value || null);
              setSearchTerm('');
            }}
            className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">همه استان‌ها</option>
            {allProvinces.map(p => (
              <option key={p} value={p}>{p} ({provinceCounts[p]})</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {!selectedProvince ? (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-gray-500" /> استان‌های دارای بار
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProvinces.map((province) => (
              <button
                key={province}
                onClick={() => { setSelectedProvince(province); setSearchTerm(''); }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-500 transition-all text-center group"
              >
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-600 mb-2">{province}</h3>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                  {provinceCounts[province]} سفارش
                </span>
              </button>
            ))}
            {filteredProvinces.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                {Object.keys(provinceCounts).length === 0 ? 'هیچ سفارش فعالی موجود نیست.' : 'استانی با این نام یافت نشد.'}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">{provinceCounts[selectedProvince] || 0}</span>
              سفارش‌های استان {selectedProvince}
            </h2>
            <button
              onClick={() => { setSelectedProvince(null); setSearchTerm(''); }}
              className="text-gray-500 hover:text-gray-800 font-bold text-sm flex items-center gap-1"
            >
              <X size={16} />
              حذف فیلتر
            </button>
          </div>
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const hasOffered = myOffers.some(off => off.orderID === order.id);
              return (
                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all">
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
                      {order.expectedPriceRange && <p className="mt-3 text-sm font-bold text-gray-700">مبلغ پیشنهادی: {order.expectedPriceRange} ریال</p>}
                    </div>
                    <div>
                      {hasOffered ? (
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm">پیشنهاد ثبت شده</span>
                      ) : (
                        <button onClick={() => setOfferModalOpen(order.id)} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center gap-2">
                          <DollarSign size={18} /> ارسال قیمت
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                سفارشی با این مشخصات در استان {selectedProvince} یافت نشد.
              </div>
            )}
          </div>
        </>
      )}

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
                <input type="number" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-gray-500" value={offerForm.price} onChange={e => setOfferForm({ ...offerForm, price: e.target.value })} required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> ارسال</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
