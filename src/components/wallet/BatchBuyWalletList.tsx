"use client";
import Image from "next/image";
import React, { FC, useEffect } from "react";
import { FaX } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addBatch, removeBatch } from "src/redux/features/batchbuy";

export interface BatchBuyWalletListProps {
  Amount: string;
  WalletName: string;
  isSelected: boolean;
  TokenBalance: number;
  onSelectWallet: (walletId: string) => void;
  isActive: boolean;
}

const BatchBuyWalletList: FC<BatchBuyWalletListProps> = ({
  Amount,
  WalletName,
  isSelected,
  TokenBalance,
  isActive,
  onSelectWallet,
}) => {
  const dispatch = useDispatch();

  const addBatchWallet = (walletId: string) => {
    dispatch(addBatch(walletId));
    onSelectWallet(walletId);
  };

  const removeBatchWallet = (walletId: string) => {
    dispatch(removeBatch(walletId));
    onSelectWallet(walletId);
  };

  const toggleSelection = () => {
    if (!isSelected) {
      addBatchWallet(WalletName);
    } else {
      removeBatchWallet(WalletName);
    }
  };

  return (
    <div className="flex gap-3 items-center text-center ">
      <div
        onClick={toggleSelection}
        className={`w-full group  md:p-3 relative ${
          !isActive
            ? "border-red-900 border"
            : isSelected
            ? "shadow-none border border-cyan"
            : "shadow-md shadow-black"
        } bg-bgDarker shadow-md shadow-black rounded-xl  flex justify-between items-center text-center cursor-pointer `}
      >
        <div className=" md:flex md:justify-between w-full">
          <div className="flex items-center">
            <Image
              className="max-h-[50px] max-w-[50px]"
              src={
                "https://imgs.search.brave.com/MLC6uvTYddhvpJIu7RiCPMZz1EWgyLj-OWWSCy0wY-U/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9sb2dv/dHlwLnVzL2ZpbGUv/c29sYW5hLnN2Zw.svg"
              }
              width={400}
              height={100}
              alt="token logo"
            />
            <div className="w-fit ">
              <div className="flex font-semibold gap-2 items-center text-center">
                <p className="text-[.5rem] md:text-xs font-thin">{WalletName}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex-col ">
              <p className="text-cyan text-xs md:text-sm">{Amount} SOL</p>
              <p className="text-cyan text-xs md:text-sm">
                {TokenBalance ? <>{TokenBalance} T</> : <>0</>}
              </p>
            </div>
            {!isActive && (
              <span className="absolute w-70 bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block p-2 bg-black text-[#249689] text-xs rounded-lg text-center">
                For these wallets, since admin fee is not deducted, this wallet
                cant be used for trade
              </span>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <div onClick={() => removeBatchWallet(WalletName)}>
          <button className="text-sm flex gap-1 items-center text-center">
            <FaX />
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchBuyWalletList;
