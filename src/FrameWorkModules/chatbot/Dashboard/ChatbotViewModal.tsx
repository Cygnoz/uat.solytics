import React from 'react';

interface ChatbotDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatbot: {
        boat_name: string;
        description: string;
        boat_iframeurl: string;
        port_number: number;
        project_name: string;
        agent: boolean;
        qa: boolean;
        insight: boolean;
        forecast: boolean;
        theme: Array<{ backgroundColor: string; textColor: string }>;
        ticketDescription: string;
        ticketSubject: string;
        ticket_fields: {
            choice: Array<{ label: string; options: string[] }>;
            input: Array<{ label: string; placeholder: string }>;
        };
        upload: boolean;
    };
}

const ChatbotViewModal: React.FC<ChatbotDetailModalProps> = ({ isOpen, onClose, chatbot }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[80%] max-w-2xl h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{chatbot.boat_name}</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-4 px-4 py-4">
                    {/* Basic Info */}
                    <section>
                        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Project Name</p>
                                <p className="text-gray-900">{chatbot.project_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-900">{chatbot.description || 'N/A'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section>
                        <h3 className="text-lg font-semibold mb-2">Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {chatbot.agent && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fed1d1] text-[#62697B]">
                                    Agent Chat
                                </span>
                            )}
                            {chatbot.qa && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFE7E7] text-[#62697B]">
                                    Q&A
                                </span>
                            )}
                            {chatbot.insight && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E7FFED] text-[#62697B]">
                                    Insight
                                </span>
                            )}
                            {chatbot.forecast && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E7E7FF] text-[#62697B]">
                                    Forecast
                                </span>
                            )}

                        </div>
                    </section>

                    {/* Ticket Fields */}
                    <section>
                        <h3 className="text-lg font-semibold mt-6 mb-2">Ticket Configuration</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="text-gray-900">{chatbot.ticketSubject || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-900 mb-4">{chatbot.ticketDescription || 'N/A'}</p>
                            </div>

                            {chatbot.upload && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E7F7FF] text-[#62697B]">
                                    Upload Enabled
                                </span>
                            )}

                            {/* Input Fields */}
                            {chatbot.ticket_fields.input.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mt-4">Input Fields</p>
                                    {chatbot.ticket_fields.input.map((field, index) => (
                                        <div key={index} className="ml-4">
                                            <p className="text-gray-900">{field.label}</p>
                                            <p className="text-sm text-gray-500">Placeholder: {field.placeholder}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Choice Fields */}
                            {chatbot.ticket_fields.choice.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium">Choice Fields</p>
                                    {chatbot.ticket_fields.choice.map((field, index) => (
                                        <div key={index} className="ml-4">
                                            <p className="text-gray-900">{field.label}</p>
                                            <p className="text-sm text-gray-500">
                                                Options: {field.options.join(', ')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ChatbotViewModal;