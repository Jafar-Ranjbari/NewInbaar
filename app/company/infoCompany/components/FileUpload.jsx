import React, { useState, useRef } from 'react';

const FileUpload = ({ label, id, onFileSelect, icon, hasError }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
        alert("لطفا یک فایل تصویری انتخاب کنید.")
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const errorClasses = "border-red-500 border-2";
  const defaultClasses = "border-dashed border-gray-300 hover:border-gray-400";

  return (
    <div>
        <div
        className={`bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer h-40 w-full relative transition-colors ${hasError ? errorClasses : defaultClasses}`}
        onClick={handleClick}
        >
        <input
            type="file"
            id={id}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        {previewUrl ? (
            <img src={previewUrl} alt="پیش نمایش" className="max-h-full max-w-full object-contain rounded" />
        ) : (
            <>
            <div className="text-gray-500 mb-2">{icon}</div>
            <span className="text-sm text-gray-700 font-medium">{label}</span>
            <div className="mt-4 p-1 bg-white rounded-full shadow-sm">
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

export default FileUpload;