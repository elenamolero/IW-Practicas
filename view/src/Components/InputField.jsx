import React from "react";

function InputField({ label, name, type, placeholder, icon, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 text-white font-medium">{label}</label>
      <div className="relative">
        <input
          name={name}       
          type={type}
          placeholder={placeholder}
          value={value}           
          onChange={onChange}      
          className="w-full pl-4 pr-10 py-3 rounded-full bg-white text-black focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          {icon}
        </span>
      </div>
    </div>
  );
}

export default InputField;
