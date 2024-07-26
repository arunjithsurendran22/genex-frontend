import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { workerWalletSingle } from "@services/wallet";
import { WalletData } from "../../../types/wallet";

interface WalletDetailsProps {
  id: string | null;
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ id }) => {
  const [walletDetails, setWalletDetails] = useState<WalletData | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [showCopiedNotification, setShowCopiedNotification] =
    useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    setLoader(true);

    try {
      const walletId = Array.isArray(id) ? id[0] : id;
      const response = await workerWalletSingle(walletId);
      console.log("Response wallet details", response);

      setWalletDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch wallet details:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 3000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleHover = (key: string) => {
    setHoveredItem(key);
  };

  const clearHover = () => {
    setHoveredItem(null);
  };

  const UserWalletDetails = {
    email: walletDetails?.user?.email ?? "N/A",
    balance: walletDetails?.balance?.toString() ?? "N/A",
    wallet_name: walletDetails?.name ?? "N/A",
    contract_token: walletDetails?.contract_token ?? "N/A",
    public_key: walletDetails?.public_key ?? "N/A",
    created: formatDate(walletDetails?.createdAt) ?? "N/A",
  };

  const MasterWalletDetails = {
    Id: walletDetails?.master_wallet?._id ?? "N/A",
    balance: walletDetails?.master_wallet?.balance?.toString() ?? "N/A",
    masterPublickey: walletDetails?.master_wallet?.public_key ?? "N/A",
    updated: formatDate(walletDetails?.master_wallet?.updatedAt) ?? "N/A",
  };

  return (
    <div className="p-3 bg-bgBlack shadow-lg shadow-black rounded-3xl border-gray-800 border">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        {/* User Wallet Details */}
        <div className="w-full md:w-6/12">
          <h2 className="md:text-xl text-cyan mb-5">Wallet Details</h2>
          <div className="text-gray-600 lowercase">
            {Object.entries(UserWalletDetails).map(([key, value], index) => (
              <div key={index} className="flex items-center my-2">
                <p className="text-xs md:text-sm text-gray-600 w-32">{key}</p>
                <div
                  className="w-44 md:w-full overflow-hidden flex justify-between items-center ml-2 flex-grow bg-neutral-800 py-1 px-3 rounded-md"
                  onMouseEnter={() => handleHover(key)}
                  onMouseLeave={clearHover}
                >
                  <span className="text-[10px] md:text-[1rem] text-gray-400">
                    {(key === "public_key" ||
                      key === "wallet_name" ||
                      key === "contract_token") &&
                    hoveredItem === key
                      ? value
                      : truncateText(value, key === "wallet_name" ? 22 : 25)}
                  </span>
                  {(key === "public_key" ||
                    key === "wallet_name" ||
                    key === "balance") &&
                    value && (
                      <FiCopy
                        className="ml-2 cursor-pointer text-xs md:text-lg text-gray-400"
                        onClick={() => handleCopy(value)}
                      />
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Wallet Details */}
        <div className="w-full md:w-6/12">
          <h2 className="md:text-xl text-cyan mb-5">Master Wallet Details</h2>
          <div className="text-gray-600 lowercase">
            {Object.entries(MasterWalletDetails).map(([key, value], index) => (
              <div key={index} className="flex items-center my-2">
                <p className="text-xs md:text-sm text-gray-600 w-32">{key}</p>
                <div
                  className="w-44 md:w-full overflow-hidden flex justify-between items-center ml-2 flex-grow bg-neutral-800 py-1 px-3 rounded-md"
                  onMouseEnter={() => handleHover(key)}
                  onMouseLeave={clearHover}
                >
                  <span className="text-[10px] md:text-[1rem] text-gray-400">
                    {(key === "masterPublickey" || key === "wallet_name") &&
                    hoveredItem === key
                      ? value
                      : truncateText(
                          value,
                          key === "masterPublickey" ? 22 : 25
                        )}
                  </span>
                  {key === "public_key" ||
                    (key === "masterPublickey" && value && (
                      <FiCopy
                        className="ml-2 cursor-pointer text-xs md:text-lg text-gray-400"
                        onClick={() => handleCopy(value)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      {showCopiedNotification && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-secondary text-white text-center p-2 w-20 text-xs rounded-full">
          Copied!
        </div>
      )}
    </div>
  );
};

export default WalletDetails;
