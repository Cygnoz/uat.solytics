import { useEffect, useState } from "react";
// import Upload from '../../assets/icons/Upload'
import { useNavigate } from "react-router-dom";
// import Star from '../../assets/icons/Star';

import { endpoints } from "../../Services/apiEndpoints";
import toast from "react-hot-toast";
import useApi from "../../Hooks/useApi";
import TextArea from "../../components/Form/TexArea";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import GoBackButton from "../../components/Ui/GoBackButton";
import OrganizationIcon from "../../assets/icons/OrganizationIcon";
import { useOrg } from "../../context/OrgContext";
import Select from "../../components/Form/Select";
import UploadInput from "../../components/Form/UploadInput";
import { socket } from "../../context/SocketContext";

// interface Message {
//     id: string;
//     content: string;
//     sender: 'agent' | 'visitor';
//     timestamp: string;
// }

// interface ChatMessage {
//     messages: Message[];
//     resolved?: boolean;
//     rating?: number;
// }

const TicketRise = () => {
  // const [rating, setRating] = useState<number>(0);
  // const [isResolved, setIsResolved] = useState<boolean | null>(null);
  // console.log(isResolved);

  const navigate = useNavigate();
  const { orgData } = useOrg();

  const { request: riseTicket } = useApi("post", 3004);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState({
    requester: orgData?.orgEmail || "",
    subject: "",
    description: "",
    choice: [{ label: "", value: "" }], // Can contain one or more objects
    uploads: [],
    text: [{ label: "", value: "" }], // Can contain one or more objects
  });
  const [moduleData, setModuleData] = useState([
    {
      name: "",
      values: [{ label: "", value: "" }],
    },
  ]);

  const ticketSubmit = async (e: any) => {
    e.preventDefault(); // Prevent default form submission
    const { description, subject } = ticketData;
    console.log("formData", ticketData);

    if (description || subject) {
      try {
        const { response, error } = await riseTicket(
          endpoints.UNASSIGNED_TICKET,
          ticketData
        );
        if (response && !error) {
          console.log("responseData", response.data);
          toast.success(response.data.message);
          // setTicketId(response.data.ticketId);
          navigate(`/ticket-view/${response.data.ticketId}`);
          setIsSubmitted(true); // Hide form on success
          socket.emit('AddUnAssignedTickets')
        } else {
          toast.error(error.response.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast("Please fill the description or subject");
    }
  };

  useEffect(() => {
    if (orgData?.ticket_fields?.choice?.length > 0) {
      const formattedData = orgData.ticket_fields.choice.map((field: any) => ({
        name: field.label,
        values: field.options.map((option: any) => ({
          label: option,
          value: option,
        })),
      }));
      setModuleData(formattedData);
    }
  }, [orgData]);

  const handleFileUpload = (base64: string | null) => {
    if (base64) {
      setTicketData((prev:any) => ({
        ...prev,
        uploads: [...prev.uploads, base64], // Append the new base64 string
      }));
    }
  };

  
 
  
  console.log("ticket",ticketData);
  

  return (
    <div className=" flex flex-col px-3 pb-2  relative">
      {/* Header Section - Fixed */}
      <GoBackButton />

      {/* Title and Description */}
      <div>
        <p className="text-center text-[#177BDA] text-2xl font-medium">
          Agent Chat
        </p>
        <p className="text-center my-2 text-[#919191] text-sm font-normal">
          Ask anything, anytime—seamless support is just a message away!
        </p>
      </div>
      <div className="p-4 flex-shrink-0">
        <div className="text-center">
          {/* <h2 className="text-[#177BDA] font-semibold text-2xl mb-2">Agent Chat</h2>
                    <p className="text-gray-500 text-sm mb-2">
                        Ask anything, anytime—seamless support is just a message away!
                    </p> */}
          <div className="flex items-center justify-center mt-3">
            <div className="relative z-10">
              <OrganizationIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Scrollable */}
      <div className="flex-grow  px-4 scrollbar-hide">
        {!isSubmitted && ( // Render form only when isSubmitted is false
          <form onSubmit={ticketSubmit}>
            <div className="bg-[#F3F9FF] p-4 rounded-3xl">
              <Input
                label="Subject"
                required
                name="subject"
                value={ticketData.subject}
                onChange={(e) =>
                  setTicketData((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="Subject"
              />

              <TextArea
                required
                label="Description"
                name="description"
                value={ticketData.description}
                onChange={(e) =>
                  setTicketData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
              />
              {orgData?.ticket_fields?.input?.length > 0 &&
                orgData.ticket_fields.input.map((field: any, index: any) => (
                  <Input
                    key={index}
                    label={field.label}
                    name={field.label}
                    value={
                      ticketData.text.find((item) => item.label === field.label)
                        ?.value || ""
                    }
                    onChange={(e) =>
                      setTicketData((prev) => {
                        const existingText = prev.text.find(
                          (item) => item.label === field.label
                        );
                        if (existingText) {
                          return {
                            ...prev,
                            text: prev.text.map((item) =>
                              item.label === field.label
                                ? { ...item, value: e.target.value }
                                : item
                            ),
                          };
                        } else {
                          return {
                            ...prev,
                            text: [
                              ...prev.text,
                              { label: field.label, value: e.target.value },
                            ],
                          };
                        }
                      })
                    }
                    placeholder={field.placeholder || "Enter text"}
                  />
                ))}

              {orgData?.ticket_fields?.choice?.length > 0 &&
                moduleData.map((module) => (
                  <Select
                    label={module.name}
                    placeholder="Select an option"
                    value={
                      ticketData.choice
                        .filter((m) => m.label === module.name)
                        .map((m) => m.value)[0] || ""
                    }
                    options={module.values}
                    onChange={(selectedValue) => {
                      setTicketData((prev) => {
                        const existingModule = prev.choice.find(
                          (m) => m.label === module.name
                        );
                        if (existingModule) {
                          return {
                            ...prev,
                            choice: prev.choice.map((m) =>
                              m.label === module.name
                                ? { label: module.name, value: selectedValue }
                                : m
                            ),
                          };
                        } else {
                          return {
                            ...prev,
                            choice: [
                              ...prev.choice,
                              { label: module.name, value: selectedValue },
                            ],
                          };
                        }
                      });
                    }}
                  />
                ))}
              {/* <label className="block text-[#495160]">Upload Attachment</label>
              <div className="border-2 mt-2 mb-3 border-dashed border-[#649DD6] rounded-lg p-4">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload />
                  <span className="text-sm text-gray-500">Upload File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.png,.zip"
                  />
                </label>
              </div>
              <p className="text-[#6D6D6D] mt-2">
                Only support .jpg, png, and zip files
              </p> */}
           {orgData?.ticket_fields?.uploading?.length > 0&&<>
            <label className="block text-[#495160]">Upload Attachment</label>
             {orgData?.ticket_fields?.uploading?.length > 0&&orgData.ticket_fields.uploading.map((upload:any)=>(
                
               <div className="mt-3">
                
                <UploadInput label={upload.label} onFileSelect={handleFileUpload}/>
               
               </div>
             ))}
              <p className="text-[#6D6D6D] mt-2">Only support .jpg,.png,.zip files</p>
           </>}
          

              {/* <div className="space-y-2 mt-4 bg-white p-4 rounded-2xl">
                                    <label className="block text-gray-600 mb-2">Select Options</label>
                                    {['1', '2', '3'].map((num) => (
                                        <label key={num} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="options"
                                                value={num}
                                                className="w-5 h-5"
                                            />
                                            <span className="text-gray-700">Option {num}</span>
                                        </label>
                                    ))}
                                </div> */}

              <div className="flex justify-end mt-4">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        )}

        {/* Chat Messages Section */}
      </div>
    </div>
  );
};

export default TicketRise;
