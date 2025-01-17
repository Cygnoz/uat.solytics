import './App.css';
import Header from './CommonComponents/Header';
import ChatbotDashboard from './features/chatbot/Dashboard/ChatBotHome';
import NewChatBot from './features/chatbot/NewChatbot/NewChatBot';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Playground from './features/PlayGround/Playground';
import Login from './features/chatbot/Login/login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/addchatbot" element={<NewChatBot />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/dashboard" element={<ChatbotDashboard />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;