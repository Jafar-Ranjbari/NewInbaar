"use client"
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, OfferStatus } from '../../types';
import { DollarSign, Truck, Scale, ClipboardList, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// DataItem Component
const DataItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
    <Icon className="w-5 h-5 text-gray-600 mb-1 stroke-1.5" />
    <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    <span className="text-sm font-bold text-gray-800 truncate max-w-[90%]">{value}</span>
  </div>
);

interface DRIVER_CONFIRMATIONProps {
  order: Order;
  onConfirm: () => Promise<void>; // تغییر به بدون پارامتر
  onTimeout: () => Promise<void>; // تغییر به بدون پارامتر
  isLoading: boolean;
}

const DRIVER_CONFIRMATION: React.FC<DRIVER_CONFIRMATIONProps> = ({
  order,
  onConfirm,
  onTimeout,
  isLoading
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(1 * 60); // 4 دقیقه به ثانیه
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timerFinished, setTimerFinished] = useState(false);

  const assignedOffer = order.offers?.find(o => o.state === OfferStatus.ACCEPTED);
  const price = assignedOffer?.price || 0;

  // تایمر معکوس
  useEffect(() => {
    if (!isTimerActive || timerFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          setTimerFinished(true);
          // زمان تمام شد، لغو خودکار
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timerFinished]);

  // فرمت زمان به صورت MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // زمان به صورت متن فارسی
  const getTimeText = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
      return `${mins} دقیقه و ${secs} ثانیه`;
    }
    return `${secs} ثانیه`;
  };

  const handleConfirm = async () => {
    setIsTimerActive(false);
    setTimerFinished(true);
    await onConfirm(); // فقط فراخوانی تابع
  };

  const handleTimeout = async () => {
    setIsTimerActive(false);
    setTimerFinished(true);
    await onTimeout(); // فقط فراخوانی تابع
  };

  // رنگ تایمر بر اساس زمان باقی‌مانده
  const getTimerColor = () => {
    if (timerFinished) return 'text-red-600';
    if (timeLeft > 120) return 'text-green-600'; // بیش از 2 دقیقه
    if (timeLeft > 60) return 'text-yellow-600'; // 1 تا 2 دقیقه
    return 'text-red-600'; // کمتر از 1 دقیقه
  };

  const getTimerBgColor = () => {
    if (timerFinished) return 'bg-red-50 border-red-200';
    if (timeLeft > 120) return 'bg-green-50 border-green-200';
    if (timeLeft > 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      {/* اطلاعات سفارش */}
      <div className="grid grid-cols-4 gap-2 mb-4 border-b border-gray-100 pb-4 border-dashed">
        <DataItem
          icon={DollarSign}
          label="مبلغ حمل"
          value={price.toLocaleString('fa-IR') + ' ریال'}
        />
        <DataItem
          icon={Truck}
          label="نوع خودرو"
          value={order.requiredVehicleType || "نامشخص"}
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

      {/* تایمر و دکمه تایید */}
      <div className={`p-4 rounded-xl border ${getTimerBgColor()} transition-all duration-300`}>
        <div className="flex flex-col items-center space-y-4">
          {/* وضعیت تایمر */}
          {timerFinished ? (
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                زمان تأیید نهایی به پایان رسید
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${getTimerColor()}`} />
              <span className="text-sm font-medium text-gray-700">
                زمان باقی‌مانده برای تأیید نهایی
              </span>
            </div>
          )}

          {/* نمایش تایمر */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${getTimerColor()} mb-1`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500">
              ({timerFinished ? 'زمان تمام شد' : getTimeText(timeLeft)})
            </div>
          </div>

          {/* دکمه‌های عملیاتی */}
          {timerFinished ? (
            <div className="text-center space-y-2">
              <div className="text-red-600 font-bold text-sm">
                سفارش به طور خودکار لغو شد
              </div>
              <button
                disabled={true}
                className="w-full py-3 px-4 rounded-full bg-gray-300 text-gray-600 font-bold cursor-not-allowed"
              >
                سفارش لغو شده است
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`
                  w-full py-3 px-4 rounded-full font-bold text-white
                  transition-all duration-200
                  bg-green-600 hover:bg-green-700 active:scale-95
                  ${isLoading ? 'opacity-70' : ''}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال پردازش...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>تأیید نهایی سفارش</span>
                  </div>
                )}
              </button>

              {/* توضیحات */}
              <div className="text-center text-xs text-gray-600 space-y-1">
                <p>• در صورت تأیید، سفارش به مرحله بارگیری منتقل می‌شود</p>
                <p>• در صورت اتمام زمان، سفارش به صورت خودکار لغو می‌شود</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DRIVER_CONFIRMATION;