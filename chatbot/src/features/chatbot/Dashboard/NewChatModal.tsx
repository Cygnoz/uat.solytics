import React, { useState } from 'react';
import lock from '../../../assets/icons/lock.png';
import insight from '../../../assets/Images/insight.png';
import QA from '../../../assets/Images/QA.png';
import forecast from '../../../assets/Images/forecast.png';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureSelectionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>

      prev.includes(option)
        ? prev.filter((item) => item !== option) // Remove if already selected
        : [...prev, option] // Add if not selected
    );
  };

  if (!isOpen) return null;

  const features = [
    {
      id: 'qa',
      title: 'Q&A',
      description: 'Interactive answers from data for user queries instantly.',
      icon: QA
    },
    {
      id: 'insights',
      title: 'Insights',
      description: 'Actionable data-driven insights for smarter decisions and strategies',
      icon: insight
    },
    {
      id: 'forecast',
      title: 'Forecast',
      description: 'Predictive analytics for accurate trends and future performance insights',
      icon: forecast,
      locked: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-[934px] h-[593px] bg-white rounded-3xl shadow-xl  ">
        <div className=" p-6 w-[870px] h-[102px] mt-4">
        <div className="space-y-6 p-6 mx-auto max-w-screen-lg">
            <div className=" mb-8">
              <h2 className="text-xl font-semibold text-[#1A243B]">
                Please Choose Functionalities Include in the Chatbot
              </h2>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              </p>
            </div>

            <div className="space-y-3 ">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`rounded-lg p-6  flex items-center justify-between bg-[#F2F4F7]`}
                >
                  <div className="flex items-center space-x-4 ">
                    <div className="w-12 h-12 text-[#1A243B] rounded-full flex items-center justify-center text-xl">
                      {feature.icon && <img className="w-8 h-8" src={feature.icon} alt={feature.title} />}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1A243B]">{feature.title}</h3>
                      <p className="text-sm text-[#62697B]">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
  {feature.locked && (
    <>
    <div className="bg-[#E7DC94] text-[#1A243B] text-xs px-2 py-1 rounded-full flex items-center">
      Adding soon
      
    </div>
    <img className="w-5" src={lock} alt="Locked" />
    </>
  )}
  
  {!feature.locked && (
    <input
      type="checkbox"
      className="w-5 h-5 rounded border-gray-300"
      disabled={feature.locked}
      checked={selectedOptions.includes(feature.id)} // Controlled checked state
      onChange={() => handleOptionChange(feature.id)} // Handle change
    />
  )}
</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="w-[170px] h-[48px] mr-8 bg-purple-100 text-purple-600 hover:bg-purple-50 rounded-xl"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="w-[170px] h-[48px] bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                onClick={() => {
                  console.log('Selected Features:', selectedOptions);
                  onClose();
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelectionModal;
