"use client";
import Loader from "@common/Loader";
import BatchBuyWalletList from "@components/wallet/BatchBuyWalletList";
import { useUser } from "@context/UserContext";
import { batchBuy } from "@services/batchBuy";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoMdRefresh } from "react-icons/io";

const generateBatchOptions = (totalLength: any) => {
  const batchOptions = [];
  const batchSize = Math.ceil(totalLength / 5);

  for (let i = batchSize; i < totalLength; i += batchSize) {
    batchOptions.push(i);
  }
  batchOptions.push(totalLength); // Ensure the last option is the total length

  return batchOptions;
};

interface WorkerWalletsProps {
  selectedWallets: string[];
  setSelectedWallets: React.Dispatch<React.SetStateAction<string[]>>;
  allWallets: any[];
  setAllWallets: React.Dispatch<React.SetStateAction<any[]>>;
  setZeroWalletBalance: React.Dispatch<React.SetStateAction<any[]>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

function WorkerWallets({
  selectedWallets,
  setSelectedWallets,
  allWallets,
  setAllWallets,
  setZeroWalletBalance,
  setValue,
  value,
}: WorkerWalletsProps) {
  const { masterWalletId } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const [walletLoading, setWalletLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState<number>(0); // Default skip value
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [walletCount, setWalletCount] = useState<number>(0);

  useEffect(() => {
    workedWalletList();
  }, [skip, masterWalletId]);

  const workedWalletList = async (refresh = false) => {
    const limit = 10;
    if (!hasMore && !refresh) return;
    setWalletLoading(true);
    setLoadingMore(true);
    try {
      const params = {
        limit: limit,
        skip: refresh ? 0 : skip, // Reset skip if refreshing
      };
      if (masterWalletId) {
        const response: any = await batchBuy(masterWalletId, params);
        if (response) {
          setWalletCount(response.data.totalWallet);
          setAllWallets((prevWallets) =>
            refresh
              ? response.data.getWorkerWallets
              : [...prevWallets, ...response.data.getWorkerWallets]
          );
          setSelectedWallets((prevWallets) =>
            refresh
              ? response.data.getWorkerWallets.map((wallet: any) => wallet._id)
              : [
                  ...prevWallets,
                  ...response.data.getWorkerWallets.map(
                    (wallet: any) => wallet._id
                  ),
                ]
          );
          setHasMore(response.data.getWorkerWallets.length === limit);
        }
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
      setAllWallets([]);
    } finally {
      setWalletLoading(false);
      setLoadingMore(false);
      if (refresh) setSkip(0); // Reset skip if refreshing
    }
  };

  const onRefresh = () => {
    workedWalletList(true);
  };

  //   Infinite scroll functions
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (!walletLoading && hasMore) {
          setSkip((prevSkip) => prevSkip + 1);
        }
      }
    }
  }, [walletLoading, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const debouncedHandleScroll = debounce(handleScroll, 200); // Debounce the scroll event
      container.addEventListener("scroll", debouncedHandleScroll);
      return () =>
        container.removeEventListener("scroll", debouncedHandleScroll);
    }
  }, [handleScroll]);

  // Debounce function to limit the rate at which handleScroll is called
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleWalletSelection = (walletName: string) => {
    // Find the wallet object in allWallets array based on name
    const wallet = allWallets.find((wallet) => wallet.name === walletName);
    if (wallet) {
      const walletId = wallet._id;
      setSelectedWallets((prevSelectedWallets) => {
        if (prevSelectedWallets.includes(walletId)) {
          // Wallet is already selected, so deselect it
          return prevSelectedWallets.filter((id) => id !== walletId);
        } else {
          // Wallet is not selected, so select it
          return [...prevSelectedWallets, walletId];
        }
      });
    } else {
      console.log(`Wallet with name '${walletName}' not found in allWallets.`);
    }
  };

  useEffect(() => {
    const zeroBalance = selectedWallets
      .map((walletId) => allWallets.find((wallet) => wallet._id === walletId))
      .filter((wallet) => wallet && parseFloat(wallet.balance) <= 0.001);
    setZeroWalletBalance(zeroBalance);
  }, [selectedWallets, allWallets]);

  const handleSelectChange = (e: any) => {
    const value = e.target.value;

    if (value === "Selected Wallets") {
      setSelectedWallets(allWallets.map((wallet) => wallet._id));
    } else if (value === "Wallets Selected") {
      setSelectedWallets([]);
    } else {
      const selectedIndexes = [];

      for (let i = 0; i < value; i++) {
        if (allWallets[i]) selectedIndexes.push(allWallets[i]._id);
      }

      setSelectedWallets(selectedIndexes);
    }

    setValue(value);
  };

  const batchOptions = generateBatchOptions(allWallets.length);

  const handleSelectBalance = () => {
    const selectedWalletIds = allWallets
      .filter((wallet) => parseFloat(wallet.balance) >= 0.001)
      .map((wallet) => wallet._id);

    setSelectedWallets(selectedWalletIds);
    setValue("Selected Wallets");
  };

  return (
    <main>
      <section className="flex flex-col sm:flex-row justify-between items-center text-center">
        <h1 className="my-3 text-xs md:text-lg sm:text-xl pl-3">
          {`Worker Wallet List (${walletCount})`}{" "}
        </h1>
        <button
          className="flex gap-3 items-center text-center text-xs md:text-sm sm:text-md cursor-pointer"
          onClick={onRefresh}
        >
          {walletLoading ? <Loader height={12} width={12} /> : <IoMdRefresh />}
          Refresh Balance
        </button>
      </section>
      <section className="flex flex-col sm:flex-row gap-3 my-3 px-3 w-32 md:w-full ">
        <select
          value={value}
          onChange={handleSelectChange}
          className="cursor-pointer rounded-full bg-cyan  text-black text-xs sm:text-sm scrollbar-thin py-1 outline-none"
        >
          <option
            value="Selected Wallets"
            className="bg-bgBlack shadow-md shadow-black rounded-xl border-gray-800 border text-white"
          >
            Select All
          </option>
          <option
            value="Wallets Selected"
            className="bg-bgBlack shadow-md shadow-black rounded-xl border-gray-800 border text-white"
          >
            Deselect All
          </option>
          {batchOptions.map((num) => (
            <option
              key={num}
              value={num}
              className="bg-bgBlack shadow-md shadow-black rounded-xl border-gray-800 border text-white hover:bg-bgDarker"
            >
              {num}
            </option>
          ))}
        </select>
        <button
          className="rounded-full bg-cyan text-black text-xs sm:text-sm py-1 px-5 hover:bg-cyanDark hover:text-white w-52 md:w-60 "
          onClick={handleSelectBalance}
        >
          Select wallet with balances
        </button>
      </section>
      <section
        ref={containerRef}
        className="flex flex-col gap-3 max-h-[400px] sm:max-h-[500px] px-3 overflow-y-auto hide-scrollbar shadow-inner shadow-black rounded-xl border-gray-900 border"
      >
        {allWallets &&
          allWallets.map((wallets: any, index: number) => (
            <div key={index}>
              <BatchBuyWalletList
                WalletName={wallets.name}
                TokenBalance={wallets.token_balance}
                Amount={wallets.balance}
                isActive={wallets.isActive}
                isSelected={selectedWallets.includes(wallets._id)} // Check if wallet is selected
                onSelectWallet={handleWalletSelection} // Pass a function to handle selection
              />
            </div>
          ))}
        {loadingMore && (
          <div className="flex justify-center items-center py-3">
            <AiOutlineLoading className="animate-spin" size={35} />
          </div>
        )}
      </section>
    </main>
  );
}

export default WorkerWallets;
