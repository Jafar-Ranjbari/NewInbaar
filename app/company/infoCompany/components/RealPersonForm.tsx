// src/components/RealPersonForm.tsx (بروزرسانی شده)
"use client";
import React, { useState, useMemo, useEffect } from 'react';
// ... (سایر ایمپورت‌ها شامل PROVINCES, CITIES_BY_PROVINCE, FormElements)
import { PROVINCES, CITIES_BY_PROVINCE } from '../constants';
import { FormSection, InputField, SelectField, TextareaField, FileUpload } from './FormElements';
import { CompanyDetail } from '../../../types'; // استفاده از تایپ CompanyDetail
import { Loader2, Save } from 'lucide-react';

// فیلدهای اجباری برای اعتبارسنجی
const requiredFields = [
  'real_firstName', 'real_lastName', 'real_nationalId', 'real_socialSecurityCode',
  'province', 'city', 'postalCode', 'deliveryAddress', 'workHoursFrom', 'workHoursTo',
  'repFirstName', 'repLastName', 'repMobile1', 'repWhatsapp',
  'nationalCardFront', 'nationalCardBack'
];

interface RealPersonFormProps {
  initialData: Partial<CompanyDetail>;
  onSubmit: (data: Partial<CompanyDetail>) => Promise<void>;
  isLoading: boolean;
}

