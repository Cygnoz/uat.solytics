import urlIcon from "../../../../assets/Icons/urlIcon.png"
import fileIcon from "../../../../assets/Icons/fileUploadIcon.png"
import textIcon from "../../../../assets/Icons/TextIcon.png"
import deleteIcon from "../../../../assets/Icons/deleteIcon.png"
import upload from "../../../../assets/Icons/uploadIcon.png"
import { Link } from "react-router-dom"

type Props = { page: string }

function DataSources({ page }: Props) {
    return (
        <div className="py-5 px-48">
            {
                page === 'Website' ? (
                    <div>
                        <div className="bg-[#FFFFFF] p-5 rounded-2xl">
                            <div className="flex gap-2">
                                <div className="">
                                    <img src={urlIcon} className="mt-2" alt="" />
                                </div>
                                <div className="">
                                    <p className="text-[#1A243B] text-[20px] font-[700]">
                                        Website Url

                                    </p>
                                    <p className="text-[#62697B] text-[15px] font-[500]">

                                        Paste website link here!!!
                                    </p>
                                </div>
                            </div>
                            <div className="flex py-3">
                                <input
                                    className="py-2 bg-[#F2F4F7] px-2 rounded-md w-full focus:outline-none"
                                    placeholder="https://www.expamle.com"
                                    type="text" />
                                <button className="bg-[#9747FF] text-white w-32 text-[14px] rounded-r-md">
                                    Fetch links
                                </button>
                            </div>
                            <div className="flex py-3">
                                <input
                                    className="py-2 bg-[#F2F4F7] px-2 rounded-md w-full focus:outline-none"

                                    placeholder="https://www.expamle.com"
                                    type="text" />
                                <button className="mx-3">
                                    <img src={deleteIcon} alt="" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-5 mt-5">
                            <button className="bg-[#FFFFFF] px-5 py-2 rounded-lg text-[#9747FF]">
                                Cancel
                            </button>
                            <Link to={"/playground"}>
                                <button className="bg-[#9747FF] px-5 py-2 rounded-lg text-white">
                                    Save & Next
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : null
            }
            {
                page === 'File' ? (
                    <div>
                        <div className="bg-[#FFFFFF] p-5 rounded-2xl">
                            <div className="flex gap-2">
                                <div className="">
                                    <img src={fileIcon} className="mt-2" alt="" />
                                </div>
                                <div className="">
                                    <p className="text-[#1A243B] text-[20px] font-[700]">
                                        File Upload
                                    </p>
                                    <p className="text-[#62697B] text-[15px] font-[500]">
                                        Uplaod file here!!!
                                    </p>
                                </div>
                            </div>
                            <label htmlFor="image">
                                <div className="flex flex-col items-center justify-center gap-4 px-2 py-5">
                                    <div className="w-full">
                                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition">
                                            <div className="flex gap-2">
                                                <img className="h-4 mt-0.5" src={upload} alt="" />
                                                <p className="text-sm text-gray-500 mb-1">Upload file</p>
                                            </div>
                                            <p className="text-xs text-gray-400">Maximum File Size: 1MB</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-4">Lorem Ipsum of content lorem</p>
                                </div>
                                <input
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    name="profile"
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-5 mt-5">
                            <button className="bg-[#FFFFFF] px-5 py-2 rounded-lg text-[#9747FF]">
                                Cancel
                            </button>
                            <Link to={"/playground"}>
                                <button className="bg-[#9747FF] px-5 py-2 rounded-lg text-white">
                                    Save & Next
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : null
            }
            {
                page === 'Text' ? (
                    <div>
                        <div className="bg-[#FFFFFF] p-5 rounded-2xl">
                            <div className="flex gap-2">
                                <div className="">
                                    <img src={textIcon} className="mt-2" alt="" />

                                </div>
                                <div className="">
                                    <p className="text-[#1A243B] text-[20px] font-[700]">
                                        Text
                                    </p>
                                    <p className="text-[#62697B] text-[15px] font-[500]">

                                        Enter text here!!!
                                    </p>
                                </div>
                            </div>

                            <div className="flex py-3">
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-5 focus:outline-none"
                                    placeholder="Enter text here"
                                    name=""
                                    id="">
                                </textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-5 mt-5">
                            <button className="bg-[#FFFFFF] px-5 py-2 rounded-lg text-[#9747FF]">
                                Cancel
                            </button>
                            <Link to={"/playground"}>
                                <button className="bg-[#9747FF] px-5 py-2 rounded-lg text-white">
                                    Save & Next
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default DataSources