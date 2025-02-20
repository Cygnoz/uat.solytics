import { useEffect, useRef, useState } from 'react';
import Upload from '../../assets/Icons/Upload'
import men1 from '../../assets/images/men1.png'
import men2 from '../../assets/images/men2.png'
import LeftArrow from '../../assets/Icons/LeftArrow';
import { useNavigate } from 'react-router-dom';
// import Star from '../../assets/Icons/Star';
import { io, Socket } from 'socket.io-client';
import ArrowRightIcon from '../../assets/Icons/ArrowRightIcon';
const CLIENT_SOCKET_URL = import.meta.env.VITE_REACT_APP_TICKETS
import CygnozLogo from '../../assets/Images/CygnozLogo.png'
import { endpoints } from '../../EndPoints/apiEndpoints';
import toast from 'react-hot-toast';
import useApi from '../../Hooks/useApi';
import SaImage from '../../assets/Images/SAImage.png'


// interface Message {
//     id: string;
//     content: string;
//     sender: 'agent' | 'visitor';
//     timestamp: string;
// }

// interface ChatMessage {
//     messages: Message[];
//     resolved?: boolean;
//     rating?: number;
// }

const BillieAgentChat = () => {
    // const [rating, setRating] = useState<number>(0);
    // const [isResolved, setIsResolved] = useState<boolean | null>(null);
    // console.log(isResolved);

    const navigate = useNavigate()

    const [ticketId, setTicketId] = useState(null)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [message, setMessage] = useState("")
    const chatBoxRef: any = useRef(null);
    const textareaRef: any = useRef(null);
    const [allmessages, setAllmessages] = useState<any[]>([]);
    const { request: getChatHistory } = useApi('get', 3004)

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [allmessages]);
    useEffect(() => {
        const newSocket = io(CLIENT_SOCKET_URL);
        setSocket(newSocket);

        newSocket.emit("joinRoom", ticketId);

        newSocket.on("chatHistory", (chatHistory: any) => {
            setAllmessages(chatHistory);
        });

        newSocket.on("newMessage", (newMessage: any) => {
            setAllmessages((prev) => [...prev, newMessage]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [ticketId]);
    //   const {organization}=useOrganization()
    //   console.log("org",organization);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim() && message.length > 0 && socket) {
            const messageBody = {
                ticketId,
                senderId: 'mevin@gmail.com',
                receiverId: allmessages[0]?.senderId,
                message,
            }
            console.log("messageBody", messageBody);

            socket.emit("sendMessage", messageBody);
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "19px"; // Reset height to auto

            }
        }
    };

    console.log("messages", allmessages);

    const getChatHis = async () => {
        try {
            const { response, error } = await getChatHistory(`${endpoints.CHAT_HISTORY}/${ticketId}`)
            if (response && !error) {
                setAllmessages(response.data?.data?.reverse())
            }
        } catch (err) {
            console.log("er", err);

        }
    }

    useEffect(() => {
        getChatHis()
    }, [ticketId])

    console.log("messages", allmessages);


    const { request: riseTicket } = useApi('post', 3004)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketData, setTicketData] = useState({
        requester: 'mevin@gmail.com',
        subject: '',
        description: ''
    })

    const ticketSubmit = async (e: any) => {
        e.preventDefault(); // Prevent default form submission
        const { description, subject } = ticketData;
        console.log("formData", ticketData);

        if (description || subject) {
            try {
                const { response, error } = await riseTicket(endpoints.UNASSIGNED_TICKET, ticketData);
                console.log("res", response);
                console.log("err", error);

                if (response && !error) {
                    console.log("responseData", response.data);
                    toast.success(response.data.message);
                    setTicketId(response.data.ticketId);
                    setIsSubmitted(true); // Hide form on success
                } else {
                    console.log(error.response.data.message);
                    toast.error(error.response.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            toast("Please fill the description or subject");
        }
    };

    console.log("ticketId", ticketId);



    // useEffect(() => {
    //     setFormData((prev) => ({
    //         ...prev, // Correct spread syntax
    //         requester: 'mevin@gmail.com',
    //     }));
    // }, [])

    console.log("form", ticketData);

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
    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents adding a new line
            sendMessage(e); // Manually trigger the form submission
        }
    };

    function formatTime(isoString:any) {
        const date = new Date(isoString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        
        hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${hours}.${formattedMinutes} ${ampm}`;
    }

    // const messages: Message[] = [
    //     {
    //         id: '1',
    //         content: 'Lorem Ipsum Content Provide by Agent',
    //         sender: 'agent',
    //         timestamp: '11:05 AM'
    //     },
    //     {
    //         id: '2',
    //         content: 'Lorem Content by Visitor',
    //         sender: 'visitor',
    //         timestamp: '11:05 AM'
    //     },
    //     {
    //         id: '3',
    //         content: 'Lorem Ipsum Content Provide by Agent',
    //         sender: 'agent',
    //         timestamp: '11:05 AM'
    //     },
    //     {
    //         id: '4',
    //         content: 'Lorem Content by Visitor',
    //         sender: 'visitor',
    //         timestamp: '11:05 AM'
    //     }
    // ];

    const MessageBubble = ({ msg }: { msg: any }) => {
        // const isAgent = message.sender === 'agent';
        return (
            // <div className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} mb-4`}>
            //     <span className="text-xs text-gray-500 mt-1 mb-1 px-20">
            //         {`${message.sender === 'agent' ? 'Agent' : 'Visitor'} ${message.timestamp}`}
            //     </span>
            //     <div className="flex items-start space-x-2">
            //         {isAgent && (
            //             <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
            //         )}
            //         <div
            //             className={`max-w-[70%] rounded-lg px-4 py-2 ${isAgent
            //                 ? 'bg-gray-100 text-gray-800'
            //                 : 'bg-blue-500 text-white'
            //                 }`}
            //         >
            //             <p>{message.content}</p>
            //         </div>
            //         {!isAgent && (
            //             <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
            //         )}
            //     </div>

            // </div>

            <div
                key={msg.ticketId}
                className={`flex flex-col space-y-1 w-full mb-2 ${msg.senderId.role === 'Customer' ? "items-end" : "items-start"
                    }`}
            >
                 {/* <p className="text-xs text-gray-500  ">
           {formatTime(msg?.createdAt)} 
          </p> */}

          {msg.senderId.role !== 'Customer' ?(
         <div className='flex justify-end items-center gap-2'>
        <p>Agent</p>
          <p className="text-xs text-gray-500  ">
          {formatTime(msg?.createdAt)}
          </p>
         </div>):
         <div className='flex justify-end items-center gap-2'>
            <p className="text-sm font-bold text-[#4B5C79]">
             {msg.senderId?.name}
             {/* <p>SupportAgent</p> */}
          </p>
          <p className="text-xs text-gray-500  ">
          {formatTime(msg?.createdAt)}
          </p>
         </div>
    }

                <div
                    className={`${msg.senderId.role === "Customer"
                        ? "bg-[#59BEFD] text-white rounded-br-none"
                        : "bg-[#F2F2F2] text-[#1B4A77] rounded-bl-none"
                        } w-fit max-w-full px-4 py-2 rounded-2xl text-sm ${msg.senderId.role === "Customer" ? "me-3 ms-8" : "ms-4 me-8"
                        }`}
                >
                    <p

                        className="break-words"
                        style={{
                            overflowWrap: "break-word", // Break long words to the next line
                            wordBreak: "break-word",   // Additional support for word breaking
                            maxWidth: "100%",          // Ensures content stays within container
                        }}
                    >{msg?.message}</p>
                </div>

                {msg.senderId.role !== 'Customer' ? (
                    // <img
                    //     src={SaImage} // Replace with actual sender logo if available
                    //     className="w-7 h-7 rounded-full shadow-lg bg-white "
                    //     alt="Sender"
                    // />
                    <img
                        src={SaImage} // Replace with actual sender logo if available
                        className="w-7 h-7 rounded-full shadow-lg bg-white "
                        alt="Sender"
                    />) :
                    // <OrganizationIcon />
                    <img
                        src={men1} // Replace with actual sender logo if available
                        className="w-7 h-7 rounded-full shadow-lg bg-white "
                        alt="Sender"
                    />
                }
                {/* <div
                    className={`${msg.senderId.role === "Customer"
                        ? "bg-[#59BEFD] text-white rounded-tr-none"
                        : "bg-[#F2F2F2] text-[#1B4A77] rounded-tl-none"
                        } w-fit max-w-full px-4 py-2 rounded-2xl text-sm ${msg.senderId.role === "Customer" ? "me-3 ms-8" : "ms-4 me-8"
                        }`}
                >
                    <p

                        className="break-words"
                        style={{
                            overflowWrap: "break-word", // Break long words to the next line
                            wordBreak: "break-word",   // Additional support for word breaking
                            maxWidth: "100%",          // Ensures content stays within container
                        }}
                    >{msg?.message}</p>
                </div> */}

            </div>
        );
    };

    // const ResolutionQuestion = () => (
    //     <div className="flex flex-col items-start space-y-2 mb-4">
    //         <div className="flex items-start space-x-2">
    //             <div className="w-8 h-8 rounded-full bg-gray-300" />
    //             <div className="bg-gray-100 rounded-lg px-4 py-2">
    //                 <p>Has your issue been resolved?</p>
    //             </div>
    //         </div>
    //         <div className="flex space-x-2 px-10">
    //             <button
    //                 onClick={() => setIsResolved(false)}
    //                 className="px-4 py-1 w-25 border border-[#177BDA] rounded-md hover:bg-gray-100"
    //             >
    //                 No
    //             </button>
    //             <button
    //                 onClick={() => setIsResolved(true)}
    //                 className="px-4 py-1 w-25 border border-[#177BDA] rounded-md hover:bg-gray-100"
    //             >
    //                 Yes
    //             </button>
    //         </div>

    //     </div>
    // );

    // const RatingSystem = () => (
    //     <div className="flex flex-col items-start space-y-2">
    //         <div className="flex items-start space-x-2">
    //             <div className="w-8 h-8 rounded-full bg-gray-300" />
    //             <div className="bg-gray-100 mb-2 rounded-lg px-4 py-2">
    //                 <p>How do you Rate the speed of the support</p>
    //             </div>
    //         </div>
    //         <div className="flex space-x-1 px-10 mb-4">
    //             {[1, 2, 3, 4, 5].map((star) => (
    //                 <button
    //                     key={star}
    //                     onClick={() => setRating(star)}
    //                     className="focus:outline-none"
    //                 >
    //                     <Star
    //                         color={star <= (rating) ? '#87238f' : '#D9D9D9'}
    //                         size={24}
    //                     />
    //                 </button>
    //             ))}
    //         </div>
    //     </div>
    // );

    return (
        <div className="flex pt-10 justify-center">
            <div className="bg-white rounded-lg shadow-2xl w-[500px] h-fit flex flex-col p-4">
                {/* Header Section - Fixed */}
                <div className="flex justify-between">
                    <div onClick={() => navigate("/")} className="text-3xl cursor-pointer">
                        <LeftArrow size={16} />
                    </div>
                    <p className="text-3xl cursor-pointer -mt-4 text-[#177BDA]">&times;</p>
                </div>

                {/* Title and Description */}
                <div>
                    <p className="text-center text-[#177BDA] text-2xl font-medium">Agent Chat</p>
                    <p className="text-center my-2 text-[#919191] text-sm font-normal">
                        Ask anything, anytime—seamless support is just a message away!
                    </p>
                </div>
                <div className="p-4 flex-shrink-0">
                    <div className="text-center">
                        {/* <h2 className="text-[#177BDA] font-semibold text-2xl mb-2">Agent Chat</h2>
                    <p className="text-gray-500 text-sm mb-2">
                        Ask anything, anytime—seamless support is just a message away!
                    </p> */}
                        <div className="flex items-center justify-center mt-5">
                            <div className="relative z-10">
                                <img
                                    src={men1}
                                    alt="First profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            </div>
                            <div className="relative -ml-4">
                                <img
                                    src={men2}
                                    alt="Second profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section - Scrollable */}
                <div className="flex-grow  px-4 scrollbar-hide">
                    {/* <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style> */}
                    {!isSubmitted && ( // Render form only when isSubmitted is false
                        <form onSubmit={ticketSubmit}>
                            <div className='bg-[#F3F9FF] p-4 rounded-3xl'>
                                <label className='block text-[#495160] mb-2'>Subject</label>
                                <input
                                    value={ticketData.subject}
                                    onChange={(e) => setTicketData((prev) => ({
                                        ...prev,
                                        subject: e.target.value,
                                    }))}
                                    type="text"
                                    name="subject"
                                    placeholder='Enter'
                                    className="w-full px-4 py-2 rounded-3xl border-2 border-gray-200 mb-4"
                                />
                                <label className='block text-[#495160] mb-2'>Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={ticketData.description}
                                    onChange={(e) => setTicketData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))}
                                    placeholder='Enter'
                                    className="w-full px-4 py-2 h-25 rounded-xl border-2 border-gray-200 mb-4"
                                />
                                <label className='block text-[#495160] mb-2'>Subject 2</label>
                                <input
                                    type="text"
                                    name="subject2"
                                    placeholder='Enter'
                                    className="w-full px-4 py-2 rounded-3xl border-2 border-gray-200 mb-4"
                                />
                                <label className="block text-[#495160]">Upload Attachment</label>
                                <div className="border-2 mt-2 mb-3 border-dashed border-[#649DD6] rounded-lg p-4">
                                    <label className="flex flex-col items-center justify-center cursor-pointer">
                                        <Upload />
                                        <span className="text-sm text-gray-500">Upload File</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".jpg,.png,.zip"
                                        />
                                    </label>
                                </div>
                                <p className='text-[#6D6D6D] mt-2'>Only support .jpg, png, and zip files</p>

                                <div className="space-y-2 mt-4 bg-white p-4 rounded-2xl">
                                    <label className="block text-gray-600 mb-2">Select Options</label>
                                    {['1', '2', '3'].map((num) => (
                                        <label key={num} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="options"
                                                value={num}
                                                className="w-5 h-5"
                                            />
                                            <span className="text-gray-700">Option {num}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type='submit'
                                        className="bg-[#177BDA] cursor-pointer text-white w-25 py-2 px-4 rounded-lg"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Chat Messages Section */}
                    <div className="mt-4">
                        {allmessages.map((message) => (
                            <MessageBubble key={message.id} msg={message} />
                        ))}


                        {/* <ResolutionQuestion /> */}
                    </div>
                    {/* <RatingSystem /> */}
                </div>
                {/* <div className='col-span-6  px-2 flex flex-col justify-between'>
        <div ref={chatBoxRef} className="space-y-2  h-[69vh] scroll-smooth  overflow-auto hide-scrollbar">
        <div className='flex flex-col space-y-1  items-start w-full mb-2'>
         <img src={droidBilly} className='w-6 h-7 rounded-full' alt="" />
         <div className='w-fit'>
         <div className="bg-[#262D30] w-fit px-4 mb-2 ms-4 py-2 rounded-tl-none rounded-2xl text-sm ">
          <p >I can't answer your message</p>
          </div> 
          {!ticketId&&<SAFormModal organization={organization} setTicketId={setTicketId}/>}
         </div>
         </div>
         
          {
            ticketId&&messages.length==0&&
            <p className='ms-4 text-xs'>Our agent will connect you,wait a minute....</p>
          }
        
  {messages.map((msg) => (
    <div
      key={msg.ticketId}
      className={`flex flex-col space-y-1 w-full mb-2 ${
        msg.senderId.role === 'Customer' ? "items-end" : "items-start"
      }`}
    >
      { msg.senderId.role !== 'Customer' ? (
        <img
          src={SaImage} 
          className="w-7 h-7 rounded-full shadow-lg bg-white "
          alt="Sender"
        />
      ):
      <OrganizationIcon/>
      }
     <div
  className={`${
    msg.senderId.role === "Customer"
      ? "bg-[#59BEFD] text-white rounded-tr-none"
      : "bg-[#262D30] text-white rounded-tl-none"
  } w-fit max-w-full px-4 py-2 rounded-2xl text-sm ${
    msg.senderId.role === "Customer" ? "me-3 ms-8" : "ms-4 me-8"
  }`}
>
  <p
   
    className="break-words"
    style={{
      overflowWrap: "break-word", 
      wordBreak: "break-word",   
      maxWidth: "100%",          
    }}
  >{msg?.message}</p>
</div>

    </div>
  ))}
</div>

 
     <form onSubmit={sendMessage} className="flex items-center justify-between space-x-2 w-full mt-2  bg-[#262D30] p-3 rounded-full">
         
         <img src={CygnozLogo} className='w-[22px]' alt="" />
         
        
         <textarea
         ref={textareaRef}
  value={message}
  onChange={(e) =>handleInput(e)}
  onKeyDown={handleKeyDown}
           className="bg-gray-700 text-white w-full text-sm focus:outline-none resize-none hide-scrollbar"
           placeholder="Type Something..."
           rows={1}
         />
         <div className='flex space-x-2 items-center'>
         <button type='submit' className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#69ACD6]  to-[#2A3075]"><ArrowRight stroke={2} color='white' size={20}/></button>
         </div>
       </form>
        </div> */}

                <form onSubmit={sendMessage} className="flex items-center justify-between space-x-2 w-full mt-2  bg-[#F3F9FF] p-3 rounded-full">

                    <img src={CygnozLogo} className='w-[22px]' alt="" />


                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => handleInput(e)}
                        onKeyDown={handleKeyDown}
                        className="text-[#495160] bg-[#F3F9FF] w-full text-sm focus:outline-none overflow-x-auto resize-none hide-scrollbar"
                        placeholder="Type Something..."
                        rows={1}
                    />
                    <div className='flex space-x-2 items-center'>
                        {/* <Mic/> */}
                        <button type='submit' className="w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-gradient-to-r from-[#69ACD6]  to-[#69ACD6]"><ArrowRightIcon stroke={2} color='white' size={20} /></button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BillieAgentChat;