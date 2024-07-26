"use client";
import React, { useEffect, useState } from "react";
import { IoIosAddCircle, IoMdTrendingUp } from "react-icons/io";
import { AiOutlineThunderbolt } from "react-icons/ai";
import Modal from "@common/Modal";
import Deposite from "./components/Deposite";
import { useUser } from "@context/UserContext";
import AddProjects from "@components/projects/AddProjects";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import WithdrawalModal from "./components/Withdraw";
import { motion } from "framer-motion";

const Dashboard = () => {
  const {
    loader,
    balance,
    projectCount,
    walletsCount,
    totalVolumeAmount,
    accessToken,
    loadingBalance,
    loadingProjectCount,
    loadingWalletsCount,
    loadingTotalVolumeAmount,
  } = useUser();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);

  const openDepositModal = () => {
    setDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setDepositModalOpen(false);
  };

  const openWithdrawModal = () => {
    setWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
  };

  const openAddProjectModal = () => {
    setAddProjectModalOpen(true);
  };

  const closeAddProjectModal = () => {
    setAddProjectModalOpen(false);
  };

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;
  const url = `${serverUrl.replace(/^http/, "ws")}?token=${accessToken}`;

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("Websocket opened!");
    };

    ws.onclose = () => {
      console.log("Websocket closed!");
    };

    ws.onmessage = (msg) => {
      console.log("socket data", msg, JSON.parse(msg.data));

      const messages = JSON.parse(msg.data);

      if (messages) {
        if (messages.message?.data) {
          toast.success(messages.message.data);
        } else if (messages.error?.error) {
          toast.error(messages.error.error);
        } else if (messages.isError?.isError) {
          toast.error(messages?.error?.error?.transactionMessage);
        } else if (messages.data?.data) {
          toast.success(messages.data.data);
        }
      }
    };

    ws.onerror = (error) => {
      console.log(`Websocket error: ${error}`);
    };
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: (i: any) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.5,
        duration: 0.8,
      },
    }),
  };

  return (
    <>
      <div className="bg-primary py-5">
        <div className="p-2 lg:p-6 lg:flex lg:justify-around gap-1 shadow-xl bg-secondary shadow-black rounded-3xl border-gray-800 border items-center   md:mx-auto h-auto mx-2 lg:w-8/12">
          {/* Balance Section */}
          <motion.div
            className="w-4/12w-4/12"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            
          >
            <p className="text-gray-600 mb-2 font-semibold text-xs md:text-lg">
              Balance <span className="text-[12px]">(MasterWallet)</span>
            </p>
            <h5 className="md:text-2xl text-sm font-bold">
              {loadingBalance ? (
                <div className="w-20 h-4 bg-gray-300 animate-pulse rounded-full" />
              ) : (
                <>
                  {balance} <span className="text-gray-400 ">SOL</span>
                </>
              )}
            </h5>
            <div className="mt-6 md:mt-10 flex flex-col md:flex-row">
              <button
                className="mr-2 md:mr-4 w-full md:w-auto rounded-full shadow-md shadow-black  border-gray-800 border px-3 py-1 hover:bg-cyanDark transition"
                onClick={openDepositModal}
                disabled={loader}
              >
                Deposit SOL
              </button>
              <button
                className="mt-2 md:mt-0 w-full md:w-auto rounded-full shadow-md shadow-black  border-gray-800 border px-3 py-1 hover:bg-cyanDark transition"
                onClick={openWithdrawModal}
                disabled={loader}
              >
                Withdraw SOL
              </button>
            </div>
          </motion.div>
          {/* Statistics Section */}
          <motion.div
            className="h-full flex flex-col justify-center lg:w-4/12 "
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col justify-center items-center w-1/3">
                <p className="text-gray-400 text-[.6rem] md:text-[.9rem]">
                  Total Projects
                </p>
                <p className="font-bold text-xs md:text-2xl">
                  {loadingProjectCount ? (
                    <div className="w-20 h-4 bg-gray-300 animate-pulse rounded-full" />
                  ) : (
                    <>{projectCount}</>
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center w-1/3">
                <p className="text-gray-400 text-[.6rem] md:text-[.9rem]">
                  Total Wallets
                </p>
                <p className="font-bold text-xs md:text-2xl">
                  {loadingWalletsCount ? (
                    <div className="w-20 h-4 bg-gray-300 animate-pulse rounded-full" />
                  ) : (
                    <>{walletsCount} </>
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center w-1/3">
                <p className="text-gray-400 text-[.6rem] md:text-[.9rem]">
                  Total Trade Volume
                </p>
                <p className="font-bold text-xs md:text-2xl">
                  {loadingTotalVolumeAmount ? (
                    <div className="w-20 h-4 bg-gray-300 animate-pulse rounded-full" />
                  ) : (
                    <>{totalVolumeAmount.toFixed(3)} </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
          {/* Additional Section */}
          <motion.div
            className="flex justify-around items-center h-full lg:w-4/12"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            
          >
            {/* Add Projects Section */}
            <div
              onClick={openAddProjectModal}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="flex justify-center items-center opacity-90">
                <div className="text-primary shadow-md shadow-black border-[3px] p-5 rounded-3xl border-primary bg-secondary">
                  <IoIosAddCircle className="text-4xl" />
                </div>
              </div>
              <p className="text-neutral-500 mt-1 text-xs md:text-[1rem]">
                Add Projects
              </p>
            </div>

            {/* Trade Section */}
            <div className="flex flex-col items-center cursor-pointer relative group">
              <div className="flex justify-center items-center opacity-20">
                <div className="text-cyan shadow-md shadow-black border-[3px] py-[11px] px-3 rounded-3xl bg-black border-cyan">
                  <IoMdTrendingUp className="text-5xl" />
                </div>
              </div>
              <p className="text-neutral-500 mt-1 text-xs md:text-[1rem]">
                Trade
              </p>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-black text-white text-xs py-1 px-1 rounded-md transition-opacity duration-300">
                Coming soon...
              </span>
            </div>

            {/* Auto Trade Section */}
            <div className="flex flex-col items-center cursor-pointer relative group">
              <div className="flex justify-center items-center opacity-20">
                <div className="text-orange shadow-md shadow-black border-[3px] p-3 rounded-3xl bg-black border-orange">
                  <AiOutlineThunderbolt className="text-5xl" />
                </div>
              </div>
              <p className="text-neutral-500 mt-1 text-xs md:text-[1rem]">
                Auto Trade
              </p>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-black text-white text-xs py-1 px-1 rounded-md transition-opacity duration-300">
                Coming soon...
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}

      <Modal
        isOpen={depositModalOpen}
        onClose={closeDepositModal}
        title="Deposit SOL"
      >
        <Deposite />
      </Modal>

      <Modal
        isOpen={withdrawModalOpen}
        onClose={closeWithdrawModal}
        title={
          <>
            {" "}
            <h1 className="text-white font-semibold text-2xl">
              Withdraw Solana
            </h1>
          </>
        }
      >
        <WithdrawalModal closeModal={closeWithdrawModal} />
      </Modal>

      <Modal
        isOpen={addProjectModalOpen}
        onClose={closeAddProjectModal}
        title={
          <>
            <div className="flex gap-3 items-center text-center text-2xl font-semibold">
              <FaPlusCircle style={{ color: "rgb(71 53 235)" }} />
              <h1>Add Project</h1>
            </div>
          </>
        }
      >
        <AddProjects closeModal={closeAddProjectModal} />
      </Modal>
    </>
  );
};

export default Dashboard;