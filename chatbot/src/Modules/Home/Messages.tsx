
import { useNavigate } from "react-router-dom";
import BotIcon from "../../assets/images/botIcon.png";
import PlusIcon from "../../assets/Icons/PlusIcon";


const Messages = () => {
  const navigate = useNavigate()
  const messages = [
    {
      id: 1,
      name: "Salena John",
      avatar: "/api/placeholder/40/40",
      status: "In Progress",
      message: "Your monthly sales report is ready! Let me know if you'd like a breakdown or additional data.",
      time: "1h Ago",
      notifications: 3
    },
    {
      id: 2,
      name: "Peter Rachal",
      avatar: "/api/placeholder/40/40",
      status: "Resolved",
      message: "Your monthly sales report is ready! Let me know if you'd like a breakdown or additional data.",
      time: "1h Ago",
      notifications: 3
    },
    {
      id: 3,
      name: "Chat Bot",
      avatar: "/api/placeholder/40/40",
      message: "Hi there! Your latest report is ready for review.",
      time: "17m Ago",
      notifications: 1
    },
    {
      id: 4,
      name: "Peter Rachal",
      avatar: "/api/placeholder/40/40",
      status: "In Progress",
      message: "Your monthly sales report is ready! Let me know if you'd like a breakdown or additional data.",
      time: "1h Ago",
      notifications: 3
    }
  ];

  return (
    <div className="flex pt-10 justify-center">
      <div className="bg-white p-4 rounded-lg shadow-2xl w-[500px] h-[700px] overflow-hidden relative">
      {/* Header */}
      <div className="">
      <div className="flex justify-end">
                    <p className="text-3xl cursor-pointer -mt-3 text-[#177BDA]">&times;</p>
                </div>
                <div className="px-4">
                    <div>
                        <p className="mb-2 text-[#177BDA] text-2xl font-medium">Messages</p>
                        <p className="text-[#919191] text-sm font-normal">View and manage all your messages, updates, and notifications here.</p>

                    </div>
                    </div>
        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search Messages"
            className="w-full px-4 py-2 rounded-full border-2 border-gray-200 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="p-2 max-h-[500px]">
        {messages.map((message) => (
          <div key={message.id} className="p-4 mb-3 bg-[#F3F9FF] rounded-2xl gap-6">
            <div className="flex items-start gap-3">
              <img
                src={message.name === "Chat Bot" ? BotIcon : message.avatar}
                alt={message.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <div className="flex items-center justify-between gap-14">
                    {message.name === "Chat Bot" ?
                      <span className='text-[#0177F2] font-medium'>{message.name}</span>
                      :
                      <span className="text-[#0F2A43] font-medium">{message.name}</span>
                    }
                    <span className="justify- text-sm text-gray-400">{message.time}</span>
                  </div>
                </div>
                {message.status && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-2xl ${message.status === "In Progress" ? "bg-[#E3CBB4] text-[#3A3A3A]" : "bg-[#B1D9AC] text-[#3A3A3A]"
                    }`}>
                    {message.status}
                  </span>
                )}
                <p className="text-[#A19999] text-sm mt-1">{message.message}</p>
              </div>
              {message.notifications && (
                <span className="bg-[#B8DAFE] text-blue-500 text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {message.notifications}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button onClick={() => navigate('/agent-chat')} className="absolute cursor-pointer bottom-4 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
        <PlusIcon/>
      </button>
    </div>
    </div>
  );
};

export default Messages;