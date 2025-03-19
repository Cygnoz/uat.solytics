import RecentMessage from '../../assets/images/recentMessageBG.png'
import chatbot from '../../assets/images/chatbot.png'
import men1 from '../../assets/images/men1.png'
import men2 from '../../assets/images/men2.png'
import sendUs from '../../assets/images/SendUs.png'
import RighArrow from '../../assets/icons/RighArrow';
import Tick from '../../assets/icons/Tick';
import RightArrow2 from '../../assets/icons/RightArrow2';
import SendUsBg from '../../assets/images/SendUsBg.png';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { endpoints } from '../../Services/apiEndpoints'
import useApi from '../../Hooks/useApi'
import { useOrg } from '../../context/OrgContext'
import { useQuery } from '../../components/Navlist/Query'

const MainPage = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const { setOrgData,orgData } = useOrg();
    const [localStorageData,setLocalStorageData]=useState<any>()
    useEffect(() => {
   
      const receiveMessage = (event: MessageEvent) => {
        console.log("Received message:", event);  
        if (event.data?.type === "ORG_DATA") {
          try {
            const parsedData = event.data.data;
     
            if (!parsedData) {
              console.error("Parsed data is empty");
              return;
            }
     
            console.log("Parsed ORG_DATA:", parsedData);
     
            const updatedOrgData = {
              email: parsedData.email || "",
              image: parsedData.image || "",
              name: parsedData.name || "",
            };
            console.log("updat",updatedOrgData);
            
            setLocalStorageData(updatedOrgData);
            // localStorage.setItem("ORG_DATA", JSON.stringify(updatedOrgData));
          } catch (error) {
            console.error("Error handling ORG_DATA:", error);
          }
        }
      };
     
     
   
      window.addEventListener("message", receiveMessage);
   
      return () => {
        window.removeEventListener("message", receiveMessage);
      };
    }, []);
   


    useEffect(() => {
      const projectName = query.get("projectName") || "";
      if (projectName) {
        fetchFrameworkData(projectName);
      }
    }, [localStorageData]);
   
    const { request: getDatas } = useApi("get", 5001);
   
    const fetchFrameworkData = async (projectName: string) => {
      try {
        const { response, error } = await getDatas(
          `${endpoints.GET_FRAMEWORK}/${projectName}`
        );
   
        if (response && !error) {
          console.log("res", response.data.framework);
   
          const frameworkData = response?.data?.framework || {};
          setOrgData({
            ...frameworkData,
            email:localStorageData?.email ||"",
            image:localStorageData?.image || "",
            name:localStorageData?.name || ""
          })
        }
      } catch (err) {
        console.log("err", err);
      }
    };
   
      console.log("losss",localStorageData);
      

    return (
 
         <div className="p-2">
            {/* Header */}
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-[#177BDA] font-semibold text-xl">Hi! Need help?</h1>
                        <p className="text-[#OF2A43] text-xl font-semibold">Ask me or pick an option below!</p>
                        <p className="text-gray-500 text-sm">Let our AI personal assistant help you find exactly what you need.</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        {/* <X size={20} /> */}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 grid grid-cols-2 gap-4">
                <div
                    className="bg-[#1B8FFF] rounded-lg p-4 text-white bg-cover bg-center"
                    style={{ backgroundImage: `url(${RecentMessage})` }}
                >
                    <div className="mb-4">
                        <h1 className='text-white mb-5'>Recent Message</h1>
                        <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center  mb-2">
                            <img src={chatbot} alt="" />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">Chatbot</p>
                        <p className="text-sm text-white/80">Bot1234</p>
                        <p className="text-sm mt-2">13 Minutes ago</p>
                    </div>
                </div>

                <div className='flex-row'>
                    {/* Tickets */}
                   {orgData?.agent&& <div className="relative p-4 bg-[#DCEAFF] flex mb-4 rounded-lg justify-between items-center overflow-hidden">
                        {/* Top-right gradient */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-[#DCEAFF] to-[#99BEF3] opacity-80 blur-sm"></div>
                        {/* Bottom-left gradient */}
                        <div className="absolute bottom-0 left-0 w-10 h-10 bg-gradient-to-tr from-[#0084ff] to-[#DCEAFF] blur-sm"></div>

                        <div className="flex flex-col">
                            <h1 className="text-[#464E59] mb-3">Tickets</h1>
                            <div className="flex items-center">
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
                        <div className='cursor-pointer z-50' onClick={() => navigate('/agent-chat')}>
                            <RighArrow size={20} color="#000000" />
                        </div>
                    </div>}

                    {/* Send Us Message */}

                    <div className={`bg-blue-50 ${orgData?.agent?'h-28':'h-full'}  rounded-lg p-4 flex items-center justify-between col-span-2`} style={{ backgroundImage: `url(${SendUsBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <div className="flex items-center" >

                            <img className='w-10 h-10' src={sendUs} alt="" />

                            <span className="ml-3 font-medium">Send Us Message</span>
                        </div>
                        <div className='cursor-pointer' onClick={() => navigate('/send-messages')}>
                            <RighArrow size={20} color="#000000" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Help Section */}
            <div className="p-6 bg-blue-50 rounded-2xl">
                <h3 className="font-medium mb-2">Help</h3>
                <p className="text-[#919191] text-sm mb-4">Need help? Our AI chatbot is here to assist you with any questions or issues.</p>

                {/* Help Items */}
                {[
                    "What are my current tasks?",
                    "Need insights on inventory levels?",
                    "Track your team's KPIs in real-time"
                ].map((text, index) => (
                    <div key={index} className="bg-[#BFE0FF] rounded-xl p-3 mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#8EC7F7] rounded-xl flex items-center justify-center mr-3">
                                <Tick />
                            </div>
                            <span className="text-[#295980]">{text}</span>
                        </div>
                        <RightArrow2 />
                    </div>
                ))}
            </div>
        </div>
      
    );
};

export default MainPage;