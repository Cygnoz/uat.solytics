import React from "react";

type InputProps = {
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?:boolean
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  required=false
}) => {
  return (
    <div>
         {label && (
          <label
           className="block text-[#495160] mb-2 ms-1"
          >
            <p>
              {label} {required && <span className="text-red-500">*</span>}
            </p>
          </label>
        )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-3xl border-2 border-gray-200 outline-0 mb-4 ${className}`}
      />
    </div>
  );
};

export default Input;