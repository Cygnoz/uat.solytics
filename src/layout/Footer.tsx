import { useEffect, useState } from "react";
import HelpIcon from "../assets/icons/HelpIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import MessageIcon from "../assets/icons/MessageIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { Navlist } from "../components/Navlist/Navlist";


type Props = {};

const Footer = ({}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("/main"); // Default active tab

    useEffect(() => {
        if (location) {
            const currentPath = location.pathname;
            const matchingTab = Navlist.find(tab =>
                currentPath === tab.basePath || tab.subPath.some(sub => {
                    // Check if it's an exact match or starts with the basePath (for nested paths)
                    const formattedSubPath = sub.startsWith("/main") ? sub : `${tab.basePath}/${sub}`;
                    return currentPath === formattedSubPath || currentPath.startsWith(`${tab.basePath}/`);
                })
            );
            setActiveTab(matchingTab ? matchingTab.basePath : "/main");
        }
    }, [location]);
    

    return (
        <div className="bg-[#B8D8F8] flex justify-between px-10 py-4 rounded-b-lg shadow-lg items-center">
            {/* Home Tab */}
            <div
                className="items-center cursor-pointer flex flex-col"
                onClick={() => navigate("/main")}
            >
                <HomeIcon color={activeTab === "/main" ? "#3E9DFF" : "#94A3B8"} />
                <p className={activeTab === "/main" ? "text-[#3E9DFF]" : "text-[#94A3B8]"}>Home</p>
            </div>

            {/* Message Tab */}
            <div
                className="items-center cursor-pointer flex flex-col"
                onClick={() => navigate("/message")}
            >
                <MessageIcon color={activeTab === "/message" ? "#3E9DFF" : "#94A3B8"} />
                <p className={activeTab === "/message" ? "text-[#3E9DFF]" : "text-[#94A3B8]"}>Message</p>
            </div>

            {/* Help Tab */}
            <div
                className="items-center cursor-pointer flex flex-col"
                onClick={() => navigate("/help")}
            >
                <HelpIcon color={activeTab === "/help" ? "#3E9DFF" : "#94A3B8"} />
                <p className={activeTab === "/help" ? "text-[#3E9DFF]" : "text-[#94A3B8]"}>Help</p>
            </div>
        </div>
    );
};

export default Footer;
