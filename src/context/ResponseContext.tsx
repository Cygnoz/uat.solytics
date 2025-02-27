import React, { createContext, useState, ReactNode, useContext } from 'react';


interface FeedBackData {
  supportAgentId: string;
  customerId: string;
  ticketId:string
}



type ResponseContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  feebBackDetails:FeedBackData;
  setFeedBackDetails: React.Dispatch<React.SetStateAction<FeedBackData>>;
  ticketStatus:string
  setTicketStatus:React.Dispatch<React.SetStateAction<string>>;
};

// Create the context with a default value
const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

// Context provider component
export const ResponseProvider = ({ children }: { children: ReactNode }) => {

  const [feebBackDetails,setFeedBackDetails]=useState<FeedBackData>( {
    supportAgentId: '',
    customerId:'',
    ticketId:""
  })

  


  // const [userOrgData,setUserOrgData]=
  

  const [loading, setLoading] = useState<boolean>(false);
  const [ticketStatus,setTicketStatus]=useState('')

  return (
    <ResponseContext.Provider value={{ loading, setLoading, feebBackDetails,setFeedBackDetails,setTicketStatus,ticketStatus }}>
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
