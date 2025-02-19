// import './App.css';
// import Header from './CommonComponents/Header';
// import ChatbotDashboard from './features/chatbot/Dashboard/ChatBotHome';
// import NewChatBot from './features/chatbot/NewChatbot/NewChatBot';
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import Playground from './features/PlayGround/Playground';
// import { Toaster } from 'react-hot-toast';
// import Login from './features/Services/Login/login';
// import PlaygroundConnect from './features/PlayGround/Connect/PlaygroundConnect';
// import ProtectedRoute from './CommonComponents/ProtectedRoutes';
// import { AuthProvider } from './context/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//   );
// }

// function AppContent() {
//   const location = useLocation();
  
//   return (
//     <>
//       {location.pathname !== '/' && <Header />}
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<ChatbotDashboard />} />
//           <Route path="/addchatbot" element={<NewChatBot />} />
//           <Route path="/playground" element={<Playground />} />
//           <Route path="/playground2" element={<PlaygroundConnect />} />
//         </Route>
//       </Routes>
//       <Toaster position="top-center" />
//     </>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './CommonComponents/Header';
import Login from './features/Services/Login/login';
import PlaygroundConnect from './features/PlayGround/Connect/PlaygroundConnect';
import ChatbotDashboard from './features/chatbot/Dashboard/ChatBotHome';
import NewChatBot from './features/chatbot/NewChatbot/NewChatBot';
import Playground from './features/PlayGround/Playground';
import MainPage from './Modules/Home/MainPage';
import HelpPage from './Modules/Home/HelpPage';
import SendMessage from './Modules/SendMessage/SendMessage';
import Messages from './Modules/Home/Messages';
import AgentChat from './Modules/Home/AgentChat';
import NavBar from './Modules/Home/NavBar';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();

  const isBillieRoute = (path: string) => {
    return [
      '/main',
      '/help',
      '/send-messages',
      '/message',
      '/agent-chat'
    ].includes(path) || path.startsWith('/main/');
  };

  return (
    <>
      {!isBillieRoute(location.pathname) && location.pathname !== '/' && <Header />}
      
      <Routes>
      {/* Routes from framework */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ChatbotDashboard />} />
      <Route path="/addchatbot" element={<NewChatBot />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/playground2" element={<PlaygroundConnect />} />

      {/* Routes from billie */}
      <Route path="/main" element={<MainPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/send-messages" element={<SendMessage />} />
      <Route path="/message" element={<Messages />} />
      <Route path="/agent-chat" element={<AgentChat />} />
      <Route path="/main/:projectName" element={<MainPage />} />
      </Routes>
      {/* Conditionally render Navbar */}
      {isBillieRoute(location.pathname) && <NavBar />}

      <Toaster position="top-center" />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;