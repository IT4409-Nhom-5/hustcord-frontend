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
    </div>
  );
};

export default Input;
