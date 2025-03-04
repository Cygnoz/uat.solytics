import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chat_bubble from '../../../assets/FrameIcons/chat_bubble.png';
import lock from '../../../assets/FrameIcons/lock.png';
import insight from '../../../assets/FrameImages/insight.png';
import QA from '../../../assets/FrameImages/QA.png';
import browseIcon from '../../../assets/FrameIcons/browseIcon.png';
import forecast from '../../../assets/FrameImages/forecast.png';
import { useChatbot } from '../../../context/ChatbotContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingChatbotNames: string[];
}

const FeatureSelectionModal: React.FC<ModalProps> = ({ isOpen, onClose, existingChatbotNames }) => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [chatbotName, setChatbotName] = useState('');
  const [chatbotDescription, setChatbotDescription] = useState('');
  const [chatbotDomain, setChatbotDomain] = useState('');
  const [, setBotIcon] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateChatbotData } = useChatbot();

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Update handleIconUpload to use base64
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64Image = await convertToBase64(file);
        setBotIcon(file);
        setPreviewUrl(URL.createObjectURL(file));
        // Store base64 image in context
        updateChatbotData({ image: base64Image });
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
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
    if (existingChatbotNames.some(existingName => 
      existingName.toLowerCase() === chatbotName.toLowerCase())) {
      setNameError('This chatbot name already exists. Please choose a different name.');
      return;
    }

    const chatbotDataToUpdate = {
      name: chatbotName,
      description: chatbotDescription,
      domain: chatbotDomain,
      selectedFeatures: selectedOptions,
      agent: selectedOptions.includes('agent'), 
      qa: selectedOptions.includes('qa'),
      insight: selectedOptions.includes('insights')
    };
    
    console.log("Updating chatbot data with:", chatbotDataToUpdate);
    updateChatbotData(chatbotDataToUpdate);
    onClose();
    navigate('/addchatbot');
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions([]);
      setChatbotName('');
      setChatbotDescription('');
      setChatbotDomain('')
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
      <div className="w-full max-w-[80%] sm:max-w-md md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-xl p-3 sm:p-4">
        <div className="px-2 sm:px-4 pt-3 sm:pt-4">
          <div className='flex items-center space-x-2 mb-3'>
            <img className='w-5 h-5' src={chat_bubble} alt="" />
            <h1 className='text-[#1A243B] text-sm sm:text-base font-semibold'>Create chatbot</h1>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-xl w-40 h-32 cursor-pointer overflow-hidden">
                {previewUrl ? (
                  <div className="relative w-full h-full ">
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
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="botIcon" className="text-center cursor-pointer">
                    <div className="flex flex-col items-center">
                      <img src={browseIcon} alt="Bot Icon" className="w-8 h-8 mb-1" />
                      <span className="text-gray-600 text-xs">Upload Bot Icon <span className="text-blue-500">browse</span></span>
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

              <div className="flex flex-col flex-grow gap-3">
                <div>
                  <label htmlFor="chatbotName" className="block text-xs font-medium text-gray-600">
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
                    className={`mt-1 h-8 w-full px-3 border ${nameError ? 'border-red-500' : 'border-gray-300'
                      } rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  />
                  {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                </div>

                <div>
                  <label htmlFor="chatbotDescription" className="block text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <input
                    type="text"
                    id="chatbotDescription"
                    value={chatbotDescription}
                    onChange={(e) => setChatbotDescription(e.target.value)}
                    placeholder="Enter Chatbot Description"
                    className="mt-1 h-8 w-full px-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="chatbotDescription" className="block text-xs font-medium text-gray-600">
                    Domain
                  </label>
                  <input
                    type="text"
                    id="chatbotDomain"
                    value={chatbotDomain}
                    onChange={(e) => setChatbotDomain(e.target.value)}
                    placeholder="Enter Domain"
                    className="mt-1 h-8 w-full px-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="mb-3">
            <h2 className="text-sm sm:text-base font-semibold text-[#1A243B]">
              Please Choose Functionalities Include in the Chatbot
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            </p>
          </div>

          <div className="space-y-2 max-h-[30vh] sm:max-h-[40vh] overflow-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-xl p-2 sm:p-3 flex items-center justify-between bg-[#F2F4F7]"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                    <img
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      src={feature.icon}
                      alt={feature.title}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm text-[#1A243B]">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#62697B]">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {feature.locked ? (
                    <>
                      <span className="bg-[#E7DC94] text-[#1A243B] text-[8px] sm:text-xs px-2 py-1 rounded-full">
                        Adding soon
                      </span>
                      <img className="w-3 h-3 sm:w-4 sm:h-4" src={lock} alt="Locked" />
                    </>
                  ) : (
                    <input
                      type="checkbox"
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300"
                      checked={selectedOptions.includes(feature.id)}
                      onChange={() => handleOptionChange(feature.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-3 sm:mt-4 mb-2 sm:mb-3">
            <button
              className="w-20 sm:w-24 h-8 sm:h-10 bg-purple-100 text-purple-600 hover:bg-purple-50 rounded-xl text-sm"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="w-24 sm:w-32 h-8 sm:h-10 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm"
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