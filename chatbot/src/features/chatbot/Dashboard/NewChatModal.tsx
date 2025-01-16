import React, { useEffect, useState } from 'react';
import lock from '../../../assets/icons/lock.png';
import insight from '../../../assets/Images/insight.png';
import QA from '../../../assets/Images/QA.png';
import forecast from '../../../assets/Images/forecast.png';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions([]); // Reset the selected options
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-xl">
        <div className="px-4 sm:px-8 pt-6 sm:pt-8">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A243B]">
              Please Choose Functionalities Include in the Chatbot
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            </p>
          </div>

          <div className="space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-xl p-4 flex items-center justify-between bg-[#F2F4F7]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                    {feature.icon && (
                      <img
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        src={feature.icon}
                        alt={feature.title}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base text-[#1A243B]">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#62697B]">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {feature.locked && (
                    <>
                      <span className="bg-[#E7DC94] text-[#1A243B] text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                        Adding soon
                      </span>
                      <img className="w-4 h-4 sm:w-5 sm:h-5" src={lock} alt="Locked" />
                    </>
                  )}
                  {!feature.locked && (
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300"
                      disabled={feature.locked}
                      checked={selectedOptions.includes(feature.id)}
                      onChange={() => handleOptionChange(feature.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-6 sm:mt-8 mb-6 sm:mb-8">
            <button
              className="w-28 sm:w-[170px] h-10 sm:h-[48px] bg-purple-100 text-purple-600 hover:bg-purple-50 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </button>
            <Link to={'/addchatbot'}>
              <button
                className="w-[170px] h-[48px] bg-purple-600 text-white rounded-xl hover:bg-purple-700"             
              >
                Next
              </button>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelectionModal;
