import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { transactionHistorySingle } from "@services/trasation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

type Props = {
  rowId: string | undefined;
};
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const truncateString = (
  str: string | undefined,
  maxLength: number = 30
): string => {
  if (!str) return "";
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="absolute -top-8 left-0 bg-black text-gray-400 text-xs rounded p-1 z-10">
      {text}
    </div>
  );
};

const CopyMessage: React.FC = () => {
  return (
    <div className="absolute -top-8 left-0 bg-green-600 text-white text-xs rounded p-1 z-10">
      Copied!
    </div>
  );
};

const TransactionSingle: React.FC<Props> = ({ rowId }) => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (rowId) {
      fetchSingleTransaction();
    }
  }, [rowId]);

  const fetchSingleTransaction = async (): Promise<void> => {
    try {
      const response = await transactionHistorySingle(rowId);
      setTransactionData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch single transaction", error);
    }
  };

  const isTruncated = (str: string | undefined, maxLength: number = 40) => {
    return str && str.length > maxLength;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
  };

  const formattedTransaction = transactionData
    ? {
        amount: transactionData.amount,
        amountPerWallet: transactionData.amountPerWallet,
        boosterInterval: transactionData.boosterInterval,
        created: dayjs(transactionData.createdAt).format(
          "YYYY-MM-DD hh:mm:ss A"
        ),
        signature: truncateString(transactionData.signature),
        signature_status: transactionData.signature_status,
        slippagePctg: transactionData.slippagePctg,
        token_address: transactionData.token_address,
        token_balance: transactionData.token_balance,
        tradesPerInterval: transactionData.tradesPerInterval,
        type: transactionData.type,
        updated: dayjs(transactionData.updatedAt).format(
          "YYYY-MM-DD hh:mm:ss A"
        ),
        user: transactionData.user,
      }
    : null;

  const master_wallet = transactionData
    ? {
        balance: transactionData?.master_wallet?.balance,
        created: dayjs(transactionData?.master_wallet?.createdAt).format(
          "YYYY-MM-DD hh:mm:ss A"
        ),
        public_key: truncateString(transactionData?.master_wallet?.public_key),
      }
    : null;

  const worker_wallet = transactionData
    ? {
        balance: transactionData?.worker_wallet?.balance,
        contract_token: transactionData?.worker_wallet?.contract_token,
        name: truncateString(transactionData?.worker_wallet?.name),
        public_key: truncateString(transactionData?.worker_wallet?.public_key),
        token_balance: truncateString(
          transactionData?.worker_wallet?.token_balance
        ),
      }
    : null;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border p-4">
          <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
          <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex md:w-[70rem] w-full  overflow-y-auto  gap-5">
      <div className="md:w-6/12 bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border">
        {formattedTransaction && (
          <div className="shadow rounded p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2 text-cyan">
              Transaction Details
            </h2>
            {Object.entries(formattedTransaction).map(([key, value]) => (
              <div key={key} className="flex justify-between mb-2">
                <div className="w-2/6">
                  <p className="font-thin text-sm">{key}:</p>
                </div>
                <div
                  className={`w-4/6 text-sm bg-neutral-800 text-gray-400 p-2 rounded relative group flex ${
                    key === "type" ? (value === "buy" ? "text-green-500" : "text-red-500") : ""
                  }`}
                >
                  {value}
                  {isTruncated(transactionData[key]) && (
                    <>
                      <div className="hidden group-hover:block absolute top-0 left-0">
                        <Tooltip text={transactionData[key]} />
                      </div>
                      <FiCopy
                        className="ml-2 cursor-pointer"
                        onClick={() => copyToClipboard(transactionData[key])}
                      />
                    </>
                  )}
                  {copySuccess === transactionData[key] && <CopyMessage />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="md:w-6/12">
        <div className="bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border">
          {master_wallet && (
            <div className="shadow rounded p-4 mb-4">
              <h2 className="text-xl font-semibold mb-2 text-cyan">
                Master Wallet
              </h2>
              {Object.entries(master_wallet).map(([key, value]) => (
                <div key={key} className="flex justify-between mb-2">
                  <div className="w-2/6">
                    <p className="font-thin text-sm">{key}:</p>
                  </div>
                  <div className="w-4/6 text-sm bg-neutral-800 text-gray-400 p-2 rounded relative group flex">
                    {value}
                    {isTruncated(transactionData.master_wallet[key]) && (
                      <>
                        <div className="hidden group-hover:block absolute top-0 left-0">
                          <Tooltip text={transactionData.master_wallet[key]} />
                        </div>
                        <FiCopy
                          className="ml-2 cursor-pointer"
                          onClick={() =>
                            copyToClipboard(transactionData.master_wallet[key])
                          }
                        />
                      </>
                    )}
                    {copySuccess === transactionData.master_wallet[key] && (
                      <CopyMessage />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border mt-10">
          {worker_wallet && (
            <div className="shadow rounded p-4 mb-4">
              <h2 className="text-xl font-semibold mb-2 text-cyan">
                Worker Wallet
              </h2>
              {Object.entries(worker_wallet).map(([key, value]) => (
                <div key={key} className="flex justify-between mb-2">
                  <div className="w-2/6">
                    <p className="font-thin text-sm">{key}:</p>
                  </div>
                  <div className="w-4/6 text-sm bg-neutral-800 text-gray-400 p-2 rounded relative group flex">
                    {value}
                    {isTruncated(transactionData.worker_wallet[key]) && (
                      <>
                        <div className="hidden group-hover:block absolute top-0 left-0">
                          <Tooltip text={transactionData.worker_wallet[key]} />
                        </div>
                        <FiCopy
                          className="ml-2 cursor-pointer"
                          onClick={() =>
                            copyToClipboard(transactionData.worker_wallet[key])
                          }
                        />
                      </>
                    )}
                    {copySuccess === transactionData.worker_wallet[key] && (
                      <CopyMessage />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionSingle;
