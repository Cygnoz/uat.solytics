
type Props = {};

const SendMessage = ({ }: Props) => {
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  // const [selectedSales, setSelectedSales] = useState<string | null>(null);
  // const [selectedTimePeriod, setSelectedTimePeriod] = useState<string | null>(null);
  // const {orgData}=useOrg()
  // const resetAllStates = () => {
  //   setSelectedOption(null);
  //   setSelectedInsight(null);
  //   setSelectedSales(null);
  //   setSelectedTimePeriod(null);
  // };



  return (

//       <div className=" px-3 pb-2">
//         {/* Header */}
//   <GoBackButton />



//         {/* Title and Description */}
//         <div>
//           <p className="text-center text-[#177BDA] text-2xl font-medium">Billie</p>
//           <p className="text-center my-2 text-[#919191] text-sm font-normal">
//             Ask anything, anytime—seamless support is just a message away!
//           </p>
//         </div>

//         {/* Profile FrameImages */}
//         <div className="flex -space-x-2 justify-center p-12">
//           <img className="w-9 h-9" src={profile} alt="Profile" />
//           <img className="w-9 h-9" src={profile} alt="Profile" />
//         </div>


//         <div className="flex items-center gap-2 ms-4 mb-6">
//           <img className="w-8 h-8 rounded-full" src={profile} alt="Bot" />
//           <div className="bg-[#F2F2F2] px-4 py-2 rounded-lg w-fit max-w-xs shadow">
//             <p className="text-[#1B4A77] text-lg font-normal">How can I assist you?</p>
//           </div>
//         </div>


//         <div
//   className={`grid ${orgData?.insight ? 'grid-cols-2' : 'grid-cols-1'} gap-6 px-4`}
// >
//   <div
//     className="bg-cover bg-center bg-no-repeat h-[220px] rounded-lg p-4 relative justify-center"
//     style={{ backgroundImage: `url(${assistBg})`, minHeight: '100px' }}
//   >
//     <div>
//       <StarVectorIcon />
//     </div>
//     <p className="py-6 text-[#01182A] text-lg font-medium">Billie Assist</p>
//     <p className="mb-4 text-[#1A4B7E] text-xs font-normal">
//       Activate support to access help, guides, and personalized assistance.
//     </p>
//     <div
//       className="bg-[#FFFFFF] rounded-sm mt-4 p-1 flex justify-center cursor-pointer"
//       onClick={() => setSelectedOption("Billie Assist")}
//     >
//       <button className="text-[#177BDA] text-sm font-medium">Let's go</button>
//     </div>
//   </div>

//   {orgData?.insight && (
//     <div
//       className="bg-cover bg-center bg-no-repeat h-[220px] rounded-lg p-4 relative justify-center"
//       style={{ backgroundImage: `url(${insightBg})`, minHeight: '100px' }}
//     >
//       <div>
//         <BulbIcon />
//       </div>
//       <p className="py-7 text-[#01182A] text-lg font-medium">Billie Insight</p>
//       <p className="mb-4 text-[#1A4B7E] text-xs font-normal">
//         Activate support to access help, guides, and personalized assistance.
//       </p>
//       <div
//         className="bg-[#FFFFFF] rounded-sm mt-4 p-1 cursor-pointer flex justify-center"
//         onClick={() => setSelectedOption("Billie Insight")}
//       >
//         <button className="text-[#177BDA] text-sm font-medium">Let's go</button>
//       </div>
//     </div>
//   )}
// </div>



//         {/* Add a 100px height space only when no option is selected */}
//         {!selectedOption && <div className="h-[170px]"></div>}

//         {/* Render the selected content when an option is chosen */}
//         {selectedOption && (
//           <div>
//             <div className="flex justify-end mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Visitor 11:05 AM</p>
//             </div>
//             <div className="flex items-center justify-end mb-4">
//               <div className="bg-[#A1D1FF] flex items-center gap-2 px-4 py-2 rounded-lg shadow-md">
//                 {selectedOption === "Billie Assist" ? <StarVectorIcon /> : <BulbIcon />}
//                 <p className="font-semibold">{selectedOption}</p>
//               </div>
//               <img className="w-8 h-8 ml-2 rounded-full" src={profile} alt="User" />
//             </div>
//           </div>
//         )}

//         {/* Rest of the code for selected states */}
//         {selectedOption && (
//           <div>
//             <div className="flex items-center mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Billie 11:05 AM</p>
//             </div>
//             <div className="flex gap-2 ms-4 mb-2">
//               <img className="w-8 h-8 rounded-full" src={profile} alt="Bot" />
//               <div className="bg-[#F2F2F2] px-4 py-2 rounded-lg w-fit max-w-xs shadow">
//                 <p>Great! I can provide insights into sales & products. What would you like to explore?</p>
//               </div>
//             </div>
//             <div className="mt-4 flex gap-4 ms-14">
//               <button
//                 className={`flex gap-1 p-2 rounded-lg cursor-pointer ${selectedInsight === "Sales Insights" ? 'bg-[#90C8FF] text-white' : 'bg-[#D1E1F1] text-gray-800'}`}
//                 onClick={() => setSelectedInsight("Sales Insights")}
//               >
//                 <div><SalesIcon /></div>
//                 Sales Insights
//               </button>
//               <button
//                 className={`flex gap-1 p-2 rounded-lg cursor-pointer ${selectedInsight === "Products Insights" ? 'bg-[#90C8FF] text-white' : 'bg-[#D1E1F1] text-gray-800'}`}
//                 onClick={() => setSelectedInsight("Products Insights")}
//               >
//                 <div><ProductInsightIcon /></div>
//                 Product Insights
//               </button>
//             </div>
//             <div className="mt-2 flex gap-4 ms-14">
//               <button
//                 className={`flex gap-1 p-2 rounded-lg cursor-pointer ${selectedOption === null ? 'bg-[#90C8FF] text-white' : 'bg-[#D1E1F1] text-gray-800'}`}
//                 onClick={() => setSelectedOption(null)}
//               >
//                 <div><GoBackIcon /></div>
//                 Go Back
//               </button>
//               <button
//                 className={`flex gap-1 p-2 rounded-lg cursor-pointer ${selectedOption === 'mainMenu' ? 'bg-[#90C8FF] text-white' : 'bg-[#D1E1F1] text-gray-800'}`}
//                 onClick={resetAllStates}
//               >
//                 <div><MainMenuIcon /></div>
//                 Go to main menu
//               </button>
//             </div>
//           </div>
//         )}
//         {selectedInsight && (
//           <div>
//             <div className="flex justify-end mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Visitor 11:05 AM</p>
//             </div>
//             <div className="flex items-center justify-end mb-4">
//               <div className="bg-[#A1D1FF] flex items-center gap-2 px-4 py-2 rounded-lg shadow-md">
//                 {selectedInsight === "Sales Insights" ? <SalesIcon /> : <ProductInsightIcon />}
//                 <p className="font-semibold">{selectedInsight}</p>
//               </div>
//               <img className="w-8 h-8 ml-2 rounded-full" src={profile} alt="User" />
//             </div>
//           </div>
//         )}


//         {selectedInsight && (
//           <div>
//             <div className="mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Billie 11:05 AM</p>
//             </div>
//             <div className="flex gap-2 ms-4 mb-2">
//               <img className="w-8 h-8 rounded-full" src={profile} alt="Bot" />
//               <div className="bg-[#F2F2F2] px-4 py-2 rounded-lg w-fit max-w-xs shadow">
//                 <p className="mb-3">
//                   What would you like to explore in product insights?
//                 </p>
//                 {/* Stack buttons vertically */}
//                 <div className="flex flex-col gap-2">
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedSales === "Total Sales"
//                         ? "bg-[#90C8FF] text-white"
//                         : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedSales("Total Sales")}
//                   >
//                     <div>
//                       <TotalSalesIcon />
//                     </div>
//                     Total Sales
//                   </button>
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedSales === "Comparison"
//                         ? "bg-[#90C8FF] text-white"
//                         : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedSales("Comparison")}
//                   >
//                     <div>
//                       <Comparison />
//                     </div>
//                     Comparison
//                   </button>
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedSales === "Sales Performance Trend"
//                         ? "bg-[#90C8FF] text-white"
//                         : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedSales("Sales Performance Trend")}
//                   >
//                     <div>
//                       <ProductInsightIcon />
//                     </div>
//                     Sales Performance Trend
//                   </button>
//                   <div className="flex gap-2">
//                     <button
//                       className="bg-[#D1E1F1] flex gap-1 p-2 rounded-lg cursor-pointer"
//                       onClick={() => setSelectedInsight(null)}
//                     >
//                       <div>
//                         <GoBackIcon />
//                       </div>
//                       Go Back
//                     </button>
//                     <button
//                       className="bg-[#D1E1F1] flex gap-1 p-2 rounded-lg cursor-pointer"
//                       onClick={resetAllStates}
//                     >
//                       <div>
//                         <MainMenuIcon />
//                       </div>
//                       Go to main menu
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {selectedSales && (
//           <div>
//             <div className="flex justify-end mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Visitor 11:05 AM</p>
//             </div>
//             <div className="flex items-center justify-end mb-4">
//               <div className="bg-[#A1D1FF] flex items-center gap-2 px-4 py-2 rounded-lg shadow-md">
//                 {selectedSales === "Total Sales" ? (
//                   <TotalSalesIcon />
//                 ) : selectedSales === "Comparison" ? (
//                   <Comparison />
//                 ) : selectedSales === "Sales Performance Trend" ? (
//                   <ProductInsightIcon />
//                 ) : null}
//                 <p className="font-semibold">{selectedSales}</p>
//               </div>
//               <img className="w-8 h-8 ml-2 rounded-full" src={profile} alt="User" />
//             </div>
//           </div>
//         )}


//         {selectedSales && (
//           <div>
//             <div className="mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Billie 11:05 AM</p>
//             </div>
//             <div className="flex gap-2 ms-4 mb-2">
//               <img className="w-8 h-8 rounded-full" src={profile} alt="Bot" />
//               <div className="bg-[#F2F2F2] px-4 py-2 rounded-lg w-fit max-w-xs shadow">
//                 <p className="mb-3">
//                   Please select a time period
//                 </p>
//                 {/* Two rows of time period buttons */}
//                 <div className="flex gap-2 my-2">
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedTimePeriod === "Day Wise Sale"
//                       ? "bg-[#90C8FF] text-white"
//                       : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedTimePeriod("Day Wise Sale")}
//                   >
//                     <div>
//                       <DayWiseIcon />
//                     </div>
//                     Day Wise Sale
//                   </button>
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedTimePeriod === "Monthly Sale"
//                       ? "bg-[#90C8FF] text-white"
//                       : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedTimePeriod("Monthly Sale")}
//                   >
//                     <div>
//                       <MonthlyWiseIcon />
//                     </div>
//                     Monthly Sale
//                   </button>
//                 </div>
//                 <div className="flex gap-2 mb-2">
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedTimePeriod === "Yearly Sale"
//                       ? "bg-[#90C8FF] text-white"
//                       : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedTimePeriod("Yearly Sale")}
//                   >
//                     <div>
//                       <YearlySaleIcon />
//                     </div>
//                     Yearly Sale
//                   </button>
//                   <button
//                     className={`flex gap-1 p-2 rounded-lg cursor-pointer w-fit ${selectedTimePeriod === "Quarterly Sale"
//                       ? "bg-[#90C8FF] text-white"
//                       : "bg-[#D1E1F1] text-gray-800"
//                       }`}
//                     onClick={() => setSelectedTimePeriod("Quarterly Sale")}
//                   >
//                     <div>
//                       <QuarterlySaleIcon />
//                     </div>
//                     Quarterly Sale
//                   </button>
//                 </div>
//                 <div className="flex gap-2 mb-2">
//                   <button
//                     className="bg-[#D1E1F1] flex gap-1 p-2 rounded-lg cursor-pointer"
//                     onClick={() => setSelectedSales(null)}
//                   >
//                     <div>
//                       <GoBackIcon />
//                     </div>
//                     Go Back
//                   </button>
//                   <button
//                     className="bg-[#D1E1F1] flex gap-1 p-2 rounded-lg cursor-pointer"
//                     onClick={resetAllStates}
//                   >
//                     <div>
//                       <MainMenuIcon />
//                     </div>
//                     Go to main menu
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {selectedTimePeriod && (
//           <div>
//             <div className="flex justify-end mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Visitor 11:05 AM</p>
//             </div>
//             <div className="flex items-center justify-end mb-4">
//               <div className="bg-[#A1D1FF] flex items-center gap-2 px-4 py-2 rounded-lg shadow-md">
//                 {selectedTimePeriod === "Day Wise Sale" ? (
//                   <DayWiseIcon />
//                 ) : selectedTimePeriod === "Monthly Sale" ? (
//                   <MonthlyWiseIcon />
//                 ) : selectedTimePeriod === "Yearly Sale" ? (
//                   <YearlySaleIcon />
//                 ) : selectedTimePeriod === "Quarterly Sale" ? (
//                   <QuarterlySaleIcon />
//                 ) : null}
//                 <p className="font-semibold">{selectedTimePeriod}</p>
//               </div>
//               <img className="w-8 h-8 ml-2 rounded-full" src={profile} alt="User" />
//             </div>
//           </div>
//         )}

//         {selectedTimePeriod && (
//           <div>
//             <div className="mt-4 mb-2 px-6">
//               <p className="text-gray-500 text-sm">Billie 11:05 AM</p>
//             </div>
//             <div className="flex gap-2 ms-4 mb-2">
//               <img className="w-8 h-8 rounded-full" src={profile} alt="Bot" />
//               <div className="bg-[#F2F2F2] px-4 py-2 rounded-lg w-fit max-w-xs shadow">
//                 <p className="mb-3">
//                   Please select a time period
//                 </p>
//                 <div className="flex gap-2 my-2">
//                   <input
//                     className="bg-[#D1E1F1] text-gray-800 px-4 py-2 rounded-lg cursor-pointer w-fit"
//                     type="date"
//                   />
//                 </div>
//                 <div className="flex gap-2 mb-2">
//                   <button
//                     className="bg-[#D1E1F1] flex gap-1 p-2 rounded-lg cursor-pointer"
//                     onClick={() => setSelectedTimePeriod(null)}
//                   >
//                     <div>
//                       <GoBackIcon />
//                     </div>
//                     Go Back
//                   </button>
//                   <button
//                     className="bg-[#D1E1F1] flex gap-1 p-2 rounded-lg cursor-pointer"
//                     onClick={resetAllStates}
//                   >
//                     <div>
//                       <MainMenuIcon />
//                     </div>
//                     Go to main menu
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}


//         {selectedTimePeriod && (
//           <div className="bg-cover bg-center bg-no-repeat w-56 h-[160px] rounded-lg p-4 ms-auto my-8"
//             style={{ backgroundImage: `url(${todaysalesBg})`, minHeight: '100px' }}>

//             <div>
//               <p className="text-[#0D5192] text-base font-normal">Today's Sales</p>
//               <div>
//                 <TodaysalesIcon size={60} />
//               </div>
//               <p className="text-[#023D7A] text-2xl font-bold">&#8377; 45655678</p>
//             </div>
//           </div>
//         )
//         }

//       </div>

<div className=" flex justify-center items-center h-[70vh]">
<div className="flex flex-col items-center text-center text-gray-700">
  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
     Bot is under development it will be available soon.
  </h1>
  {/* <h2 className="text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
    Please wait a moment
  </h2> */}
  
  <div className="dots-loading mt-2">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
</div>

  );
};

export default SendMessage;
