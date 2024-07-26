"use client";
import CustomInput from "@common/CustomInput";
import { useUser } from "@context/UserContext";
import { bulkBatchBuy } from "@services/batchBuy";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaBackward, FaPercentage } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { SiSolana } from "react-icons/si";
import { toast } from "react-hot-toast";

interface BuyOrSellProps {
  onPreviousStep: () => void;
  side: string;
  poolId: string;
}

function BuyOrSell({ onPreviousStep, side, poolId }: BuyOrSellProps) {
  const router = useRouter();
  const { masterWalletId } = useUser();
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [timeInterval, setTimeInterval] = useState("");
  const [tradesInterval, setTradesInterval] = useState("");
  const [batchBtn, setBatchBtn] = useState<boolean>(false);

  const isBatchBtnDisabled =
    !amount || !tradesInterval || !slippage || !timeInterval || batchBtn;

  const handleSlippageChange = (value: string) => {
    setSlippage(value);
  };

  const handleTimeIntervalChange = (value: string) => {
    setTimeInterval(value);
  };

  const handleTradesIntervalChange = (value: string) => {
    setTradesInterval(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const continueProcess = async () => {
    const payload = {
      pool_id: poolId,
      master_wallet: masterWalletId,
      side: side,
      amountPerWallets: parseFloat(amount),
      slippagePctg: parseFloat(slippage),
      boosterInterval: timeInterval,
      tradesPerInterval: tradesInterval,
    };
    try {
      const response = await bulkBatchBuy(payload);

      if (response.data) {
        toast.success(`${response.data.message}`);
        router.push("/home");
        setSlippage("");
        setTimeInterval("");
        setTradesInterval("");
        setAmount("");
      }
    } catch (error: any) {
      console.log("error in buy or sell", error);
      toast.error(`${error?.response?.data?.error}`);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[500px] ">
      <div>
        {/* <button className="mt-5" onClick={onPreviousStep}>
            <FaBackward />
          </button>
          <h1 className="text-xl mt-5">
            {side === "out" ? "Create Buy Order" : "Create Sell Order"}
          </h1> */}
        <div className="w-full grid grid-row-2 ">
          <div className="mt-10">
            <CustomInput
              label="Amount per wallet"
              value={amount}
              onChange={handleAmountChange}
              placeholder="minimum 0.0035"
              icon={<SiSolana className="text-xl text-[#4B39EF]" />}
              type="text"
            />
          </div>
          <div className="mt-10">
            <CustomInput
              label="Trades Per Interval"
              value={tradesInterval}
              onChange={handleTradesIntervalChange}
              placeholder="minimum 1 trade"
              icon={<IoMdRefresh className="text-xl text-[#4B39EF]" />}
              type="text"
            />
          </div>
        </div>
        <div className="w-full grid grid-row-2 gap-3">
          <div className="mt-10">
            <CustomInput
              label="Slippage"
              value={slippage}
              onChange={handleSlippageChange}
              placeholder="minimum 0.0035"
              icon={<FaPercentage className="text-xl text-[#4B39EF]" />}
              type="text"
            />
          </div>
          <div className="mt-10">
            <CustomInput
              label="Time Interval"
              value={timeInterval}
              onChange={handleTimeIntervalChange}
              placeholder="minimum 10 seconds"
              icon={<AiOutlineClockCircle className="text-xl text-[#4B39EF]" />}
              type="text"
            />
          </div>
        </div>
      </div>
      <button
        className={`rounded-full text-sm mt-12 px-3 py-2 font-semibold ${
          isBatchBtnDisabled
            ? "rounded-full shadow-md shadow-black  border-gray-800 border hover:bg-cyanDark transition cursor-not-allowed"
            : "bg-cyan hover:bg-cyanDark  text-black hover:text-white"
        }`}
        onClick={continueProcess}
        disabled={isBatchBtnDisabled}
      >
        {side === "out" ? "Start Batch Buy" : "Start Batch Sell"}
      </button>
    </div>
  );
}

export default BuyOrSell;
