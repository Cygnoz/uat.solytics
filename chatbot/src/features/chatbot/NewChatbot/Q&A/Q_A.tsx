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
                <h1 className='text-[20px] text-[#1A243B] font-[700] text-center'>Data Sources</h1>
                <p className='text-[16px] text-[#62697B] font-[400] text-center pb-2'>Add your data sources to train your chatbot</p>
                <div className='flex items-center justify-center'>
                    <div className='grid grid-cols-3 gap-3 items-center justify-center'>
                        <div
                            className={`flex gap-2 rounded-3xl p-5 cursor-pointer ${secondActiveTab === "Website" ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"}`}
                            onClick={() => setSecondActiveTab("Website")}
                        >
                            <div>
                                <img src={web} alt="" />
                            </div>
                            <div>
                                <p className='text-[18px] font-[700]'>Website</p>
                                <p className='text-[14px] font-[400]'>Analyze content, build responses.</p>
                            </div>
                        </div>
                        <div
                            className={`flex gap-2 rounded-3xl p-5 cursor-pointer ${secondActiveTab === "File" ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"}`}
                            onClick={() => setSecondActiveTab("File")}
                        >
                            <div>
                                <img src={file} alt="" />
                            </div>
                            <div>
                                <p className='text-[18px] font-[700]'>File</p>
                                <p className='text-[14px] font-[400]'>Analyze content, build responses.</p>
                            </div>
                        </div>
                        <div
                            className={`flex gap-2 rounded-3xl p-5 cursor-pointer ${secondActiveTab === "Text" ? "bg-[#6229AB] text-[#F2F2F2]" : "bg-white"}`}
                            onClick={() => setSecondActiveTab("Text")}
                        >
                            <div>
                                <img src={text} alt="" />
                            </div>
                            <div>
                                <p className='text-[18px] font-[700]'>Text</p>
                                <p className='text-[14px] font-[400]'>Analyze content, build responses.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {secondActiveTab === "Website" ? (
                    <div>
                        <DataSources page='Website' />
                    </div>
                ) : null}
                {secondActiveTab === "File" ? (
                    <div>
                        <DataSources page='File' />
                    </div>
                ) : null}{secondActiveTab === "Text" ? (
                    <div>
                        <DataSources page='Text' />
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Q_A