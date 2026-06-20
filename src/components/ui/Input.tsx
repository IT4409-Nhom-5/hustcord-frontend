import React from 'react';
import type { UseFormRegister } from 'react-hook-form';

interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  className?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  register, 
  className = '',
  required = true 
}) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-xs font-bold text-gray-400 uppercase mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required })}
        className="bg-gray-900 text-white p-3 rounded border border-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
      />
import React from 'react'; 
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  required,
  className = '',
  id,
  ...props
}) => {
  // Tự động tạo ID ngẫu nhiên nếu không được truyền vào, giúp liên kết label với input (Accessibility)
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        required={required}
        className={`w-full rounded bg-[#1e1f22] p-2.5 text-white outline-none transition-shadow focus:ring-1 focus:ring-[#5865F2] disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'ring-1 ring-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
