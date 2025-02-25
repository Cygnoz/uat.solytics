import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chat_bubble from '../../../assets/FrameIcons/chat_bubble.png';
import lock from '../../../assets/FrameIcons/lock.png';
import insight from '../../../assets/FrameImages/insight.png';
import QA from '../../../assets/FrameImages/QA.png';
import browseIcon from '../../../assets/FrameIcons/browseIcon.png';
import forecast from '../../../assets/FrameImages/forecast.png';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureSelectionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [chatbotName, setChatbotName] = useState('');
  const [chatbotDescription, setChatbotDescription] = useState('');
  const [botIcon, setBotIcon] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string>(''); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };


  // Update the handleIconUpload function
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBotIcon(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = () => {
    if (!chatbotName.trim()) {
      setNameError('Chatbot name is required'); 
      return;
    }

  const formData = {
      name: chatbotName,
      description: chatbotDescription,
      selectedFeatures: selectedOptions,
    };
    localStorage.setItem('chatbotData', JSON.stringify(formData));
    onClose();
    navigate('/addchatbot');
  };


useEffect(() => {
  // Clear localStorage
  localStorage.removeItem('chatbotData');
}, []); 

useEffect(() => {
  if (isOpen) {
    setSelectedOptions([]);
    setChatbotName('');
    setChatbotDescription('');
    setBotIcon(null);
  }
}, [isOpen]);

  if (!isOpen) return null;

  const features = [
    {
      id: 'agent',
      title: 'Agent Chat',
      description: 'Chat with a live agent for real-time support.',
      icon: QA
    },
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
      <div className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-4xl bg-white rounded-3xl shadow-xl p-6">
        <div className="px-4 sm:px-8 pt-6 sm:pt-8">
          <div className='flex items-center space-x-3 mb-4'>
            <img className='w-6 h-6' src={chat_bubble} alt="" />
            <h1 className='text-[#1A243B] font-semibold'>Create chatbot</h1>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-xl w-60 h-40 cursor-pointer overflow-hidden">
  {previewUrl ? (
    <div className="relative w-full h-full">
      <img 
        src={previewUrl} 
        alt="Bot Icon Preview" 
        className="w-full h-full object-cover"
      />
      <button 
        onClick={(e) => {
          e.preventDefault();
          setBotIcon(null);
          setPreviewUrl(null);
        }}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  ) : (
    <label htmlFor="botIcon" className="text-center cursor-pointer">
      <div className="flex flex-col items-center">
        <img src={browseIcon} alt="Bot Icon" className="w-12 h-12 mb-2" />
        <span className="text-gray-600 text-sm">Upload Bot Icon <span className="text-blue-500">browse</span></span>
        <p className="text-xs text-gray-400">Support JPG, PNG</p>
      </div>
    </label>
  )}
  <input 
    type="file" 
    id="botIcon" 
    className="hidden" 
    accept="image/png, image/jpeg" 
    onChange={handleIconUpload}
  />
</div>

              <div className="flex flex-col flex-grow gap-4">
                <div>
                  <label htmlFor="chatbotName" className="block text-sm font-medium text-gray-600">
                    Chatbot Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="chatbotName"
                    required
                    value={chatbotName}
                    onChange={(e) => {
                      setChatbotName(e.target.value);
                      setNameError(''); 
                    }}
                    placeholder="Enter Chatbot Name"
                    className={`mt-2 h-10 w-full px-4 border ${
                      nameError ? 'border-red-500' : 'border-gray-300'
                    } rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                </div>

                <div>
                  <label htmlFor="chatbotDescription" className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <input
                    type="text"
                    id="chatbotDescription"
                    value={chatbotDescription}
                    onChange={(e) => setChatbotDescription(e.target.value)}
                    placeholder="Enter Chatbot Description"
                    className="mt-2 h-10 w-full px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A243B]">
              Please Choose Functionalities Include in the Chatbot
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            </p>
          </div>

          <div className="space-y-4 max-h-[40vh] sm:max-h-[50vh] overflow-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-xl p-4 flex items-center justify-between bg-[#F2F4F7]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                    <img
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      src={feature.icon}
                      alt={feature.title}
                    />
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
                  {feature.locked ? (
                    <>
                      <span className="bg-[#E7DC94] text-[#1A243B] text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                        Adding soon
                      </span>
                      <img className="w-4 h-4 sm:w-5 sm:h-5" src={lock} alt="Locked" />
                    </>
                  ) : (
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300"
                      checked={selectedOptions.includes(feature.id)}
                      onChange={() => handleOptionChange(feature.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-4 sm:mt-6 mb-4 sm:mb-6">
            <button
              className="w-28 sm:w-[170px] h-10 sm:h-[48px] bg-purple-100 text-purple-600 hover:bg-purple-50 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </button>
       
              <button
                onClick={handleSubmit}
                className="w-[170px] h-[48px] bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                Next
              </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelectionModal;
