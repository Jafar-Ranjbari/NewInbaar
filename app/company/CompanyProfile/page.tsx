 "use client";

import React, { useState, useEffect } from 'react';
import { Company, CompanyDetail, CompanyType } from '../../types';
import { getCompanyDetail, createOrUpdateCompanyDetail, getCompanyByUserId, createCompany } from '../../services/userService'; // فرض می‌کنیم این توابع در userService هستند
import { useAuthStore } from '../../store/useAuthStore'; // برای دسترسی به کاربر جاری
import { Building2, Loader2, Save, AlertCircle } from 'lucide-react';

// ---------------- CompanyProfile Component ----------------
  const CompanyProfile: React.FC = () => {
    const { currentUser } = useAuthStore();
    
    // مدیریت وضعیت‌های داخلی
    const [company, setCompany] = useState<Partial<Company>>({});
    const [details, setDetails] = useState<Partial<CompanyDetail>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ۱. بارگذاری داده‌های اولیه شرکت و جزئیات آن
    useEffect(() => {
        const loadCompanyData = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            try {
                let comp = await getCompanyByUserId(currentUser.id);
                
                // اگر شرکت وجود نداشت، آن را به عنوان حقیقی ایجاد کن (مانند داشبورد)
                if (!comp) {
                    comp = await createCompany(currentUser.id, CompanyType.REAL);
                }
                
                setCompany(comp);

                if (comp.id) {
                    const detailData = await getCompanyDetail(comp.id);
                    if (detailData) {
                        setDetails(detailData);
                    } else {
                        // اگر جزئیات وجود نداشت، حداقل نام برند را از comp بردار
                        // brandName 
                        setDetails({ brandName: comp.id });
                    }
                }
            } catch (e) {
                console.error("خطا در بارگذاری اطلاعات شرکت:", e);
                setError("خطا در بارگذاری اطلاعات شرکت. لطفاً مجدداً تلاش کنید.");
            } finally {
                setLoading(false);
            }
        };

        loadCompanyData();
    }, [currentUser]);

    // ۲. مدیریت ذخیره‌سازی
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company.id) {
            alert('اطلاعات شرکت ناقص است. ابتدا باید ثبت نام تکمیل شود.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await createOrUpdateCompanyDetail({ ...details, companyID: company.id });
            // به‌روزرسانی نام برند در وضعیت شرکت اصلی
            setCompany(prev => ({ ...prev, brandName: details.brandName }));
            alert('تغییرات با موفقیت ثبت شد.');
        } catch (e) { 
            console.error("خطا در ذخیره جزئیات:", e);
            setError('خطا در ثبت تغییرات. لطفاً فیلدها را بررسی کنید.');
        } finally { 
            setSaving(false); 
        }
    };
    
    // ---------------- UI ----------------

    if (!currentUser) return <div className="p-6 text-center text-red-500">لطفا ابتدا وارد شوید.</div>;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-sm p-6">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
                <p className="mr-2 text-gray-600">در حال بارگذاری اطلاعات...</p>
            </div>
        );
    }
    
    if (error && !saving) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl flex items-center gap-2 m-4">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
            </div>
        );
    }

    // تعیین عنوان بر اساس نوع شرکت برای نمایش بهتر
    const isLegal = company.type === CompanyType.LEGAL;
    const typeLabel = isLegal ? "حقوقی" : "حقیقی";

    return (
        <div dir="rtl" className="max-w-md mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
                
                {/* Header and Type Selector */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                        <Building2 className="text-blue-600 w-6 h-6" /> اطلاعات حساب
                    </h2>
                    <div className="flex bg-gray-100 p-1 rounded-full shadow-inner">
                        <button 
                            onClick={() => setCompany({ ...company, type: CompanyType.REAL })} 
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!isLegal ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            حقیقی
                        </button>
                        <button 
                            onClick={() => setCompany({ ...company, type: CompanyType.LEGAL })} 
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isLegal ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            حقوقی
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Company Type Information */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-800 font-medium rounded-md">
                        در حال ویرایش اطلاعات به عنوان **{typeLabel}** هستید.
                    </div>
                    
                    {/* Main Fields Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        
                        {/* 1. Brand Name */}
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 block mb-1">نام تجاری / برند:</span>
                            <input 
                                placeholder="مثال: اکوشیک" 
                                className="input-base" 
                                value={details.brandName || ''} 
                                onChange={e => setDetails({ ...details, brandName: e.target.value })} 
                                required
                            />
                        </label>
                        
                        {/* 2. Representative First Name */}
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 block mb-1">نام نماینده:</span>
                            <input 
                                placeholder="نام" 
                                className="input-base" 
                                value={details.repFirstName || ''} 
                                onChange={e => setDetails({ ...details, repFirstName: e.target.value })} 
                                required
                            />
                        </label>

                        {/* 3. Representative Last Name */}
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 block mb-1">نام خانوادگی نماینده:</span>
                            <input 
                                placeholder="نام خانوادگی" 
                                className="input-base" 
                                value={details.repLastName || ''} 
                                onChange={e => setDetails({ ...details, repLastName: e.target.value })} 
                                required
                            />
                        </label>

                        {/* 4. Mobile */}
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 block mb-1">موبایل:</span>
                            <input 
                                type="tel"
                                placeholder="۰۹۱۲۱۱۱۱۱۱۱" 
                                className="input-base" 
                                value={details.repMobile1 || ''} 
                                onChange={e => setDetails({ ...details, repMobile1: e.target.value })} 
                                required
                            />
                        </label>
                        
                        {/* 5. Legal/Real ID */}
                        {isLegal ? (
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 block mb-1">شناسه ملی:</span>
                                <input 
                                    placeholder="شناسه ملی ده رقمی" 
                                    className="input-base" 
                                    value={details.legal_nationalId || ''} 
                                    onChange={e => setDetails({ ...details, legal_nationalId: e.target.value })} 
                                    required={isLegal}
                                />
                            </label>
                        ) : (
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 block mb-1">کد ملی:</span>
                                <input 
                                    placeholder="کد ملی ده رقمی" 
                                    className="input-base" 
                                    value={details.real_nationalId || ''} 
                                    onChange={e => setDetails({ ...details, real_nationalId: e.target.value })} 
                                    required={!isLegal}
                                />
                            </label>
                        )}
                    </div>
                    
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="w-full bg-blue-600 text-white py-3 mt-8 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                    >
                        {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saving ? 'در حال ثبت...' : 'ثبت تغییرات'}
                    </button>
                    
                    {/* Save Error Message */}
                    {error && saving && (
                        <div className="text-center text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                </form>
            </div>
            
            {/* Style Definition */}
            <style jsx>{`
                .input-base { 
                    width: 100%; 
                    padding: 0.75rem 1rem; 
                    border: 1px solid #d1d5db; /* gray-300 */
                    border-radius: 0.75rem; /* rounded-xl */
                    outline: none; 
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-size: 1rem;
                }
                .input-base:focus { 
                    border-color: #3b82f6; /* blue-500 */
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); 
                }
            `}</style>
        </div>
    );
}

export default CompanyProfile;