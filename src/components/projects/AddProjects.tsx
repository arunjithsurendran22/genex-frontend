"use client";

import Loader from "@common/Loader";
import { useUser } from "@context/UserContext";
import { addProjectsService, verifyTokenService } from "@services/projects";
import React, { FC, useEffect, useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCircle,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
// import { workerData } from "worker_threads";
// import { RootState } from "@/redux/store";
// import useWebSocket from "@/hooks/webSocketHook";
// import Checkbox from "./Checkbox";
// import WorkerWallets from "./WorkerWallets";
// import Loading from "./Loading";

export interface AddProjectPageProps {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProjects: FC<AddProjectPageProps> = ({ closeModal }) => {
  const [stage, setStage] = useState("req");
  const [walletAddress, setWalletAddress] = useState("");
  const [addressVerify, setAddressVerify] = useState<Boolean>(false);
  const [dummyData, setDummyData] = useState<any>(undefined);
  const [isKeepMinimumBalance, setIsKeepMinimumBalance] =
    useState<Boolean>(false);
  const [workerWallet, setWorkerWallet] = useState<number | undefined>(
    undefined
  );
  const [validToken, setValidToken] = useState<boolean>(false);
  const [countText, setcountText] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const [loading, setLoading] = useState<Boolean>(false);
  const { masterWalletId, user } = useUser();
  // const [messages, setMessages] = useState<any>();
  // const serverUrl: any = process.env.NEXT_PUBLIC_SERVER_URL;
  // const socketUrl: string = `${serverUrl.replace(
  //   /^http/,
  //   "ws"
  // )}?token=${jwtToken}`;
  // console.log("socket url", socketUrl);
  // const { messages, error } = useWebSocket(socketUrl);

  // console.log("test", jwtToken, user);

  useEffect(() => {
    const isWalletAddressValid = walletAddress !== "";
    const isWorkerWalletValid = workerWallet !== undefined;

    if (isWalletAddressValid && isWorkerWalletValid && addressVerify) {
      setIsButtonEnabled(true);
    }
    // setIsButtonEnabled(isWalletAddressValid && isWorkerWalletValid);
  }, [walletAddress, workerWallet, addressVerify]);

  const handleCreateProject = async () => {
    setLoading(true);
    const payload: any = {
      wallet_count: workerWallet,
      userId: user?._id,
      contractAccount: walletAddress,
      masterWalletId: masterWalletId,
      isKeepMinimumBalance: isKeepMinimumBalance,
    };

    try {
      const response = await addProjectsService(payload);
      console.log("res", response);
      if (response.status === 200) {
        setStage("finalize");
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Failed to create project. Please try again.");
      }

      return response;
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleVerifyAddress = async () => {
    setLoading(true);
    const payload: any = {
      token_address: walletAddress,
    };

    try {
      const response = await verifyTokenService(payload);
      console.log("res verify token", response);

      if (response.status === 200) {
        setValidToken(false);
        setAddressVerify(true);
        setLoading(false);
      } else {
        setLoading(false);
        setValidToken(true);
      }
      return response;
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  useEffect(() => {
    if (
      workerWallet === 10 ||
      workerWallet === 50 ||
      workerWallet === 100 ||
      workerWallet === 500 ||
      workerWallet === undefined
    ) {
      setcountText(false);
    } else {
      setcountText(true);
    }
  }, [workerWallet]);

  useEffect(() => {
    if (isKeepMinimumBalance) {
      const isBannceData = Number(workerWallet) * 0.0025;
      const workerWalletData = Number(workerWallet) * 0.0003;
      const totalBalance = workerWalletData
        ? Number(workerWalletData)
        : 0 + isBannceData
        ? Number(isBannceData)
        : 0;
    } else {
      const workerWalletData = Number(workerWallet) * 0.0003;
    }
  }, [isKeepMinimumBalance]);

  // ------------socket error

  // useEffect(() => {
  //   if (messages?.message.data) {
  //     console.log('success', messages.message.data)
  //     toast.success(messages?.message?.data);
  //   }
  //   if (messages?.error?.error) {
  //     toast.error(messages?.error?.error?.transactionMessage);
  //   }
  // }, [messages]);
  const renderRequirements = () => {
    return (
      <div className="  w-[17rem] sm:w-auto">
        <div className="flex justify-between  mt-5 ">
          <div className="flex gap-2 items-center text-white text-center">
            <BsFillCircleFill style={{ color: "#32c132" }} />
            <p className="text-[.7rem] sm:text-[1rem]">Submit Requirements</p>
          </div>

          <div className="flex gap-2 text-white items-center text-center">
            <MdOutlineCircle />
            <p className="text-[.7rem] sm:text-[1rem]">Review</p>
          </div>

          <div className="flex gap-2 text-white items-center text-center">
            <MdOutlineCircle />
            <p className="text-[.7rem] sm:text-[1rem]">Finalize</p>
          </div>

          {/* <div className="flex gap-2 items-center text-center">
            <AiOutlineCheckCircle className="text-lg" />
            <p>Complete</p>
          </div> */}
        </div>

        <div className="w-full mt-10">
          <p className="text-left text-neutral-500 text-xs">Token Address</p>
          <div className="flex justify-between border-b rounded-2xl border-indigo-800 pb-2 items-center text-center w-full">
            <input
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="CcwhLH72goZtwbK3B88F1Zddpemx78UWtZzhzpbsxeEh"
              className="bg-transparent border-none text-[.5rem] sm:text-xs w-full pt-2 pl-2 text-white placeholder:text-neutral-700  font-semibold border-0 focus:outline-none"
             
            />

            {addressVerify ? (
              <>
                <AiOutlineCheck className="text-lg text-[#249689]" />
              </>
            ) : (
              <>
                {loading ? (
                  <Loader color="#fff" />
                ) : (
                  <>
                    <span
                      onClick={() => {
                        console.log("btn clicked");
                        handleVerifyAddress();
                      }}
                      className=" justify-content-center border text-white rounded-2xl border-green-800 p-2 items-center text-center  flex"
                    >
                      Verify
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          <p className="text-left text-neutral-500 text-xs mt-1">
            {validToken ? (
              <>
                {" "}
                <span style={{ color: "#d14f0e" }}>
                  Please enter the valid token address
                </span>{" "}
              </>
            ) : (
              <>Please enter the token address</>
            )}
          </p>
        </div>

        <div className="mt-10">
          <div className="w-full flex justify-between items-center text-center">
            <p className="text-[.8rem]">How many Worker wallets are required?</p>
            <AiOutlineQuestionCircle />
          </div>

          <div className="flex gap-3 mt-3">
            <div
              onClick={() => setWorkerWallet(10)}
              className={`${
                workerWallet === 10
                  ? "border-4 border-cyan"
                  : "border border-neutral-600"
              } py-4 px-5 text-white rounded-xl w-[2rem] sm:w-auto flex justify-center`}
            >
              <p className="text-[.7rem]">10</p>
            </div>

            <div
              onClick={() => setWorkerWallet(50)}
              className={`${
                workerWallet === 50
                  ? "border-4 border-cyan"
                  : "border border-neutral-600"
              } py-4 px-5 text-white rounded-xl w-[2rem] sm:w-auto flex justify-center`}
            >
              <p className="text-[.7rem]">50</p>
            </div>

            <div
              onClick={() => setWorkerWallet(100)}
              className={`${
                workerWallet === 100
                  ? "border-4 border-cyan"
                  : "border border-neutral-600"
              } py-4 px-5 text-white  rounded-xl w-[2rem] sm:w-auto flex justify-center`}
            >
              <p className="text-[.7rem]">100</p>
            </div>

            <div
              onClick={() => setWorkerWallet(500)}
              className={`${
                workerWallet === 500
                  ? "border-4 border-cyan"
                  : "border border-neutral-600"
              } py-4 px-5 text-white rounded-xl w-[2rem] sm:w-auto flex justify-center`}
            >
              <p className="text-[.7rem]">500</p>
            </div>

            <div
              onClick={() => {
                // setWorkerWallet(0)
                setWorkerWallet(dummyData);
                setcountText(true);
              }}
              // className={`${'py-4 px-6 border rounded-xl w-fit'} `}
              className={`${
                countText === true
                  ? "border-4 border-cyan"
                  : "border border-neutral-600"
              } py-4 px-3 text-white rounded-xl w-[3rem] sm:w-auto flex justify-center`}
            >
              <input
                onChange={(e) => {
                  setWorkerWallet(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  );
                  setDummyData(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  );
                }}
                className="bg-transparent w-auto md:max-w-[100px] border-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* <div className="mt-10">
          <div className="w-full flex justify-between items-center text-center">
            <p>How much Solana will be using per wallet?</p>
            <AiOutlineQuestionCircle />
          </div>

          <div className="flex gap-3 mt-3">
            <div className="py-4 px-2 border rounded-xl w-fit">
              <p>0.010 SOL</p>
            </div>

            <div className="py-4 px-2 border rounded-xl w-fit">
              <p>0.050 SOL</p>
            </div>

            <div className="py-4 px-2 border rounded-xl w-fit">
              <p>0.100 SOL</p>
            </div>

            <div className="py-4 px-2 border rounded-xl w-fit">
              <input className="bg-transparent max-w-[200px]" />
            </div>
          </div>
        </div> */}

        <div className="flex justify-between items-center text-center my-10">
          {/* <div className="flex flex-col text-left min-w-[300px]">
            <p>Confused about what to choose ?</p>
            <p>Get help from our Team on Live Chat</p>
          </div> */}

          <div className="w-full flex justify-center items-center text-center">
            {/* <button
              onClick={() => setStage("review")}
              className="text-white ripple-bg-indigo-500 font-bold bg-[#4B39EF] shadow-sm shadow-black rounded-xl px-4 w-full h-[40px]"
            >
              Next
            </button> */}

            <button
              className={`md:font-bold md:min-w-[150px] w-full text-xs md:text-md shadow-sm h-[40px] bg-[#4B39EF]  border border-[#57636c] rounded-2xl px-4 ${
                isButtonEnabled
                  ? "ripple-bg-neutral-500"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isButtonEnabled}
              onClick={() => {
                setStage("review");
                setValidToken(false);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    return (
      <div>
        <div className="flex justify-between mt-10">
          <div className="flex gap-2 text-white items-center text-center">
            <FaCheckCircle style={{ color: "#32c132" }} />
            <p>Submit Requirements</p>
          </div>

          <div className="flex gap-2 text-white items-center text-center">
            <BsFillCircleFill style={{ color: "#32c132" }} />
            <p>Review</p>
          </div>

          <div className="flex gap-2 text-white items-center text-center">
            <MdOutlineCircle />
            <p>Finalize</p>
          </div>

          {/* <div className="flex gap-2 items-center text-center">
            <AiOutlineCheckCircle className="text-lg" />
            <p>Complete</p>
          </div> */}
        </div>

        <div className="w-full mt-10">
          <p className="text-left text-neutral-500 text-xs">
            {/* SolToken, SLT, 100Billion */}
            Token address
          </p>
          <div className="flex justify-between border-b rounded-2xl border-indigo-800 pb-2 items-center text-center w-full">
            <input
              placeholder={walletAddress}
              className="bg-transparent text-sm w-full pl-2 pt-2 font-semibold border-0 focus:outline-none"
            />
            <AiOutlineCheck className="text-lg text-[#249689]" />
          </div>
        </div>

        <div className="w-full mt-10 text-sm text-neutral-500">
          <p>Current Selection</p>

          <div className="flex items-center text-center gap-3 mt-3">
            <p>Total Worker Wallet Count</p>
            <p className="py-2 px-6 border rounded-xl w-fit">{workerWallet}</p>
          </div>

          {/* <div className="flex items-center text-center gap-3 mt-3">
            <p>Trade Amount per Wallet</p>
            <p className="py-2 px-6 border rounded-xl w-fit">0.010 SOL</p>
          </div> */}
        </div>

        <div className="w-full mt-10 text-sm text-neutral-500">
          {/* <div className="w-full flex  justify-between items-center text-center">
            <div className="flex items-center text-center gap-3">
              <p>Total Solana required to trade</p>
              <AiOutlineQuestionCircle />
            </div>
            <p>0.10 SOL</p>
          </div> */}

          <div className="w-full flex  justify-between items-center text-center">
            <div className="flex items-center text-center gap-3">
              <p>Worker wallet creation fee</p>
              <AiOutlineQuestionCircle />
            </div>
            <p>{(Number(workerWallet) * 0.0003).toFixed(5)} SOL</p>
          </div>

          {/* <div className="w-full flex justify-between items-center text-center">
            <div className="flex items-center text-center gap-3">
              <p>Total Solana required (including gas fee)</p>
              <AiOutlineQuestionCircle />
            </div>
            <p>0.03 SOL</p>
          </div> */}

          <div className="text-xs mt-1">
            <p>
              Genex Market Mining, Volume generation and batch swap requires gas
              fee. Learn more about Fees here
            </p>
          </div>
        </div>
        <div className="mt-5">
          <div className="w-full flex justify-between items-center text-white text-center">
            <p>
              Sent minimum 0.0025 sol required for rent exemption to{" "}
              {workerWallet} wallets ?
            </p>
            {/* <Checkbox/> */}
            {/* <Checkbox
              name="checkbox"
              className="border-indigo-800"
              onChange={(e: any) => {
                setIsKeepMinimumBalance(e?.target?.checked);
              }}

              
            /> */}
            {/* <CustomCheckBox onClick={()=>{ console.log();
            }}/> */}
            <div
              className=" pr-2
          "
              onClick={() => {
                if (isKeepMinimumBalance === false) {
                  setIsKeepMinimumBalance(true);
                } else {
                  setIsKeepMinimumBalance(false);
                }
              }}
            >
              {isKeepMinimumBalance ? (
                <>
                  {" "}
                  <MdOutlineCheckBox
                    style={{ color: "#249689", fontSize: "1.5rem" }}
                  />
                </>
              ) : (
                <>
                  {" "}
                  <MdOutlineCheckBoxOutlineBlank
                    style={{ color: "#249689", fontSize: "1.5rem" }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-center my-10">
          <div className="w-full flex justify-center items-center text-center">
            <button
              onClick={() => setStage("req")}
              className="text-white ripple-bg-neutral-500 font-bold bg-[#131011] border-2 shadow-sm shadow-black rounded-xl min-w-[200px] px-4 w-fit h-[40px]"
            >
              Back
            </button>
          </div>

          <div className="w-full flex justify-center items-center text-center">
            <button
              onClick={() => {
                handleCreateProject();
                // setStage("finalize");
              }}
              className="text-white ripple-bg-indigo-500 font-bold bg-[#4B39EF] shadow-sm shadow-black rounded-xl min-w-[200px] px-4 w-fit h-[40px]"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  Deposit{" "}
                  {isKeepMinimumBalance ? (
                    <>
                      {(
                        Number(workerWallet) * 0.0003 +
                        Number(workerWallet) * 0.0025
                      ).toFixed(4)}
                    </>
                  ) : (
                    <> {(Number(workerWallet) * 0.0003).toFixed(4)}</>
                  )}{" "}
                  SOL
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFinalize = () => {
    return (
      <div>
        <div className="flex justify-between mt-10">
          <div className="flex gap-2 text-white items-center  text-center">
            <FaCheckCircle style={{ color: "#32c132" }} />
            <p>Submit Requirements</p>
          </div>

          <div className="flex gap-2 text-white items-center text-center">
            <FaCheckCircle style={{ color: "#32c132" }} />
            <p>Review</p>
          </div>

          <div className="flex gap-2 text-white items-center text-center">
            <BsFillCircleFill style={{ color: "#32c132" }} />
            <p>Finalize</p>
          </div>

          {/* <div className="flex gap-2 items-center text-center">
          <AiOutlineCheckCircle className="text-lg" />
          <p>Complete</p>
        </div> */}
        </div>

        <div className="w-full mt-10 text-sm text-neutral-500">
          <div className="flex w-full justify-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>

          <h3 className="my-3 w-full flex justify-center text-center">
            Verifying the deposit, You can close this modal.
          </h3>
          <div className="text-[9px] mt-5">
            <p>
              Genex Market Mining, Volume generation and batch swap requires gas
              fee. Learn more about Fees here
            </p>
          </div>
        </div>

        {/* <div className="flex justify-between items-center text-center my-10">
        <div className="w-full flex justify-center items-center text-center">
          <button
            onClick={() => setStage("req")}
            className="text-white ripple-bg-neutral-500 font-bold bg-[#131011] border-2 shadow-sm shadow-black rounded-xl min-w-[200px] px-4 w-fit h-[40px]"
          >
            Back
          </button>
        </div>

        <div className="w-full flex justify-center items-center text-center">
          <button
            onClick={() => setStage("review")}
            className="text-white ripple-bg-indigo-500 font-bold bg-[#4B39EF] shadow-sm shadow-black rounded-xl min-w-[200px] px-4 w-fit h-[40px]"
          >
            Deposit 0.14 SOL
          </button>
        </div>
      </div> */}
      </div>
    );
  };

  return (
    <div
      className="backdrop-blur-md bg-opacity-10 "
      // className="bg-[#14181b] mt-[5%] shadow-md shadow-black p-4 rounded-2xl min-w-[600px] max-w-[600px]"
    >
      <div className="w-full flex justify-between items-center text-center ">
        {/* <div className="flex gap-3 items-center text-center text-2xl font-semibold">
          <FaPlusCircle style={{ color: "rgb(71 53 235)" }} />
          <h1>Add Project</h1>
        </div> */}
        {/* <div
          className="text-3xl cursor-pointer"
          onClick={() => closeModal(false)}
        >
          <FaXmark />
        </div> */}
      </div>
      {/* <ToastContainer /> */}

      {stage === "req" && <>{renderRequirements()}</>}
      {stage === "review" && <>{renderReview()}</>}
      {stage === "finalize" && <>{renderFinalize()}</>}
    </div>
  );
};

export default AddProjects;
