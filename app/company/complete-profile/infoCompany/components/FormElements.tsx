 // src/components/common/FormElements.tsx
import React, { useState, useRef, useEffect } from 'react';
import { CompanyDetail } from '../../../../types';
import { Upload, X } from 'lucide-react';

// === ۱. FormSection ===
interface FormSectionProps {
    title: string;
    children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-6 border-b pb-3 text-gray-800">{title}</h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);


// === ۲. InputField ===
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: keyof Partial<CompanyDetail> | string;
    hasError?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, hasError = false, className = '', required, ...rest }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <input
            id={id}
            name={id}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-black focus:border-black transition duration-150 ease-in-out bg-gray-50 text-gray-800 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
            {...rest}
        />
        {hasError && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
    </div>
);


// === ۳. SelectField ===
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: keyof Partial<CompanyDetail> | string;
    options: string[];
    hasError?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, hasError = false, required, ...rest }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <select
            id={id}
            name={id}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-black focus:border-black transition duration-150 ease-in-out bg-gray-50 text-gray-800 appearance-none ${hasError ? 'border-red-500' : 'border-gray-300'}`}
            {...rest}
        >
            <option value="" disabled>انتخاب کنید...</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
        {hasError && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
    </div>
);

// === ۴. TextareaField ===
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    id: keyof Partial<CompanyDetail> | string;
    hasError?: boolean;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ label, id, hasError = false, className = '', required, ...rest }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <textarea
            id={id}
            name={id}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-black focus:border-black transition duration-150 ease-in-out bg-gray-50 text-gray-800 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
            {...rest}
        />
        {hasError && <p className="text-red-500 text-xs mt-1">این فیلد الزامی است.</p>}
    </div>
);

// === ۵. FileUpload ===
interface FileUploadProps {
    label: string;
    id: keyof Partial<CompanyDetail> | string;
    onFileSelect: (id: string, file: File | null) => void;
    hasError?: boolean;
    initialFileUrl?: string | null; // Base64 یا آدرس فایل موجود
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, id, onFileSelect, hasError, initialFileUrl }) => {
    // اگر فایل موجود Base64 باشد، آن را برای نمایش قرار می‌دهد
    const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(initialFileUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // به‌روزرسانی پیش‌نمایش در صورت تغییر initialFileUrl
    useEffect(() => {
        setPreviewUrl(initialFileUrl || null);
    }, [initialFileUrl]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (file) {
            if (file.type.startsWith('image/') || file.type === 'application/pdf') { 
                onFileSelect(id, file); // ارسال فایل
                
                // ایجاد پیش‌نمایش
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreviewUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    // برای PDF، فقط نام فایل را نشان می‌دهیم
                    setPreviewUrl(`PDF: ${file.name}`);
                }
            } else {
                alert("لطفا یک فایل تصویری یا PDF انتخاب کنید.");
            }
        } else {
             // اگر کاربر فایل را انتخاب نکرده و دایلوگ را بسته است
             onFileSelect(id, null);
             setPreviewUrl(null);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // جلوگیری از باز شدن دایلوگ فایل
        setPreviewUrl(null);
        onFileSelect(id, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // پاک کردن مقدار input
        }
    };

    const errorClasses = "border-red-500 border-2";
    const defaultClasses = "border-dashed border-gray-300 hover:border-gray-400";
    
    // تشخیص PDF بر اساس Base64 (شروع با data:application/pdf یا ماک ما)
    const isPdf = typeof previewUrl === 'string' && (previewUrl.startsWith('data:application/pdf') || previewUrl.startsWith('PDF:'));
    
    // تشخیص تصویر بر اساس Base64
    const isImage = typeof previewUrl === 'string' && previewUrl.startsWith('data:image/');

    return (
        <div className='relative'>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}
                {/* <span className="text-red-500 mr-1">*</span> */}
            </label>
            <div
                className={`bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer h-40 w-full relative transition-colors border ${hasError ? errorClasses : defaultClasses}`}
                onClick={handleClick}
            >
                <input
                    type="file"
                    id={id}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf" // پذیرش تصویر و PDF
                />
                
                {previewUrl ? (
                    <>
                        {isPdf ? (
                             <div className="flex flex-col items-center justify-center h-full">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-2" viewBox="0 0 24 24" fill="currentColor">
                                     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v4h4v12H6z"/>
                                 </svg>
                                 <p className="text-sm text-gray-700 font-medium truncate w-full px-2">
                                    {/* نمایش نام فایل یا عنوان کلی PDF */}
                                    {isPdf && typeof previewUrl === 'string' && previewUrl.startsWith('PDF: ') ? previewUrl.replace('PDF: ', '') : 'فایل PDF موجود'}
                                 </p>
                             </div>
                        ) : isImage ? (
                            <img src={previewUrl as string} alt="پیش نمایش" className="max-h-full max-w-full object-contain rounded" />
                        ) : (
                             // اگر رشته Base64 است اما ما مطمئن نیستیم تصویر یا PDF است، فقط نشان می‌دهیم موجود است.
                             <div className="text-gray-500 mb-2">فایل موجود است.</div>
                        )}
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition"
                            aria-label="حذف فایل"
                        >
                            <X className="h-4 w-4 text-red-600" />
                        </button>
                    </>
                ) : (
                    <>
                        <Upload className="text-gray-500 mb-2 h-6 w-6" />
                        <span className="text-sm text-gray-700 font-medium">{label}</span>
                        <div className="mt-2 p-1 bg-white rounded-full shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </>
                )}
            </div>
            {hasError && <p className="text-red-500 text-xs mt-1">آپلود این مدرک الزامی است.</p>}
        </div>
    );
};