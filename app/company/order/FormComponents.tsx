import React from 'react';
import { ChevronDown } from 'lucide-react';

export const InputLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <label className="block text-xs font-bold text-gray-700 mb-1.5 px-1">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (val: string) => void;
  required?: boolean;
  className?: string;
  suffix?: string;
  type?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required, 
  className = "", 
  suffix, 
  type = "text" 
}) => (
  <div className={`w-full ${className}`}>
    {label && <InputLabel label={label} required={required} />}
    <div className="relative">
      <input
        type={type}
        className="w-full bg-gray-100 text-gray-800 text-sm rounded-lg p-3 border-none focus:ring-2 focus:ring-black outline-none transition-all placeholder-gray-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {suffix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

interface FormSelectProps {
  label: string;
  required?: boolean;
  options: string[];
  placeholder?: string;
  value: string;
  className?: string;
  onChange: (val: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  required, 
  options = [], 
  placeholder = "انتخاب کنید", 
  className = "", 
  value, 
  onChange 
}) => (
  <div className={`w-full ${className}`}>
    <InputLabel label={label} required={required} />
    <div className="relative">
      <select 
        className="w-full bg-gray-100 text-gray-800 text-sm rounded-lg p-3 pr-3 pl-8 border-none focus:ring-2 focus:ring-black outline-none appearance-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

interface FormTextAreaProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({ 
  label, 
  required, 
  value, 
  onChange, 
  placeholder = "", 
  className = "", 
  rows = 3 
}) => (
  <div className={`w-full ${className}`}>
    <InputLabel label={label} required={required} />
    <textarea 
      className="w-full bg-gray-100 text-gray-800 rounded-lg p-3 resize-none border-none focus:ring-2 focus:ring-black outline-none text-sm placeholder-gray-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={rows}
    ></textarea>
  </div>
);