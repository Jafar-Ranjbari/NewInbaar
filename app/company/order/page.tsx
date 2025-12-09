 "use client"

import React, { useState, useEffect } from "react";
import { useAuthStore } from "./../../store/useAuthStore";
import { Order, OrderStatus, CompanyType } from "./../../types"; // مطمئن شوید Order شامل فیلدهای جدید است
import { createOrder, createCompany, getCompanyByUserId } from "./../companyService";
import {
  PackagePlus,
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft,
  CloudRain,
  Sun,
  CloudLightning,
  Cloud,
  Thermometer,
} from "lucide-react";

import { FormInput, FormSelect, FormTextArea, InputLabel } from "./FormComponents";
import {
  PROVINCE_OPTIONS,
  CITY_OPTIONS,
  CARGO_TYPE_OPTIONS,
  PACKAGE_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  PAYMENT_OPTIONS,
  WEATHER_DAYS
} from "./../../constants";

export default function OrderManagementNew() {
  const { currentUser } = useAuthStore();
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customerType, setCustomerType] = useState<'regular' | 'chain'>('regular');
  
  // 💥 تمامی فیلدهای اضافی به State اصلی newOrder منتقل شدند 💥

  // --- State for the Order (شامل فیلدهای جدید) ---
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    weightType: "KG",
    loadType: CARGO_TYPE_OPTIONS[5], // Default to 'عمومی'
    originProvince: PROVINCE_OPTIONS[0],
    originCity: '',
    destinationProvince: PROVINCE_OPTIONS[0],
    destinationCity: '',
    goodType: CARGO_TYPE_OPTIONS[0],
    weight: 0,
    deliveryDate: new Date().toISOString().substring(0, 10),
    requiredVehicleType: VEHICLE_TYPE_OPTIONS[0],
    receiverName: '',
    loadDescription: '',
    size: '',
    
    // فیلدهای جدید (باید در Order interface تعریف شده باشند)
    invoiceNumber: '',
    receiverContact: '',
    packageType: PACKAGE_OPTIONS[0],
    packageCount: '1',
    goodsValue: undefined, // یا 0
    paymentMethod: PAYMENT_OPTIONS[0],
    unloadingAddress: '', 
    unloadingFromHour: '',
    unloadingToHour: '',
  });

  // 1. Load CompanyID
  useEffect(() => {
    let mounted = true;
    const loadCompany = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        let comp = await getCompanyByUserId(currentUser.id);
        if (!comp) {
          comp = await createCompany(currentUser.id, CompanyType.REAL);
        }
        if (mounted) {
          setCompanyID(comp.id);
        }
      } catch (err) {
        console.error("Error loading company:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCompany();
    return () => { mounted = false; };
  }, [currentUser]);

  // 2. Handle New Order Creation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyID) return alert("ابتدا اطلاعات شرکت باید بارگذاری شود.");

    // Enhanced Validation Check (استفاده از فیلدهای جدید در newOrder)
    if (
        !newOrder.invoiceNumber ||
        !newOrder.receiverName ||
        !newOrder.receiverContact ||
        !newOrder.originCity ||
        !newOrder.destinationCity ||
        !newOrder.packageType ||
        !newOrder.packageCount ||
        !newOrder.goodType ||
        !newOrder.requiredVehicleType ||
        !newOrder.weight || (newOrder.weight <= 0) ||
        !newOrder.unloadingAddress ||
        !newOrder.unloadingFromHour ||
        !newOrder.unloadingToHour ||
        !newOrder.deliveryDate
    ) {
        return alert("لطفاً تمام فیلدهای ستاره‌دار (الزامی) را پر کنید.");
    }

    setIsSaving(true);
    try {
      
      const orderData = {
        ...newOrder,
        companyID,
        status: OrderStatus.NEW,
        weight: Number(newOrder.weight),
        // فیلدهای زیر اکنون جداگانه ارسال می‌شوند و نیازی به ادغام ندارند:
        loadDescription: newOrder.loadDescription || '', // فقط توضیحات اضافی
        goodsValue: newOrder.goodsValue ? Number(newOrder.goodsValue) : 0, 
      } as Omit<Order, 'id' | 'createdAt'>;

      const o = await createOrder(orderData);

      alert(`سفارش با موفقیت ثبت شد: ${o.id}`);
      
      // Reset form state (شامل فیلدهای جدید):
      setNewOrder({
          weightType: "KG", loadType: CARGO_TYPE_OPTIONS[5], originProvince: PROVINCE_OPTIONS[0], destinationProvince: PROVINCE_OPTIONS[0], weight: 0, requiredVehicleType: VEHICLE_TYPE_OPTIONS[0],
          originCity: '', destinationCity: '', goodType: CARGO_TYPE_OPTIONS[0], receiverName: '', deliveryDate: new Date().toISOString().substring(0, 10), loadDescription: '', size: '',
          
          invoiceNumber: '', receiverContact: '', packageType: PACKAGE_OPTIONS[0], packageCount: '1', goodsValue: undefined, paymentMethod: PAYMENT_OPTIONS[0], unloadingAddress: '', unloadingFromHour: '', unloadingToHour: '',
      });

    } catch (err) {
      console.error(err);
      alert("خطا در ایجاد سفارش");
    } finally {
      setIsSaving(false);
    }
  };

  const getWeatherIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'storm': return <CloudLightning className={className} />;
      case 'rain': return <CloudRain className={className} />;
      case 'sun': return <Sun className={className} />;
      case 'partly-cloudy': return <Cloud className={className} />;
      default: return <Sun className={className} />;
    }
  };

  // --- UI Rendering ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white p-6">
        <Loader2 className="animate-spin text-black w-8 h-8" />
        <p className="mr-2 text-gray-600">در حال بارگذاری اطلاعات شرکت...</p>
      </div>
    );
  }

  if (!currentUser) return <div className="p-6 text-center text-red-500">لطفا ابتدا وارد شوید.</div>;

  return (
    <div className="min-h-screen bg-white w-full max-w-md mx-auto shadow-xl overflow-hidden flex flex-col relative pb-24">

      {/* Header Title */}
      <header className="pt-6 pb-4 px-4 text-center">
        <h1 className="text-lg font-bold text-gray-900">ثبت سفارش حمل بار</h1>
      </header>

      <main className="flex-1 px-4 space-y-5 overflow-y-auto no-scrollbar">

        {/* Toggle Switch */}
        <div className="bg-gray-200 rounded-full p-1 flex relative h-10 items-center">
          <button
            onClick={() => setCustomerType('regular')}
            className={`flex-1 text-sm font-medium rounded-full h-full transition-all duration-300 z-10 ${customerType === 'regular' ? 'text-white' : 'text-gray-500'
              }`}
          >
            مشتریان عادی
          </button>
          <button
            onClick={() => setCustomerType('chain')}
            className={`flex-1 text-sm font-medium rounded-full h-full transition-all duration-300 z-10 ${customerType === 'chain' ? 'text-white' : 'text-gray-500'
              }`}
          >
            فروشگاه زنجیره ای
          </button>

          {/* Animated Background Pill */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full transition-all duration-300 ${customerType === 'regular' ? 'right-1' : 'right-[50%]'
              }`}
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو نام مشتری"
            className="w-full bg-gray-100 rounded-2xl py-3 pr-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Weather Widget */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          {/* Days Scroller */}
          <div className="flex items-center justify-between mb-4 text-gray-400 text-xs">
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-2">
              {WEATHER_DAYS.map((day, idx) => (
                <div key={idx} className={`flex flex-col items-center gap-1 min-w-[3rem] ${day.isActive ? 'text-black font-bold' : ''}`}>
                  <span>{day.dayName}</span>
                  {getWeatherIcon(day.icon, `w-6 h-6 ${day.isActive ? 'text-gray-800' : 'text-gray-400'}`)}
                </div>
              ))}
            </div>
            <ChevronLeft className="w-4 h-4 text-orange-400" />
          </div>

          {/* Detailed Weather Info */}
          <div className="flex items-end justify-between px-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Thermometer className="w-5 h-5 text-gray-800" />
                <span className="text-3xl font-bold text-gray-800">30°</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Real Feel</span>
            </div>
            <span className="text-lg font-bold text-gray-800 pb-1">شیراز</span>
          </div>
        </div>

        {/* New Order Section Title */}
        <h2 className="text-right text-lg font-bold text-gray-900 mt-6 flex items-center gap-2">
          <PackagePlus className="w-5 h-5 text-gray-800" /> سفارش جدید
        </h2>

        {/* Form Fields - Styled to match the desired look */}
        <form onSubmit={handleCreate} className="space-y-4">

          {/* Invoice Number */}
          <FormInput
            label="شماره فاکتور / شماره درخواست"
            required
            value={newOrder.invoiceNumber || ""}
            onChange={(val) => setNewOrder({ ...newOrder, invoiceNumber: val })}
          />

          {/* Row: Name & Contact */}
          <div className="flex gap-3">
            <FormInput
              label="شماره تماس گیرنده"
              required
              className="flex-1"
              type="tel"
              value={newOrder.receiverContact || ""}
              onChange={(val) => setNewOrder({ ...newOrder, receiverContact: val })}
            />
            <FormInput
              label="نام مشتری"
              required
              className="flex-1"
              value={newOrder.receiverName || ""}
              onChange={(val) => setNewOrder({ ...newOrder, receiverName: val })}
            />
          </div>

          {/* Origin Section - Styled as a row */}
          <div className="flex gap-3">
            <FormSelect
              label="شهر مبدا"
              required
              className="flex-1"
              options={CITY_OPTIONS} // Ideally filtered by province
              value={newOrder.originCity || ""}
              onChange={(val) => setNewOrder({ ...newOrder, originCity: val })}
            />
            <FormSelect
              label="استان مبدا"
              required
              className="flex-1"
              options={PROVINCE_OPTIONS}
              value={newOrder.originProvince || PROVINCE_OPTIONS[0]}
              onChange={(val) => setNewOrder({ ...newOrder, originProvince: val })}
            />
          </div>

          {/* Destination Section - Styled as a row */}
          <div className="flex gap-3">
            <FormSelect
              label="شهر مقصد"
              required
              className="flex-1"
              options={CITY_OPTIONS} // Ideally filtered by province
              value={newOrder.destinationCity || ""}
              onChange={(val) => setNewOrder({ ...newOrder, destinationCity: val })}
            />
            <FormSelect
              label="استان مقصد"
              required
              className="flex-1"
              options={PROVINCE_OPTIONS}
              value={newOrder.destinationProvince || PROVINCE_OPTIONS[0]}
              onChange={(val) => setNewOrder({ ...newOrder, destinationProvince: val })}
            />
          </div>

          {/* Row: Count & Package Type */}
          <div className="flex gap-3">
            <FormSelect
              label="نوع بسته بندی"
              required
              className="flex-1"
              options={PACKAGE_OPTIONS}
              value={newOrder.packageType || PACKAGE_OPTIONS[0]}
              onChange={(val) => setNewOrder({ ...newOrder, packageType: val })}
            />
            <FormSelect
              label="تعداد بسته"
              required
              className="flex-1"
              options={['1', '2', '3', 'بیشتر']}
              value={newOrder.packageCount || '1'}
              onChange={(val) => setNewOrder({ ...newOrder, packageCount: val })}
            />
          </div>

          {/* Blue Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-700">
              حداکثر زمان تقریبی بارگیری از لحظه رسیدن خودرو N دقیقه می باشد
            </p>
          </div>

          {/* Red Warning Text */}
          <div className="flex items-start gap-2 px-1">
            <div className="min-w-[6px] h-[6px] rounded-full bg-red-500 mt-1.5"></div>
            <p className="text-[10px] leading-relaxed text-gray-500 text-justify">
              شرکت محترم ، بارگیری بیش از زمان اعلام شده مشمول هزینه خواهد بود. به ازای هر <span className="font-bold text-gray-700">30 دقیقه</span> تاخیر مبلغ <span className="font-bold text-gray-700">100.000</span> تومان به کرایه راننده اضافه می گردد
            </p>
          </div>

          {/* Row: Vehicle Type & Cargo Type */}
          <div className="flex gap-3">
            <FormSelect
              label="نوع کالا"
              required
              options={CARGO_TYPE_OPTIONS}
              className="flex-1"
              value={newOrder.goodType || CARGO_TYPE_OPTIONS[0]}
              onChange={(val) => setNewOrder({ ...newOrder, goodType: val })}
            />
            <FormSelect
              label="نوع خودرو درخواستی"
              required
              options={VEHICLE_TYPE_OPTIONS}
              className="flex-1"
              value={newOrder.requiredVehicleType || VEHICLE_TYPE_OPTIONS[0]}
              onChange={(val) => setNewOrder({ ...newOrder, requiredVehicleType: val })}
            />
          </div>

          {/* Row: Volume & Weight */}
          <div className="flex gap-3">
            <FormInput
              label="وزن"
              required
              type="number"
              suffix="کیلوگرم"
              className="flex-1"
              value={newOrder.weight || ""}
              onChange={(val) => setNewOrder({ ...newOrder, weight: Number(val) })}
            />
            <FormInput
              label="حجم (اختیاری)"
              className="flex-1"
              value={newOrder.size || ""}
              onChange={(val) => setNewOrder({ ...newOrder, size: val })}
            />
          </div>

          {/* Row: Value & Payment */}
          <div className="flex gap-3">
            <FormSelect
              label="نحوه پرداخت کرایه"
              required={false}
              className="flex-1"
              options={PAYMENT_OPTIONS}
              value={newOrder.paymentMethod || PAYMENT_OPTIONS[0]}
              onChange={(val) => setNewOrder({ ...newOrder, paymentMethod: val })}
            />
            <FormInput
              label="ارزش کالا (اختیاری)"
              suffix="ریال"
              type="number"
              className="flex-1"
              value={newOrder.goodsValue || ""}
              onChange={(val) => setNewOrder({ ...newOrder, goodsValue: Number(val) })}
            />
          </div>

          {/* Delivery Date */}
          <FormInput
            label="تاریخ تحویل مورد انتظار"
            required
            type="date"
            value={newOrder.deliveryDate || ""}
            onChange={(val) => setNewOrder({ ...newOrder, deliveryDate: val })}
          />

          {/* Delivery Hours */}
          <div className="w-full">
            <InputLabel label="ساعت کار انبار تحویل گیرنده" required />

            <div className="flex gap-3">

              {/* تا ساعت */}
              <div className="flex-1 bg-gray-100 rounded-lg p-3 flex flex-col">
                <span className="text-xs text-gray-500 mb-1">تا ساعت</span>
                <input
                  type="time"
                  value={newOrder.unloadingToHour || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, unloadingToHour: e.target.value })}
                  className="bg-transparent text-gray-900 text-sm focus:outline-none"
                />
              </div>

              {/* از ساعت */}
              <div className="flex-1 bg-gray-100 rounded-lg p-3 flex flex-col">
                <span className="text-xs text-gray-500 mb-1">از ساعت</span>
                <input
                  type="time"
                  value={newOrder.unloadingFromHour || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, unloadingFromHour: e.target.value })}
                  className="bg-transparent text-gray-900 text-sm focus:outline-none"
                />
              </div>

            </div>
          </div>


          {/* Address */}
          <FormTextArea
            label="آدرس پستی محل تخلیه بار"
            required
            value={newOrder.unloadingAddress || ""}
            onChange={(val) => setNewOrder({ ...newOrder, unloadingAddress: val })}
            rows={4}
          />

          {/* Description */}
          <FormTextArea
            label="توضیحات بیشتر"
            required={false}
            value={newOrder.loadDescription || ""}
            onChange={(val) => setNewOrder({ ...newOrder, loadDescription: val })}
            rows={3}
          />

        </form>
      </main>

      {/* Footer Button */}
      <div className="bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white p-4 border-t border-gray-100">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleCreate}
          className="w-full bg-black text-white text-lg font-bold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin w-6 h-6" /> : 'تایید'}
        </button>
      </div>

    </div>
  );
}