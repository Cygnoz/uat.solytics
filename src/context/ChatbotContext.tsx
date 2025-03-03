import React, { createContext, useContext, useState, ReactNode } from 'react';


export interface Field{
  type: 'text' | 'upload' | 'choice';
  title: string;
  content: string | string[] | File;
}
interface ChatbotData {
  name?: string;
  image?: string;
  description?: string;
  domain?: string;
  boat_iframeurl?: string;
  selectedFeatures?: string[];
  botUrl?: string;
  theme?: {
    backgroundColor: string;
    textColor: string;
  };
  agent?: boolean;
  qa?: boolean;
  insight?: boolean;
  ticketSubject?: string;
  ticketDescription?: string;
  ticketFields?: Field[];
  upload?: boolean;

}

interface ChatbotContextType {
  chatbotData: ChatbotData;
  updateChatbotData: (data: Partial<ChatbotData>) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatbotData, setChatbotData] = useState<ChatbotData>({});

  const updateChatbotData = (data: Partial<ChatbotData>) => {
    setChatbotData(prevData => {
      const newData = { ...prevData, ...data };
      localStorage.setItem('chatbotData', JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <ChatbotContext.Provider value={{ chatbotData, updateChatbotData }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};