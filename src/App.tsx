import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer';
import Header from './layout/Header';
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
import { Navlist } from './components/Navlist/Navlist';
import { ChatbotProvider } from './context/ChatbotContext';



const routeComponents: { [key: string]: JSX.Element } = {
  "/main": <MainPage />,
  "/help": <HelpPage />,
  "/send-messages": <SendMessage />,
  "/message": <Messages />,
  "/agent-chat": <TicketRise />,
  "/ticket-view/:id": <TicketView />,
};

const routesWithHeader = ['/dashboard', '/addchatbot', '/playground', '/playground2'];

function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  const showHeader = routesWithHeader.includes(currentPath);

  const isWrappedRoute = Navlist.some(({ basePath, subPath }) =>
    [basePath, ...subPath].some(path => 
      path.includes(":") ? new RegExp(`^${path.replace(/:[^\s/]+/, ".*")}$`).test(currentPath) : path === currentPath
    )
  );
  return (
    // <>
    //   {!framework ? (
    //     <div className="w-full h-[98vh]">
    //       <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full">
    //         {/* Scrollable Content */}
    //         <div className="flex-1 overflow-auto hide-scrollbar">
    //           <Routes>
    //             <Route path="/main" element={<MainPage />} />
    //             <Route path="/help" element={<HelpPage />} />
    //             <Route path="/send-messages" element={<SendMessage />} />
    //             <Route path="/message" element={<Messages />} />
    //             <Route path="/agent-chat" element={<TicketRise />} />
    //             <Route path="/ticket-view/:id" element={<TicketView />} />
    //           </Routes>
    //         </div>

    //         {/* Fixed Footer */}
    //         {!currentPath.startsWith('/ticket-view') && (
    //           <div className="mt-auto">
    //             <Footer />
    //           </div>
    //         )}
    //       </div>
    //       <Toaster reverseOrder={false} />
    //     </div>
    //   ) : (
    //     <div>
    //       <Routes>
    //         {/* Routes from framework */}
    //         <Route path="/" element={<Login />} />
    //         <Route path="/dashboard" element={<ChatbotDashboard />} />
    //         <Route path="/addchatbot" element={<NewChatBot />} />
    //         <Route path="/playground" element={<Playground />} />
    //         <Route path="/playground2" element={<PlaygroundConnect />} />
    //       </Routes>
    //     </div>
    //   )}
    // </>
    <>
    
    {isWrappedRoute ? (
      <div className="w-full h-[98vh]">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto hide-scrollbar">
            <Routes>
              {Navlist.flatMap(({ subPath }) =>
                subPath.map((path) => (
                  <Route key={path} path={path} element={routeComponents[path]} />
                ))
              )}
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
        {showHeader && <Header />}
        <ChatbotProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ChatbotDashboard />} />
          <Route path="/addchatbot" element={<NewChatBot />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/playground2" element={<PlaygroundConnect />} />
        </Routes>
        </ChatbotProvider>
        
      </div>
    )}
  </>
    
  );
}

export default App;
