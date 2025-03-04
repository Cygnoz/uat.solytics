import React, { useState } from "react";
import UploadIcon from "../../assets/icons/Upload";
import PlusCircle from "../../assets/icons/PlusCircle";
import MinusCircle from "../../assets/icons/MinusCircle";
// You can create or import any close/delete icon.

type UploadInputProps = {
  onFileSelect?: (base64: string | null, index: number) => void;
};

const UploadInput: React.FC<UploadInputProps> = ({ onFileSelect }) => {
  const [filePreviews, setFilePreviews] = useState<(string | null)[]>([null]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedPreviews = [...filePreviews];
        updatedPreviews[index] = base64String;
        setFilePreviews(updatedPreviews);

        if (onFileSelect) {
          onFileSelect(base64String, index);
        }
      };
    }
  };

  const handleAddMore = () => {
    setFilePreviews([...filePreviews, null]);
  };

  const handleRemove = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 space-y-4">
      {filePreviews.map((filePreview, index) => (
        <div
          key={index}
          className="relative border-2 border-dashed border-[#649DD6] rounded-lg p-2 pb-3 text-center"
        >
          {/* Remove button (visible only if index > 0) */}
          {index > 0 && (
            <div className="cursor-pointer flex justify-end items-center" onClick={()=>handleRemove(index)}>
              <MinusCircle color="#ef4444"/>
            </div>
          )}

          <label className="flex flex-col items-center justify-center cursor-pointer">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview"
                className="mt-2 max-w-full h-20"
              />
            ) : (
              <>
                <UploadIcon />
                <span className="text-sm text-gray-500">Upload File</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={(event) => handleFileChange(event, index)}
            />
          </label>
        </div>
      ))}

      <button
        onClick={handleAddMore}
        type="button"
        className="flex items-center justify-end ms-auto gap-1 text-[#56a5f4] text-sm"
      >
        <PlusCircle color='#56a5f4'/>
        Add More
      </button>
    </div>
  );
};

export default UploadInput;
