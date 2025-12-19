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