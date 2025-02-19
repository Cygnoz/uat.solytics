import { useState, useEffect, useRef } from 'react';
import Upload from '../../assets/Icons/Upload';
import men1 from '../../assets/images/men1.png';
import men2 from '../../assets/images/men2.png';
import LeftArrow from '../../assets/Icons/LeftArrow';
import { useNavigate, useLocation } from 'react-router-dom';
import Star from '../../assets/Icons/Star';
import useApi from '../../Hooks/useApi';
import { io, Socket } from 'socket.io-client';
import { endpoints } from '../../EndPoints/apiEndpoints';
const CLIENT_SOCKET_URL = import.meta.env.VITE_REACT_APP_TICKETS
import CygnozLogo from '../../assets/Images/CygnozLogo.png'
import ArrowRightIcon from '../../assets/Icons/ArooeRightIcon';
import toast from 'react-hot-toast';

interface Message {
    id: string;
    content: string;
    sender: 'agent' | 'visitor';
    timestamp: string;
}

interface FrameworkResponse {
    framework: {
        boat_name: string;
        qa: string;
        ticket_fields: {
            input?: Array<{
                label: string;
                placeholder: string;
            }>;
            uploading?: Array<{
                label: string;
            }>;
            choice?: Array<{
                label: string;
                options: string[];
            }>;
        };
    };
}

