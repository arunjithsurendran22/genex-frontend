"use client";
import CustomInput from "@common/CustomInput";
import Loader from "@common/Loader";
import { useUser } from "@context/UserContext";
import {
  batchListApi,
  createPoolApi,
  transferSolenaToWorker,
} from "@services/batchBuy";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SiSolana } from "react-icons/si";
import { toast } from "react-hot-toast";
import CreatedPoolList from "./CreatedPoolList";
import SubTab from "@common/SubTab";
import { useParams } from "next/navigation";

interface CreateBatchProps {
  selectedWallets: string[];
  setSelectedWallets: React.Dispatch<React.SetStateAction<string[]>>;
  allWallets: any[];
  zeroBalanceWallets: any;
  setZeroWalletBalance: React.Dispatch<React.SetStateAction<string[]>>;
  onNextStep: () => void;
  setSide: React.Dispatch<React.SetStateAction<string>>;
  setPoolId: React.Dispatch<React.SetStateAction<string>>;
  poolId: string;
  value: string;
}

function CreateBatch({
  selectedWallets,
  setSelectedWallets,
  allWallets,
  zeroBalanceWallets,
  setZeroWalletBalance,
  onNextStep,
  setSide,
  setPoolId,
  poolId,
  value,
}: CreateBatchProps) {
  const { masterWalletId } = useUser();
  const tokenAddress = useParams();
  const [dropdown, setDropdown] = useState(false);
  const [zeroBalanceDropdown, setZeroBalanceDropdown] = useState(false);
  const [batchBtnLoading, setBatchBtnLoading] = useState<Boolean>(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferBtn, setTransferBtn] = useState<boolean>(false);

  const handleClose = (walletId: string) => {
    setSelectedWallets((prevSelectedWallets) =>
      prevSelectedWallets.filter((id) => id !== walletId)
    );
  };

  const handleMasterToWorker = (value: string) => {
    setTransferAmount(value);
  };
  const transferSolena = async () => {
    setTransferBtn(true);
    const payload = {
      master_wallet: masterWalletId,
      worker_wallet: zeroBalanceWallets.map((walletId: any) => walletId._id),
      amount: parseFloat(transferAmount),
    };
    try {
      const response = await transferSolenaToWorker(payload);
      if (response.data) {
        toast.success("Solana transferred successfully");
        setTransferBtn(false);
        setSelectedWallets([]);
        setZeroWalletBalance([]);
      }
    } catch (error) {
      setTransferBtn(false);
      console.error("Error transferring Solana:", error);
      toast.error("Failed to transfer Solana");
    }
  };

  const createPool = async () => {
    setBatchBtnLoading(true);
    const payload = {
      tokenAddress: tokenAddress.id,
      master_wallet: masterWalletId,
      wallets: selectedWallets.map((walletId) => ({
        worker_wallet: walletId,
        status: "progress",
      })),
    };
    try {
      const response = await createPoolApi(payload);
      setPoolId(response.data._id);
      setBatchBtnLoading(false);
      toast.success("Batch created successfully");
      // setPoolCreating(false);
    } catch (error: any) {
      setBatchBtnLoading(false);
      console.log(error.response.data.error);

      console.log("error in creating pool", error);
      // setPoolCreating(false);
    }
  };

  const handleBuyOrSell = (side: string) => {
    setSide(side); // Setting the side ('in' for sell, 'out' for buy)
    onNextStep(); // Proceed to the next step
  };
  const isTransferBtnDisabled = !transferAmount || transferBtn;

  return (
    <div className="mt-10 min-h-[500px] flex flex-col justify-between ">
      <div>
        <div>
          <label className="text-left text-neutral-500 text-xs">
            Total number of wallets
          </label>
          <div
            onClick={() => {
              setDropdown(!dropdown), setZeroBalanceDropdown(false);
            }}
            className="flex items-center text-center cursor-pointer"
          >
            <p className="w-full p-2 text-left  my-3 bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border">
              {value} ({selectedWallets?.length})
            </p>
            {dropdown && <FaChevronUp className="-ml-10" />}
            {!dropdown && <FaChevronDown className="-ml-10" />}
          </div>

          {dropdown && (
            <div className="">
              <div className=" max-h-[8rem] w-[15.5rem] sm:w-[40rem] md:w-[44rem] lg:w-[28rem] p-2 bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border overflow-y-auto flex flex-col gap-3 absolute hide-scrollbar">
                {selectedWallets?.map((walletId, index) => {
                  const wallet = allWallets?.find(
                    (wallet) => wallet?._id === walletId
                  );
                  if (!wallet) return null;

                  const isZeroBalance = parseFloat(wallet.balance) === 0;

                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-md cursor-pointer gap-2 items-center text-[.6rem] md:text-xs md:flex md:justify-between   bg-bgBlack shadow-md shadow-black  border-gray-800 border `}
                      onClick={() => handleClose(wallet?._id)}
                    >
                      <p
                        className={`${
                          isZeroBalance
                            ? "text-red-500 hover:text-red-400"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {wallet?.name}
                      </p>
                      <div className="flex justify-between gap-1">
                        <p
                          className={`${
                            isZeroBalance ? "text-red-600 " : "text-cyan"
                          }`}
                        >
                          {wallet?.balance}
                          <span className="text-cyan">SOL</span>{" "}
                        </p>

                        <IoClose className="hover:text-red-600 text-lg" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {zeroBalanceWallets.length > 0 && (
            <>
              <label className="text-left text-red-500 text-xs mt-5">
                Wallets with Low Balance (below 0.001)
              </label>
              <div
                onClick={() => {
                  setZeroBalanceDropdown(!zeroBalanceDropdown);
                  setDropdown(false);
                }}
                className="flex items-center text-center cursor-pointer"
              >
                <p className="w-full p-2 text-left  my-3 bg-bgDarker shadow-sm shadow-black rounded-xl border-gray-800 border">
                  Low Balance Wallets ({zeroBalanceWallets.length})
                </p>
                {zeroBalanceDropdown && <FaChevronUp className="-ml-10" />}
                {!zeroBalanceDropdown && <FaChevronDown className="-ml-10" />}
              </div>
              {zeroBalanceDropdown && (
                <div className="w-fit">
                  <div className="max-h-[8rem] w-[15.5rem] sm:w-[40rem] md:w-[44rem] lg:w-[28rem] p-2 bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border overflow-y-auto flex flex-col gap-3 absolute hide-scrollbar">
                    {zeroBalanceWallets.map((wallet: any, index: any) => (
                      <div
                        key={index}
                        className="p-2 rounded-md cursor-pointer gap-3 items-center text-[.6rem] md:text-xs md:flex md:justify-between    bg-bgBlack shadow-md shadow-black  border-gray-800 border"
                      >
                        <p className="text-red-600 hover:text-red-500">
                          {wallet?.name}
                        </p>
                        <div className="flex justify-between gap-1">
                          <p className="text-cyan">{wallet?.balance} SOL</p>
                          <IoClose
                            className="hover:text-red-600 text-lg"
                            onClick={() => handleClose(wallet?._id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {zeroBalanceWallets.length > 0 && (
            <div className="flex justify-between items-center gap-10  mt-10">
              <CustomInput
                label="Transfer Amount to Worker Wallet"
                value={transferAmount}
                onChange={handleMasterToWorker}
                placeholder="minimum 0.0035"
                icon={<SiSolana className="text-xl text-primary" />}
                type="text"
              />
              <button
                className={` rounded-full text-sm  w-28 h-10 font-semibold flex justify-center items-center ${
                  isTransferBtnDisabled
                    ? "rounded-full shadow-md shadow-black  border-gray-800 border hover:bg-cyanDark transition cursor-not-allowed"
                    : "bg-cyan hover:bg-cyanDark  text-black hover:text-white"
                }`}
                onClick={transferSolena}
                disabled={isTransferBtnDisabled}
              >
                {transferBtn ? <Loader height={20} width={20} /> : "Transfer"}
              </button>
            </div>
          )}
          {zeroBalanceWallets.length === 0 && (
            <div className="flex justify-end">
              <button
                className="rounded-xl bg-cyan  hover:bg-cyanDark hover:text-white text-black text-sm px-2 py-1 "
                onClick={createPool}
                disabled={batchBtnLoading === true}
              >
                {batchBtnLoading ? <Loader /> : <>Create Batch</>}
              </button>
            </div>
          )}
        </div>
        <CreatedPoolList setPoolId={setPoolId} />
      </div>

      <div className="flex justify-evenly gap-3 mt-24">
        <button
          className={`rounded-full bg-cyan hover:bg-cyanDark hover:text-white text-black text-lg px-10 py-1 w-full ${
            !poolId ? "cursor-not-allowed" : ""
          }`}
          onClick={() => handleBuyOrSell("out")}
          disabled={!poolId}
        >
          Buy
        </button>
        <button
          className={`rounded-full bg-red-500 hover:bg-red-800 hover:text-white text-black text-lg px-10 py-1 w-full ${
            !poolId ? "cursor-not-allowed" : ""
          }`}
          onClick={() => handleBuyOrSell("in")}
          disabled={!poolId}
        >
          Sell
        </button>
      </div>
    </div>
  );
}

export default CreateBatch;
