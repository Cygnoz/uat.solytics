import { useState } from "react";
import Star from "../../assets/icons/Star";
import toast from "react-hot-toast";
import TextArea from "../../components/Form/TexArea";
import Button from "../../components/Form/Button";
import useApi from "../../Hooks/useApi";
import { endpoints } from "../../Services/apiEndpoints";
import { useResponse } from "../../context/ResponseContext";
import { useNavigate } from "react-router-dom";
import { socket } from "../../context/SocketContext";

type Props = {
  onClose: () => void;
};

function FeedBackModal({ onClose }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const {request:addFeedback}=useApi('post',3004)
 const {feebBackDetails}=useResponse()
 const [isResolved,setIsResolved]=useState(false)
 const navigate=useNavigate()
  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, star: number) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const isHalf = x < width / 2;
    setHover(isHalf ? star - 0.5 : star);
  };

  const handleSubmit=async ()=>{
    // toast.success("Your rating has been recorded")
    // onClose()
    const body={
      supportAgentId:feebBackDetails.supportAgentId,
      customerId:feebBackDetails.customerId,
      ticketId:feebBackDetails?.ticketId,
      feedback,
      starCount:rating
    }

    console.log("Body",body);
    
    
    try{
      const {response,error}=await addFeedback(endpoints.ADD_FEEDBACK,body)
      if(response && !error){
        toast.success(response.data.message)
        onClose()
        socket.emit("AddUnAssignedTickets")
      }else{
        toast.error(error.response.data.message)
      }
    }catch(err){
      console.log("Errr",err);
      
    }
  }

  console.log("fe",feebBackDetails);
  

  return (
  <>
  <div className="p-6 bg-white shadow-lg rounded-xl  mx-auto relative">
   {!isResolved? 
    <>
    {/* <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center max-h-[94vh] overflow-auto"> */}
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Is your problem resolved?
                </h2>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-2">
                        {/* <button
                            className="px-6 py-2 bg-purple-100 text-purple-600 font-semibold rounded-lg hover:bg-purple-200"
                            onClick={()=>{
                              navigate(`/ticketView/${feebBackDetails?.ticketId}`)
                               toast.success("You can contact with our agent")
                            }}
                        >
                            No
                        </button> */}
                        <Button variant="tertiary" onClick={()=>{
                              navigate(`/ticket-view/${feebBackDetails?.ticketId}`)
                               toast.success("You can contact with our agent")
                            }} className="w-16 flex justify-center">
                      <p>No</p>
                    </Button>
                    <Button onClick={()=>setIsResolved(true)} className="w-16 flex justify-center">
                      <p>Yes</p>
                    </Button>
                </div>
            {/* </div> */}
            </>
      :
      <>
        <p className="text-xl font-semibold text-center mb-4">How would you rate this agent?</p>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="cursor-pointer relative transition-transform duration-200 hover:scale-110"
              onMouseMove={(event) => handleMouseMove(event, star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleRating(hover ?? star)}
            >
              <Star
                color="#FFCC00"
                size={35}
                isHalf={(hover ?? rating) === star - 0.5}
                filled={(hover ?? rating) >= star}
                index={star}
              />
            </div>
          ))}
        </div>
        <TextArea
    name="feedback"
    value={feedback}
    onChange={(e) => setFeedback(e.target.value)}
    placeholder="Write your feedback here..."
  />
        {/* <button
          onClick={handleSubmit}
          className="bg-[#177BDA] cursor-pointer text-white w-full py-3 rounded-lg mt-4 font-medium transition duration-200 hover:bg-[#125a9f] active:scale-95"
        >
          Submit
        </button> */}
        <Button className="w-full flex justify-center items-center mt-3" onClick={handleSubmit}>
          <p>Submit</p>
        </Button>
        </>}
        </div>
  </>
  );
}

export default FeedBackModal;
