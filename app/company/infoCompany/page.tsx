// "use client"
// import React, { useState } from 'react';
// import RealPersonForm from './components/RealPersonForm';
// import LegalPersonForm from './components/LegalPersonForm';

// const App = () => {
//   const [activeForm, setActiveForm] = useState('real');
//   const [submittedData, setSubmittedData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   const handleFormSubmit = async (type, data) => {
//     setIsLoading(true);
//     setSubmittedData(null);

//     const processedData = { ...data };
//     const filePromises = [];

//     for (const key in processedData) {
//         const value = processedData[key];
//         if (value instanceof File) {
//             const promise = fileToBase64(value).then(base64 => {
//                 processedData[key] = base64;
//             });
//             filePromises.push(promise);
//         }
//     }

//     await Promise.all(filePromises);

//     const output = {
//       table: type === 'real' ? 'real_persons' : 'legal_persons',
//       data: processedData,
//     };

//     setSubmittedData(JSON.stringify(output, null, 2));
//     setIsLoading(false);
//     // Scroll to the bottom to show the JSON output
//     setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
//   };

//   const getHeaderText = () => {
//       return activeForm === 'real' ? 'اطلاعات شخص حقیقی' : 'اطلاعات شخص حقوقی';
//   }

//   return (
//     <div className="max-w-lg mx-auto bg-black min-h-screen">
//       <header className="bg-black text-white p-4 pt-8">
//         <h1 className="text-xl font-bold text-center mb-4">{getHeaderText()}</h1>
//         <div className="flex items-center justify-between">
//             <div></div>
//             <div className="flex items-center space-x-3 space-x-reverse">
//                 <div className="text-right">
//                     <p className="font-semibold">محمد فراهانی</p>
//                     {/* <p className="text-sm text-gray-400">سلام</p> */}
//                 </div>
//                 <img src="https://i.imgur.com/3j2a3f7.png" alt="Avatar" className="w-12 h-12 rounded-full" />
//             </div>
//             <div></div>
//         </div>
//       </header>
//       <main className="bg-white rounded-t-3xl p-4 md:p-6">
//         <div className="w-full mb-8">
//           <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setActiveForm('real')}
//               className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
//                 activeForm === 'real' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               حقیقی
//             </button>
//             <button
//               onClick={() => setActiveForm('legal')}
//               className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
//                 activeForm === 'legal' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               حقوقی
//             </button>
//           </div>
//         </div>

//         {activeForm === 'real' ? (
//           <RealPersonForm onSubmit={(data) => handleFormSubmit('real', data)} />
//         ) : (
//           <LegalPersonForm onSubmit={(data) => handleFormSubmit('legal', data)} />
//         )}
        
//         {(isLoading || submittedData) && (
//             <div className="mt-12">
//                 <h2 className="text-xl font-bold mb-4">خروجی JSON</h2>
//                  {isLoading ? (
//                     <div className="bg-gray-100 rounded-lg p-4 text-center">
//                         <p className="text-gray-600">در حال پردازش و تولید JSON...</p>
//                     </div>
//                  ) : (
//                     <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-left overflow-x-auto" dir="ltr">
//                         <code>{submittedData}</code>
//                     </pre>
//                  )}
//             </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default App;

// src/app/page.tsx 

// src/app/page.tsx
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import RealPersonForm from './components/RealPersonForm';
import LegalPersonForm from './components/LegalPersonForm';

// ایمپورت سرویس‌ها و تایپ‌ها
import { getCompanyByUserId, createCompany, getCompanyDetail, createOrUpdateCompanyDetail } from '../../services/userService';
import { Company, CompanyType, CompanyDetail } from '../../types';

// ایمپورت ابزارهای کمکی
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore'; // ماک AuthStore
import { updateCompanyType } from '../../services/userService'; // تابع جدید

// تعریف فیلدهای مختص هر نوع شرکت برای پاک‌سازی
const REAL_FIELDS = ['real_firstName', 'real_lastName', 'real_nationalId', 'real_socialSecurityCode', 'nationalCardFront', 'nationalCardBack'];
const LEGAL_FIELDS = ['legal_companyName', 'legal_registrationNumber', 'legal_nationalId', 'legal_socialSecurityWorkshopCode', 'legal_ceoName', 'legal_ceoLastName', 'officialGazette', 'latestChangesGazette'];


// تابع کمکی برای تبدیل فایل به Base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


