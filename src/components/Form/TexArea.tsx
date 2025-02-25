import React from "react";

type TextAreaProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  required?:boolean
};

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
  rows = 3,
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
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none resize-none custom-scrollbar ${className}`}
      />
    </div>
  );
};

export default TextArea;
