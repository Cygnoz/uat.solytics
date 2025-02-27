import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import AgentIcon from "../../assets/icons/AgentIcon";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import OrganizationIcon from "../../assets/icons/OrganizationIcon";
import CygnozLogo from "../../assets/FrameImages/CygnozLogo.png";
import GoBackButton from "../../components/Ui/GoBackButton";
import { useResponse } from "../../context/ResponseContext";
import useApi from "../../Hooks/useApi";
import { endpoints } from "../../Services/apiEndpoints";
import { useOrg } from "../../context/OrgContext";
import toast from "react-hot-toast";
const CLIENT_SOCKET_URL = import.meta.env.VITE_REACT_APP_TICKETS;
type Props = {};

function TicketView({}: Props) {
  const { id } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const {setFeedBackDetails,ticketStatus}=useResponse()
  const {orgData}=useOrg()
  // const [agentImg,setAgentImg]=useState('')
  const chatBoxRef: any = useRef(null);
  const textareaRef: any = useRef(null);
  const [allmessages, setAllmessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { request: getChatHistory } = useApi("get", 3004); 
  
  function formatTime(isoString: any) {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}.${formattedMinutes} ${ampm}`;
  }
  const MessageBubble = ({ msg }: { msg: any }) => {
    return (
      <div
        key={msg?.ticketId}
        className={`flex flex-col space-y-1 w-full mb-2 ${
          msg?.senderId?.role === "Customer" ? "items-end" : "items-start"
        }`}
      >
        {msg.senderId.role !== "Customer" ? (
          <div className="flex justify-end items-center gap-2 ms-4">
            <p className="text-xs font-bold text-[#4B5C79]">{allmessages[0]?.senderId?.name ||"Agent"}</p>
            <p className="text-xs text-gray-500  ">
              {formatTime(msg?.createdAt)}
            </p>
          </div>
        ) : (
          <div className="flex justify-end items-center gap-2 me-4">
            <p className="text-xs font-bold text-[#4B5C79]">
              {msg.senderId?.name}
            </p>
            <p className="text-xs text-gray-500  ">
              {formatTime(msg?.createdAt)}
            </p>
          </div>
        )}

        <div
          className={`${
            msg.senderId.role === "Customer"
              ? "bg-[#59BEFD] text-white rounded-br-none"
              : "bg-[#F2F2F2] text-[#1B4A77] rounded-bl-none"
          } w-fit max-w-full px-4 py-2 rounded-2xl text-sm ${
            msg.senderId.role === "Customer" ? "me-3 ms-8" : "ms-4 me-8"
          }`}
        >
          <p
            className="break-words"
            style={{
              overflowWrap: "break-word", // Break long words to the next line
              wordBreak: "break-word", // Additional support for word breaking
              maxWidth: "100%", // Ensures content stays within container
            }}
          >
            {msg?.message}
          </p>
        </div>

        {msg.senderId.role !== "Customer" ? (
         <AgentIcon agentImg={allmessages[0]?.senderId?.image ||""}  height={7} width={7}/>
        ) : (
          <OrganizationIcon height={7} width={7}/>
        )}
      </div>
    );
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents adding a new line
      sendMessage(e); // Manually trigger the form submission
    }
  };
  const handleInput = (e: any) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset the height
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight); // Get the line height
    const maxHeight = lineHeight * 4; // Max height for 3 rows
    const minHeight = lineHeight * 1; // Min height for 1 row

    // Set the new height within bounds
    textarea.style.height = `${Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    )}px`;

    setMessage(textarea.value);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && message.length > 0 && socket) {
      const messageBody = {
        ticketId: id,
        senderId:orgData?.orgEmail,
        receiverId: allmessages[0]?.senderId,
        message,
      };
  
      socket.emit("sendMessage", messageBody);
      setMessage("");
  
  
      if (textareaRef.current) {
        textareaRef.current.style.height = "19px";
      }
    }
  };

  const getChatHis=async()=>{
    try{
      const {response,error}=await getChatHistory(`${endpoints.CHAT_HISTORY}/${id}`)      
      if(response && !error){
        setAllmessages(response.data?.data?.reverse())
        
      }
    }catch(err){
      console.log("er",err); 
      
    }
  }

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    if(allmessages.length==1){
      setFeedBackDetails({
        supportAgentId:allmessages[0].senderId?._id ||"",
        customerId:allmessages[0]?.receiverId?. _id || "",
        ticketId:id||""
     })
     }
  }, [allmessages]);
  useEffect(() => {
    getChatHis();
    const newSocket = io(CLIENT_SOCKET_URL);
    setSocket(newSocket);

  
    newSocket.emit("joinRoom", id);
    newSocket.emit("messageRead", { ticketId: id, role: "Customer" });
    newSocket.on("chatHistory", (chatHistory: any) => {
      setAllmessages(chatHistory);
    });
  
    newSocket.on("newMessage", (newMessage: any) => {
      setAllmessages((allMsg) => {
        const updatedMessages = [...allMsg, newMessage];
      
      
      
        return updatedMessages;
      });
      
    });
  
    newSocket.on("disconnect", () => {
    
    });
   
    return () => {
      newSocket.disconnect();
    };
   
  }, [id]);


  console.log("dd",allmessages);
  
  


  // useEffect(() => {
  //   const newSocket = io(CLIENT_SOCKET_URL);
  //   setSocket(newSocket);

  //   newSocket.emit("joinRoom", id);

  //   newSocket.on("chatHistory", (chatHistory: any) => {
  //     setAllmessages(chatHistory);
  //   });

  //   newSocket.on("newMessage", (newMessage: any) => {
  //     setAllmessages((prev) => [...prev, newMessage]);
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, [id]);

 

 

  

  return (
    <div className="px-2 pb-2 h-full">
         <GoBackButton navigation="/message"/>

                {/* Title and Description */}
                {(allmessages?.length ?? 0) <= 6 && (<div>
                    <p className="text-center text-[#177BDA] text-2xl font-medium">Agent Chat</p>
                    <p className="text-center mt-2  text-[#919191] text-sm font-normal">
                        Ask anything, anytime—seamless support is just a message away!
                    </p>
                </div>)}
         
                    <div className={`text-center ${(allmessages?.length ?? 0) <= 6&&'mt-3'}` }>
                        {/* <h2 className="text-[#177BDA] font-semibold text-2xl mb-2">Agent Chat</h2>
                    <p className="text-gray-500 text-sm mb-2">
                        Ask anything, anytime—seamless support is just a message away!
                    </p> */}
                        <div className="flex items-center justify-center">
                            <div className="relative z-10">
                               <OrganizationIcon/>
                            </div>
                           {allmessages?.length>0&& <div className="relative -ml-4">
                               <AgentIcon agentImg={allmessages[0]?.senderId?.image ||""}/>
                            </div>}
                        </div>
                    </div>
             
      {allmessages?.length > 0 ? (
        <div className="flex flex-col justify-between">
            <div ref={chatBoxRef} className={`mt-2 ${(allmessages?.length ?? 0) <= 6?'h-[70vh]':'h-[79vh]'}  scroll-smooth  overflow-auto hide-scrollbar`}>
          {allmessages.map((message) => (
            <MessageBubble key={message.id} msg={message} />
          ))}
          {/* <ResolutionQuestion /> */}
        </div>
        <form
        onSubmit={sendMessage}
        className="flex items-center justify-between space-x-2 w-full mt-2  bg-[#F3F9FF] p-2 rounded-full"
      >
        <img src={CygnozLogo} className="w-[22px]" alt="" />
        
    
       
          <textarea
           onClick={()=>{
            if(ticketStatus==="Closed"){
              toast.error("This ticket has been closed you can raise another ticket!")
            }
           }}
          ref={textareaRef}
          value={message}
          readOnly={ticketStatus==="Closed"?true:false}
          onChange={(e) => handleInput(e)}
          onKeyDown={handleKeyDown}
          className="text-[#495160] text-start bg-[#F3F9FF] w-full text-sm focus:outline-none overflow-x-auto resize-none hide-scrollbar"
          placeholder="Type Something..."
          rows={1}
        />

      
        <div className="flex space-x-2 items-center">
          {/* <Mic/> */}
          <button
            type="submit"
            className="w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-gradient-to-r from-[#69ACD6]  to-[#69ACD6]"
          >
            <ArrowRightIcon stroke={2} color="white" size={20} />
          </button>
        </div>
      </form>
        </div>
        
      ):
<div className=" flex justify-center items-center h-[60vh]">
<div className="flex flex-col items-center text-center text-gray-700">
  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
    Our agent will connect you soon
  </h1>
  <h2 className="text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
    Please wait a moment
  </h2>
  
  <div className="dots-loading mt-2">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
</div>



      }
    </div>
  );
}

export default TicketView;
