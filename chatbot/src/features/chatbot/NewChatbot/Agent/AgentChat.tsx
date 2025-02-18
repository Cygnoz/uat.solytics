import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import FormPopup from './FormModal';
import AddMore from './../../../../assets/Icons/addMore.png'
import Text from './../../../../assets/Icons/Text.png'
import Upload from './../../../../assets/Icons/Upload.png'
import Upload2 from './../../../../assets/Icons/Upload2.png'
import Choice from './../../../../assets/Icons/Choice.png'
import Delete from './../../../../assets/Icons/delete.png'

const AgentChat: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);
    const [options, setOptions] = useState(["Option 1", "Option 2"]);

    // const addOption = () => {
    //     setOptions([...options, Option ${options.length + 1}]);
    // };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    }



    const handleConfirm = () => {
        setIsModalOpen(false);
        setShowTicketForm(true);
    };

    return (
        <div className=" min-h-screen flex justify-center">
            <div className=" w-full max-w-5xl mx-auto p-6">
                {!showTicketForm ? (
                    //Port Number Collection Section 
                    <div className="flex flex-col gap-6 ">
                        <h2 className='text-lg text-[#1A243B] font-semibold'>
                            Port Number Collection
                        </h2>

                        <div className="relative mt-4  ">
                            <textarea
                                className="w-4/5 h-32 p-4 bg-white border-none rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-200 mx-auto block"
                                placeholder="Enter"
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
                                className="px-8 py-3 text-white bg-[#9747FF] hover:bg-[#8A3FEB] rounded-xl transition-colors"
                            >
                                Save & Next
                            </button>
                        </div>
                    </div>
                ) : (
                    //Create Ticket Request Form 
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
                                    className="w-full px-4 py-2 mt-2 border rounded-3xl"
                                />
                            </div>
                            <div>
                                <span className='text-[#495160]'>Description</span>
                                <input
                                    type="text"
                                    placeholder="Enter description"
                                    className="w-full px-4 py-2 mt-2 border rounded-3xl"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 text-[#1A243B] font-medium">
                                    <img className='w-6 h-6' src={AddMore} alt="" />
                                    Add More
                                </button>
                            </div>

                            <div className="flex justify-around mt-6 gap-4">
                                <button
                                    className="bg-[#F6F6F6] px-8 py-3 w-full flex items-center justify-center gap-2 rounded-lg text-gray-700"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Text button clicked');
                                        setSelectedField('text');
                                    }}
                                >
                                    <img className='w-10 h-10' src={Text} alt="Text Icon" />
                                    <span className="text-base font-medium">Text</span>
                                </button>

                                <button className="bg-[#F6F6F6] px-8 py-3 w-full flex items-center justify-center gap-2 rounded-lg text-gray-700"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Text button clicked');
                                        setSelectedField('upload');
                                    }}
                                >
                                    <img className='w-10 h-10' src={Upload} alt="" />
                                    <span className="text-base font-medium"> Upload File</span>
                                </button>

                                <button className="bg-[#F6F6F6] px-8 py-3 w-full flex items-center justify-center gap-2 rounded-lg text-gray-700"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Text button clicked');
                                        setSelectedField('choice');
                                    }}
                                >
                                    <img className='w-10 h-10' src={Choice} alt="" />
                                    <span className="text-base font-medium"> Choice</span>
                                </button>
                            </div>
                            {selectedField === "text" && (
                                <>
                                    <input className='w-full p-2 border rounded-3xl'
                                        type="text"
                                        placeholder='Title'
                                    />
                                    <input className='w-full p-2 border rounded-3xl'
                                        type="text"
                                    />
                                    <div className='flex justify-end gap-4 mt-6'>
                                        <button className="px-6 py-2 text-[#9747FF] font-semibold bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors">
                                            Remove
                                        </button>
                                        <button className="px-5 py-2 text-white bg-[#9747FF] hover:bg-[#8A3FEB] font-semibold rounded-lg">
                                            Done
                                        </button>
                                    </div>
                                </>
                            )}
                            {selectedField === "upload" && (
                                <>
                                    <input className='w-full p-2 border rounded-3xl'
                                        type="text"
                                        placeholder='Title'
                                    />
                                    <button className='p-2 px-8 flex items-center gap-2 bg-[#E7E7E7] rounded-2xl'>
                                        <img className='w-5 h-5 opacity-50' src={Upload2} alt="" />
                                        <span className="text-[#818894] text-base font-medium"> Upload file</span>
                                    </button>
                                    {/* <input type="file" className="w-full p-2 border rounded" /> */}
                                    <div className='flex justify-end gap-4 mt-6'>
                                        <button className="px-6 py-2 text-[#9747FF] font-semibold bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors">
                                            Remove
                                        </button>
                                        <button className="px-5 py-2 text-white bg-[#9747FF] hover:bg-[#8A3FEB] font-semibold rounded-lg">
                                            Done
                                        </button>
                                    </div>
                                </>
                            )}
                            {selectedField === "choice" && (
                                <>
                                    <input className='w-full p-2 border rounded-3xl'
                                        type="text"
                                        placeholder='Title'
                                    />
                                    {/* Options List */}
                                    <div className="space-y-2">
                                        {options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                {/* Radio Button */}
                                                <input type="radio" name="option" className="w-5 h-5" />

                                                {/* Option Input */}
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

                                                {/* Delete Icon */}
                                                <button onClick={() => removeOption(index)}>
                                                    <img className='w-7 h-7' src={Delete} alt="" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        // onClick={addOption}
                                        className="mt-2 text-blue-500 hover:underline"
                                    >
                                        + Add Option
                                    </button>
                                    <div className='flex justify-end gap-4 mt-6'>
                                        <button className="px-6 py-2 text-[#9747FF] font-semibold bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 rounded-xl transition-colors">
                                            Remove
                                        </button>
                                        <button className="px-5 py-2 text-white bg-[#9747FF] hover:bg-[#8A3FEB] font-semibold rounded-lg">
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
                            <Link to={'/playground'}>
                            <button className="px-6 py-2 font-semibold text-white bg-[#9747FF] hover:bg-[#8A3FEB] rounded-lg">
                                Save & Next
                            </button>
                            </Link>
                        </div>

                    </div>
                )}
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