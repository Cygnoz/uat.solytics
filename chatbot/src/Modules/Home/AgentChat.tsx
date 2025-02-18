import { useState } from 'react';
import Upload from '../../assets/Icons/Upload';
import men1 from '../../assets/images/men1.png';
import men2 from '../../assets/images/men2.png';
import LeftArrow from '../../assets/Icons/LeftArrow';
import { useNavigate } from 'react-router-dom';
import Star from '../../assets/Icons/Star';

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
    const [formData, setFormData] = useState<Record<string, string>>({});
    const navigate = useNavigate();

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

    const handleInputChange = (fieldLabel: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldLabel]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Handle form submission
    };

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
                        {frameworkData.framework.boat_name}
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
                    <form onSubmit={handleSubmit}>
                        <div className="bg-[#F3F9FF] p-4 rounded-3xl">
                            {/* Dynamic Input Fields */}
                            {frameworkData.framework.ticket_fields.input?.map((field, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-[#495160] mb-2">{field.label}</label>
                                    <input
                                        type="text"
                                        placeholder={field.placeholder}
                                        className="w-full px-4 py-2 rounded-3xl border-2 border-gray-200"
                                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                                    />
                                </div>
                            ))}

                            {/* Dynamic Upload Fields */}
                            {frameworkData.framework.ticket_fields.uploading?.map((field, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-[#495160]">{field.label}</label>
                                    <div className="border-2 mt-2 mb-3 border-dashed border-[#649DD6] rounded-lg p-4">
                                        <label className="flex flex-col items-center justify-center cursor-pointer">
                                            <Upload />
                                            <span className="text-sm text-gray-500">Upload File</span>
                                            <input type="file" className="hidden" accept=".jpg,.png,.zip" />
                                        </label>
                                    </div>
                                    <p className="text-[#6D6D6D] mt-2">Only support .jpg, png and zip files</p>
                                </div>
                            ))}

                            {/* Dynamic Choice Fields */}
                            {frameworkData.framework.ticket_fields.choice?.map((field, index) => (
                                <div key={index} className="space-y-2 mt-4 bg-white p-4 rounded-2xl">
                                    <label className="block text-gray-600 mb-2">{field.label}</label>
                                    {field.options.map((option, optionIndex) => (
                                        <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={field.label}
                                                value={option}
                                                className="w-5 h-5"
                                                onChange={(e) => handleInputChange(field.label, e.target.value)}
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}

                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white w-25 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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
                </div>
            </div>
        </div>
    );
};

export default AgentChat;