"use client";
import InputBox from "@common/InputBox";
import Loader from "@common/Loader";
import { useUser } from "@context/UserContext";
import { transferSolenaToWorker } from "@services/batchBuy";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

interface TransferToWorkerProps {
  id: string | null;
}

function TransferToWorker({ id }: TransferToWorkerProps) {
  const [transferAmount, setTransferAmount] = useState<string>("");
  const { masterWalletId } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [tranferBtn, setTransferBtn] = useState<boolean>(false);

  const istranferBtnDisabled = !transferAmount || tranferBtn;

  const transferSolena = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      master_wallet: masterWalletId,
      worker_wallet: Array.isArray(id) ? id[0] : [id],
      amount: parseFloat(transferAmount),
    };

    try {
      const response = await transferSolenaToWorker(payload);
      if (response.data) {
        setLoading(false);
        toast.success("Solana transferred successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error transferring Solana:", error);
      toast.error("Failed to transfer Solana");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="md:text-xl font-bold mb-10 text-cyan">
        Transfer Solana to worker
      </h3>
      <form onSubmit={transferSolena} className="flex gap-5">
        <div>
          <InputBox
            type="number"
            id="number"
            placeholder="Enter amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="w-40 md:w-40 p-1 md:p-2 "
          />
        </div>

        <button
          type="submit"
          className={`rounded-full text-sm  w-16 font-semibold flex justify-center items-center ${
            istranferBtnDisabled
              ? "rounded-full shadow-inner shadow-black  border-gray-800 border hover:bg-cyanDark transition cursor-not-allowed"
              : "bg-cyan hover:bg-cyanDark  text-black hover:text-white"
          }`}
          disabled={istranferBtnDisabled}
        >
          {loading ? <Loader height={20} width={20}/> : "trasfer"}
        </button>
      </form>
    </div>
  );
}

export default TransferToWorker;
