import React from 'react'

export default function Input({ type, placeholder, label, errors }) {
  return (
    <div key={name}>
      <label htmlFor={name} className="sr-only">{placeholder}</label>
      <input type={type} id={name} name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange}
        className={`w-full p-3 bg-[#F5F5F5] ${errors[name] && 'border border-red-500'} rounded-md focus:outline-none`}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  )
}
