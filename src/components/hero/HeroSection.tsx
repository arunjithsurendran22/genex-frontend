"use client";

import Projects from "@components/projects/Projects";
import TransactionHistory from "@components/trasations/TransactionHistory";
import WorkerWalletList from "@components/wallet/WorkerWalletList";
import React, { useState } from "react";

function HeroSection() {
  const [activeComponent, setActiveComponent] = useState("Project");


  return (
    <div className="bg-primary ">
      <div className="bg-secondary  rounded-t-3xl shadow-2xl shadow-black h-[42rem] ">
        {activeComponent !== "BatchBuy" && (
          <div className="grid grid-cols-3 mt-1 md:w-8/12 mx-auto items-center">
            <div
              className={`py-2 px-1 w-full text-center text-md cursor-pointer ${
                activeComponent === "Project"
                   ? "border-b-4 rounded-bl-3xl  border-primary text-[10px] font-semibold md:text-lg md:font-bold text-white"
                  : "border-b-4 rounded-bl-3xl border-gray-700 text-gray-400 text-[10px] md:text-lg"
              }`}
              onClick={() => setActiveComponent("Project")}
            >
              Project
            </div>
            <div
              className={`py-2 px-1 w-full text-center cursor-pointer ${
                activeComponent === "Wallet"
                   ? "border-b-4  border-primary text-[10px] font-semibold md:text-lg md:font-bold text-white"
                  : "border-b-4  border-gray-700 text-gray-400 text-[10px] md:text-lg"
              }`}
              onClick={() => setActiveComponent("Wallet")}
            >
              Wallet
            </div>
            <div
              className={`py-2 px-1 w-full text-center cursor-pointer ${
                activeComponent === "TransactionHistory"
                  ? "border-b-4 rounded-br-3xl border-primary text-[10px] font-semibold md:text-lg md:font-bold text-white"
                  : "border-b-4 rounded-br-3xl border-gray-700 text-gray-400 text-[10px] md:text-lg"
              }`}
              onClick={() => setActiveComponent("TransactionHistory")}
            >
              Transaction History
            </div>
          </div>
        )}

        <div className="mt-2">
          {activeComponent === "Project" && <Projects />}
          {activeComponent === "Wallet" && <WorkerWalletList />}
          {activeComponent === "TransactionHistory" && <TransactionHistory />}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
