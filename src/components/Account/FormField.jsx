import React from 'react';

const FormField = ({ name, label, type, value, error, onChange, placeholder, showLabel = true }) => {
  return (
    <div>
      {showLabel && (
        <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder || label}
        className={`w-full p-3 bg-[#F5F5F5] rounded-md focus:outline-none border ${error ? 'border-[#db4444]' : 'border-gray-300'} focus:border-[#db4444] transition-colors`}
      />
      {error && <p className="text-[#db4444] text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;