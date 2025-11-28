

"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUser, FaIdCard, FaIdCardAlt, FaAward, FaCamera, FaPlus, FaChevronDown } from 'react-icons/fa';
import { Loader2, Save } from 'lucide-react';
import { Driver } from '../../types'; // فرض می‌شود این مسیر درست است
import { createOrUpdateDriver } from '../driverService'; // فرض می‌شود این مسیر درست است

// --- Type Definition for Props ---

interface Props {
  driver: Partial<Driver>;
  userID: string;
  onUpdate: (d: Driver) => void;
}

// --- Reusable UI Components (Based on the provided new structure) ---

// این کامپوننت‌ها به دلایل زیر تغییر کمی داشته‌اند:
// 1. اضافه شدن type: string به onChange
// 2. تغییرات جزئی در استایل برای انطباق بهتر با Tailwind

interface FormFieldProps {
  label: string;
  name: keyof Partial<Driver> | 'idNumber' | 'nationalId'; // idNumber و nationalId در Driver اولیه نبودند، اما در فرم جدید اضافه شده‌اند. من آنها را حذف می‌کنم و از nationalIdFront/Back استفاده می‌کنم.
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'password';
  dir?: 'rtl' | 'ltr';
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, required, className = '', placeholder, type = 'text', dir = 'rtl', disabled = false }) => (
  <div className={className}>
    <label htmlFor={name as string} className="block text-right text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <input
      id={name as string}
      name={name as string}
      value={value ?? ''}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      dir={dir}
      className={`w-full rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black text-right ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
      required={required}
      disabled={disabled}
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  name: keyof Partial<Driver>;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, required, className = '', options }) => (
  <div className={className}>
    <label htmlFor={name as string} className="block text-right text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <div className="relative">
      <select
        id={name as string}
        name={name as string}
        value={value ?? ''}
        onChange={onChange}
        className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black appearance-none text-right pr-10 hover:bg-gray-200"
        required={required}
      >
        <option value="" disabled>انتخاب کنید...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

interface UploadBoxProps {
  icon: React.ReactNode;
  text: string;
  name: keyof Partial<Driver>;
  previewUrl: string | undefined;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ icon, text, name, previewUrl, onFileChange, onClick }) => {
  const inputId = `file-input-${name as string}`;
  const commonButton = (
    <div className="absolute bottom-[-10px] left-[-10px] bg-black text-white rounded-full w-7 h-7 flex items-center justify-center border-4 border-white z-10 shadow-md">
      <FaPlus size={12} />
    </div>
  );

  return (
    <div className="relative">
      <label htmlFor={onClick ? undefined : inputId} onClick={onClick} className="cursor-pointer block h-full">
        <div className="relative bg-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-32 overflow-hidden hover:bg-gray-200 transition-colors">
          {previewUrl ? (
            // 

// [Image of the uploaded document or live photo preview]

            <img src={previewUrl} alt={text} className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="text-3xl text-gray-500 mb-2">{icon}</div>
              <p className="text-sm font-medium text-gray-700">{text}</p>
            </>
          )}
        </div>
      </label>
      {!onClick && (
        <input type="file" id={inputId} name={name as string} accept="image/*" className="hidden" onChange={onFileChange} />
      )}
      {commonButton}
    </div>
  );
};

interface CameraCaptureModalProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function getCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("خطا در دسترسی به دوربین. لطفا مجوزها را بررسی کنید.");
        onClose();
      }
    }
    getCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onClose]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      onCapture(dataUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 rounded-xl max-w-lg w-full">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg mb-4 shadow-md"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="flex justify-between gap-2">
          <button onClick={onClose} type="button" className="flex-1 py-3 bg-gray-200 rounded-full font-semibold hover:bg-gray-300 transition-colors">بستن</button>
          <button onClick={handleCapture} type="button" className="flex-1 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">گرفتن عکس</button>
        </div>
      </div>
    </div>
  );
};


// --- Main DriverProfile Component ---

export const DriverProfile: React.FC<Props> = ({ driver, userID, onUpdate }) => {
  // تفکیک formData و imagePreviews برای مدیریت بهتر
  const initialFormData: Partial<Driver> = {
    ...driver,
    id: driver.id ?? '',
    userID: driver.userID ?? userID,
  };

  const [formData, setFormData] = useState<Partial<Driver>>(initialFormData);
  // توجه: در اپلیکیشن واقعی، اینها باید به سرور آپلود شده و URL آنها در formData ذخیره شود.
  // در اینجا از state جداگانه برای نگهداری Base64 پیش‌نمایش استفاده می‌کنیم.
  const [imagePreviews, setImagePreviews] = useState<Partial<Driver>>({
    nationalIdFront: formData.nationalIdFront,
    nationalIdBack: formData.nationalIdBack,
    accountHolderIdFront: formData.accountHolderIdFront,
    accountHolderIdBack: formData.accountHolderIdBack,
    driverIdFront: formData.driverIdFront,
    driverIdBack: formData.driverIdBack,
    license: formData.license,
    smartCard: formData.smartCard,
    livePhoto: formData.livePhoto,
  });

  const [loading, setLoading] = useState(false);
  // فرض می‌کنیم صاحب حساب 'self' است اگر اطلاعاتی از قبل وجود نداشته باشد
  const [accountOwner, setAccountOwner] = useState<'self' | 'other'>(
    (driver.accountHolderName || driver.accountHolderLastName || driver.accountHolderNationalId) ? 'other' : 'self'
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof Driver]: value }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // در برنامه واقعی، در اینجا فایل را به سرور آپلود کرده و URL آن را در formData ذخیره کنید
        // در اینجا فقط پیش‌نمایش Base64 را ذخیره می‌کنیم
        setImagePreviews(prev => ({ ...prev, [name as keyof Driver]: result }));
        // برای حفظ سازگاری، یک مقدار placeholder در formData ذخیره می‌کنیم
        setFormData(prev => ({ ...prev, [name as keyof Driver]: result })); // موقتاً Base64 را در formData ذخیره می‌کنیم
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = (dataUrl: string) => {
    setImagePreviews(prev => ({ ...prev, livePhoto: dataUrl }));
    setFormData(prev => ({ ...prev, livePhoto: dataUrl })); // موقتاً Base64 را در formData ذخیره می‌کنیم
    setIsCameraOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // آماده‌سازی داده‌ها برای ارسال
    let dataToSubmit: Partial<Driver> = { ...formData, userID };

    // اگر صاحب حساب راننده است، اطلاعات صاحب حساب را خالی کنید
    if (accountOwner === 'self') {
      dataToSubmit = {
        ...dataToSubmit,
        accountOwner: dataToSubmit.firstName + ' ' + dataToSubmit.lastName, // فیلد accountOwner را با نام راننده پر کنید
        accountHolderName: undefined,
        accountHolderLastName: undefined,
        accountHolderNationalId: undefined,
        accountHolderIdFront: undefined,
        accountHolderIdBack: undefined,
        driverIdFront: undefined, // اینها دیگر لازم نیستند
        driverIdBack: undefined, // اینها دیگر لازم نیستند
      };
    } else {
      // اگر شخص دیگر است، فیلد accountOwner را بر اساس نام و نام خانوادگی صاحب حساب پر کنید
      dataToSubmit = {
        ...dataToSubmit,
        accountOwner: dataToSubmit.accountHolderName + ' ' + dataToSubmit.accountHolderLastName,
      };
    }

    try {
      // TODO: در این بخش باید ابتدا تمامی فایل‌های Base64 (موجود در imagePreviews یا formData) را به سرور آپلود کنید
      // و URLهای نهایی را جایگزین مقادیر Base64 در dataToSubmit نمایید.
      // مثال: const nationalIdFrontUrl = await uploadFile(imagePreviews.nationalIdFront);

      const saved: Driver = await createOrUpdateDriver(dataToSubmit as Driver);
      onUpdate(saved);
      alert('اطلاعات راننده ذخیره شد');
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const provinceOptions = [
    { value: 'تهران', label: 'استان تهران' },
    { value: 'البرز', label: 'استان البرز' },
    // اضافه کردن سایر استان‌ها
  ];

  const cityOptions = [
    { value: 'تهران', label: 'تهران' },
    { value: 'کرج', label: 'کرج' },
    // اضافه کردن سایر شهرها
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
  ];

  return (
    <div className="bg-gray-200 flex items-start justify-center min-h-screen">
      {isCameraOpen && <CameraCaptureModal onCapture={handleTakePhoto} onClose={() => setIsCameraOpen(false)} />}
      
      <div className="w-full max-w-md bg-white shadow-lg flex flex-col min-h-screen">
        <header className="bg-black text-white p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="bg-gray-700 p-3 rounded-full">
              <FaUser className="text-white text-3xl" />
            </div>
            <div className="text-right">
              {/* می‌توان از اطلاعات فعلی راننده استفاده کرد یا یک نام placeholder */}
              <h1 className="text-xl font-bold">{formData.firstName || 'راننده'} {formData.lastName || 'عزیز'}</h1>
              <p className="text-sm text-gray-300">سلام کاپیتان</p>
            </div>
          </div>
          <h2 className="text-center text-lg font-semibold mt-4">تکمیل اطلاعات راننده</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <main className="bg-white rounded-t-3xl -mt-6 z-0 p-6 space-y-8">
            
            {/* اطلاعات فردی */}
            <section>
              <h3 className="font-bold text-right mb-4 border-b pb-2 text-gray-800">اطلاعات هویتی و تماس</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                
                <FormField 
                  label="نام خانوادگی" name="lastName" 
                  value={formData.lastName} onChange={handleInputChange} 
                  required 
                />
                <FormField 
                  label="نام" name="firstName" 
                  value={formData.firstName} onChange={handleInputChange} 
                  required 
                />
                
                {/* در Driver interface فیلدی برای کد ملی خود راننده ندارید. فرض می‌کنیم NationalIdFront/Back برای همین منظور استفاده می‌شود. اما اگر فیلد مستقیم می‌خواهید، باید به interface اضافه شود. از nationalIdFront به عنوان Placeholder استفاده می‌کنم. */}
                {/*
                <FormField 
                  label="کد ملی (در Driver interface تعریف نشده)" name="nationalId" 
                  value={formData.nationalId} onChange={handleInputChange} 
                  required 
                />
                */}
                
                <FormField 
                  label="شماره همراه ۱" name="mobile1" 
                  value={formData.mobile1} onChange={handleInputChange} 
                  dir="ltr" type="tel" disabled 
                />
                <FormField 
                  label="شماره همراه ۲" name="mobile2" 
                  value={formData.mobile2} onChange={handleInputChange} 
                  dir="ltr" type="tel"
                />

                <SelectField 
                  label="شهر" name="city" 
                  value={formData.city} onChange={e => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)} 
                  required 
                  options={cityOptions}
                />
                <SelectField 
                  label="استان" name="province" 
                  value={formData.province} onChange={e => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)} 
                  required 
                  options={provinceOptions}
                />
                
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-right text-sm font-medium text-gray-700 mb-1">
                    آدرس محل سکونت<span className="text-red-500 mr-1">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black text-right hover:bg-gray-200"
                    required
                  ></textarea>
                </div>
                
                <SelectField 
                  label="گروه خونی" name="bloodType" 
                  value={formData.bloodType} onChange={e => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)} 
                  options={bloodTypeOptions}
                />
                <FormField 
                  label="کد پستی" name="postalCode" 
                  value={formData.postalCode} onChange={handleInputChange} 
                />
              </div>
            </section>

            {/* اطلاعات بانکی */}
            <section>
              <h3 className="font-bold text-right mb-4 border-b pb-2 text-gray-800">اطلاعات بانکی</h3>
              
              <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                صاحب حساب<span className="text-red-500 mr-1">*</span>
              </label>
              <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setAccountOwner('other')}
                  className={`w-1/2 py-2 rounded-full text-center font-semibold transition-colors text-sm ${accountOwner === 'other' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
                >
                  شخص دیگر
                </button>
                <button
                  type="button"
                  onClick={() => setAccountOwner('self')}
                  className={`w-1/2 py-2 rounded-full text-center font-semibold transition-colors text-sm ${accountOwner === 'self' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
                >
                  خودم
                </button>
              </div>

              {accountOwner === 'other' && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
                  <FormField label="نام صاحب حساب" name="accountHolderName" 
                    value={formData.accountHolderName} onChange={handleInputChange} 
                    required={accountOwner === 'other'} 
                  />
                  <FormField label="نام خانوادگی صاحب حساب" name="accountHolderLastName" 
                    value={formData.accountHolderLastName} onChange={handleInputChange} 
                    required={accountOwner === 'other'} 
                  />
                  <FormField label="کد ملی صاحب حساب" name="accountHolderNationalId" 
                    value={formData.accountHolderNationalId} onChange={handleInputChange} 
                    required={accountOwner === 'other'} 
                  />
                </div>
              )}

              <div className="mt-6 space-y-4">
                <FormField label="شماره کارت بانکی" name="cardNumber" 
                  value={formData.cardNumber} onChange={handleInputChange} 
                  placeholder="---- | ---- | ---- | ----" dir="ltr" 
                  required 
                />
                <div className="relative">
                  <FormField label="شماره شبا" name="shebaNumber" 
                    value={formData.shebaNumber} onChange={handleInputChange} 
                    placeholder="24 رقم" dir="ltr" 
                    required 
                  />
                  <span className="absolute top-[42px] right-4 text-gray-500 font-semibold pointer-events-none">IR</span>
                </div>
                {/* دکمه "اضافه کردن شماره کارت و شبا" حذف شد تا منطق فرم ساده بماند */}
              </div>
            </section>

            {/* آپلود مدارک */}
            <section>
              <h3 className="font-bold text-right mb-4 border-b pb-2 text-gray-800">
                آپلود مدارک<span className="text-red-500 mr-1">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-6">
                
                {/* مدارک کارت ملی - بر اساس صاحب حساب */}
                {accountOwner === 'self' && (
                  <>
                    <UploadBox icon={<FaIdCard />} text="کارت ملی راننده (رو)" name="nationalIdFront" 
                      previewUrl={imagePreviews.nationalIdFront} onFileChange={handleFileChange} />
                    <UploadBox icon={<FaIdCard />} text="کارت ملی راننده (پشت)" name="nationalIdBack" 
                      previewUrl={imagePreviews.nationalIdBack} onFileChange={handleFileChange} />
                  </>
                )}
                {accountOwner === 'other' && (
                  <>
                    <UploadBox icon={<FaIdCard />} text="کارت ملی صاحب حساب (رو)" name="accountHolderIdFront" 
                      previewUrl={imagePreviews.accountHolderIdFront} onFileChange={handleFileChange} />
                    <UploadBox icon={<FaIdCard />} text="کارت ملی صاحب حساب (پشت)" name="accountHolderIdBack" 
                      previewUrl={imagePreviews.accountHolderIdBack} onFileChange={handleFileChange} />
                    <UploadBox icon={<FaIdCard />} text="کارت ملی راننده (رو)" name="driverIdFront" 
                      previewUrl={imagePreviews.driverIdFront} onFileChange={handleFileChange} />
                    <UploadBox icon={<FaIdCard />} text="کارت ملی راننده (پشت)" name="driverIdBack" 
                      previewUrl={imagePreviews.driverIdBack} onFileChange={handleFileChange} />
                  </>
                )}

                {/* سایر مدارک */}
                <UploadBox icon={<FaIdCardAlt />} text="گواهینامه" name="license" 
                  previewUrl={imagePreviews.license} onFileChange={handleFileChange} />
                <UploadBox icon={<FaAward />} text="کارت هوشمند" name="smartCard" 
                  previewUrl={imagePreviews.smartCard} onFileChange={handleFileChange} />
                
                {/* عکس زنده */}
                <div className="col-span-2">
                  <UploadBox icon={<FaCamera />} text="تصویر چهره راننده (زنده)" name="livePhoto" 
                    previewUrl={imagePreviews.livePhoto} onClick={() => setIsCameraOpen(true)} />
                </div>
              </div>
            </section>
          </main>

          {/* دکمه ذخیره */}
          <footer className="p-6 bg-white sticky bottom-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-full text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
              ذخیره اطلاعات
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// import React, { useState } from 'react';
// import { Driver } from '../../types';
// import { createOrUpdateDriver } from '../driverService';
// import { UserCircle, Save, Loader2 } from 'lucide-react';

// interface Props {
//   driver: Partial<Driver>;
//   userID: string;
//   onUpdate: (d: Driver) => void;
// }

// export const DriverProfile: React.FC<Props> = ({ driver, userID, onUpdate }) => {
//   const [formData, setFormData] = useState<Partial<Driver>>(driver);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const saved = await createOrUpdateDriver({ ...formData, userID });
//       onUpdate(saved);
//       alert('اطلاعات راننده ذخیره شد');
//     } catch (err) {
//       alert('خطا در ذخیره اطلاعات');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//             <UserCircle className="text-green-500" /> اطلاعات هویتی
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
//                     <input 
//                         type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//                         value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
//                     <input 
//                         type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//                         value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">موبایل اصلی</label>
//                     <input 
//                         type="text" disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
//                         value={formData.mobile1 || ''}
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
//                     <input 
//                         type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//                         value={formData.province || ''} onChange={e => setFormData({...formData, province: e.target.value})}
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
//                     <input 
//                         type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//                         value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})}
//                     />
//                 </div>
//                     <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">شماره شبا</label>
//                     <input 
//                         type="text" dir="ltr" placeholder="IR..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//                         value={formData.shebaNumber || ''} onChange={e => setFormData({...formData, shebaNumber: e.target.value})}
//                     />
//                 </div>
//             </div>
//             <div className="pt-4 border-t">
//                 <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-70">
//                     {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
//                     ذخیره تغییرات
//                 </button>
//             </div>
//         </form>
//     </div>
//   );
// };
