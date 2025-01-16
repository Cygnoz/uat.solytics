import { useState } from 'react';
import rightArrow from '../../../assets/Icons/chevron-right.png'
import Q_A from './Q&A/Q_A';

type Props = {}

function NewChatBot({ }: Props) {
    const [activeTab, setActiveTab] = useState("Q & A");

    return (
        <div className="bg-[#F2F4F7]">
            <div className="px-10 py-3">
                <div className="flex gap-2">
                    <a className="text-[#9747FF] text-[18px] font-[700]" href="/">Chatbots</a>
                    <img className=' h-4 mt-1.5' src={rightArrow} alt="" />
                    <a className="text-[#1A243BF] text-[18px] font-[700]" href="">New Chat Bot</a>
                </div>
                <div className="flex items-center justify-center pt-5">
                    <div className="grid grid-cols-3 items-center justify-center h-10 bg-[#FFFFFF] w-[30%] rounded-3xl">
                        {/* Q & A Tab */}
                        <div
                            onClick={() => setActiveTab("Q & A")}
                            className={`text-center text-[16px] font-[600] h-10 pt-2 rounded-l-3xl cursor-pointer ${activeTab === "Q & A"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Q & A
                        </div>

                        {/* Insights Tab */}
                        <div
                            onClick={() => setActiveTab("Insights")}
                            className={`text-center text-[16px] font-[600] h-10 pt-2 cursor-pointer ${activeTab === "Insights"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Insights
                        </div>

                        {/* Forecast Tab */}
                        <div
                            onClick={() => setActiveTab("Forecast")}
                            className={`text-center text-[16px] font-[600] h-10 pt-2 rounded-r-3xl cursor-pointer ${activeTab === "Forecast"
                                ? "bg-[#9747FF] text-white"
                                : "text-[#9747FF]"
                                }`}
                        >
                            Forecast
                        </div>
                    </div>
                </div>
                <div>
                    {activeTab === "Q & A" ? (
                        <div>
                            <Q_A />
                        </div>
                    ) : null}
                    {activeTab === "Insights" ? (
                        <div>
                            Insights
                        </div>
                    ) : null}   {activeTab === "Forecast" ? (
                        <div>
                            Forecast
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default NewChatBot