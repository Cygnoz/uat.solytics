import React, { useState, useRef, useEffect } from "react";
import ChevronDown from "../../assets/icons/ChevronDown"
import SearchBar from "../Ui/SearchBar";
import NoRecords from "../Ui/NoRecords";

interface SelectProps {
  required?: boolean;
  label?: string;
  options: { value: any; label: string }[];
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  addButtonLabel?: string;
  addButtonFunction?: (...params: any[]) => void;
  totalParams?: number;
  paramsPosition?: number;
  from?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  placeholder,
  required,
  readOnly,
  value,
  onChange,
  from
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const getTextFromJSX = (label: React.ReactNode): string => {
    if (typeof label === "string") return label; // If it's a string, return as is
    if (Array.isArray(label)) {
      return label.map(getTextFromJSX).join(""); // Recursively process arrays
    }
    if (React.isValidElement(label)) {
      return getTextFromJSX(label.props.children); // Process children recursively
    }
    return ""; // Return an empty string for unsupported types
  };
  
  

  useEffect(() => {
    let newOptions = options.filter((option) => {
      const labelText =
        typeof option.label === "string" ? option.label : getTextFromJSX(option.label);
      return labelText.toLowerCase().includes(searchValue.toLowerCase());
    });
  
    // Add placeholder as the first option if it exists
    if (placeholder) {
      newOptions = [{ label: placeholder, value: "" }, ...newOptions];
    }
  
    setFilteredOptions(newOptions);
  }, [searchValue, options, placeholder]);
  
  // Function to extract text from JSX elements
  
  
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current && parentRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const spaceBelow = viewportHeight - parentRect.bottom;
      const spaceAbove = parentRect.top;
      
      setDropdownPosition(spaceBelow < dropdownRect.height && spaceAbove > spaceBelow ? "top" : "bottom");
    }
  }, [isOpen, filteredOptions]);

  const handleOptionSelect = (selectedValue: string) => {
    setIsOpen(false);
    if (onChange) onChange(selectedValue === placeholder ? "" : selectedValue);
  };

  return (
    <div className="relative w-full mb-2" ref={parentRef}>
      {label && (
        <label className="block text-sm text-[#495160]  mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`relative ${readOnly ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        onClick={() => !readOnly && setIsOpen((prev) => !prev)}
      >
        <div
  className={`block w-full h-9 ${from=="ticket" ?'pt-1':'pt-2'} bg-white rounded-3xl border-2 text-sm px-2 pr-8 items-center leading-tight 
              ${error ? "border-red-500" : "border-gray-200"}`}
>
  {value !== undefined && value !== ""
    ? options.find((option) => option.value === value)?.label || "Select an option"
    : placeholder || "Select an option"}
</div>

        <div className="absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronDown color="gray" />
        </div>
      </div>
      <div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-t-3xl rounded-md shadow-lg 
                      ${dropdownPosition === "top" ? "bottom-[70%]" : "top-full mt-1"} `}
        >
          <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />
          
          <div className="max-h-52 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {option.label}
                </div>
              ))
            ) : (
             <div className="py-3">
              <NoRecords textSize="xs" imgSize={50}/>
             </div>
            )}
          </div>
        </div>
      )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