const App = () => {
    const { currentUser } = useAuthStore(); 
    
    const [company, setCompany] = useState<Company | null>(null);
    const [details, setDetails] = useState<Partial<CompanyDetail>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // ۱. بارگذاری داده‌های اولیه
    const loadCompanyData = useCallback(async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        
        try {
            let comp = await getCompanyByUserId(currentUser.id);
            
            if (!comp) {
                // ایجاد شرکت به عنوان حقیقی اگر وجود نداشت
                comp = await createCompany(currentUser.id, CompanyType.REAL);
            }
            
            setCompany(comp);

            if (comp.id) {
                const detailData = await getCompanyDetail(comp.id);
                // جزئیات را به‌صورت Partial<CompanyDetail> ذخیره کن
                setDetails({ 
                    ...(detailData || {}), 
                    companyID: comp.id, 
                });
            }
        } catch (e) {
            console.error("خطا در بارگذاری اطلاعات شرکت:", e);
            setError("خطا در بارگذاری اطلاعات شرکت. لطفاً مجدداً تلاش کنید.");
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            loadCompanyData();
        }
    }, [currentUser, loadCompanyData]);

    // ۲. مدیریت تغییر نوع شرکت
    const handleTypeChange = async (newType: CompanyType) => {
        if (!company || saving || newType === company.type) return;
        setSaving(true);
        setError(null);
        
        try {
            // به‌روزرسانی نوع شرکت در جدول اصلی
            const updatedComp = await updateCompanyType(company.id, newType);
            setCompany(updatedComp);
            
            // نمایش داده‌های موجود در نوع جدید (بدون پاک کردن استیت)
            // هنگام سابمیت، داده‌های غیرمرتبط پاک خواهند شد.

        } catch (e) {
            console.error("خطا در تغییر نوع شرکت:", e);
            setError("خطا در تغییر نوع شرکت.");
        } finally {
            setSaving(false);
        }
    };
    
    // ۳. مدیریت ذخیره‌سازی نهایی فرم
    const handleFormSubmit = async (data: Partial<CompanyDetail>) => {
        if (!company || !company.id) {
            alert('اطلاعات شرکت ناقص است. ابتدا باید ثبت نام تکمیل شود.');
            return;
        }

        setSaving(true);
        setError(null);
        
        try {
            const currentType = company.type;
            let processedData: Partial<CompanyDetail> = { ...data };
            const filePromises: Promise<void>[] = [];

            // === ۱. تبدیل فایل‌ها به Base64 (فقط فایل‌های جدید یا به‌روز شده) ===
            const allFileFields = [...REAL_FIELDS.filter(f => f.includes('Card') || f.includes('Gazette')), ...LEGAL_FIELDS.filter(f => f.includes('Card') || f.includes('Gazette'))];

            for (const key of allFileFields) {
                const value = processedData[key as keyof Partial<CompanyDetail>];
                if (value instanceof File) {
                    const promise = fileToBase64(value).then(base64 => {
                        (processedData as any)[key] = base64; 
                    });
                    filePromises.push(promise);
                } else if (value === null) {
                    // اگر در FileUpload با دکمه X حذف شده، مقدار آن را null می‌گذاریم تا در دیتابیس پاک شود.
                    (processedData as any)[key] = null;
                }
            }
            await Promise.all(filePromises);

            // === ۲. پاک‌سازی فیلدهای غیرمرتبط ===
            const fieldsToRemove = currentType === CompanyType.REAL ? LEGAL_FIELDS : REAL_FIELDS;
            
            // حذف فیلدهای نامرتبط از آبجکت ارسالی
            fieldsToRemove.forEach(field => {
                delete (processedData as any)[field];
            });


            // === ۳. ارسال داده‌ها به سرویس ذخیره‌سازی ===
            const detailsToSave = { 
                ...processedData, 
                companyID: company.id,
                type: currentType, // اطمینان از ارسال نوع صحیح
            };
            
            const savedDetails = await createOrUpdateCompanyDetail(detailsToSave);
            
            // به‌روزرسانی استیت details با داده‌های تمیز شده و ذخیره شده
            setDetails(savedDetails);
            
            alert('تغییرات با موفقیت ثبت شد.');

        } catch (e) {
            console.error("خطا در ذخیره جزئیات:", e);
            setError('خطا در ثبت تغییرات. لطفاً فیلدها را بررسی کنید.');
        } finally {
            setSaving(false);
        }
    };

    // ---------------- UI نمایش وضعیت‌ها ----------------
    const activeFormType = company?.type || CompanyType.REAL;
    const isLegal = activeFormType === CompanyType.LEGAL;

    if (!currentUser) return <div className="p-6 text-center text-red-500">لطفا ابتدا وارد شوید.</div>;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-100 rounded-xl shadow-sm p-6 max-w-lg mx-auto mt-20">
                <Loader2 className="animate-spin text-black w-8 h-8" />
                <p className="mr-2 text-gray-600">در حال بارگذاری اطلاعات اولیه...</p>
            </div>
        );
    }
    
    return (
        <div dir="rtl" className="max-w-xl mx-auto bg-black min-h-screen">
            <header className="bg-black text-white p-4 pt-8">
                <h1 className="text-xl font-bold text-center mb-4">
                    اطلاعات شخص {isLegal ? 'حقوقی' : 'حقیقی'}
                </h1>
                <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="text-right">
                            <p className="font-semibold">{currentUser?.fullName || 'کاربر'}</p>
                        </div>
                        <img src="https://i.imgur.com/3j2a3f7.png" alt="Avatar" className="w-12 h-12 rounded-full" />
                    </div>
                    <div></div>
                </div>
            </header>
            
            <main className="bg-white rounded-t-3xl p-4 md:p-6 min-h-[80vh]">
                
                {/* دکمه‌های انتخاب نوع شرکت */}
                <div className="w-full mb-8">
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => handleTypeChange(CompanyType.REAL)}
                            disabled={saving}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                !isLegal ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            حقیقی
                        </button>
                        <button
                            onClick={() => handleTypeChange(CompanyType.LEGAL)}
                            disabled={saving}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                isLegal ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            حقوقی
                        </button>
                    </div>
                </div>

                {/* نمایش وضعیت ذخیره‌سازی و خطا */}
                {saving && (
                    <div className="flex items-center justify-center p-3 bg-blue-50 text-blue-800 rounded-lg mb-4">
                        <Loader2 className="animate-spin w-5 h-5 ml-2" />
                        در حال به‌روزرسانی اطلاعات...
                    </div>
                )}
                {error && (
                    <div className="flex items-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
                        <AlertCircle className="w-5 h-5 ml-2" />
                        {error}
                    </div>
                )}
                
                {/* رندر فرم فعال */}
                {activeFormType === CompanyType.REAL ? (
                    <RealPersonForm 
                        initialData={details} 
                        onSubmit={handleFormSubmit} 
                        isLoading={saving}
                    />
                ) : (
                    <LegalPersonForm 
                        initialData={details} 
                        onSubmit={handleFormSubmit} 
                        isLoading={saving}
                    />
                )}
            </main>
        </div>
    );
};

export default App;