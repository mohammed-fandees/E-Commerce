import React from 'react';

export default function Button({ children, onClick, className, type = "", disabled = false }) {
  return (
    <button onClick={onClick} type={type} disabled={disabled}
      className={` px-12 py-4 bg-[#DB4444] text-white rounded-sm 
        transform transition-transform duration-150 ease-in-out
        hover:brightness-110 active:scale-90 active:duration-75 ${className}
        ${disabled ? 'opacity-50 !cursor-not-allowed active:scale-100 !hover:brightness-100' : ''}
      `}>
      {children}
    </button>
  );
}
