import React, { createContext, useState, ReactNode, useContext } from 'react';

interface IsFeedBack {
  isSocketConnected: boolean;
  hasMessaged: boolean;
}

interface FeedBackData {
  supportAgentId: string;
  customerId: string;
}



type ResponseContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackModalState: IsFeedBack;
  setFeedbackModalState: React.Dispatch<React.SetStateAction<IsFeedBack>>;
  feebBackDetails:FeedBackData;
  setFeedBackDetails: React.Dispatch<React.SetStateAction<FeedBackData>>;
};

// Create the context with a default value
const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

// Context provider component
export const ResponseProvider = ({ children }: { children: ReactNode }) => {
  const [feedbackModalState, setFeedbackModalState] = useState<IsFeedBack>({
    isSocketConnected: false,
    hasMessaged: false,
  });

  const [feebBackDetails,setFeedBackDetails]=useState<FeedBackData>( {
    supportAgentId: '',
    customerId:''
  })


  // const [userOrgData,setUserOrgData]=
  

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ResponseContext.Provider value={{ loading, setLoading, feedbackModalState, setFeedbackModalState,feebBackDetails,setFeedBackDetails }}>
      {children}
    </ResponseContext.Provider>
  );
};

// Custom hook to use the context
export const useResponse = (): ResponseContextType => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponse must be used within a ResponseProvider');
  }
  return context;
};
