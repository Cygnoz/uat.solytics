import web from '../../../../assets/Icons/websiteIcon.png'
import file from '../../../../assets/Icons/fileIcon.png'
import text from '../../../../assets/Icons/TextIcon.png'
import { useState } from 'react';
import DataSources from './DataSources';

type Props = {}

function Q_A({ }: Props) {
    const [secondActiveTab, setSecondActiveTab] = useState("Website");

    return (
        <div>
            <div className="py-5">
                <h1 className="text-[18px] sm:text-[20px] text-[#1A243B] font-[700] text-center">
                    Data Sources
                </h1>
                <p className="text-[14px] sm:text-[16px] text-[#62697B] font-[400] text-center pb-2">
                    Add your data sources to train your chatbot
                </p>
                <div className="flex items-center justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center justify-center max-w-md sm:max-w-lg lg:max-w-4xl">
                        {/* Website Card */}
                        <div
                            className={`flex gap-2 items-start rounded-3xl p-5 cursor-pointer ${secondActiveTab === "Website" ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"}`}
                            onClick={() => setSecondActiveTab("Website")}
                        >
                            <div>
                                <img src={web} alt="Website Icon" className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[16px] sm:text-[18px] font-[700]">Website</p>
                                <p className="text-[12px] sm:text-[14px] font-[400]">
                                    Analyze content, build responses.
                                </p>
                            </div>
                        </div>

                        {/* File Card */}
                        <div
                            className={`flex gap-2 items-start rounded-3xl p-5 cursor-pointer ${secondActiveTab === "File" ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"}`}
                            onClick={() => setSecondActiveTab("File")}
                        >
                            <div>
                                <img src={file} alt="File Icon" className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[16px] sm:text-[18px] font-[700]">File</p>
                                <p className="text-[12px] sm:text-[14px] font-[400]">
                                    Analyze content, build responses.
                                </p>
                            </div>
                        </div>

                        {/* Text Card */}
                        <div
                            className={`flex gap-2 items-start rounded-3xl p-5 cursor-pointer ${secondActiveTab === "Text" ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"}`}
                            onClick={() => setSecondActiveTab("Text")}
                        >
                            <div>
                                <img src={text} alt="Text Icon" className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[16px] sm:text-[18px] font-[700]">Text</p>
                                <p className="text-[12px] sm:text-[14px] font-[400]">
                                    Analyze content, build responses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    {secondActiveTab === "Website" && <DataSources page="Website" />}
                    {secondActiveTab === "File" && <DataSources page="File" />}
                    {secondActiveTab === "Text" && <DataSources page="Text" />}
                </div>
            </div>
        </div>

    )
}

export default Q_A