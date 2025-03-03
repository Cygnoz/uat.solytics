import React, { useState } from "react";
import UploadIcon from "../../assets/icons/Upload";

type UploadInputProps = {
  onFileSelect?: (base64: string | null) => void;
  label?:string
};

const UploadInput: React.FC<UploadInputProps> = ({ onFileSelect,label }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFilePreview(base64String);
        if (onFileSelect) {
          onFileSelect(base64String);
        }
      };
    }
  };

  return (
   
      <div className="mt-2">
      <p className="block text-sm text-[#495160] mb-2">{label}</p>
      <div className="border-2  border-dashed border-[#649DD6] rounded-lg p-4 text-center">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          {filePreview ? (
            <img src={filePreview} alt="Preview" className="mt-2 max-w-full h-20" />
          ) : (
            <>
              <UploadIcon />
              <span className="text-sm text-gray-500">Upload File</span>
            </>
          )}
          <input type="file" className="hidden"  onChange={handleFileChange} />
        </label>
      </div>
      </div>

  );
};


export default UploadInput;
