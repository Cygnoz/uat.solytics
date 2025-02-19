// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HelpIcon from "../../assets/Icons/HelpIcon";
import HomeIcon from "../../assets/Icons/HomeIcon";
import MessageIcon from "../../assets/Icons/MessageIcon";
// import { useState } from "react";
// import BulbIcon from "../../assets/Icons/BulbIcon";
// import SendMessage from "../SendMessage/SendMessage";
// import HelpPage from "./HelpPage";
// import MainPage from "./MainPage";
// import Messages from "./Messages";
import { useNavigate } from "react-router-dom";

type Props = {};

const NavBar = ({ }: Props) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("/"); // Default active tab

    const handleClick = (path: string) => {
        setActiveTab(path); // Update active tab
        navigate(path); // Navigate to the path
    };

    // const tabs = [{ name: "Home", icon: HomeIcon },
    // { name: "Message", icon: MessageIcon },
    // { name: "Help", icon: HelpIcon },
    // ]

    // const [activeTab, setActiveTab] = useState("Home")

    return (
        <div className="flex justify-center items-end pb-5">
            <div className="bg-[#B8D8F8] w-[500px] h-[100px] flex justify-between px-10 py-5 rounded-b-lg shadow-lg items-center">
                {/* Home Tab */}
                <div
                    className="items-center cursor-pointer flex flex-col"
                    onClick={() => handleClick("/main")}
                >
                    <HomeIcon color={activeTab === "/main" ? "#3E9DFF" : "#94A3B8"} />
                    <p className={activeTab === "/main" ? "text-[#3E9DFF]" : "text-[#94A3B8]"}>Home</p>
                </div>

                {/* Message Tab */}
                <div
                    className="items-center cursor-pointer flex flex-col"
                    onClick={() => handleClick("/message")}
                >
                    <MessageIcon color={activeTab === "/message" ? "#3E9DFF" : "#94A3B8"} />
                    <p className={activeTab === "/message" ? "text-[#3E9DFF]" : "text-[#94A3B8]"}>Message</p>
                </div>

                {/* Help Tab */}
                <div
                    className="items-center cursor-pointer flex flex-col"
                    onClick={() => handleClick("/help")}
                >
                    <HelpIcon color={activeTab === "/help" ? "#3E9DFF" : "#94A3B8"} />
                    <p className={activeTab === "/help" ? "text-[#3E9DFF]" : "text-[#94A3B8]"}>Help</p>
                </div>
            </div>
        </div>


        // <div>
        //     {activeTab === "Home" && (
        //         <div>
        //             {/* <div className="bg-white p-4 rounded-t-lg shadow-2xl w-[500px] mx-auto overflow-hidden">
        //                 <div className="p-4">
        //                     <div className="flex justify-between items-center">
        //                         <div>
        //                             <h2 className="text-[#177BDA] font-semibold text-xl">Hi! Need help?</h2>
        //                             <p className="text-[#OF2A43] text-base font-semibold">Ask me or pick an option below!</p>
        //                             <p className="text-gray-500 text-sm">Let our AI personal assistant help you find exactly what you need.</p>
        //                         </div>
        //                         <button className="text-gray-400 hover:text-gray-600">
        //                         </button>
        //                     </div>
        //                 </div>

        //                 <div className="p-4 grid grid-cols-2 gap-4">
        //                     <div
        //                         className="bg-[#1B8FFF] rounded-lg p-4 text-white bg-cover bg-center"
        //                     >
        //                         <div className="mb-4">
        //                             <h1 className='text-white mb-5'>Recent Message</h1>
        //                             <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center  mb-2">
        //                                 <img src="" alt="" />
        //                             </div>
        //                         </div>
        //                         <div>
        //                             <p className="font-medium">Chatbot</p>
        //                             <p className="text-sm text-white/80">Bot1234</p>
        //                             <p className="text-sm mt-2">13 Minutes ago</p>
        //                         </div>
        //                     </div>

        //                     <div className='flex-row'>
        //                         <div className='p-4 bg-[#DCEAFF] flex-row mb-6 rounded-lg'>
        //                             <div className='flex-col'>
        //                                 <h1 className='text-[#464E59] mb-3'>
        //                                     Tickets
        //                                 </h1>
        //                                 <div className="flex items-center">
        //                                     <div className="relative z-10">
        //                                         <img
        //                                             src=""
        //                                             alt="First profile"
        //                                             className="w-10 h-10 rounded-full border-2 border-white"
        //                                         />
        //                                     </div>
        //                                     <div className="relative -ml-4">
        //                                         <img
        //                                             src=""
        //                                             alt="Second profile"
        //                                             className="w-10 h-10 rounded-full border-2 border-white"
        //                                         />
        //                                     </div>
        //                                     <BulbIcon size={20} />
        //                                 </div>
        //                             </div>
        //                         </div>

        //                         <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between col-span-2">
        //                             <div className="flex items-center" >

        //                                 <img className='w-10 h-10' src='' alt="" />

        //                                 <span className="ml-3 font-medium">Send Us Message</span>
        //                             </div>
        //                             <BulbIcon size={20} />
        //                         </div>

        //                     </div>
        //                 </div>

        //                 <div className="p-4 bg-blue-50 rounded-2xl">
        //                     <h3 className="font-medium mb-2">Help</h3>
        //                     <p className="text-[#919191] text-sm mb-4">Need help? Our AI chatbot is here to assist you with any questions or issues.</p>

        //                     {[
        //                         "What are my current tasks?",
        //                         "Need insights on inventory levels?",
        //                         "Track your team's KPIs in real-time"
        //                     ].map((text, index) => (
        //                         <div key={index} className="bg-[#BFE0FF] rounded-lg p-3 mb-2 flex items-center justify-between">
        //                             <div className="flex items-center">
        //                                 <div className="w-10 h-10 bg-[#8EC7F7] rounded-xl flex items-center justify-center mr-3">
        //                                     <BulbIcon />
        //                                 </div>
        //                                 <span className="text-[#295980]">{text}</span>
        //                             </div>
        //                             <BulbIcon />
        //                         </div>
        //                     ))}
        //                 </div>
        //             </div> */}
        //             <MainPage/>
        //         </div>
        //     )}

        //     {activeTab === "Message" && (
        //         // <SendMessage />
        //         <Messages/>
        //     )}

        //     {activeTab === "Help" && (
        //         <HelpPage />
        //     )}


        //     <div className="flex justify-center">
        //         <div className="bg-[#B8D8F8] w-[500px] h-[80px] flex justify-between px-10 py-5 rounded-b-lg shadow-lg items-center">
        //             {tabs.map((tab) => (
        //                 <div
        //                     key={tab.name}
        //                     onClick={() => setActiveTab(tab.name)}
        //                     className="flex flex-col items-center cursor-pointer"
        //                 >
        //                     <tab.icon
        //                         size={30}
        //                         color={activeTab === tab.name ? "#3E9DFF" : "#94A3B8"} // ✅ Pass proper color
        //                     />
        //                     <span
        //                         className={`text-sm ${activeTab === tab.name ? "text-blue-500 font-semibold" : "text-gray-400"
        //                             }`}
        //                     >
        //                         {tab.name}
        //                     </span>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </div>



    );
};

export default NavBar;
