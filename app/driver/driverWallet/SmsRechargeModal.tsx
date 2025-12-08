// فرض کنید این کد از 'SmsRechargeModal.tsx' import شده است

import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiMail, FiCheckCircle } from 'react-icons/fi';

// داده‌های نمونه برای استان و شهر
interface City { id: number; name: string; provinceId: number; }
interface Province { id: number; name: string; }
const mockProvinces: Province[] = [{ id: 1, name: 'تهران' }, { id: 2, name: 'فارس' }, { id: 3, name: 'اصفهان' },];
const mockCities: City[] = [{ id: 101, name: 'تهران', provinceId: 1 }, { id: 102, name: 'کرج', provinceId: 1 }, { id: 201, name: 'شیراز', provinceId: 2 }, { id: 202, name: 'کازرون', provinceId: 2 }, { id: 301, name: 'اصفهان', provinceId: 3 }, { id: 302, name: 'کاشان', provinceId: 3 },];

interface SmsRechargeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onBuySms: () => Promise<void>;
}

const SmsRechargeModal: React.FC<SmsRechargeModalProps> = ({ isVisible, onClose, onBuySms }) => {
  if (!isVisible) return null;

  const priceTomans: number = 30000;
  const smsCount: number = 50;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  useEffect(() => {
    if (selectedProvince) {
      setFilteredCities(mockCities.filter(city => city.provinceId === selectedProvince));
      setSelectedCity(null);
    } else {
      setFilteredCities([]);
    }
  }, [selectedProvince]);

  const handleConfirm = useCallback(async () => {
    if (!selectedProvince || !selectedCity) {
      alert('لطفاً استان و شهر را انتخاب کنید.');
      return;
    }

    setIsProcessing(true);
    try {
      await onBuySms();
      setIsSuccess(true);
    } catch (error) {
      console.error("SMS recharge failed:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [onBuySms, selectedProvince, selectedCity]);

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setSelectedProvince(null);
    setSelectedCity(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={isSuccess ? handleClose : undefined}>
      <div
        dir="rtl"
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transition-all duration-300 transform"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          disabled={isProcessing}
        >
          <FiX size={24} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <FiCheckCircle size={64} className="text-gray-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">عملیات موفقیت‌آمیز!</h2>
            <p className="text-lg text-gray-700 font-semibold">
              موجودی پیامک با موفقیت شارژ شد.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              تعداد <span className="font-bold">{smsCount}</span> پیامک به اعتبار شما اضافه شد.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
            >
              بستن
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">شارژ اعتبار پیامک</h2>

            <div className="space-y-4 mb-6 text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
              <FiMail size={40} className="text-blue-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-700">بسته <span className="text-blue-600">{smsCount}</span> عددی</p>
              <p className="text-3xl font-extrabold text-gray-600 tracking-wider">
                {priceTomans.toLocaleString('fa-IR')} <span className="text-xl">تومان</span>
              </p>
            </div>

            {/* فیلتر استان و شهر */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700">انتخاب محل سکونت (اختیاری):</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={selectedProvince ?? ''}
                onChange={(e) => setSelectedProvince(Number(e.target.value))}
                disabled={isProcessing}
              >
                <option value="" disabled>انتخاب استان</option>
                {mockProvinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow disabled:bg-gray-100"
                value={selectedCity ?? ''}
                onChange={(e) => setSelectedCity(Number(e.target.value))}
                disabled={isProcessing || !selectedProvince || filteredCities.length === 0}
              >
                <option value="" disabled>انتخاب شهر</option>
                {filteredCities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {selectedProvince && filteredCities.length === 0 && <option value="" disabled>شهری یافت نشد</option>}
              </select>
              <p className="text-xs text-gray-500">
                مبلغ خرید از موجودی کیف پول شما کسر خواهد شد.
              </p>
            </div>


            {/* دکمه تأیید خرید */}
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-blue-400"
              disabled={isProcessing || !selectedProvince || !selectedCity}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 ml-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال پرداخت...
                </span>
              ) : (
                `تایید و خرید (${priceTomans.toLocaleString('fa-IR')} تومان)`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};


export default SmsRechargeModal;