const AgentChat = () => {
    const [rating, setRating] = useState<number>(0);
    const [isResolved, setIsResolved] = useState<boolean | null>(null);
    // const [formData, setFormData] = useState<Record<string, string>>({});
    const [projectName, setProjectName] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract project name from URL path
        const pathParts = location.pathname.split('/');
        const project = pathParts[pathParts.length - 1];
        setProjectName(project);
    }, [location]);

    // Sample framework data (replace with actual API response)
    const frameworkData: FrameworkResponse = {
        framework: {
            boat_name: "SupportBot",
            qa: "How can I help you today?",
            ticket_fields: {
                input: [
                    { label: "User Name", placeholder: "Enter your name" },
                    { label: "Email", placeholder: "Enter your email" },
                    { label: "Subject", placeholder: "Enter your Subject" }
                ],
                uploading: [
                    { label: "Upload Document" }
                ],
                choice: [
                    {
                        label: "Choose a Plan",
                        options: ["Basic", "Pro", "Enterprise"]
                    }
                ]
            }
        }
    };

    // const handleInputChange = (fieldLabel: string, value: string) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         [fieldLabel]: value
    //     }));
    // };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     console.log('Form Data:', formData);
    //     // Handle form submission
    // };

    const messages: Message[] = [
        {
            id: '1',
            content: 'How can I help you today?',
            sender: 'agent',
            timestamp: '11:05 AM'
        },
        {
            id: '2',
            content: 'I need assistance with my account',
            sender: 'visitor',
            timestamp: '11:05 AM'
        }
    ];

    const MessageBubble = ({ message }: { message: Message }) => {
        const isAgent = message.sender === 'agent';
        return (
            <div className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} mb-4`}>
                <span className="text-xs text-gray-500 mt-1 mb-1 px-20">
                    {`${message.sender === 'agent' ? 'Agent' : 'Visitor'} ${message.timestamp}`}
                </span>
                <div className="flex items-start space-x-2">
                    {isAgent && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                    )}
                    <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isAgent
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-500 text-white'
                        }`}>
                        <p>{message.content}</p>
                    </div>
                    {!isAgent && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                    )}
                </div>
            </div>
        );
    };

    const ResolutionQuestion = () => (
        <div className="flex flex-col items-start space-y-2 mb-4">
            <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <p>Has your issue been resolved?</p>
                </div>
            </div>
            <div className="flex space-x-2 px-10">
                <button
                    onClick={() => setIsResolved(false)}
                    className="px-4 py-1 w-25 border border-[#177BDA] rounded-md hover:bg-gray-100"
                >
                    No
                </button>
                <button
                    onClick={() => setIsResolved(true)}
                    className="px-4 py-1 w-25 border border-[#177BDA] rounded-md hover:bg-gray-100"
                >
                    Yes
                </button>
            </div>
        </div>
    );

    const RatingSystem = () => (
        <div className="flex flex-col items-start space-y-2">
            <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div className="bg-gray-100 mb-2 rounded-lg px-4 py-2">
                    <p>How would you rate the support?</p>
                </div>
            </div>
            <div className="flex space-x-1 px-10 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                    >
                        <Star
                            color={star <= rating ? '#87238f' : '#D9D9D9'}
                            size={24}
                        />
                    </button>
                ))}
            </div>
        </div>
    );

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
    const [ticketData, setTicketData] = useState({
        requester: 'mevin@gmail.com',
        subject: '',
        description: ''
    })

    const ticketSubmit = async () => {
        const { description, subject } = ticketData
        console.log("formDta", ticketData);

        if (description || subject) {
            try {
                const { response, error } = await riseTicket(endpoints.UNASSIGNED_TICKET, ticketData)
                console.log("res", response);
                console.log("err", error);
                if (response && !error) {
                    console.log(response.data);

                    // toast.success(response.data.message)
                    // handleModalToggle()
                    setTicketId(response.data.ticketId)
                } else {
                    console.log(error.response.data.message);

                    toast.error(error.response.data.message)

                }
            } catch (err) {
                console.log(err);
            }
        } else {
            toast("Please fill the description or subject")
        }
    }
    // useEffect(() => {
    //     setFormData((prev) => ({
    //         ...prev, // Correct spread syntax
    //         requester: 'mevin@gmail.com',
    //     }));
    // }, [])

    console.log("form", ticketData);



    return (
        <div className="flex pt-10 justify-center">
            <div className="bg-white rounded-lg shadow-2xl w-[500px] h-fit flex flex-col p-4">
                <div className="flex justify-between">
                    <div onClick={() => navigate("/")} className="text-3xl cursor-pointer">
                        <LeftArrow size={16} />
                    </div>
                    <p className="text-3xl cursor-pointer -mt-4 text-[#177BDA]">&times;</p>
                </div>

                <div>
                    <p className="text-center text-[#177BDA] text-2xl font-medium">
                        {/* {frameworkData.framework.boat_name} */}
                        {projectName}
                    </p>
                    <p className="text-center my-2 text-[#919191] text-sm font-normal">
                        {frameworkData.framework.qa}
                    </p>
                </div>

                <div className="p-4 flex-shrink-0">
                    <div className="text-center">
                        <div className="flex items-center justify-center mt-5">
                            <div className="relative z-10">
                                <img src={men1} alt="First profile" className="w-10 h-10 rounded-full" />
                            </div>
                            <div className="relative -ml-4">
                                <img src={men2} alt="Second profile" className="w-10 h-10 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow px-4">
                    <form>
                        <div className='bg-[#F3F9FF] p-4 rounded-3xl'>
                            <label className='block text-[#495160] mb-2'>Subject</label>
                            <input
                                value={ticketData.subject}
                                onChange={(e) => setTicketData((prev) => ({
                                    ...prev, // Correct spread syntax
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
                                    ...prev, // Correct spread syntax
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
                            <p className='text-[#6D6D6D] mt-2'>Only support .jpg, png and zip files</p>

                            <div className="space-y-2 mt-4 bg-white p-4 rounded-2xl">
                                <label className="block  text-gray-600 mb-2">Select Options</label>
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
                                    onClick={ticketSubmit}
                                    type="submit"
                                    className="bg-[#177BDA] cursor-pointer text-white w-25 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>


                    <div className="mt-4">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        <ResolutionQuestion />
                    </div>
                    <RatingSystem />
                    <form onSubmit={sendMessage} className="flex items-center justify-between space-x-2 w-full mt-2  bg-[#177BDA] p-3 rounded-full">

                        <img src={CygnozLogo} className='w-[22px]' alt="" />


                        <textarea
                            ref={textareaRef}
                            value={message}
                            //  onChange={(e) => handleInput(e)}
                            // onKeyDown={handleKeyDown}
                            className="text-white bg-[#177BDA] w-full text-sm focus:outline-none resize-none hide-scrollbar"
                            placeholder="Type Something..."
                            rows={1}
                        />
                        <div className='flex space-x-2 items-center'>
                            {/* <Mic/> */}
                            <button type='submit' className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#69ACD6]  to-text-gray-500"><ArrowRightIcon stroke={2} color='white' size={20} /></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgentChat;