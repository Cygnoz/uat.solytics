import React, { useState } from 'react';
import chat_bubble from '../../../assets/icons/chat_bubble.png';
import NewChatModal from './NewChatModal';
import plus from '../../../assets/icons/plusIcon.png';

// ChatbotCard component for individual chatbot items
interface ChatbotCardProps {
  name: string;
  description: string;
  tags: string[];
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({ name, description, tags }) => {
  return (
    <div className="bg-white p-6 w-93 gap-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <img className="w-8 h-8" src={chat_bubble} alt="" />
          <h3 className="font-medium text-gray-900 mt-2 mb-1">{name}</h3>
          <p className="text-gray-500 text-sm mb-4">{description}</p>
        </div>
      </div>
      <hr className="border-t border-gray-200 my-5 -mx-6" />
      <div className="flex flex-wrap gap-2">

        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium
                  ${tag.toLowerCase() === 'q&a' ? 'bg-[#FFE7E7] text-[#62697B]' : ''}
                  ${tag.toLowerCase() === 'insight' ? 'bg-[#E7FFED] text-[#62697B]' : ''}
                  ${tag.toLowerCase() === 'forecast' ? 'bg-[#E7E7FF] text-[#62697B]' : ''}
                `}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard component
const ChatbotDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const chatbots = [
    {
      name: 'Billie Bot',
      description: 'Chatbot for sales insight',
      tags: ['Q&A', 'Insight', 'Forecast'],
    },
    {
      name: 'ShopEase Bot',
      description: 'Shopping assistant for effortless purchases',
      tags: ['Q&A'],
    },
    {
      name: 'HelpBuddy',
      description: 'Resolving customer queries 24/7',
      tags: ['Q&A', 'Insight'],
    },
    {
      name: 'MediAssist',
      description: 'Your trusted health companion',
      tags: ['Q&A', 'Insight'],
    },
    {
      name: 'EduSmart',
      description: 'Learners with instant educational support',
      tags: ['Q&A', 'Insight'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f4f7] px-8 py-5">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center ">
          <div>
            <h1 className="text-[18px] font-[700] text-[#1A243B]">Chatbots</h1>
            <h1 className="mb-8 text-[#62697b] py-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </h1>
          </div>
          <div className='-mt-8'>
            <button
              onClick={openModal}
              className="flex items-center w-[170px] h-[48px] gap-2 bg-[#9747ff] hover:bg-violet-600 text-white text-[16px] font-[600] px-4 rounded-xl transition-colors"
            >
              <img src={plus} alt="" />
              New Chatbot
            </button>

            <NewChatModal isOpen={isModalOpen} onClose={closeModal} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot, index) => (
            <ChatbotCard
              key={index}
              name={chatbot.name}
              description={chatbot.description}
              tags={chatbot.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotDashboard;
