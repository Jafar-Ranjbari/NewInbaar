"use client"
import React, { useEffect, useState, useRef, FC, ReactNode, useCallback } from "react";
import {
  FaAngleDown,
  FaUmbrella,
  FaRegCreditCard,
  FaTruck,
  FaCar,
  FaFileAlt,
  FaPlus,
  FaUserSecret,
} from "react-icons/fa";
import { Truck as TruckIcon, Save, Loader2 } from 'lucide-react';

// فرض می‌شود این import‌ها از فایل‌های پروژه شما هستند
import { DriverCar } from '../../types'; 
import { createOrUpdateCar, getCarByDriverId } from './../driverService';
import { useDriverDashboardData } from '../useDriverDashboardData';

// --- Type Definitions for Reusable Components ---

interface CustomInputProps {
  label: string;
  name: keyof Partial<DriverCar>;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'tel';
  dir?: 'rtl' | 'ltr';
  disabled?: boolean;
}

const CustomInput: FC<CustomInputProps> = ({ label, placeholder, name, value, onChange, required = false, type = 'text', dir = 'rtl', disabled = false }) => (
  <div className="w-full">
    <label htmlFor={name as string} className="block text-sm font-medium text-gray-700 text-right mb-1">
      {label} {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <input
      id={name as string}
      name={name as string}
      value={value ?? ''}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      dir={dir}
      className={`w-full border-0 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-black text-right ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
      required={required}
      disabled={disabled}
    />
  </div>
);

interface CustomSelectProps {
  label: string;
  name: keyof Partial<DriverCar>;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

const CustomSelect: FC<CustomSelectProps> = ({ label, options, name, value, onChange, required = false }) => (
  <div className="relative w-full">
    <label htmlFor={name as string} className="block text-sm font-medium text-gray-700 text-right mb-1">
      {label} {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <select
      id={name as string}
      name={name as string}
      value={value ?? ''}
      onChange={onChange}
      className="w-full bg-gray-100 border-0 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-black text-right hover:bg-gray-200"
      required={required}
    >
      <option value="" disabled>انتخاب کنید</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 pt-6 text-gray-700">
      <FaAngleDown />
    </div>
  </div>
);

interface UploadCardProps {
  icon: ReactNode;
  label: string;
  name: keyof Partial<DriverCar>;
  previewUrl: string | undefined;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const UploadCard: FC<UploadCardProps> = ({ icon, label, name, previewUrl, onFileChange, required = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative rounded-2xl p-4 flex flex-col items-center justify-center aspect-[4/3] cursor-pointer overflow-hidden transition-all duration-200 shadow-sm border border-gray-200"
      onClick={handleClick}
    >
      <input
        type="file"
        name={name as string}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
        required={required}
      />
      {previewUrl ? (
        // 
        <img src={previewUrl} alt={label} className="w-full h-full object-cover rounded-xl" />
      ) : (
        <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center rounded-xl hover:bg-gray-200">
          <div className="text-4xl text-gray-600 mb-2">{icon}</div>
          <p className="text-gray-800 text-center text-sm font-medium">{label}</p>
        </div>
      )}
      <div className="absolute bottom-[-6px] left-[-6px] bg-black text-white rounded-full w-7 h-7 flex items-center justify-center border-4 border-white shadow-md">
        <FaPlus size={12} />
      </div>
    </div>
  );
};


// --- Data Definitions ---

const VEHICLE_TYPE_OPTIONS = [
  { value: 'PICKUP', label: 'وانت (Pickup)' },
  { value: 'TRUCK', label: 'کامیون (Truck)' },
  { value: 'TRAILER', label: 'تریلی (Trailer)' },
  { value: 'MINIBUS', label: 'مینی‌بوس (Minibus)' },
];

const BODY_TYPE_OPTIONS = [
  { value: 'CANVAS', label: 'مسقف (چادری)' },
  { value: 'OPEN', label: 'بدون سقف (روباز)' },
  { value: 'REFRIGERATED', label: 'یخچالی' },
  { value: 'TANKER', label: 'تانکر' },
];

const COOLING_OPTIONS = [
  { value: 'YES', label: 'دارد' },
  { value: 'NO', label: 'ندارد' },
];


const UPLOAD_ITEMS: { id: keyof Partial<DriverCar>, icon: ReactNode, label: string, required?: boolean }[] = [
  { id: "insuranceUrl", icon: <FaUmbrella />, label: "بیمه خودرو", required: true },
  { id: "cardUrl", icon: <FaRegCreditCard />, label: "کارت خودرو", required: true },
  { id: "sideViewUrl", icon: <FaTruck />, label: "تصویر از بغل خودرو", required: false },
  { id: "frontViewUrl", icon: <FaCar />, label: "تصویر روبرو از خودرو", required: false },
  { id: "registrationUrl", icon: <FaFileAlt />, label: "برگ سبز خودرو" },
];

// --- Main Component ---

const DriverCarTab: FC = () => {
  // فرض می‌کنیم useDriverDashboardData اطلاعات راننده را فراهم می‌کند
  const { driver } = useDriverDashboardData();
  const driverID = driver?.id;

  // استفاده از Partial<DriverCar> برای state اولیه
  const [car, setCar] = useState<Partial<DriverCar>>({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Partial<DriverCar>>({});


  useEffect(() => {
    if (driverID) {
      getCarByDriverId(driverID).then(c => { 
        if (c) {
          setCar(c);
          // در اینجا باید URLها را به imagePreviews منتقل کنید تا هنگام لود شدن، پیش‌نمایش قابل مشاهده باشد
          setImagePreviews({
            insuranceUrl: c.insuranceUrl,
            cardUrl: c.cardUrl,
            sideViewUrl: c.sideViewUrl,
            frontViewUrl: c.frontViewUrl,
            registrationUrl: c.registrationUrl,
          });
        } 
      });
    }
  }, [driverID]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCar(prev => ({ ...prev, [name as keyof DriverCar]: value }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // 1. ذخیره Base64 برای نمایش در UI
        setImagePreviews(prev => ({ ...prev, [name as keyof DriverCar]: result }));
        // 2. ذخیره Base64 موقت در State اصلی برای ارسال در handleSubmit
        setCar(prev => ({ ...prev, [name as keyof DriverCar]: result }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverID) return;

    // TODO: اعتبار سنجی فیلدهای الزامی در اینجا اضافه شود

    setLoading(true);
    try {
      // TODO: قبل از ارسال، فایل‌های Base64 (که در car.xxxUrl ذخیره شده‌اند) باید به سرور آپلود شوند 
      // و در نهایت URLهای نهایی به جای Base64 در شیء `carToSave` قرار گیرند.
      let carToSave: Partial<DriverCar> = { ...car, driverID };

      // برای دمو، فرض می‌کنیم سرویس، Base64 را می‌پذیرد یا تبدیل می‌کند
      const saved: DriverCar = await createOrUpdateCar(carToSave as DriverCar);
      setCar(saved);
      // پس از ذخیره موفق، باید imagePreviews را با URLهای ذخیره‌شده به‌روز کنید (اگر سرویس، URL برمی‌گرداند)
      setImagePreviews({
        insuranceUrl: saved.insuranceUrl,
        cardUrl: saved.cardUrl,
        sideViewUrl: saved.sideViewUrl,
        frontViewUrl: saved.frontViewUrl,
        registrationUrl: saved.registrationUrl,
      });

      alert('اطلاعات خودرو ذخیره شد');
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  if (!driverID) {
    return (
      <div className="w-full max-w-sm mx-auto bg-gray-200 p-4 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-yellow-700 bg-yellow-50 border border-yellow-200 w-full">
          ❌ ابتدا پروفایل راننده را تکمیل کنید.
        </div>
      </div>
    );
  }

  // --- Render UI ---
  return (
    <div className="bg-gray-200 flex justify-center min-h-screen">
      <div className="bg-white min-h-screen max-w-sm mx-auto shadow-lg overflow-hidden relative w-full">
        {/* Header */}
        <header className="bg-black text-white pt-8 pb-4 mb-10 rounded-b-[3rem] sticky top-0 z-20">
          <div className="px-4">
            <h1 className="text-center text-lg font-bold mb-4 flex items-center justify-center gap-2">
                <TruckIcon size={20} className="text-white" /> اطلاعات ناوگان
            </h1>
            <div className="flex items-center justify-start gap-3">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-500">
                <FaUserSecret size={32} className="text-gray-300" />
              </div>
              <div className="text-right">
                <h2 className="font-bold text-base">{driver.firstName || 'راننده'} {driver.lastName || 'عزیز'}</h2>
                <p className="text-sm text-gray-300">{car.carModel || 'مدل نامشخص'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSave}>
          <main className="bg-white rounded-t-[2.5rem] -mt-8 pt-6 pb-28 px-4 z-10 relative space-y-8">
            
            <section>
              <h3 className="font-bold text-base mb-4 text-right border-b pb-2 text-gray-800">مشخصات فنی</h3>
              <div className="grid grid-cols-2 gap-4 text-right">
                
                {/* vehicleType */}
                <CustomSelect 
                  label="نوع خودرو" name="vehicleType" 
                  value={car.vehicleType} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLSelectElement>) => void} 
                  options={VEHICLE_TYPE_OPTIONS} 
                  required
                />
                
                {/* carModel */}
                <CustomInput 
                  label="مدل خودرو" name="carModel" 
                  value={car.carModel} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
                  placeholder="مثال: آریسان، فوتون" 
                  required
                />

                {/* licensePlate */}
                <CustomInput 
                  label="پلاک خودرو" name="licensePlate" 
                  value={car.licensePlate} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
                  placeholder="مثال: ایران ۱۱-۱۲۳ب۴۵" 
                  dir="ltr" 
                  required
                />
                
                {/* vehicleColor */}
                <CustomInput 
                  label="رنگ خودرو" name="vehicleColor" 
                  value={car.vehicleColor} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
                  placeholder="مثال: سفید" 
                />

                {/* loadCapacity */}
                <CustomInput 
                  label="ظرفیت بار (تن)" name="loadCapacity" 
                  value={car.loadCapacity} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
                  type="number"
                  placeholder="مثال: ۱.۵" 
                />
                
                {/* coolingSystem */}
                <CustomSelect 
                  label="سیستم سرمایش" name="coolingSystem" 
                  value={car.coolingSystem} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLSelectElement>) => void} 
                  options={COOLING_OPTIONS} 
                />
                
                {/* rearBodyType */}
                <CustomSelect 
                  label="نوع اتاق پشت" name="rearBodyType" 
                  value={car.rearBodyType} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLSelectElement>) => void} 
                  options={BODY_TYPE_OPTIONS} 
                />

                {/* owner - اختیاری */}
                <CustomInput 
                  label="نام مالک (اگر با راننده متفاوت است)" name="owner" 
                  value={car.owner} 
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
                  placeholder="نام مالک" 
                />
              </div>
            </section>

            {/* آپلود مدارک */}
            <section className="mt-8">
              <h3 className="font-bold text-base mb-4 text-right border-b pb-2 text-gray-800">
                آپلود مدارک <span className="text-red-500 mr-1">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {UPLOAD_ITEMS.map((item) => (
                  <UploadCard
                    key={item.id as string}
                    icon={item.icon}
                    label={item.label}
                    name={item.id}
                    previewUrl={imagePreviews[item.id]}
                    onFileChange={handleFileChange}
                    required={item.required}
                  />
                ))}
              </div>
            </section>
          </main>

          {/* Footer / Save Button */}
          <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white p-4 border-t border-gray-200 z-50 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)]">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-2xl text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              ذخیره اطلاعات خودرو
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default DriverCarTab; 