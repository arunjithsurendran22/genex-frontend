import React, { useState } from "react";
import QRCode from "qrcode.react";
import { FaHeadset } from "react-icons/fa6";
import Input from "@common/Input";
import { useUser } from "@context/UserContext";

const Deposite = () => {
  const { masterWallet } = useUser();
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  const handleCopy = async (textToCopy: any) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Text copied to clipboard:", textToCopy);
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className=" rounded-3xl bg-bgBlack w-auto md:w-96">
      <div className="flex flex-col items-center">
        <div className="bg-white  rounded-3xl mb-4">
          {masterWallet?.public_key ? (
            <QRCode
              value={masterWallet.public_key}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
              className="rounded-3xl"
            />
          ) : (
            <img
              className="max-h-[200px] max-w-[200px]"
              src="https://imgs.search.brave.com/d4TTkNroCjaXk0_ZtcTeg50yAI15LlOgXbrYS5ydqME/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cucG5nYWxsLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMi9RUi1Db2RlLnBuZw"
              alt="Deposit QR"
            />
          )}
        </div>
        <div className="w-full">
          <label className="block text-gray-400 mb-2">Public Key:</label>
          <Input
            value={masterWallet?.public_key || ""}
            onCopy={() => handleCopy(masterWallet?.public_key || "")}
            showCopiedNotification={showCopiedNotification}
          />
        </div>
        <p className="mt-4 text-gray-400 text-xs text-center">
          Solana is required for the fees on Genex. Amount deposited on Genex
          master wallet is secured by industry standard safety measures. Please
          don&apos;t send other tokens. In some cases, recovery might not be
          possible. Contact us for more info - support@genex.com
        </p>
        <div className="flex gap-1 cursor-pointer items-center text-center justify-center text-xs text-neutral-500 mt-5">
          <FaHeadset />
          <p>Support</p>
        </div>
      </div>
      {showCopiedNotification && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-secondary text-white text-center p-2 w-20 text-xs rounded-full">
          Copied!
        </div>
      )}
    </div>
  );
};

export default Deposite;
