import React from 'react'

export default function Button({ children, onClick, className, type = "" }) {
  return (
    <button onClick={onClick} type={type} className={`cursor-pointer px-12 py-4 bg-[#DB4444] text-white rounded-sm 
      transform transition-transform duration-150 ease-in-out 
      hover:brightness-110 active:scale-90 active:duration-75 ${className}
      `}>
      {children}
    </button>
  )
}
