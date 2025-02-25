import { useState } from "react";
import share from "../../../assets/FrameIcons/share.png";
import frame from "../../../assets/FrameIcons/copy-frame.png";
import visit from "../../../assets/FrameIcons/visit.png";
import embedded2 from "../../../assets/FrameIcons/embedded2.png";

type Props = {
  page: string;
  botUrl?: string;
};

function Connect({ page, botUrl }: Props) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Function to copy text to clipboard
  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(message);
        setTimeout(() => setCopySuccess(null), 1500); // Reset message after 2 sec
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const iframeCode = `<iframe src="${botUrl}" width="100%" style="height:100%; min-height:700px"></iframe>`;

  const scriptCode = `<script>
  window.embeddedChatbotConfig = { chatbotId: "Ye-esP28mgCaafv4kpnbI", domain: "www.chatbase.co" };
  </script>
  <script src="https://www.chatbase.co/embed.min.js" chatbotId="Ye-esP28mgCaafv4kpnbI" domain="www.chatbase.co" defer></script>`;

  const shareIframeCode = `<iframe src="https://www.chatbase.co/chatbot-iframe/Ye-esP28mgCaafv4kpnbl" width="100%" style="height:100%; min-height:700px"></iframe>`;

  return (
    <div className="py-5 px-5 sm:px-10 lg:px-20 xl:px-48">
      {page === "embedded" && (
        <div>
          {/* First Iframe Code Block */}
          <div className="bg-white rounded-2xl">
            <div className="p-4 mb-4">
              <div className="p-4 mb-4 flex place-items-center">
                <img className="h-8 mr-3" src={embedded2} alt="Embedded" />
                <div>
                  <h2 className="font-bold text-[#1A243B]">www.chatbot.com</h2>
                  <p className="text-[#62697B]">
                    To add the chatbot anywhere on your website, add this frame to your HTML code.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <pre className="text-sm text-[#687087] break-all">{iframeCode}</pre>
              </div>
            </div>
          </div>
          {/* Copy Button */}
          <div className="flex justify-end items-center space-x-4">
            <button
              className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1"
              onClick={() => handleCopy(iframeCode, "Iframe copied!")}
            >
              <span className="text-[#24568B] text-sm">Copy Frame</span>
              <img className="h-4" src={frame} alt="Copy" />
            </button>
          </div>

          {/* Script Code Block */}
          <div className="bg-white rounded-2xl mt-4">
            <div className="p-4 mb-4">
              <div className="p-4 mb-4 flex place-items-center">
                <img className="h-8 mr-3" src={embedded2} alt="Embedded" />
                <div>
                  <h2 className="font-bold text-[#1A243B]">www.chatbot.com</h2>
                  <p className="text-[#62697B]">
                    To add the chatbot anywhere on your website, add this script to your HTML code.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <pre className="text-sm text-[#687087] break-all">{scriptCode}</pre>
              </div>
            </div>
          </div>
          {/* Copy Script Button */}
          <div className="flex justify-end items-center space-x-4">
            <button
              className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1"
              onClick={() => handleCopy(scriptCode, "Script copied!")}
            >
              <span className="text-[#24568B] text-sm">Copy Script</span>
              <img className="h-4" src={frame} alt="Copy" />
            </button>
          </div>
        </div>
      )}

      {page === "share" && (
        <div>
          <div className="bg-white rounded-2xl">
            <div className="p-4 mb-4">
              <div className="p-4 mb-4 flex place-items-center">
                <img className="h-8 mr-3" src={share} alt="Share" />
                <div>
                  <h2 className="font-bold text-[#1A243B]">www.chatbot.com</h2>
                  <p className="text-[#62697B]">
                    To share the chatbot, use this frame in your HTML code.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <pre className="text-sm text-[#687087] break-all">{shareIframeCode}</pre>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1">
              <span className="text-[#24568B] text-sm">Visit</span>
              <img className="h-4" src={visit} alt="Visit" />
            </button>
            <button
              className="flex items-center space-x-2 bg-white rounded-lg px-4 py-1"
              onClick={() => handleCopy(shareIframeCode, "Iframe copied!")}
            >
              <span className="text-[#24568B] text-sm">Copy Frame</span>
              <img className="h-4" src={frame} alt="Copy" />
            </button>
          </div>
        </div>
      )}

      {page === "integration" && (
        <div className="flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1A243B] mt-10 mb-4">Coming Soon...</h1>
          </div>
        </div>
      )}

      {/* Copy Success Message */}
      {copySuccess && (
        <div className="fixed bottom-5 right-5 text-[#24568B] font-normal transition-opacity duration-300 ease-in-out">
          {copySuccess}
        </div>
      )}
    </div>
  );
}

export default Connect;
