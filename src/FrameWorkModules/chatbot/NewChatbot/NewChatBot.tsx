import { useEffect, useState } from 'react';
import rightArrow from '../../../assets/FrameIcons/chevron-right.png'
import Q_A from './Q&A/Q_A';
import AgentChat from './Agent/AgentChat';
import { useChatbot } from '../../../context/ChatbotContext';


type Props = {}

function NewChatBot({ }: Props) {
    const [activeTab, setActiveTab] = useState("Agent");
    const { chatbotData } = useChatbot();

    useEffect(() => {
        if (chatbotData.selectedFeatures) {
            if (chatbotData.selectedFeatures.includes("agent")) {
                setActiveTab("Agent");
            } else if (chatbotData.selectedFeatures.includes("qa")) {
                setActiveTab("Q & A");
            } else if (chatbotData.selectedFeatures.includes("insights")) {
                setActiveTab("Insights");
            } else if (chatbotData.selectedFeatures.includes("forecast")) {
                setActiveTab("Forecast");
            }
        }
    }, [chatbotData.selectedFeatures]);

    const isTabEnabled = (tabName: string) => {
        if (!chatbotData.selectedFeatures) return true;
        switch (tabName) {
            case "Agent":
                return chatbotData.selectedFeatures.includes("agent");
            case "Q & A":
                return chatbotData.selectedFeatures.includes("qa");
            case "Insights":
                return chatbotData.selectedFeatures.includes("insights");
            case "Forecast":
                return chatbotData.selectedFeatures.includes("forecast");
            default:
                return false;
        }
    };

    const handleTabClick = (tabName: string) => {
        if (isTabEnabled(tabName)) {
            setActiveTab(tabName);
        }
    };
    

    const getTabClassName = (tabName: string) => {
        return [
            "text-center text-[14px] sm:text-[16px] font-[600] h-10 pt-2 cursor-pointer",
            activeTab === tabName ? "bg-[#9747FF] text-white" : "text-[#9747FF]",
            !isTabEnabled(tabName) && "text-gray-400 cursor-not-allowed",
            activeTab === tabName && (tabName === "Agent" ? "rounded-l-3xl" : tabName === "Forecast" ? "rounded-r-3xl" : "")
        ].filter(Boolean).join(" ");
    };



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
                            onClick={() => handleTabClick("Agent")}
                            className={getTabClassName("Agent")}
                        >
                            Agent
                        </div>
                        {/* Q & A Tab */}
                        <div
                            onClick={() => handleTabClick("Q & A")}
                            className={getTabClassName("Q & A")}
                        >
                            Q & A
                        </div>

                        {/* Insights Tab */}
                        <div
                            onClick={() => handleTabClick("Insights")}
                            className={getTabClassName("Insights")}
                        >
                            Insights
                        </div>

                        {/* Forecast Tab */}
                        <div
                            onClick={() => handleTabClick("Forecast")}
                            className={getTabClassName("Forecast")}
                        >
                            Forecast
                        </div>
                    </div>
                </div>
                <div className="pt-5">
                    {activeTab === "Agent" && <AgentChat />}
                    {activeTab === "Q & A" && <Q_A />}
                    {["Insights", "Forecast"].includes(activeTab) && (
                        <div className="flex items-center justify-center bg-gray-100 max-h-screen w-full mt-24 mb-24">
                            <div className="text-center mt-24 mb-28">
                                <h1 className="text-3xl font-bold text-[#1A243B]">Coming Soon...</h1>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default NewChatBot