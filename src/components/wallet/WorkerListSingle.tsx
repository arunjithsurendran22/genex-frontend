import React, { useState } from "react";
import TransferToWorker from "./components/TransferToWorker";
import TransferToMaster from "./components/TransferToMaster";
import SingleWalletTransactions from "./components/SingleWalletTransations";
import SingleWalletPayment from "./components/SingleWalletPayment";
import { WorkerListSingleProps } from "../../types/wallet";
import WalletDetails from "./components/WalletDetails";
import Footer from "@layout/Footer";

const WorkerListSingle: React.FC<WorkerListSingleProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<string>("transactions");

  return (
    <>
      <div className="bg-secondary p-5 md:p-10 ">
        <div className="container mx-auto bg-secondary">
          <WalletDetails id={id} />
          <div className="lg:flex gap-10 shadow-lg bg-bgBlack shadow-black rounded-3xl border-gray-800 border p-5 md:w-6/12 mt-5">
            <TransferToWorker id={id} />
            <TransferToMaster id={id} />
          </div>
        </div>
        <div className=" h-[38rem] container mx-auto">
          <div className="grid grid-cols-2 mx-auto items-center container mt-10 ">
            <div
              className={`py-2 px-1 w-full text-center text-md cursor-pointer ${
                activeTab === "transactions"
                  ? "border-b-4 rounded-bl-3xl border-primary text-[10px] font-semibold md:text-lg md:font-bold text-white"
                  : "border-b-4 rounded-bl-3xl border-gray-700 text-gray-400 text-[10px] md:text-lg"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </div>
            <div
              className={`py-2 px-1 w-full text-center cursor-pointer ${
                activeTab === "paymentHistory"
                  ? "border-b-4 rounded-br-3xl border-primary text-[10px] font-semibold md:text-lg md:font-bold text-white"
                  : "border-b-4 rounded-br-3xl border-gray-700 text-gray-400 text-[10px] md:text-lg"
              }`}
              onClick={() => setActiveTab("paymentHistory")}
            >
              Payment History
            </div>
          </div>

          <div className="mt-5 container mx-auto ">
            {activeTab === "transactions" && (
              <SingleWalletTransactions walletId={id} />
            )}
            {activeTab === "paymentHistory" && (
              <SingleWalletPayment walletId={id} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WorkerListSingle;
