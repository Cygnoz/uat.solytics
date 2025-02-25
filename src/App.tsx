import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer';
import { Toaster } from 'react-hot-toast';
import MainPage from './SupportModules/Home/MainPage';
import HelpPage from './SupportModules/Help/HelpPage';
import SendMessage from './SupportModules/Boat/SendMessage';
import Messages from './SupportModules/Messages/Messages';
import TicketRise from './SupportModules/Agent/TicketRise';
import TicketView from './SupportModules/Agent/TicketView';
import Login from './FrameWorkModules/Services/Login/login';
import ChatbotDashboard from './FrameWorkModules/chatbot/Dashboard/ChatBotHome';
import NewChatBot from './FrameWorkModules/chatbot/NewChatbot/NewChatBot';
import Playground from './FrameWorkModules/PlayGround/Playground';
import PlaygroundConnect from './FrameWorkModules/PlayGround/Connect/PlaygroundConnect';

function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  const framework = true; // Change this based on your logic if needed

  return (
    <>
      {!framework ? (
        <div className="w-full h-[98vh]">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto hide-scrollbar">
              <Routes>
                <Route path="/main" element={<MainPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/send-messages" element={<SendMessage />} />
                <Route path="/message" element={<Messages />} />
                <Route path="/agent-chat" element={<TicketRise />} />
                <Route path="/ticket-view/:id" element={<TicketView />} />
              </Routes>
            </div>

            {/* Fixed Footer */}
            {!currentPath.startsWith('/ticket-view') && (
              <div className="mt-auto">
                <Footer />
              </div>
            )}
          </div>
          <Toaster reverseOrder={false} />
        </div>
      ) : (
        <div>
          <Routes>
            {/* Routes from framework */}
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ChatbotDashboard />} />
            <Route path="/addchatbot" element={<NewChatBot />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/playground2" element={<PlaygroundConnect />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
