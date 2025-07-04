import React from "react";

const Checkbox = ({ name, checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-5">
        <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className={`
            appearance-none w-5 h-5 rounded bg-white border border-gray-300 checked:bg-[#db4444] checked:border-[#db4444] transition-all `}
        />
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </div>
      {label && (
        <label htmlFor={name} className="text-sm text-gray-700 ">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
