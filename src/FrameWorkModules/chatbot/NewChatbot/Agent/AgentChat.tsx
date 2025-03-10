import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormPopup from './FormModal';
// import AddMore from '../../../../assets/FrameIcons/addMore.png';
import Text from '../../../../assets/FrameIcons/Text.png';
import Upload from '../../../../assets/FrameIcons/Upload.png';
import Upload2 from '../../../../assets/FrameIcons/Upload2.png';
import Choice from '../../../../assets/FrameIcons/Choice.png';
import Delete from '../../../../assets/FrameIcons/delete.png';
import { useChatbot, Field } from '../../../../context/ChatbotContext';


const AgentChat: React.FC = () => {
    const { chatbotData, updateChatbotData } = useChatbot();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [showTicketForm, setShowTicketForm] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);
    const [options, setOptions] = useState(["", ""]);
    // const [portNumber, setPortNumber] = useState('');
    const [fields, setFields] = useState<Field[]>([]);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [uplaodTrue, setUploadTrue] = useState(false);
    const [formErrors, setFormErrors] = useState({
        subject: false,
        description: false
    });
    const [currentField, setCurrentField] = useState<{
        title: string;
        content: string | File | string[];
    }>({ title: '', content: '' });

    const handleConfirm = () => {
        setIsModalOpen(false);
        // setShowTicketForm(true);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSubject = e.target.value;
        setSubject(newSubject);
        setFormErrors(prev => ({ ...prev, subject: false }));
        // Update context
        updateChatbotData({ ticketSubject: newSubject });
    };

    // When description changes
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        setFormErrors(prev => ({ ...prev, description: false }));
        // Update context
        updateChatbotData({ ticketDescription: newDescription });
    };

    const handleFieldAdd = () => {
        if (currentField.title) {
            const newField: Field = {
                type: selectedField as 'text' | 'choice',
                title: currentField.title,
                content: selectedField === 'choice' ? options : currentField.content
            };
            const updatedFields = [...fields, newField];
            setFields(updatedFields);
            // Update context
            updateChatbotData({ ticketFields: updatedFields });
            setSelectedField(null);
            setCurrentField({ title: '', content: '' });
            setOptions(["", ""]);
            setSelectedField(null);
        }
    };

    const handleUploadToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setUploadTrue(isChecked);
        updateChatbotData({ upload: true });
    }

    const handleRemoveField = (index: number) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
        // Update context
        updateChatbotData({ ticketFields: updatedFields });
    };;

    // const validateForm = () => {
    //     const errors = {
    //         subject: !subject.trim(),
    //         description: !description.trim()
    //     };
    //     setFormErrors(errors);
    //     return !errors.subject && !errors.description;
    // };

    const handleSaveAndNext = async () => {
        // if (!validateForm()) {
        //     return;
        // }
        try {


            // Format fields to match backend expectations
            const ticket_fields = {
                input: fields.filter(field => field.type === 'text').map(field => ({
                    title: field.title,
                    content: field.content,
                    type: "text"
                })),
                choice: fields.filter(field => field.type === 'choice').map(field => ({
                    title: field.title,
                    content: field.content,
                    type: "choice"
                }))
            }
            console.log(chatbotData,ticket_fields);
            

            // Prepare the complete payload to match backend schema
            // const frameworkData = {
            //     project_name: chatbotData.name,
            //     boat_name: chatbotData.name,
            //     boat_iframeurl: `http://localhost:5173/main/${chatbotData.name}/`,
            //     description: chatbotData.description,
            //     // port_number: 5001,
            //     ticket_fields: ticket_fields
            // };

            // console.log('Sending data to backend:', frameworkData);

            // // Send the data to your API
            // const response = await axiosInstance.authInstance(5001).post(
            //     endpoints.CREATE_FRAMEWORK,
            //     frameworkData
            // );

            // console.log('Response from backend:', response.data);

            // if (response.data) {
            //     updateChatbotData({ botUrl: frameworkData.boat_iframeurl });
            //     navigate('/playground');
            // }
            navigate('/playground');
        } catch (error) {
            console.error('Error creating framework:', error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center">
            <div className="w-full max-w-5xl mx-auto p-6">
                {/* {!showTicketForm ? (
                    <div className="flex flex-col gap-6">
                        <h2 className='text-lg text-[#1A243B] font-semibold'>
                            Port Number Collection
                        </h2>
                        <div className="relative mt-4">
                            <textarea
                                className="w-4/5 h-32 p-4 bg-white border-none rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-200 mx-auto block"
                                placeholder="Enter port number"
                                value={portNumber}
                                required
                                inputMode="numeric"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                    setPortNumber(value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-4 pr-4 mt-6">
                            <Link to="/dashboard">
                                <button className="px-8 py-3 text-[#9747FF] bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={`px-8 py-3 text-white rounded-xl transition-colors ${portNumber ? "bg-[#9747FF] hover:bg-[#8A3FEB]" : "bg-gray-300 cursor-not-allowed"
                                    }`}
                                disabled={!portNumber} // Disable button if portNumber is empty
                            >
                                Save & Next
                            </button>
                        </div>
                    </div>

                ) : ( */}
                <div>
                    <h2 className="text-xl font-semibold text-center text-[#1A243B]">
                        Create Ticket Request Form
                    </h2>
                    <p className="text-gray-500 text-center mt-2 mb-6">
                        Add your data sources to train your chatbot
                    </p>

                    <form className="bg-white w-full max-w-6xl p-6 rounded-2xl space-y-4">
                        <div>
                            <span className='text-[#495160]'>Subject</span>
                            <input
                                type="text"
                                placeholder="Enter subject"
                                value={subject}
                                onChange={handleSubjectChange}
                                className={`w-full px-4 py-2 mt-2 border rounded-3xl`}
                                disabled
                            />
                            {formErrors.subject && (
                                <p className="text-red-500 text-sm mt-1">Subject is required</p>
                            )}
                        </div>
                        <div>
                            <span className='text-[#495160]'>Description</span>
                            <input
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={handleDescriptionChange}
                                className={`w-full px-4 py-2 mt-2 border rounded-3xl `}
                                disabled
                            />
                            {formErrors.description && (
                                <p className="text-red-500 text-sm mt-1">Description is required</p>
                            )}
                        </div>

                        {/* <div className="flex items-center gap-3">
                            <button
                                className="flex items-center gap-2 text-[#1A243B] font-medium"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedField(null);
                                }}
                            >
                                <img className='w-6 h-6' src={AddMore} alt="" />
                                Add More
                            </button>
                        </div> */}
                        {/* Display added fields */}
                        {fields.length > 0 && (
                            <div className="mt-4 space-y-4">
                                <h3 className="font-medium text-[#1A243B]">Added Fields:</h3>
                                {fields.map((field, index) => (
                                    <div key={index} className="flex items-center justify-between p-1 ">
                                        {/* <div> */}

                                        {/* <p className="text-sm text-gray-500">Type: {field.type}</p> */}
                                        {field.type == 'text' && (
                                            <div className='w-full'>
                                                <p className="text-[#495160]">{field.title}</p>
                                                <input
                                                    type="text"
                                                    placeholder={typeof field.content === "string" ? field.content : JSON.stringify(field.content)}
                                                    disabled
                                                    className='w-full p-2 border rounded-3xl' />
                                            </div>
                                        )}
                                        {field.type == 'upload' && (
                                            <div>
                                                <p className="font-normal text-[#495160] mb-2">{field.title}</p>
                                                <button
                                                    className='p-2 px-8 flex items-center gap-2 bg-[#E7E7E7] rounded-2xl'
                                                >
                                                    <img className='w-5 h-5 opacity-50' src={Upload2} alt="" />
                                                    <span className="text-[#3d3939] text-base font-medium">
                                                        Upload file
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                        {field.type == 'choice' && (
                                            <div>
                                                <p className="font-normal text-[#495160] mb-2">{field.title}</p>
                                                {Array.isArray(field.content) && field.content.map((option, index) => (
                                                    <label key={index} className="flex items-center space-x-2 text-gray-700">
                                                        <input
                                                            type="radio"
                                                            name={field.title}
                                                            value={option}
                                                            className="w-4 h-4"
                                                            disabled
                                                        />
                                                        <span>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {/* </div> */}
                                        <button
                                            onClick={() => handleRemoveField(index)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <img className='w-5 h-5' src={Delete} alt="Remove" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-around mt-6 gap-4">
                            <button
                                className="bg-[#F6F6F6] px-8 py-3 w-full flex items-center justify-center gap-2 rounded-lg text-gray-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedField('text');
                                }}
                            >
                                <img className='w-10 h-10' src={Text} alt="Text Icon" />
                                <span className="text-base font-medium">Text</span>
                            </button>

                            <button
                                className="bg-[#F6F6F6] px-8 py-3 w-full flex items-center justify-center gap-2 rounded-lg text-gray-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedField('upload');
                                }}
                            >
                                <img className='w-10 h-10' src={Upload} alt="" />
                                <span className="text-base font-medium">Upload File</span>
                            </button>

                            <button
                                className="bg-[#F6F6F6] px-8 py-3 w-full flex items-center justify-center gap-2 rounded-lg text-gray-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedField('choice');
                                }}
                            >
                                <img className='w-10 h-10' src={Choice} alt="" />
                                <span className="text-base font-medium">Choice</span>
                            </button>
                        </div>

                        {selectedField === "text" && (
                            <>
                                <input
                                    className='w-full p-2 border rounded-3xl'
                                    type="text"
                                    placeholder='Title'
                                    value={currentField.title}
                                    onChange={(e) => setCurrentField(prev => ({ ...prev, title: e.target.value }))}
                                />
                                <input
                                    className='w-full p-2 border rounded-3xl'
                                    type="text"
                                    placeholder='placeholder'
                                    value={currentField.content as string}
                                    onChange={(e) => setCurrentField(prev => ({ ...prev, content: e.target.value }))}
                                />
                                <div className='flex justify-end gap-4 mt-6'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedField(null);
                                        }}
                                        className="px-6 py-2 text-[#9747FF] font-semibold bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFieldAdd();
                                        }}
                                        className="px-5 py-2 text-white bg-[#9747FF] hover:bg-[#8A3FEB] font-semibold rounded-lg"
                                    >
                                        Done
                                    </button>
                                </div>
                            </>
                        )}

                        {selectedField === "upload" && (
                            <>
                                {/* <input
                                    className='w-full p-2 border rounded-3xl'
                                    type="text"
                                    placeholder='Title'
                                    value={currentField.title}
                                    onChange={(e) => setCurrentField(prev => ({ ...prev, title: e.target.value }))}
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('fileUpload')?.click();
                                    }}
                                    className='p-2 px-8 flex items-center gap-2 bg-[#E7E7E7] rounded-2xl'
                                >
                                    <img className='w-5 h-5 opacity-50' src={Upload2} alt="" />
                                    <span className="text-[#818894] text-base font-medium">
                                        Upload file
                                    </span>
                                </button>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                /> */}

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="requiredField"
                                        name="requiredField"
                                        className="w-5 h-5 accent-[#9747FF] cursor-pointer"
                                        checked={uplaodTrue}
                                        onChange={handleUploadToggle}
                                    />
                                    <label htmlFor="requiredField" className="text-[#495160]">
                                        Add upload option
                                    </label>
                                </div>
                                <div className='flex justify-end gap-4 mt-6'>
                                    {/* <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedField(null);
                                            setUploadTrue(false);
                                        }}
                                        className="px-6 py-2 text-[#9747FF] font-semibold bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFieldAdd();
                                        }}
                                        className="px-5 py-2 text-white bg-[#9747FF] hover:bg-[#8A3FEB] font-semibold rounded-lg"
                                    >
                                        Done
                                    </button> */}
                                </div>
                            </>
                        )}

                        {selectedField === "choice" && (
                            <>
                                <input
                                    className='w-full p-2 border rounded-3xl'
                                    type="text"
                                    placeholder='Title'
                                    value={currentField.title}
                                    onChange={(e) => setCurrentField(prev => ({ ...prev, title: e.target.value }))}
                                />
                                <div className="space-y-2">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input type="radio" name="option" className="w-5 h-5" />
                                            <input
                                                type="text"
                                                value={option}
                                                className="flex-1 p-2 rounded-full border border-gray-300 outline-none"
                                                onChange={(e) => {
                                                    const newOptions = [...options];
                                                    newOptions[index] = e.target.value;
                                                    setOptions(newOptions);
                                                }}
                                            />
                                            <button onClick={() => removeOption(index)}>
                                                <img className='w-7 h-7' src={Delete} alt="" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addOption();
                                    }}
                                    className="mt-2 text-blue-500 hover:underline"
                                >
                                    + Add Option
                                </button>
                                <div className='flex justify-end gap-4 mt-6'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedField(null);
                                        }}
                                        className="px-6 py-2 text-[#9747FF] font-semibold bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFieldAdd();
                                        }}
                                        className="px-5 py-2 text-white bg-[#9747FF] hover:bg-[#8A3FEB] font-semibold rounded-lg"
                                    >
                                        Done
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                    <div className="flex justify-end gap-4 mt-6">
                        <button className="px-6 py-2 font-semibold text-[#9747FF] bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-lg">
                            Cancel
                        </button>

                        <button
                            className="px-6 py-2 font-semibold text-white bg-[#9747FF] hover:bg-[#8A3FEB] rounded-lg"
                            onClick={handleSaveAndNext}
                        >
                            Save & Next
                        </button>

                    </div>

                </div>
                {/* )} */}
            </div>

            {/* Modal Component */}
            <FormPopup
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
            />
        </div>

    );
};

export default AgentChat;