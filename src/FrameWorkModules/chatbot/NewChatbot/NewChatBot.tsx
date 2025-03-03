import { useState } from 'react';
import rightArrow from '../../../assets/FrameIcons/chevron-right.png'
import Q_A from './Q&A/Q_A';
import AgentChat from './Agent/AgentChat';


type Props = {}

function NewChatBot({ }: Props) {
    const [activeTab, setActiveTab] = useState("Agent");

    return (
        <div className="bg-[#F2F4F7] min-h-screen">
            <div className="px-4 sm:px-6 md:px-10 py-3">
                <div className="flex gap-2 flex-wrap">
                    <a className="text-[#9747FF] text-[18px] font-[700]" href="/dashboard">Chatbots</a>
                    <img className='h-4 mt-1.5' src={rightArrow} alt="" />
                    <a className="text-[#1A243BF] text-[18px] font-[700]" href="">New Chat Bot</a>
                </div>
                <div className="flex items-center justify-center pt-5">
                <div className="grid grid-cols-4 items-center justify-center h-10 bg-[#FFFFFF] max-w-3xl w-full rounded-3xl">

                        {/* Agent chat Tab */}
                        <div
                            onClick={() => setActiveTab("Agent")}
                            className={`text-center text-[14px] sm:text-[16px] font-[600] h-10 pt-2 rounded-l-3xl cursor-pointer ${activeTab === "Agent"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Agent
                        </div>
                        {/* Q & A Tab */}
                        <div
                            onClick={() => setActiveTab("Q & A")}
                            className={`text-center text-[14px] sm:text-[16px] font-[600] h-10 pt-2 cursor-pointer ${activeTab === "Q & A"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Q & A
                        </div>

                        {/* Insights Tab */}
                        <div
                            onClick={() => setActiveTab("Insights")}
                            className={`text-center text-[14px] sm:text-[16px] font-[600] h-10 pt-2 cursor-pointer ${activeTab === "Insights"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Insights
                        </div>

                        {/* Forecast Tab */}
                        <div
                            onClick={() => setActiveTab("Forecast")}
                            className={`text-center text-[14px] sm:text-[16px] font-[600] h-10 pt-2 rounded-r-3xl cursor-pointer ${activeTab === "Forecast"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Forecast
                        </div>
                    </div>
                </div>
                <div className="pt-5">
                {activeTab === "Agent" ? (
                        <div>
                            <AgentChat />
                        </div>
                    ) : null}
                    {activeTab === "Q & A" ? (
                        <div>
                            <Q_A />
                        </div>
                    ) : null}
                    {activeTab === "Insights" ? (
                        <div className="flex items-center justify-center bg-gray-100 max-h-screen w-full mt-24 mb-24">
                            <div className="text-center mt-24 mb-28">
                                <h1 className="text-3xl font-bold text-[#1A243B]">Coming Soon...</h1>
                            </div>
                        </div>
                    ) : null}
                    {activeTab === "Forecast" ? (
                        <div className="flex items-center justify-center bg-gray-100 max-h-screen w-full mt-24 mb-24">
                            <div className="text-center mt-24 mb-28">
                                <h1 className="text-3xl font-bold text-[#1A243B]">Coming Soon...</h1>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>

    )
}

export default NewChatBot