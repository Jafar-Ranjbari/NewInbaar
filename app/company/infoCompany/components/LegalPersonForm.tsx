// import React, { useState, useMemo } from 'react';
// import FileUpload from './FileUpload';
// import { PROVINCES, CITIES_BY_PROVINCE } from '../constants';

// const InputField = ({ label, id, value, onChange, required = false, hasError = false }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type="text"
//       id={id}
//       name={id}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 ${hasError ? 'border-red-500' : 'border-transparent'}`}
//     />
//     {hasError && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
//   </div>
// );

// const LegalPersonForm = ({ onSubmit }) => {
//     const [formData, setFormData] = useState({
//         companyName: '', registrationNumber: '', nationalId: '', brandName: '', socialSecurityWorkshopCode: '', 
//         ceoName: '', ceoLastName: '', province: '', city: '', companyPostalAddress: '', postalCode: '',
//         deliveryAddress: '', workHoursFrom: '', workHoursTo: '', repFirstName: '', repLastName: '',
//         repMobile1: '', repMobile2: '', repPhone: '', repInternal: '', repWhatsapp: '', repEmail: '',
//         officialGazette: null, latestChangesGazette: null,
//     });
//     const [errors, setErrors] = useState([]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (name === 'province') {
//              setFormData(prev => ({ ...prev, city: '' }));
//         }
//     };

//     const handleFileSelect = (id, file) => {
//         setFormData(prev => ({...prev, [id]: file}));
//     }

//     const validateForm = () => {
//         const newErrors = [];
//         const requiredFields = [
//             'companyName', 'registrationNumber', 'nationalId', 'socialSecurityWorkshopCode', 'ceoName', 'ceoLastName', 'province', 'city', 'companyPostalAddress', 'postalCode', 'deliveryAddress', 'workHoursFrom', 'workHoursTo', 'repFirstName', 'repLastName', 'repMobile1', 'repWhatsapp'
//         ];

//         requiredFields.forEach(field => {
//             if (!formData[field]) {
//                 newErrors.push(field);
//             }
//         });

//         if (!formData.officialGazette) newErrors.push('officialGazette');
//         if (!formData.latestChangesGazette) newErrors.push('latestChangesGazette');

//         setErrors(newErrors);
//         return newErrors.length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             onSubmit(formData);
//         } else {
//              console.log('Validation failed');
//         }
//     };

//     const cities = useMemo(() => {
//         return CITIES_BY_PROVINCE[formData.province] || [];
//     }, [formData.province]);

//     return (
//         <form onSubmit={handleSubmit} className="space-y-8" noValidate>
//             <FormSection title="اطلاعات حقوقی">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                     <InputField label="نام شرکت" id="companyName" value={formData.companyName} onChange={handleInputChange} required hasError={errors.includes('companyName')} />
//                     <InputField label="شماره ثبت" id="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required hasError={errors.includes('registrationNumber')} />
//                     <InputField label="شناسه ملی" id="nationalId" value={formData.nationalId} onChange={handleInputChange} required hasError={errors.includes('nationalId')} />
//                     <InputField label="نام برند" id="brandName" value={formData.brandName} onChange={handleInputChange} />
//                     <InputField label="کد کارگاهی تامین اجتماعی" id="socialSecurityWorkshopCode" value={formData.socialSecurityWorkshopCode} onChange={handleInputChange} required hasError={errors.includes('socialSecurityWorkshopCode')} />
//                     <InputField label="نام مدیرعامل" id="ceoName" value={formData.ceoName} onChange={handleInputChange} required hasError={errors.includes('ceoName')} />
//                     <InputField label="نام خانوادگی مدیرعامل" id="ceoLastName" value={formData.ceoLastName} onChange={handleInputChange} required hasError={errors.includes('ceoLastName')} />
//                     <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                         <SelectField label="استان" id="province" value={formData.province} onChange={handleInputChange} options={PROVINCES} required hasError={errors.includes('province')} />
//                         <SelectField label="شهر" id="city" value={formData.city} onChange={handleInputChange} options={cities} required disabled={!formData.province} hasError={errors.includes('city')} />
//                     </div>
//                     <TextareaField label="آدرس پستی شرکت" id="companyPostalAddress" value={formData.companyPostalAddress} onChange={handleInputChange} className="md:col-span-2" required hasError={errors.includes('companyPostalAddress')} />
//                     <InputField label="کد پستی" id="postalCode" value={formData.postalCode} onChange={handleInputChange} required hasError={errors.includes('postalCode')} />
//                 </div>
//             </FormSection>

