import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
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
import NoAccess from './context/NoAccess';
import { useEffect } from 'react';

 

// Protect these routes
const protectedRoutes = ['/dashboard', '/addchatbot', '/playground', '/playground2'];



const routeComponents: { [key: string]: JSX.Element } = {
  "/main": <MainPage />,
  "/help": <HelpPage />,
  "/send-messages": <SendMessage />,
  "/message": <Messages />,
  "/agent-chat": <TicketRise />,
  "/ticket-view/:id": <TicketView />,
};

// const routesWithHeader = ['/dashboard', '/addchatbot', '/playground', '/playground2'];
// const LoadingOverlay = () => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-[9999]">
//       <div className="relative w-16 h-16">
//         {/* Spinning Loader */}
//         <div className="absolute inset-0 border-[7px]  border-[#C96E76] border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     </div>
//   );
// };
function App() {
  const isAuthenticated = localStorage.getItem('token');
  function PrivateRoute() {
    return isAuthenticated ? <Outlet /> : <NoAccess/>;
  }

  useEffect(()=>{
    PrivateRoute()
  },[isAuthenticated])
  const location = useLocation();
  const currentPath = location.pathname;
  const showHeader = protectedRoutes.includes(currentPath);

  const isWrappedRoute = Navlist.some(({ basePath, subPath }) =>
    [basePath, ...subPath].some(path => 
      path.includes(":") ? new RegExp(`^${path.replace(/:[^\s/]+/, ".*")}$`).test(currentPath) : path === currentPath
    )
  );
  return (
    <>
      {isWrappedRoute ? (
        <div className="w-full h-[98vh]">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full">
            <div className="flex-1 overflow-auto hide-scrollbar">
              <Routes>
                {Navlist.flatMap(({ subPath }) =>
                  subPath.map((path) => (
                    <Route key={path} path={path} element={routeComponents[path]} />
                  ))
                )}
              </Routes>
            </div>

            {!currentPath.startsWith('/ticket-view') && (
              <div className="mt-auto">
                <Footer />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {(showHeader &&isAuthenticated) &&<Header />}
          <ChatbotProvider>
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<ChatbotDashboard />} />
                <Route path="/addchatbot" element={<NewChatBot />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/playground2" element={<PlaygroundConnect />} />
              </Route>
              <Route path="*" element={<NoAccess />} />
            </Routes>
          </ChatbotProvider>
        </div>
      )}
      
      <Toaster reverseOrder={false} />
    </>
  );
}

export default App;
