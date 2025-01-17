import profile from '../../assets/Icons/billieProfile.png'
import refresh from '../../assets/Icons/refeshIcon.png'
import dot from '../../assets/Icons/3dotIcon.png'
import uplaod from '../../assets/Icons/VectorIcon.png'
import send from '../../assets/Icons/SendIcon.png'
import theme from '../../assets/Icons/colorThemeIcon.png'
import WhiteMode from '../../assets/Images/WhiteTheme.png'
import DarkMode from '../../assets/Images/darkTheme.png'
import SoftBlue from '../../assets/Images/SoftBlue.png'
import back from '../../assets/Icons/backIcon.png'

import { Box, Modal } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type Props = {}

function Playground({ }: Props) {
    const [open, setOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState("WhiteTheme"); // Active theme
    const [selectedTheme, setSelectedTheme] = useState("WhiteTheme"); // Temporary selected theme

    const handleThemeChange = (event: any) => {
        setSelectedTheme(event.target.value); // Update the temporary state
        console.log("Selected Theme:", event.target.value);
    };

    const handleSave = () => {
        setActiveTheme(selectedTheme); // Confirm and set the active theme
        setOpen(false); // Close the dialog (if applicable)
        console.log("Active Theme Saved:", selectedTheme);
    };

    return (
        <div className="bg-[#F2F4F7] pb-5">
            <div className="px-10 py-3 flex gap-2">
                <Link to={"/addchatbot"}>
                    <img src={back} className='w-7 h-7  mt-0.5' alt="" />
                </Link>
                <div>
                    <h1 className="text-[18px]  text-[#1A243B] font-[700]">
                        Playground
                    </h1>
                    <p className="text-[14px] text-[#62697B] font-[400] py-2">
                        A place to experiment with your chatbot configurations and see them in action.
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="bg-[#FFFFFF] rounded-xl  sm:w-[780px]  py-5 w-[500px] flex justify-center">
                    <div>
                        <div className="w-[300px] sm:w-[400px] shadow-lg border border-[#F2F4F7] rounded-xl">
                            <div className="bg-[#9747FF] rounded-t-xl flex justify-between w-full px-5 py-3">
                                <div className='flex gap-2'>
                                    <div className="bg-[white] w-10 h-10 rounded-full p-1">
                                        <img src={profile} className='pt-1' alt="" />
                                    </div>
                                    <div className="mt-1">
                                        <h1 className='text-[#FFFFFF] text-[13px] font-[400]'>
                                            Billie Bot
                                        </h1>
                                        <p className='text-[#FFFFFF] flex gap-1 text-[9px] font-[400]'>
                                            <div className='bg-[#3FE054] w-2 h-2 mt-[3px] rounded-full'></div>
                                            We are Online!!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 py-3">
                                    <button>
                                        <img src={refresh} className='h-5' alt="" />
                                    </button>
                                    <button>
                                        <img src={dot} className='h-4 mt-0.5' alt="" />
                                    </button>
                                </div>
                            </div>
                            <div className={`px-6 pb-[60%] ${activeTheme === "WhiteTheme"
                                ? "bg-white"
                                : activeTheme === "DarkTheme"
                                    ? "bg-[#000000]"
                                    : "bg-[#D5DBED]"
                                }`}>
                                <div className="w-[80%]">
                                    <div className="flex gap-1 pt-3">
                                        <div className="border border-2-[#F2F4F7] w-5 bg-white rounded-full p-1">
                                            <img src={profile} alt="" />
                                        </div>
                                        <p
                                            className={`text-[7px] pt-1 font-[600] ${activeTheme === "WhiteTheme"
                                                ? "text-[#62697B]"
                                                : activeTheme === "DarkTheme"
                                                    ? "text-white"
                                                    : "text-black"
                                                }`}
                                        >Billie Bot</p>
                                    </div>
                                    <div
                                        className={` rounded-2xl p-1 mt-1 ${activeTheme === "WhiteTheme"
                                            ? "text-[#1A243B] border border-2-[#F2F4F7]"
                                            : activeTheme === "DarkTheme"
                                                ? "bg-[#4D4D4D] text-white"
                                                : "bg-[#B5C0D0] text-[#1A243B] border border-2-[#F2F4F7]"
                                            }`}>
                                        <p className=' text-[10px] px-2 font-[400]'>How can I assist you ?</p>
                                    </div>
                                    <div className="text-end">
                                        <p
                                            className={`text-[7px] py-0.5 ${activeTheme === "SoftBlue"
                                                ? "text-[#7b7272]"
                                                : " text-[#c2c3c4]"
                                                }`}>Today 11:42</p>
                                    </div>
                                </div>

                            </div>
                            <div
                                className={` flex justify-between px-4 py-5 rounded-b-xl ${activeTheme === "WhiteTheme"
                                    ? "bg-[#FAFAFA] "
                                    : activeTheme === "DarkTheme"
                                        ? "bg-[#4D4D4D] "
                                        : "bg-[#B5C0D0] "
                                    }`}>
                                <div className="flex gap-2">
                                    <button>
                                        <img src={uplaod} className='h-4 w-3' alt="" />
                                    </button>
                                    <input type="text"
                                        className={` w-[100%] px-2 text-[9px]  border-none outline-none ${activeTheme === "WhiteTheme"
                                            ? "bg-[#FAFAFA] "
                                            : activeTheme === "DarkTheme"
                                                ? "bg-[#4D4D4D] text-white"
                                                : "bg-[#B5C0D0] text-black"
                                            }`}
                                        placeholder='Enter Your Message Here.....' />
                                </div>
                                <div className="">
                                    <button className=''>
                                        <img src={send} className='h-4' alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='flex -me-16  justify-end '>
                            <button onClick={() => setOpen(true)}>
                                <img src={theme} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box className="p-6 flex justify-center items-center">
                    <div className="w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] bg-[#FFFFFF] rounded-2xl shadow-lg p-6 sm:p-8">
                        <h1 className="text-[#1A243B] text-[16px] font-[600]">Select Theme</h1>
                        <p className="text-[#62697B] text-[12px] font-[400]">
                            Choose your preferred color theme for the chatbot interface.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
                            <div
                                className={`rounded-lg border  ${selectedTheme === "WhiteTheme" ? " border-[#177BDA] " : "border-[#00000036]"} cursor-pointer`}
                                onClick={() => setSelectedTheme("WhiteTheme")}
                            >
                                <div className="bg-[#F0F0F0] rounded-lg p-5 flex justify-center">
                                    <img src={WhiteMode} alt="White Theme" />
                                </div>
                                <div className="px-3 py-2 flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        value="WhiteTheme"
                                        onChange={handleThemeChange}
                                        checked={selectedTheme === "WhiteTheme"}
                                        style={{ transform: "scale(1.2)" }}
                                    />
                                    <p className="text-[14px] text-[#495160] font-[600]">White Theme</p>
                                </div>
                            </div>
                            <div
                                className={`rounded-lg border  ${selectedTheme === "DarkTheme" ? " border-[#177BDA] " : "border-[#00000036]"} cursor-pointer`}
                                onClick={() => setSelectedTheme("DarkTheme")}
                            >
                                <div className="bg-[#F0F0F0] rounded-lg p-5 flex justify-center">
                                    <img src={DarkMode} alt="Dark Theme" />
                                </div>
                                <div className="px-3 py-2 flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        value="DarkTheme"
                                        onChange={handleThemeChange}
                                        checked={selectedTheme === "DarkTheme"}
                                        style={{ transform: "scale(1.2)" }}
                                    />
                                    <p className="text-[14px] text-[#495160] font-[600]">Dark Theme</p>
                                </div>
                            </div>
                            <div
                                className={`rounded-lg border  ${selectedTheme === "SoftBlue" ? " border-[#177BDA] " : "border-[#00000036]"} cursor-pointer`}
                                onClick={() => setSelectedTheme("SoftBlue")}
                            >
                                <div className="bg-[#F0F0F0] rounded-lg p-5 flex justify-center">
                                    <img src={SoftBlue} alt="Soft Blue Theme" />
                                </div>
                                <div className="px-3 py-2 flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        value="SoftBlue"
                                        onChange={handleThemeChange}
                                        checked={selectedTheme === "SoftBlue"}
                                        style={{ transform: "scale(1.2)" }}
                                    />
                                    <p className="text-[14px] text-[#495160] font-[600]">Soft Blue</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                className="bg-[#F6EEFF] rounded-lg px-6 sm:px-8 py-2 text-[#9747FF]"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#9747FF] rounded-lg text-white px-6 sm:px-8 py-2"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>


        </div>
    )
}

export default Playground