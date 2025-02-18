import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-[500px] bg-white rounded-xl shadow-xl">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1A243B]">Chatbot Settings</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Status</div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              <span className="text-sm text-[#62697B]">Trained</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Theme</div>
            <div className="text-sm text-[#62697B]">Light</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Instructions</div>
            <div className="text-sm text-[#62697B]">
              Lorem ipsum dolor sit amet, consectetur. Tincidunt eu amet nisi vitae ornare tincidunt.
              Elementum quam molestie leo morbi pulvinar tincidunt. Enim quis lorem tempus urna morbi
              phasellus sed eu odio.
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              className="w-[150px] h-[40px] bg-[#9747ff] text-white rounded-xl hover:bg-violet-600"
              onClick={onClose}
            >
              Save Bot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
