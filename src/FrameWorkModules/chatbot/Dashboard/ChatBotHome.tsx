import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import chat_bubble from '../../../assets/icons/chat_bubble.png';
import NewChatModal from './NewChatModal';
import plus from '../../../assets/icons/plusIcon.png';
import { endpoints } from '../../../Services/apiEndpoints';
import axiosInstance from '../../../Services/axiosInstance';
import ChatbotViewModal from './ChatbotViewModal';
import delete1 from '../../../assets/FrameIcons/delete.png'
import Edit from '../../../assets/FrameIcons/Edit';


// Define the complete Chatbot interface
interface Chatbot {
  _id: string;
  boat_name: string;
  description: string;
  boat_iframeurl: string;
  port_number: number;
  project_name: string;
  agent: boolean;
  qa: boolean;
  insight: boolean;
  forecast: boolean;
  theme: Array<{ backgroundColor: string; textColor: string }>;
  ticketDescription: string;
  ticketSubject: string;
  ticket_fields: {
    choice: Array<{ label: string; options: string[] }>;
    input: Array<{ label: string; placeholder: string }>;
  };
  upload: boolean;
}

// Card props interface
interface ChatbotCardProps extends Omit<Chatbot, 'theme' | 'ticketDescription' | 'ticketSubject' | 'ticket_fields' | 'upload'> {
  onClick: () => void;
  onDelete: (_id: string) => void;
  _id: string;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({
  _id,
  boat_name,
  description,
  boat_iframeurl,
  agent,
  qa,
  insight,
  forecast,
  onClick,
  onDelete
}) => {
  const getTags = () => {
    const activeTags = [];
    if (agent) activeTags.push('agent chat');
    if (qa) activeTags.push('q&a');
    if (insight) activeTags.push('insight');
    if (forecast) activeTags.push('forecast');
    return activeTags;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click even
    onDelete(_id);
  };

  return (
    <div
      className="bg-white p-6 w-93 gap-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 h-40">
          <div className='flex justify-between items-start w-full'>
            <img className="w-8 h-8" src={chat_bubble} alt="" />
            <div className='flex items-center gap-3'>
            <div  >
        <Edit />
      </div>
              <img
                src={delete1}
                className='w-5 h-5'
                alt=""
                onClick={handleDelete}
              />
            </div>
          </div>
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
              ${tag === 'agent chat' ? 'bg-[#fed1d1] text-[#62697B]' : ''}
              ${tag === 'q&a' ? 'bg-[#FFE7E7] text-[#62697B]' : ''}
              ${tag === 'insight' ? 'bg-[#E7FFED] text-[#62697B]' : ''}
              ${tag === 'forecast' ? 'bg-[#E7E7FF] text-[#62697B]' : ''}
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
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotNames, setChatbotNames] = useState<string[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChatbotClick = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setIsDetailModalOpen(true);
  };

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        console.log('Fetching from:', endpoints.GET_ALL_FRAMEWORKS);
        const apiInstance = axiosInstance.baseInstance(5001);
        const response = await apiInstance.get(endpoints.GET_ALL_FRAMEWORKS);
        console.log('Response:', response.data);

        const transformedChatbots = response.data.frameworks.map((framework: any) => ({
          _id: framework._id,  // Explicitly include _id 
          boat_name: framework.boat_name,
          description: framework.description,
          boat_iframeurl: framework.boat_iframeurl,
          port_number: framework.port_number,
          project_name: framework.project_name,
          agent: framework.agent || false,
          qa: framework.qa || false,
          insight: framework.insight || false,
          forecast: framework.forecast || false,
          theme: framework.theme || [],
          ticketDescription: framework.ticketDescription || '',
          ticketSubject: framework.ticketSubject || '',
          ticket_fields: framework.ticket_fields || { choice: [], input: [] },
          upload: framework.upload || false
        }));

        const names = response.data.frameworks.map((framework: any) => framework.boat_name);

        setChatbots(transformedChatbots);
        setChatbotNames(names);
        setLoading(false);
      } catch (err) {
        setError('Failed to load chatbots. Please try again later.');
        setLoading(false);
        console.error('Error fetching chatbots:', err);
      }
    };

    fetchChatbots();
  }, []);

  const handleDelete = async (_id: string) => {
    try {
      const apiInstance = axiosInstance.baseInstance(5001);
      await apiInstance.delete(`${endpoints.DELETE_FRAMEWORK}/${_id}`);

      // Remove the deleted chatbot from state
      setChatbots(prevChatbots =>
        prevChatbots.filter(chatbot => chatbot._id !== _id)
      );

      // Update names list
      setChatbotNames(prevNames =>
        prevNames.filter(name =>
          chatbots.find(c => c._id === _id)?.boat_name !== name
        )
      );
      toast.success("Deleted Successfully")
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast.error("Failed to delete")
      // Show error message to user
      setError('Failed to delete chatbot. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f7] px-8 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[18px] font-[700] text-[#1A243B]">Chatbots</h1>
            <h1 className="mb-8 text-[#62697b] py-2">
              Build and deploy custom chatbots for your business needs
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
              existingChatbotNames={chatbotNames}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading chatbots...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : chatbots.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500 text-lg mb-4">No chatbots found</div>
            <p className="text-gray-400">
              Click the "New Chatbot" button above to create your first chatbot
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot, index) => (
              <ChatbotCard
                key={chatbot._id || index}
                {...chatbot}
                onClick={() => handleChatbotClick(chatbot)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {selectedChatbot && (
        <ChatbotViewModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          chatbot={selectedChatbot}
        />
      )}
    </div>
  );
};

export default ChatbotDashboard;