//             <FormSection title="آدرس محل تحویل بار">
//                  <TextareaField id="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} required hasError={errors.includes('deliveryAddress')} />
//                  <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">انتخاب از روی نقشه</a>
//             </FormSection>

//             <FormSection title="ساعت کاری انبار">
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">از ساعت <span className="text-red-500">*</span></label>
//                         <input type="time" name="workHoursFrom" value={formData.workHoursFrom} onChange={handleInputChange} className={`w-full px-3 py-2 bg-gray-100 rounded-md border ${errors.includes('workHoursFrom') ? 'border-red-500' : 'border-transparent'}`} />
//                         {errors.includes('workHoursFrom') && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
//                     </div>
//                      <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">تا ساعت <span className="text-red-500">*</span></label>
//                         <input type="time" name="workHoursTo" value={formData.workHoursTo} onChange={handleInputChange} className={`w-full px-3 py-2 bg-gray-100 rounded-md border ${errors.includes('workHoursTo') ? 'border-red-500' : 'border-transparent'}`} />
//                         {errors.includes('workHoursTo') && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
//                     </div>
//                  </div>
//             </FormSection>

//             <FormSection title="اطلاعات مدیرعامل یا نماینده مدیرعامل">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                      <InputField label="نام" id="repFirstName" value={formData.repFirstName} onChange={handleInputChange} required hasError={errors.includes('repFirstName')} />
//                      <InputField label="نام خانوادگی" id="repLastName" value={formData.repLastName} onChange={handleInputChange} required hasError={errors.includes('repLastName')} />
//                      <InputField label="شماره همراه ۱" id="repMobile1" value={formData.repMobile1} onChange={handleInputChange} required hasError={errors.includes('repMobile1')} />
//                      <InputField label="شماره همراه ۲" id="repMobile2" value={formData.repMobile2} onChange={handleInputChange} />
//                      <InputField label="شماره ثابت" id="repPhone" value={formData.repPhone} onChange={handleInputChange} />
//                      <InputField label="داخلی نماینده" id="repInternal" value={formData.repInternal} onChange={handleInputChange} />
//                      <InputField label="شماره واتس اپ" id="repWhatsapp" value={formData.repWhatsapp} onChange={handleInputChange} required hasError={errors.includes('repWhatsapp')} />
//                      <InputField label="آدرس ایمیل" id="repEmail" value={formData.repEmail} onChange={handleInputChange} />
//                 </div>
//             </FormSection>

//             <FormSection title="آپلود مدارک">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FileUpload label="تصویر آگهی آخرین تغییرات" id="latestChangesGazette" onFileSelect={(file) => handleFileSelect('latestChangesGazette', file)} icon={<DocIcon />} hasError={errors.includes('latestChangesGazette')} />
//                     <FileUpload label="تصویر آگهی روزنامه رسمی" id="officialGazette" onFileSelect={(file) => handleFileSelect('officialGazette', file)} icon={<DocIcon />} hasError={errors.includes('officialGazette')} />
//                 </div>
//             </FormSection>

//             <div className="pt-8">
//                  <button type="submit" className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
//                      تایید
//                  </button>
//             </div>
//         </form>
//     )
// }

// // Helper Components
// const FormSection = ({ title, children }) => (
//     <section>
//         <h2 className="text-lg font-bold mb-4 pb-2 border-b">{title}</h2>
//         <div className="space-y-4">{children}</div>
//     </section>
// );

// const SelectField = ({label, id, value, onChange, options, required, disabled, hasError}) => (
//      <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <select id={id} name={id} value={value} onChange={onChange} disabled={disabled} className={`w-full px-3 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:bg-gray-200 ${hasError ? 'border-red-500' : 'border-transparent'}`}>
//             <option value="" disabled>انتخاب کنید...</option>
//             {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//         </select>
//         {hasError && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
//     </div>
// );

// const TextareaField = ({label, id, value, onChange, required, className, hasError}) => (
//     <div className={className}>
//          {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
//          <textarea id={id} name={id} value={value} onChange={onChange} rows={3} className={`w-full px-3 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 ${hasError ? 'border-red-500' : 'border-transparent'}`}></textarea>
//          {hasError && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
//     </div>
// );

// const DocIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//     </svg>
// );

// export default LegalPersonForm;

// src/components/LegalPersonForm.tsx
 


// src/components/LegalPersonForm.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { PROVINCES, CITIES_BY_PROVINCE } from '../constants';
import { FormSection, InputField, SelectField, TextareaField, FileUpload } from './FormElements';
import { CompanyDetail } from '../../../types';
import { Loader2, Save } from 'lucide-react';

// === ۱. تعریف فیلدهای اجباری با نام‌های دقیق تایپ (Legal) ===
const requiredFields: (keyof Partial<CompanyDetail>)[] = [
    'legal_companyName',
    'legal_registrationNumber',
    'legal_nationalId',
    'legal_ceoName',
    'legal_ceoLastName',
    'province',
    'city',
    'companyPostalAddress',
    'postalCode',
    'deliveryAddress',
    'workHoursFrom',
    'workHoursTo',
    'repFirstName',
    'repLastName',
    'repMobile1',
    'repWhatsapp',
    'officialGazette', // آگهی تأسیس (مدارک)
];

interface LegalPersonFormProps {
    initialData: Partial<CompanyDetail>;
    onSubmit: (data: Partial<CompanyDetail>) => Promise<void>;
    isLoading: boolean;
}

