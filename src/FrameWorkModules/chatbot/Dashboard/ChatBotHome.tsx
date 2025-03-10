import React, { useState, useEffect } from 'react';
import chat_bubble from '../../../assets/icons/chat_bubble.png';
import NewChatModal from './NewChatModal';
import plus from '../../../assets/icons/plusIcon.png';
import { endpoints } from '../../../Services/apiEndpoints';
import axiosInstance from '../../../Services/axiosInstance';

// Updated interface to match API response
interface ChatbotCardProps {
  boat_name: string;
  description: string;
  boat_iframeurl: string;
  port_number: number;
  project_name: string;
  agent: boolean;
  qa: boolean;
  insight: boolean;
  forecast: boolean;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({ boat_name,description, boat_iframeurl, agent,qa,insight,forecast }) => {
  const getTags =() => {
    const activeTags =[];
    if (agent) activeTags.push('agent chat');
    if (qa) activeTags.push('q&a');
    if (insight) activeTags.push('insight');
    if (forecast) activeTags.push('forecast');
    return activeTags;
  }
  return (
    <div className="bg-white p-6 w-93 gap-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1 h-40">
          <img className="w-8 h-8" src={chat_bubble} alt="" />
          <h3 className="font-medium text-gray-900 mt-2 mb-1">{boat_name}</h3>
          <p className="text-gray-500 text-sm mb-4">{description}</p>
          <p className="text-gray-500 text-sm mb-4">{boat_iframeurl}</p>
        </div>
      </div>
      <hr className="border-t border-gray-200 my-5 -mx-6" />
      <div className="flex flex-wrap gap-2">
        {getTags().map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium
                  ${tag.toLowerCase() === 'agent chat' ? 'bg-[#fed1d1] text-[#62697B]' : ''}
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

const ChatbotDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatbots, setChatbots] = useState<ChatbotCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotNames, setChatbotNames] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        console.log('Fetching from:', endpoints.GET_ALL_FRAMEWORKS);
        const apiInstance = axiosInstance.baseInstance(5001);
        const response = await apiInstance.get(endpoints.GET_ALL_FRAMEWORKS);
        console.log('Response:', response.data);

        
        const transformedChatbots = response.data.frameworks.map((framework: any) => ({
          boat_name: framework.boat_name,
          description: framework.description,
          boat_iframeurl: framework.boat_iframeurl,
          port_number: framework.port_number,
          project_name: framework.project_name,
          agent: framework.agent || false,
          qa: framework.qa || false,
          insight: framework.insight || false,
          forecast: framework.forecast || false
        }));

        const names = response.data.frameworks.map((framework:any) => framework.boat_name)

        setChatbots(transformedChatbots);
        setChatbotNames(names)
        setLoading(false);
      } catch (err) {
        setError('Failed to load chatbots. Please try again later.');
        setLoading(false);
        console.error('Error fetching chatbots:', err);
      }
    };

    fetchChatbots();
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f4f7] px-8 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[18px] font-[700] text-[#1A243B]">Chatbots</h1>
            <h1 className="mb-8 text-[#62697b] py-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </h1>
          </div>
          <div className="-mt-8">
            <button
              onClick={openModal}
              className="flex items-center w-[170px] h-[48px] gap-2 bg-[#9747ff] hover:bg-violet-600 text-white text-[16px] font-[600] px-4 rounded-xl transition-colors"
            >
              <img src={plus} alt="" />
              New Chatbot
            </button>
            <NewChatModal
             isOpen={isModalOpen} 
             onClose={closeModal} 
             existingChatbotNames={chatbotNames}/>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading chatbots...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot, index) => (
              <ChatbotCard
                key={index}
                boat_name={chatbot.boat_name}
                description={chatbot.description}
                boat_iframeurl={chatbot.boat_iframeurl}
                port_number={chatbot.port_number}
                project_name={chatbot.project_name}
                agent={chatbot.agent}
                qa={chatbot.qa}
                insight={chatbot.insight}
                forecast={chatbot.forecast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotDashboard;