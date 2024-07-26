"use client";
import BuySteps from "@components/batchBuy/BuySteps";
import WorkerWallets from "@components/batchBuy/WorkerWallets";
import { UserProvider } from "@context/UserContext";
import Footer from "@layout/Footer";
import Header from "@layout/Header";
import React, { useEffect, useState } from "react";
import { IoMdTrendingUp } from "react-icons/io";
import { Provider } from "react-redux";
import store from "src/redux/store";

function BatchSwap() {
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [allWallets, setAllWallets] = useState<any[]>([]);
  const [zeroBalanceWallets, setZeroWalletBalance] = useState<any[]>([]);
  const [value, setValue] = useState("All Wallets");

  return (
    <UserProvider>
      <Provider store={store}>
        <Header />
        <main >
          <div className="w-full h-[82rem] md:h-[90rem] lg:h-[51rem]  flex justify-center bg-secondary p-5 ">
            <div className="md:w-[60rem] h-[78rem] md:h-[82rem] lg:h-[45rem]  bg-bgBlack shadow-lg shadow-black rounded-xl border-gray-800 border  mt-5">
              <section className="flex items-center gap-3 border-b p-3 text-2xl font-semibold">
                <IoMdTrendingUp className="text-2xl" />
                <h1 className="text-xs md:text-lg">Batch Swap</h1>
              </section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-3 py-3">
                <WorkerWallets
                  selectedWallets={selectedWallets}
                  setSelectedWallets={setSelectedWallets}
                  allWallets={allWallets}
                  setAllWallets={setAllWallets}
                  setZeroWalletBalance={setZeroWalletBalance}
                  setValue={setValue}
                  value={value}
                />
                <BuySteps
                  selectedWallets={selectedWallets}
                  setSelectedWallets={setSelectedWallets}
                  allWallets={allWallets}
                  zeroBalanceWallets={zeroBalanceWallets}
                  setZeroWalletBalance={setZeroWalletBalance}
                  value={value}
                />
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </Provider>
    </UserProvider>
  );
}

export default BatchSwap;