const LegalPersonForm: React.FC<LegalPersonFormProps> = ({ initialData, onSubmit, isLoading }) => {
    
    const [formData, setFormData] = useState<Partial<CompanyDetail>>(() => ({
        ...initialData,
        // اطمینان از مقداردهی اولیه برای جلوگیری از خطاهای "غیرقابل کنترل"
    }));
    const [errors, setErrors] = useState<string[]>([]);

    // همگام سازی با initialData از والد (مهم برای بارگذاری اولیه یا تغییر نوع شرکت)
    useEffect(() => {
        setFormData(prev => ({ ...prev, ...initialData }));
    }, [initialData]);
 // داخل LegalPersonForm.tsx

// فرض می‌کنیم که CompanyDetail یک فیلد province از نوع string دارد.
// export interface CompanyDetail { province: string; ... }

const cities = useMemo(() => {
    const province = formData.province;

    // ۱. بررسی می‌کنیم که province یک مقدار غیرتهی باشد
    if (!province) {
        return [];
    }

    // ۲. بررسی می‌کنیم که کلید province در آبجکت CITIES_BY_PROVINCE وجود داشته باشد.
    // از آنجا که formData.province نوع string | undefined دارد، باید از Type Assertion استفاده کنیم
    // تا آن را به کلیدی از CITIES_BY_PROVINCE تبدیل کنیم.
    if (province in CITIES_BY_PROVINCE) {
        // اگر کلید وجود دارد و city list یک آرایه است (که هست)
        return CITIES_BY_PROVINCE[province as keyof typeof CITIES_BY_PROVINCE] || [];
    }
    
    return [];

}, [formData.province]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // === ۲. استفاده از id به عنوان کلید (کلید در InputField ها id است) ===
        const { id, value } = e.target;
        
        setFormData(prev => ({ ...prev, [id]: value }));
        
        // پاک کردن شهر هنگام تغییر استان
        if (id === 'province') {
            setFormData(prev => ({ ...prev, city: '' }));
        }
    };

    const handleFileSelect = (id: string, file: File | null) => {
        setFormData(prev => ({ ...prev, [id]: file }));
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = [];

        requiredFields.forEach(field => {
            const value = formData[field];
            
            // اعتبارسنجی رشته‌ها: وجود مقدار و خالی نبودن پس از حذف فاصله‌ها
            if (typeof value === 'string') {
                if (value.trim() === '') {
                    newErrors.push(field as string);
                }
            } 
            // اعتبارسنجی فایل‌ها: باید null/undefined نباشند (برای officialGazette)
            else if (field === 'officialGazette' && (value === null || value === undefined)) {
                newErrors.push(field as string);
            }
            // اعتبارسنجی مقادیر دیگر (مانند numbers که در این فرم نداریم)
            else if (!value) {
                 newErrors.push(field as string);
            }
        });

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit(formData);
        } else {
            // نمایش خطای عمومی هنگام عدم اعتبارسنجی
            alert('لطفاً فیلدهای الزامی را تکمیل کنید.');
        }
    };

    const isError = (field: keyof Partial<CompanyDetail>) => errors.includes(field as string);

    return (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>

            <FormSection title="اطلاعات هویتی و ثبتی شرکت">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    
                    {/* نام شرکت */}
                    <InputField
                        label="نام شرکت"
                        id="legal_companyName"
                        value={formData.legal_companyName || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('legal_companyName')}
                    />

                    {/* شماره ثبت */}
                    <InputField
                        label="شماره ثبت"
                        id="legal_registrationNumber"
                        value={formData.legal_registrationNumber || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('legal_registrationNumber')}
                        inputMode="numeric"
                    />

                    {/* شناسه ملی */}
                    <InputField
                        label="شناسه ملی"
                        id="legal_nationalId"
                        value={formData.legal_nationalId || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('legal_nationalId')}
                        placeholder="شناسه ملی ۱۱ رقمی"
                        inputMode="numeric"
                        maxLength={11}
                    />

                    {/* نام برند */}
                    <InputField
                        label="نام برند (اختیاری)"
                        id="brandName"
                        value={formData.brandName || ''}
                        onChange={handleInputChange}
                    />

                    {/* کد کارگاهی تامین اجتماعی (اختیاری) - از لیست الزامی حذف شده است */}
                    <InputField
                        label="کد کارگاهی تامین اجتماعی (اختیاری)"
                        id="legal_socialSecurityWorkshopCode"
                        value={formData.legal_socialSecurityWorkshopCode || ''}
                        onChange={handleInputChange}
                    />

                    {/* نام مدیرعامل */}
                    <InputField
                        label="نام مدیرعامل"
                        id="legal_ceoName"
                        value={formData.legal_ceoName || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('legal_ceoName')}
                    />

                    {/* نام خانوادگی مدیرعامل */}
                    <InputField
                        label="نام خانوادگی مدیرعامل"
                        id="legal_ceoLastName"
                        value={formData.legal_ceoLastName || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('legal_ceoLastName')}
                    />
                </div>
            </FormSection>

            <FormSection title="آدرس و موقعیت مکانی شرکت">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <SelectField
                        label="استان" id="province"
                        value={formData.province || ''}
                        onChange={handleInputChange}
                        options={PROVINCES}
                        required
                        hasError={isError('province')}
                    />
                    <SelectField
                        label="شهر" id="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        options={cities}
                        required
                        disabled={!formData.province}
                        hasError={isError('city')}
                    />
                    <TextareaField
                        label="آدرس پستی شرکت" id="companyPostalAddress"
                        value={formData.companyPostalAddress || ''}
                        onChange={handleInputChange}
                        required
                        className="md:col-span-2"
                        placeholder="آدرس کامل پستی به همراه پلاک و واحد"
                        hasError={isError('companyPostalAddress')}
                    />
                    <InputField
                        label="کد پستی" id="postalCode"
                        value={formData.postalCode || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('postalCode')}
                        placeholder="ده رقمی"
                        inputMode="numeric"
                        maxLength={10}
                    />
                </div>
            </FormSection>

            <FormSection title="آدرس تحویل و ساعت کاری انبار">
                <TextareaField
                    id="deliveryAddress"
                    value={formData.deliveryAddress || ''}
                    onChange={handleInputChange}
                    required
                    hasError={isError('deliveryAddress')}
                    label="آدرس محل تحویل بار"
                    placeholder="آدرس دقیق مکانی که بار باید تحویل داده شود."
                />
                <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">انتخاب از روی نقشه</a>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start pt-4">
                    <InputField
                        label="ساعت کاری انبار (از)" id="workHoursFrom"
                        type="time"
                        value={formData.workHoursFrom || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('workHoursFrom')}
                    />
                    <InputField
                        label="ساعت کاری انبار (تا)" id="workHoursTo"
                        type="time"
                        value={formData.workHoursTo || ''}
                        onChange={handleInputChange}
                        required
                        hasError={isError('workHoursTo')}
                    />
                </div>
            </FormSection>

            <FormSection title="اطلاعات نماینده">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField label="نام نماینده" id="repFirstName" value={formData.repFirstName || ''} onChange={handleInputChange} required hasError={isError('repFirstName')} />
                    <InputField label="نام خانوادگی نماینده" id="repLastName" value={formData.repLastName || ''} onChange={handleInputChange} required hasError={isError('repLastName')} />
                    <InputField label="شماره همراه ۱" id="repMobile1" type="tel" value={formData.repMobile1 || ''} onChange={handleInputChange} required hasError={isError('repMobile1')} placeholder="۰۹۱۲۱۱۱۱۱۱۱" />
                    <InputField label="شماره واتس اپ" id="repWhatsapp" type="tel" value={formData.repWhatsapp || ''} onChange={handleInputChange} required hasError={isError('repWhatsapp')} placeholder="۰۹۱۲۱۱۱۱۱۱۱" />
                    <InputField label="شماره همراه ۲ (اختیاری)" id="repMobile2" type="tel" value={formData.repMobile2 || ''} onChange={handleInputChange} />
                    <InputField label="شماره ثابت (اختیاری)" id="repPhone" type="tel" value={formData.repPhone || ''} onChange={handleInputChange} />
                    <InputField label="داخلی نماینده (اختیاری)" id="repInternal" value={formData.repInternal || ''} onChange={handleInputChange} />
                    <InputField label="آدرس ایمیل (اختیاری)" id="repEmail" type="email" value={formData.repEmail || ''} onChange={handleInputChange} />
                </div>
            </FormSection>

            <FormSection title="آپلود مدارک">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUpload
                        label="آگهی روزنامه رسمی تأسیس"
                        id="officialGazette"
                        onFileSelect={handleFileSelect}
                        hasError={isError('officialGazette')}
                        initialFileUrl={formData.officialGazette as string | undefined}
                        
                    />
                    <FileUpload
                        label="آگهی آخرین تغییرات روزنامه رسمی"
                        id="latestChangesGazette"
                        onFileSelect={handleFileSelect}
                        initialFileUrl={formData.latestChangesGazette as string | undefined}
                    />
                </div>
            </FormSection>

            <div className="pt-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isLoading ? 'در حال ذخیره‌سازی...' : 'ثبت نهایی اطلاعات حقوقی'}
                </button>
            </div>
        </form>
    )
}

export default LegalPersonForm;