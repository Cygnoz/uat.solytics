import share from "../../../assets/Icons/share.png";
import frame from "../../../assets/Icons/copy-frame.png";
import visit from "../../../assets/Icons/visit.png";
import embedded2 from "../../../assets/Icons/embedded2.png";
type Props = { page: string }

function Connect({ page }: Props) {
  return (

    <div className="py-5 px-5 sm:px-10 lg:px-20 xl:px-48">
      {page === "embedded" ? (
        <div>
        <div className="bg-white rounded-2xl">
          <div >
            <div className=" p-4 mb-4 ">
              <div className="p-4 mb-4 flex place-items-center">
                <img className="h-8 mr-3" src={embedded2} alt="" />
                <div>
                  <h2 className="font-bold text-[#1A243B]">www.chatbot.com</h2>
                  <p className="text-[#62697B]">To add the chatbot anywhere on your website. add this frame to  your html code</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <pre className="text-sm text-[#687087] whitespace-pre-wrap break-all">
                  &lt;iframe src="https://www.chatbase.co/chatbot-iframe/Ye-esP28mgCaafv4kpnbl" width="100%" style="height:100%; min-height:700px"&gt;
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-4">
          <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1">
            <span className="text-[#24568B] text-sm">Copy Script</span>
            <img className="h-4" src={frame} alt="" />
          </button>
        </div>
        <div className="bg-white rounded-2xl mt-4">
        <div >
            <div className=" p-4 mb-4 ">
              <div className="p-4 mb-4 flex place-items-center">
                <img className="h-8 mr-3" src={embedded2} alt="" />
                <div>
                  <h2 className="font-bold text-[#1A243B]">www.chatbot.com</h2>
                  <p className="text-[#62697B]">To add the chatbot anywhere on your website. add this frame to  your html code</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <pre className="text-sm text-[#687087] whitespace-pre-wrap break-all">
                  &lt;script &gt;window.embeddedChatbotConfig = chatbotId: "Ye-esP28mgCaafv4kpnbI", domain: "www.chatbase.co"  &lt; /script&gt;  &lt;script &gt;src="https://www.chatbase.co/embed.min.js" chatbotId="Ye-esP28mgCaafv4kpnbI" domain="www.chatbase.co" defer &gt; &lt;/script&gt;
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1">
              <span className="text-[#24568B] text-sm">Copy Script</span>
              <img className="h-4" src={frame} alt="" />
            </button>
          </div>
      </div>
      ) : null}
      {page === "share" ? (
        <div>
          <div className="bg-white rounded-2xl">
            <div >
              <div className=" p-4 mb-4 ">
                <div className="p-4 mb-4 flex place-items-center">
                  <img className="h-8 mr-3" src={share} alt="" />
                  <div>
                    <h2 className="font-bold text-[#1A243B]">www.chatbot.com</h2>
                    <p className="text-[#62697B]">To add the chatbot anywhere on your website. add this frame to  your html code</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <pre className="text-sm text-[#687087] whitespace-pre-wrap break-all">
                    &lt;iframe src="https://www.chatbase.co/chatbot-iframe/Ye-esP28mgCaafv4kpnbl" width="100%" style="height:100%; min-height:700px"&gt;
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1">
              <span className="text-[#24568B] text-sm">Visit</span>
              <img className="h-4" src={visit} alt="" />
            </button>
            <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1">
              <span className="text-[#24568B] text-sm">Copy Frame</span>
              <img className="h-4" src={frame} alt="" />
            </button>
          </div>
        </div>


      ) : null}
      {page === "integration" ? (
        <div className="flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A243B] mt-10 mb-4">Coming Soon...</h1>
        </div>
      </div>
      
      ) : null}

    </div>
  )
}

export default Connect