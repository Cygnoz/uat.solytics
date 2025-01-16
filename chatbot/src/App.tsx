import './App.css'
import Header from './CommonComponents/Header'
import ChatbotDashboard from './features/chatbot/Dashboard/ChatBotHome'
import NewChatBot from './features/chatbot/NewChatbot/NewChatBot'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Playground from './features/chatbot/PlayGround/Playground';
function App() {

  return (
    <>
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<ChatbotDashboard />} />
          <Route path="/addchatbot" element={<NewChatBot />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
