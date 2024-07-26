"use client";

import { useUser } from "@context/UserContext";
import { withdreawApi } from "@services/withdrawalService";
// import { RootState } from "@/redux/store";
// import { withdrawApi } from "@/services/withdrawService";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineLoading } from "react-icons/ai";
import { FaArrowUp, FaHeadset, FaRegPaste, FaXmark } from "react-icons/fa6";
import { MdTaskAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export interface WithdrawModalProps {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithdrawalModal: FC<WithdrawModalProps> = ({ closeModal }) => {
  const [withdrawSecondModal, setWithdrawSecondModal] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [fee, setFee] = useState<number>(0);
  const [amountError, setAmountError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { masterWallet, user } = useUser();

  const handleClose = () => {
    closeModal(false);
    setWithdrawSecondModal(false);
  };

  useEffect(() => {
    const inputAmount = parseFloat(amount);
    if (!isNaN(inputAmount)) {
      const calculatedFee = (inputAmount * 0.01) / 100;
      setFee(parseFloat(calculatedFee.toFixed(6)));
    } else {
      setFee(0);
    }
  }, [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountError(""); // Clear previous error message if any
    let inputAmount = e.target.value.trim(); // Trim any leading or trailing whitespace

    // Check if input starts with more than one zero
    if (/^0\d/.test(inputAmount)) {
      // If more than one zero before decimal, correct it to a single zero
      inputAmount = "0" + inputAmount.slice(1).replace(/^0+/, "");
    }

    if (inputAmount === "") {
      setAmount("");
      return;
    }

    const parsedAmount = parseFloat(inputAmount);
    if (!isNaN(parsedAmount) && parsedAmount <= masterWallet?.balance) {
      setAmount(inputAmount);
    } else if (!isNaN(parsedAmount) && parsedAmount > masterWallet?.balance) {
      setAmount(masterWallet.balance.toString());
    } else {
      setAmount(inputAmount);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressError(""); // Clear previous error message if any
    setWalletAddress(e.target.value);
  };

  const withdrawBalance = async () => {
    let hasError = false;
    if (amount === "") {
      setAmountError("Amount is required.");
      hasError = true;
    }
    if (walletAddress === "") {
      setAddressError("Wallet address is required.");
      hasError = true;
    }
    if (hasError) return;

    const payload = {
      amount: parseFloat(amount),
      master_wallet: masterWallet?._id,
      toWallet_pubkey: walletAddress,
    };
    setIsSubmitting(true);
    try {
      const response = await withdreawApi(payload);
      if (response.data) {
        setWithdrawSecondModal(true);
        setIsSubmitting(false);
        toast.success("Withdrawal successful!");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to process withdrawal. Please try again.");
      console.log("Error while getting withdrawal response", error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWalletAddress(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  return (
    <>
      <div
      // className="fixed w-full h-full z-50 left-0 top-0 backdrop-blur-md bg-opacity-10 bg-black"
      >
        <div className=" flex justify-center">
          <div className="">
            <div className=" rounded-2xl w-auto md:min-w-[400px] md:max-w-[400px]">
              <div className="border-b-2  px-3 py-1 text-[#57636C] border-[#57636c] rounded-b-2xl flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <p className="text-left text-xs">Amount to withdraw in SOL</p>
                  <div className="flex justify-between items-center text-center w-full">
                    <input
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter the amount of SOL"
                      className="bg-transparent text-sm placeholder:text-[#414547] border-0 focus:outline-none w-full"
                      required
                    />
                    <button
                      className="text-sm"
                      onClick={() => setAmount(masterWallet.balance.toString())}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
              {amountError && (
                <div className="text-red-500 text-xs px-3 py-1">
                  {amountError}
                </div>
              )}

              <div className="border-b-2 mt-10 px-3 py-1 text-[#57636C] border-[#57636c] rounded-b-2xl flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <p className="text-left text-xs">
                    Paste your wallet address below
                  </p>
                  <div className="flex justify-between items-center text-center w-full">
                    <input
                      value={walletAddress}
                      onChange={handleAddressChange}
                      placeholder="Enter your wallet address"
                      className="bg-transparent text-sm w-full placeholder:text-[#414547] border-0 focus:outline-none"
                      required
                    />
                    <FaRegPaste
                      className="cursor-pointer"
                      onClick={handlePaste}
                    />
                  </div>
                </div>
              </div>
              {addressError && (
                <div className="text-red-500 text-xs px-3 py-1">
                  {addressError}
                </div>
              )}

              <div className="text-xs w-full flex justify-center gap-10 mt-10 overflow-x-hidden">
                <div className="flex flex-col justify-center text-center">
                  <p className="text-neutral-500">Network</p>
                  <p className="font-semibold text-white">Solana</p>
                </div>

                <div className="flex flex-col justify-center text-center ">
                  <p className="text-neutral-500">Amount</p>
                  <p className="font-semibold text-white ">{amount} SOL</p>
                </div>

                <div className="flex flex-col justify-center text-center">
                  <p className="text-neutral-500">Fee</p>
                  <p className="font-semibold text-white">{fee} SOL</p>
                </div>
              </div>

              <div>
                <button
                  onClick={withdrawBalance}
                  className="text-white ripple-bg-indigo-600 font-bold bg-[#4B39EF] shadow-md shadow-black flex items-center justify-center text-center rounded-xl px-4 w-full h-[40px] mt-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <AiOutlineLoading className="animate-spin" size={28} />
                  ) : (
                    "Proceed"
                  )}
                </button>
              </div>

              <div className="text-neutral-500 text-xs mt-10">
                <p>
                  Solana is required for the fees on genex. Amount deposited on
                  genex master wallet are secured by industry standard safety
                  measures. Please don&apos;t send other tokens. Some cases
                  might not be recoverable. Contact us for more info -
                  support@genex.com
                </p>
              </div>

              <div className="flex gap-1 cursor-pointer items-center text-center justify-center text-xs text-neutral-500 mt-5">
                <FaHeadset />
                <p>Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {withdrawSecondModal && (
        <div className="fixed w-full h-full z-50 left-0 top-0 backdrop-blur-md bg-opacity-10 bg-black">
          <div className="w-full flex justify-center">
            <div className="mt-[8%]">
              <div className="bg-[#14181b] shadow-md shadow-black p-4 rounded-2xl min-w-[400px] max-w-[400px]">
                <div className="w-full flex justify-between font-semibold text-2xl">
                  <h1>Withdraw Solana</h1>
                  <FaXmark
                    className="cursor-pointer"
                    onClick={() => setWithdrawSecondModal(false)}
                  />
                </div>

                <div className="text-xs flex flex-col justify-center">
                  <div className="text-[100px] mt-10 mb-5 flex w-full justify-center">
                    <MdTaskAlt className="text-[#249689] animate-bounce" />
                  </div>
                  <div className="w-full flex justify-center text-neutral-500 mb-5">
                    <div className="w-full flex flex-col justify-center text-center">
                      <div className="text-[30px] mb-3 flex gap-3 text-white font-semibold items-center text-center w-full justify-center">
                        <FaArrowUp />
                        <h1>500 SOL</h1>
                      </div>
                      <p>05-06-2024 12:55 UTC</p>
                      <p>To: 4NS3vG9jWdLScyFZa3nDrmRP5MLAKZHDkYhGGhnAqZpm</p>
                    </div>
                  </div>

                  <div className="text-neutral-500">
                    <p>
                      Withdrawal successful, you will receive the amount after
                      fee deduction. Amount withdrawn 500 SOL, After fee
                      deduction 499.575 SOL.
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleClose}
                    className="text-white ripple-bg-indigo-500 font-bold bg-[#4B39EF] shadow-md shadow-black rounded-xl px-4 w-full h-[40px] mt-10"
                  >
                    Done
                  </button>
                </div>

                <div className="text-neutral-500 text-xs mt-10">
                  <p>
                    Solana is required for the fees on genex. Amount deposited
                    on genex master wallet are secured by industry standard
                    safety measures. Please don&apos;t send other tokens. Some
                    cases might not be recoverable. Contact us for more info -
                    support@genex.com
                  </p>
                </div>

                <div className="flex gap-1 cursor-pointer items-center text-center justify-center text-xs text-neutral-500 mt-5">
                  <FaHeadset />
                  <p>Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawalModal;
