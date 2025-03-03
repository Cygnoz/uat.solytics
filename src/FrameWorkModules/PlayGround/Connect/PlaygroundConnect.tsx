import { useState } from "react";
import embedded from "../../../assets/FrameIcons/embedded.png";
import integration from "../../../assets/FrameIcons/integration.png";
import share from "../../../assets/FrameIcons/share.png";
import Connect from "./Connect";
import rightArrow from "../../../assets/FrameIcons/chevron-right.png";
import { useLocation } from "react-router-dom";
import { useChatbot } from "../../../context/ChatbotContext";



function PlaygroundConnect() {
    const [secondActiveTab, setSecondActiveTab] = useState("embedded");
    const { chatbotData } = useChatbot();
    const location = useLocation();
    const botUrl = location.state?.botData;
    
    {console.log("data = ",chatbotData)}

    const getTabClass = (tab: string) =>
        `flex gap-2 items-start rounded-3xl p-5 cursor-pointer ${secondActiveTab === tab ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"
        }`;

    return (
        <div>
            <div className="bg-[#F2F4F7] min-h-screen">
                <div className="px-4 sm:px-6 md:px-10 py-3">
                    <div className="flex gap-2 flex-wrap">
                        <a className="text-[#9747FF] text-[18px] font-[700]" href="/dashboard">Chatbots</a>
                        <img className="h-4 mt-1.5" src={rightArrow} alt="Right Arrow" />
                        <a className="text-[#1A243BF] text-[18px] font-[700]" href="">Connect</a>
                    </div>
                </div>
                <h1 className="text-[18px] text-[#1A243B] font-[700] text-center">Connect</h1>
                <p className="text-[14px] sm:text-[16px] text-[#62697B] font-[400] text-center pb-2">
                    Empower Your Chatbots to Connect Seamlessly
                </p>
                <div className="flex items-center justify-center mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-items-center max-w-md sm:max-w-lg lg:max-w-4xl gap-2 sm:gap-4 lg:gap-24">

                        <div
                            className={`${getTabClass("embedded")} w-full sm:w-[200px] md:w-[200px] lg:w-[320px]`}
                            onClick={() => setSecondActiveTab("embedded")}
                        >
                            <img src={embedded} alt="Embedded Icon" className="w-8 h-8" />
                            <div>
                                <p className="text-[16px] sm:text-[18px] font-[700]">Embedded</p>
                                <p className="text-[12px] sm:text-[14px] font-[400]">Effortlessly Embed and Engage</p>
                            </div>
                        </div>
                        <div
                            className={`${getTabClass("share")} w-full sm:w-[200px] md:w-[200px] lg:w-[320px]`}
                            onClick={() => setSecondActiveTab("share")}
                        >
                            <img src={share} alt="Share Icon" className="w-8 h-8" />
                            <div>
                                <p className="text-[16px] sm:text-[18px] font-[700]">Share</p>
                                <p className="text-[12px] sm:text-[14px] font-[400]">Connecting Insights to Action</p>
                            </div>
                        </div>
                        <div
                            className={`${getTabClass("integration")} w-full sm:w-[200px] md:w-[200px] lg:w-[320px]`}
                            onClick={() => setSecondActiveTab("integration")}
                        >
                            <img src={integration} alt="Integration Icon" className="w-8 h-8" />
                            <div>
                                <p className="text-[16px] sm:text-[18px] font-[700]">Integration</p>
                                <p className="text-[12px] sm:text-[14px] font-[400]">Integration Made Simple and Powerful</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    {secondActiveTab === "embedded" && <Connect page="embedded" botUrl={chatbotData.boat_iframeurl} />}
                    
                    {secondActiveTab === "share" && <Connect page="share" />}
                    {secondActiveTab === "integration" && <Connect page="integration" />}
                </div>
            </div>
        </div>
    );
}

export default PlaygroundConnect;