const RealPersonForm: React.FC<RealPersonFormProps> = ({ initialData, onSubmit, isLoading }) => {
  // نگاشت اولیه داده‌ها به استیت داخلی
  const [formData, setFormData] = useState<Partial<CompanyDetail>>(() => ({
    ...initialData,
    // اگر فیلدهای حقیقی خالی بودند، با مقادیر خالی پیش‌فرض پر شوند
    brandName: initialData.brandName || '',
    repFirstName: initialData.repFirstName || '',
    real_firstName: initialData.real_firstName || '',
    // ... مطمئن شوید تمام فیلدهای مورد استفاده در UI در استیت اولیه وجود دارند
  }));
  const [errors, setErrors] = useState<string[]>([]);

  // استفاده از useMemo برای لیست شهرها
  const cities = useMemo(() => {
    return CITIES_BY_PROVINCE[formData.province as keyof typeof CITIES_BY_PROVINCE] || [];
  }, [formData.province]);

  // توابع هندلر
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'province') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleFileSelect = (id: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [id as keyof Partial<CompanyDetail>]: file }));
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    requiredFields.forEach(field => {
      if (!formData[field as keyof CompanyDetail]) {
        newErrors.push(field);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // حذف فیلدهای Legal برای تمیز بودن داده ارسالی (اختیاری، اما توصیه می‌شود)
      const dataToSubmit = { ...formData };
      delete dataToSubmit.legal_companyName;
      delete dataToSubmit.legal_nationalId;
      // ... (حذف سایر فیلدهای legal_...)

      await onSubmit(dataToSubmit);
    } else {
      alert('لطفاً فیلدهای الزامی را تکمیل کنید.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <FormSection title="اطلاعات هویتی و شغلی">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InputField label="نام" id="real_firstName" value={formData.real_firstName || ''} onChange={handleInputChange} required hasError={errors.includes('real_firstName')} />
          <InputField label="نام خانوادگی" id="real_lastName" value={formData.real_lastName || ''} onChange={handleInputChange} required hasError={errors.includes('real_lastName')} />
          <InputField label="کد ملی" id="real_nationalId" value={formData.real_nationalId || ''} onChange={handleInputChange} required hasError={errors.includes('real_nationalId')} placeholder="۰۴۹۱۰۰۰۰۰۰" />
          <InputField label="نام برند (اختیاری)" id="brandName" value={formData.brandName || ''} onChange={handleInputChange} />
          <InputField label="کد کارگاهی تامین اجتماعی" id="real_socialSecurityCode" value={formData.real_socialSecurityCode || ''} onChange={handleInputChange} required hasError={errors.includes('real_socialSecurityCode')} />

          {/* فیلد اقتصادی در تایپ شما نیست، اما اگر نیاز است، باید به تایپ اضافه شود. اینجا نادیده گرفته می‌شود */}
          {/* <InputField label="کد اقتصادی" id="economicCode" value={formData.economicCode || ''} onChange={handleInputChange} required hasError={errors.includes('economicCode')} /> */}

        </div>
      </FormSection>

      <FormSection title="آدرس و موقعیت مکانی">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <SelectField
            label="استان" id="province"
            value={formData.province || ''}
            onChange={handleInputChange}
            options={PROVINCES}
            required
            hasError={errors.includes('province')}
          />
          <SelectField
            label="شهر" id="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            options={cities}
            required
            disabled={!formData.province}
            hasError={errors.includes('city')}
          />
          <TextareaField
            label="آدرس پستی دفتر" id="officePostalAddress" // از فیلد مشترک یا فیلدی شبیه به آن استفاده کنید
            value={formData.officePostalAddress || ''}
            onChange={handleInputChange}
            className="md:col-span-2"
            placeholder="آدرس کامل پستی به همراه پلاک و واحد"
          />
          <InputField
            label="کد پستی" id="postalCode"
            value={formData.postalCode || ''}
            onChange={handleInputChange}
            required
            hasError={errors.includes('postalCode')}
            placeholder="ده رقمی"
          />
        </div>
      </FormSection>

      {/* بخش آدرس تحویل و ساعت کاری (مشترک) */}
      <FormSection title="آدرس تحویل و ساعت کاری انبار">
        <TextareaField
          id="deliveryAddress"
          value={formData.deliveryAddress || ''}
          onChange={handleInputChange}
          required
          hasError={errors.includes('deliveryAddress')}
          label="آدرس محل تحویل بار"
        />
        <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">انتخاب از روی نقشه</a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start pt-4">
          <InputField label="ساعت کاری انبار (از)" id="workHoursFrom" type="time" value={formData.workHoursFrom || ''} onChange={handleInputChange} required hasError={errors.includes('workHoursFrom')} />
          <InputField label="ساعت کاری انبار (تا)" id="workHoursTo" type="time" value={formData.workHoursTo || ''} onChange={handleInputChange} required hasError={errors.includes('workHoursTo')} />
        </div>
      </FormSection>

      {/* بخش اطلاعات نماینده (مشترک) */}
      <FormSection title="اطلاعات نماینده">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InputField label="نام نماینده" id="repFirstName" value={formData.repFirstName || ''} onChange={handleInputChange} required hasError={errors.includes('repFirstName')} />
          <InputField label="نام خانوادگی نماینده" id="repLastName" value={formData.repLastName || ''} onChange={handleInputChange} required hasError={errors.includes('repLastName')} />
          <InputField label="شماره همراه ۱" id="repMobile1" type="tel" value={formData.repMobile1 || ''} onChange={handleInputChange} required hasError={errors.includes('repMobile1')} placeholder="۰۹۱۲۱۱۱۱۱۱۱" />
          <InputField label="شماره واتس اپ" id="repWhatsapp" type="tel" value={formData.repWhatsapp || ''} onChange={handleInputChange} required hasError={errors.includes('repWhatsapp')} placeholder="۰۹۱۲۱۱۱۱۱۱۱" />
          <InputField label="شماره همراه ۲ (اختیاری)" id="repMobile2" type="tel" value={formData.repMobile2 || ''} onChange={handleInputChange} />
          <InputField label="شماره ثابت (اختیاری)" id="repPhone" type="tel" value={formData.repPhone || ''} onChange={handleInputChange} />
          <InputField label="داخلی نماینده (اختیاری)" id="repInternal" value={formData.repInternal || ''} onChange={handleInputChange} />
          <InputField label="آدرس ایمیل (اختیاری)" id="repEmail" type="email" value={formData.repEmail || ''} onChange={handleInputChange} />
        </div>
      </FormSection>

      <FormSection title="آپلود مدارک">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FileUpload
            label="تصویر روی کارت ملی"
            id="nationalCardFront"
            onFileSelect={handleFileSelect}
            // hasError={isError('nationalCardFront')}
            initialFileUrl={formData.nationalCardFront as string | undefined}

          />

           <FileUpload
         label="تصویر پشت کارت ملی"
            id="nationalCardBack"
            onFileSelect={handleFileSelect}
            // hasError={isError('nationalCardFront')}
            initialFileUrl={formData.nationalCardBack as string | undefined}

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
          {isLoading ? 'در حال ذخیره‌سازی...' : 'ثبت نهایی اطلاعات حقیقی'}
        </button>
      </div>
    </form>
  )
}

export default RealPersonForm;