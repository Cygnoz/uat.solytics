import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../../assets/icons/PlusIcon";
// import BotIcon from "../../assets/images/botIcon.png";
import Modal from "../../components/Modal/Modal";
import GoBackButton from "../../components/Ui/GoBackButton";
import { useResponse } from "../../context/ResponseContext";
import FeedBackModal from "../Agent/FeedBackModal";
import { endpoints } from "../../Services/apiEndpoints";
import useApi from "../../Hooks/useApi";
import { useOrg } from "../../context/OrgContext";
import AgentIcon from "../../assets/icons/AgentIcon";
import NoRecords from "../../components/Ui/NoRecords";
import SearchBar from "../../components/Ui/SearchBar";
import { SkeletonCard } from "../../components/Skeltons/MessagesSkelton";
import Star from "../../assets/icons/Star";
import { socket } from "../../context/SocketContext";


const Messages = () => {
  const navigate = useNavigate();
  const { request: getClientHis } = useApi("get", 3004);
  const [isModal, setIsModal] = useState(false);
  const {setFeedBackDetails}=useResponse()
  const handleModalToggle = (agentId?:string,clientId?:string,ticketId?:string) => {
    setFeedBackDetails({
      supportAgentId:agentId || "",
      customerId:clientId || "",
      ticketId:ticketId||""
    })
    setIsModal((prev) => !prev);
  };
  useEffect(()=>{
    if(!isModal){
      getClientHistory()
    }
  },[isModal])

  const [searchValue, setSearchValue] = useState<any>("");

  const { orgData } = useOrg();
  const { loading, setLoading,setTicketStatus } = useResponse();
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const status = [
    { label: "Open", color: "#60A5FA" }, // Blue (Indicates a new issue)
    { label: "Resolved", color: "#A78BFA" }, // Violet (Indicates resolution)
    { label: "In progress", color: "#FACC15" }, // Yellow (Indicates work in progress)
    { label: "Closed", color: "#34D399" } // Green (Indicates finalization)
];
  // const messages = [
  //   {
  //     id: 1,
  //     name: "Salena John",
  //     avatar: "/api/placeholder/40/40",
  //     status: "In Progress",
  //     message: "Your monthly sales report is ready! Let me know if you'd like a breakdown or additional data.",
  //     time: "1h Ago",
  //     notifications: 3
  //   },
  //   {
  //     id: 2,
  //     name: "Peter Rachal",
  //     avatar: "/api/placeholder/40/40",
  //     status: "Resolved",
  //     message: "Your monthly sales report is ready! Let me know if you'd like a breakdown or additional data.",
  //     time: "1h Ago",
  //     notifications: 3
  //   },
  //   {
  //     id: 3,
  //     name: "Chat Bot",
  //     avatar: "/api/placeholder/40/40",
  //     message: "Hi there! Your latest report is ready for review.",
  //     time: "17m Ago",
  //     notifications: 1
  //   },
  //   {
  //     id: 4,
  //     name: "Peter Rachal",
  //     avatar: "/api/placeholder/40/40",
  //     status: "In Progress",
  //     message: "Your monthly sales report is ready! Let me know if you'd like a breakdown or additional data.",
  //     time: "1h Ago",
  //     notifications: 3
  //   }
  // ];

  // const getClientHistory=async()=>{
  //   try{
  //     const {response,error}=await getClientHis(`${endpoints.CHATS_LEAD}/${orgData?.email}`)
  //     if(response &&!error){
  //       console.log("res",response.data);
  //     }else{
  //       console.log("er",error)
  //     }
  //   }catch(err){
  //     console.log("err",err);

  //   }
  // }

  const getClientHistory = async () => {
    try {
      setLoading(true); // Start loading before the API call
  
      const { response, error } = await getClientHis(
        `${endpoints.CHATS_LEAD}/${orgData?.email}`
      );
  
      if (error) {
        console.error("Error in API response:", error?.response?.data || error);
        setAllTickets([]);
        return;
      }
  
      if (response?.data?.data?.length) {
        const ticketDetailsArray = response.data.data
          .filter((history: any) => history?.ticketDetails !== null)
          .sort(
            (a: any, b: any) =>
              new Date(b.ticketDetails.updatedAt).getTime() -
              new Date(a.ticketDetails.updatedAt).getTime()
          )
          .map((history: any) => history.ticketDetails); // 🔑 Extract only ticketDetails
  
        console.log("Filtered Ticket Details:", ticketDetailsArray);
        setAllTickets(ticketDetailsArray);
      } else {
        console.log("No chat history found.");
        setAllTickets([]);
      }
    } catch (err) {
      console.error("Error fetching client history:", err);
      setAllTickets([]);
    } finally {
      setLoading(false); // End loading after everything
    }
  };
  
  
  

  const filteredTickets = allTickets.filter(
    (ticket) =>
      ticket?.subject?.toLowerCase().includes(searchValue.toLowerCase()) ||
      ticket?.status?.toLowerCase().includes(searchValue.toLowerCase()) ||
      ticket?.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
   if(orgData?.email){
    getClientHistory();
   }
    setTicketStatus("")
    socket.on("getCustomerHistory", (customerHis) => {
      if (customerHis?.data?.length > 0) {
        const ticketDetailsArray = customerHis?.data
          .filter((history: any) => history?.ticketDetails !== null)
          .sort(
            (a: any, b: any) =>
              new Date(b.ticketDetails.updatedAt).getTime() -
              new Date(a.ticketDetails.updatedAt).getTime()
          )
          .map((history: any) => history.ticketDetails); // 🔑 Extract only ticketDetails
    
        console.log("Filtered Ticket Details:", ticketDetailsArray);
        
        setAllTickets(ticketDetailsArray);
      } else {
        console.log("No chat history found.");
        setAllTickets([]);
      }
    });
     
  }, [orgData]);
  console.log("org",orgData);

  return (
    <>
      <div className=" px-3 pb-4 relative">
        {/* Header */}
        <GoBackButton />
        <div>
          <div>
            <p className="mb-2 text-[#177BDA] text-2xl font-medium">Messages</p>
            <p className="text-[#919191] text-sm font-normal">
              View and manage all your messages, updates, and notifications
              here.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              onSearchChange={setSearchValue}
              searchValue={searchValue}
              placeholder="Search Messages/Tickets"
            />
          </div>
        </div>
        <div className="pt-3">
          {/* Messages List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredTickets?.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
              {" "}
              {/* Scrollable container */}
              {filteredTickets.map((ticket) => (
                <div
                  onClick={() => {
                    setTicketStatus(ticket?.status)
                    navigate(`/ticket-view/${ticket?._id}`)
                }}
                  key={ticket._id}
                  className="p-4 mb-3 h-auto cursor-pointer bg-[#F3F9FF] rounded-2xl gap-6"
                >
                  
                  <div className="flex items-start gap-3">
                    <AgentIcon
                      agentImg={ticket?.supportAgentId?.user?.userImage || ""}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#0F2A43] font-medium">
                          {ticket?.subject}
                        </span>
                        <span className="text-sm text-[#0F2A43] font-medium">{ticket?.ticketId}</span>
                        <span className="text-xs text-gray-400">{`${new Date(
                          ticket?.updatedAt
                        ).toLocaleDateString()} ${new Date(
                          ticket?.updatedAt
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}`}</span>
                      </div>

                      {ticket.status && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-2xl"
                          style={{
                            backgroundColor:
                              status.find(
                                (s) =>
                                  s.label.toLowerCase() ===
                                  ticket.status.toLowerCase()
                              )?.color || "#B1D9AC",
                            color: "#3A3A3A",
                          }}
                        >
                          {ticket.status}
                        </span>
                      )}
                      <div className="grid grid-cols-1 w-full">
                        <p className="text-[#A19999] text-sm mt-1 w-full whitespace-normal break-words overflow-hidden">
                          {ticket?.description}
                        </p>
                      </div>

                      {ticket.status == "Resolved" && (
                        <div className="flex justify-center items-center mt-2">
                          <div onClick={(e)=>{
                            handleModalToggle(ticket?.supportAgentId?.user?._id,ticket?.customerId?._id,ticket?._id)
                            e.stopPropagation()
                          }} className="text-sm font-medium ms-auto px-2 py-1 rounded-lg text-white flex gap-2 items-center bg-gray-800">
                            <p>Add Feedback</p><Star filled color="yellow" size={14}/>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* {ticket.notifications && (
                      <span className="bg-[#B8DAFE] text-blue-500 text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {ticket.notifications}
                      </span>
                    )} */}
                   {ticket?.unreadMessagesCount>0&&<div className="h-5 w-5  rounded-full top-1 right-2 bg-red-600 text-white flex items-center justify-center">
                <p className="text-xs font-semibold">{ticket?.unreadMessagesCount}</p>
              </div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoRecords parentHeight="450px" />
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => navigate("/agent-chat")}
            className="fixed cursor-pointer right-4 bottom-28 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      <Modal isOutsideClose={false} open={isModal} onClose={handleModalToggle}>
        <FeedBackModal onClose={handleModalToggle} />
      </Modal>
    </>
  );
};

export default Messages;
