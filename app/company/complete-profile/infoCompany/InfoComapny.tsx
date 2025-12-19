 "use client"
 import React, { useState, useEffect, useCallback, useMemo } from 'react';
 import { Loader2, AlertCircle, Save } from 'lucide-react';
 
 // سرویس‌ها و تایپ‌ها
 import { 
     getCompanyByUserId, 
     createCompany, 
     getCompanyDetail, 
     createOrUpdateCompanyDetail, 
     updateCompanyType 
 } from '../../../services/userService';
 import { Company, CompanyType, CompanyDetail } from '../../../types';
 import { useAuthStore } from '@/app/store/useAuthStore';
 
 // اجزای UI و ثابت‌ها
 import { FormSection, InputField, SelectField } from './components/FormElements';
 import { PROVINCES, CITIES_BY_PROVINCE } from './constants';
 
 // فیلدهای متنی برای پاک‌سازی داده‌های نامرتبط در هنگام ذخیره
 const REAL_FIELDS = ['real_firstName', 'real_lastName', 'repMobile1'];
 const LEGAL_FIELDS = ['legal_companyName', 'legal_nationalId', 'province', 'city'];
 
//  const ContractSign = ({ onNext }: { onNext: () => void }) => {
 const InfoCompany = ({ onNext }: { onNext: () => void }) => {
     const { currentUser } = useAuthStore();
     
     const [company, setCompany] = useState<Company | null>(null);
     const [formData, setFormData] = useState<Partial<CompanyDetail>>({});
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [validationErrors, setValidationErrors] = useState<string[]>([]);
 
     // ۱. بارگذاری داده‌ها
     const loadData = useCallback(async () => {
         if (!currentUser) return;
         setLoading(true);
         try {
             let comp = await getCompanyByUserId(currentUser.id);
             if (!comp) {
                 comp = await createCompany(currentUser.id, CompanyType.REAL);
             }
             setCompany(comp);
 
             if (comp.id) {
                 const detailData = await getCompanyDetail(comp.id);
                 setFormData(detailData || {});
             }
         } catch (e) {
             setError("خطا در دریافت اطلاعات از سرور.");
         } finally {
             setLoading(false);
         }
     }, [currentUser]);
 
     useEffect(() => { loadData(); }, [loadData]);
 
     // ۲. مدیریت تغییرات ورودی‌ها (فقط متن و عدد)
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
         const { id, value, name } = e.target;
         const fieldId = id || name; 
         setFormData(prev => ({ ...prev, [fieldId]: value }));
 
         if (fieldId === 'province') {
             setFormData(prev => ({ ...prev, city: '' }));
         }
     };
 
     // ۳. تغییر نوع شخصیت
     const handleTypeChange = async (newType: CompanyType) => {
         if (!company || saving || newType === company.type) return;
         setSaving(true);
         try {
             const updatedComp = await updateCompanyType(company.id, newType);
             setCompany(updatedComp);
             setValidationErrors([]); // پاک کردن خطاهای اعتبارسنجی قبلی
         } catch (e) {
             setError("خطا در تغییر نوع شخصیت.");
         } finally {
             setSaving(false);
         }
     };
 
     // ۴. لیست شهرها
     const cities = useMemo(() => {
         const province = formData.province;
         if (!province || !(province in CITIES_BY_PROVINCE)) return [];
         return CITIES_BY_PROVINCE[province as keyof typeof CITIES_BY_PROVINCE] || [];
     }, [formData.province]);
 
     // ۵. اعتبارسنجی و ارسال فرم
     const validate = () => {
         const errors: string[] = [];
         const isLegal = company?.type === CompanyType.LEGAL;
         
         const fieldsToCheck = isLegal ? LEGAL_FIELDS : REAL_FIELDS;
 
         fieldsToCheck.forEach(field => {
             if (!formData[field as keyof CompanyDetail]?.toString().trim()) {
                 errors.push(field);
             }
         });
 
         setValidationErrors(errors);
         return errors.length === 0;
     };
 
     const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         if (!validate()) {
             alert("لطفاً تمامی فیلدهای الزامی را پر کنید.");
             return;
         }
 
         setSaving(true);
         setError(null);
         try {
             const isLegal = company?.type === CompanyType.LEGAL;
             let dataToSave = { ...formData };
 
             // حذف فیلدهای مربوط به نوع دیگر برای ارسال داده‌های پاکیزه به API
             const fieldsToRemove = isLegal ? REAL_FIELDS : LEGAL_FIELDS;
             fieldsToRemove.forEach(f => delete (dataToSave as any)[f]);
 
             const payload = {
                 ...dataToSave,
                 companyID: company?.id,
                 type: company?.type
             };
 
             
             const result = await createOrUpdateCompanyDetail(payload);
             setFormData(result);
             alert("اطلاعات با موفقیت ثبت شد.");
             onNext();
         } catch (e) {
             setError("مشکلی در ذخیره‌سازی اطلاعات رخ داد.");
         } finally {
             setSaving(false);
         }
     };
 
     if (!currentUser) return <div className="p-6 text-center text-red-500">لطفا ابتدا وارد حساب کاربری شوید.</div>;
 
     if (loading) {
         return (
             <div className="flex flex-col justify-center items-center h-screen bg-black">
                 <Loader2 className="animate-spin text-white w-10 h-10 mb-4" />
                 <p className="text-white">در حال بارگذاری...</p>
             </div>
         );
     }
 
     const isLegal = company?.type === CompanyType.LEGAL;
 
     return (
         <div dir="rtl" className="max-w-xl mx-auto bg-black min-h-screen">
             <header className="bg-black text-white p-6 pt-10 text-center">
                 <h1 className="text-xl font-bold">تکمیل اطلاعات {isLegal ? 'حقوقی' : 'حقیقی'}</h1>
                 <div className="mt-4 flex items-center justify-center gap-3">
                     <img src="https://i.imgur.com/3j2a3f7.png" alt="User" className="w-10 h-10 rounded-full border border-gray-700" />
                     <span className="font-medium">{currentUser.fullName}</span>
                 </div>
             </header>
 
             <main className="bg-white rounded-t-[2.5rem] p-6 md:p-8 min-h-[80vh] shadow-2xl">
                 {/* سوئیچ تغییر نوع */}
                 <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                     <button 
                         type="button"
                         onClick={() => handleTypeChange(CompanyType.REAL)}
                         disabled={saving}
                         className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLegal ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
                     >شخص حقیقی</button>
                     <button 
                         type="button"
                         onClick={() => handleTypeChange(CompanyType.LEGAL)}
                         disabled={saving}
                         className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLegal ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
                     >شخص حقوقی</button>
                 </div>
 
                 <form onSubmit={handleSubmit} className="space-y-6">
                     {isLegal ? (
                         <>
                             <FormSection title="مشخصات شرکت">
                                 <div className="space-y-4">
                                     <InputField label="نام کامل شرکت" id="legal_companyName" value={formData.legal_companyName || ''} onChange={handleInputChange} required hasError={validationErrors.includes('legal_companyName')} />
                                     <InputField label="شناسه ملی (۱۱ رقم)" id="legal_nationalId" value={formData.legal_nationalId || ''} onChange={handleInputChange} required hasError={validationErrors.includes('legal_nationalId')} inputMode="numeric" />
                                 </div>
                             </FormSection>
                             <FormSection title="محل فعالیت">
                                 <div className="grid grid-cols-2 gap-4">
                                     <SelectField label="استان" id="province" value={formData.province || ''} onChange={handleInputChange} options={PROVINCES} required hasError={validationErrors.includes('province')} />
                                     <SelectField label="شهر" id="city" value={formData.city || ''} onChange={handleInputChange} options={cities} disabled={!formData.province} required hasError={validationErrors.includes('city')} />
                                 </div>
                             </FormSection>
                         </>
                     ) : (
                         <FormSection title="مشخصات فردی">
                             <div className="space-y-4">
                                 <div className="grid grid-cols-2 gap-4">
                                     <InputField label="نام" id="real_firstName" value={formData.real_firstName || ''} onChange={handleInputChange} required hasError={validationErrors.includes('real_firstName')} />
                                     <InputField label="نام خانوادگی" id="real_lastName" value={formData.real_lastName || ''} onChange={handleInputChange} required hasError={validationErrors.includes('real_lastName')} />
                                 </div>
                                 <InputField label="شماره موبایل" id="repMobile1" value={formData.repMobile1 || ''} onChange={handleInputChange} required hasError={validationErrors.includes('repMobile1')} placeholder="۰۹۱۲..." />
                             </div>
                         </FormSection>
                     )}
 
                     {error && (
                         <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                             <AlertCircle size={18}/>
                             {error}
                         </div>
                     )}
 
                     <button
                         type="submit"
                         disabled={saving}
                         className="w-full bg-black text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 mt-8"
                     >
                         {saving ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                         {saving ? 'در حال ثبت...' : 'ذخیره تغییرات'}
                     </button>
                 </form>
             </main>
         </div>
     );
 };
 
 export default InfoCompany;