import { useState } from "react"

type Props = {}

const HelpPage = ({ }: Props) => {
    const tabs = ["All", "Get Started", "Sales", "Billing", "Purchase"]
    const [activeTab, setActiveTab] = useState("All")
    return (
        <div className="flex pt-10 justify-center">
            <div className="bg-white rounded-t-lg w-[500px] h-[700px] p-5 shadow-2xl overflow-hidden">
                <div className="flex justify-end">
                    <p className="text-3xl cursor-pointer -mt-3 text-[#177BDA]">&times;</p>
                </div>
                <div className="px-4">
                    <div>
                        <p className="mb-2 text-[#177BDA] text-2xl font-medium">Help</p>
                        <p className="text-[#919191] text-sm font-normal">Explore guides, FAQs, and get quick assistance from our AI for any questions or issues.</p>

                    </div>
                    <div className="rounded-4xl border border-[#D3D3D3] w-[425px] h-11 my-4">
                        <p className="py-2 ms-9 text-[#BCBDBE] text-base font-normal">Search Messages</p>
                    </div>

                    <div className="flex justify-between my-4">
                        {/* <div className="bg-[#D7E2EE] w-fit h-fit p-2 rounded-lg">
                        <p>All</p>
                    </div>
                    <div className="bg-[#D7E2EE] w-fit h-fit p-2 rounded-lg">
                        <p>Get Started</p>
                    </div>
                    <div className="bg-[#D7E2EE] w-fit h-fit p-2 rounded-lg">
                        <p>Sales</p>
                    </div>
                    <div className="bg-[#D7E2EE] w-fit h-fit p-2 rounded-lg">
                        <p>Billing</p>
                    </div>
                    <div className="bg-[#D7E2EE] w-fit h-fit p-2 rounded-lg">
                        <p>Purchase</p>
                    </div> */}
                        <div className="flex rounded-xl gap-2 py-2 text-sm">
                            {tabs.map((tab) => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`cursor-pointer py-2 px-[16px] ${activeTab === tab
                                        ? "text-[#0177F2] text-sm font-medium bg-[#A8D3FD] rounded-md"
                                        : "bg-[#D7E2EE] text-[#A8B0B8] font-medium rounded-md"
                                        }`}
                                >
                                    {tab}
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="bg-[#F3F9FF] p-2 rounded-2xl my-4 text-center">
                        <p className="text-[#0F2A43] text-lg font-medium">I can't access my report, what should I do?</p>
                        <p className="text-[#A19999] text-sm font-normal">"Ensure you have the necessary permissions for the report.</p>
                    </div>
                    <div className="bg-[#F3F9FF] p-2 rounded-2xl my-4 text-center">
                        <p className="text-[#0F2A43] text-lg font-medium">Why isn't my payment processing?</p>
                        <p className="text-[#A19999] text-sm font-normal">Check if your payment gateway is connected properly or if there are any errors in the payment details</p>
                    </div>
                    <div className="bg-[#F3F9FF] p-2 rounded-2xl my-4 text-center">
                        <p className="text-[#0F2A43] text-lg font-medium">How do I add a new employee?</p>
                        <p className="text-[#A19999] text-sm font-normal">Navigate to the 'HR' section, click 'Add Employee,' enter the employee's personal and job details, and then click 'Save.'</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelpPage