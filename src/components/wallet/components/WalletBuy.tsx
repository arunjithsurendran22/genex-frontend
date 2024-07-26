import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@context/UserContext";
import { walletBuySell } from "@services/wallet";
import { toast } from "react-hot-toast";
import CustomInput from "@common/CustomInput";
import { fetchProjectsService } from "@services/projects";
import { query } from "../../../types/global";
import { SiSolana } from "react-icons/si";
import { IoIosArrowDown, IoMdRefresh, IoIosArrowUp } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaPercentage, FaSearch } from "react-icons/fa";
import Loader from "@common/Loader";

import InputBox from "@common/InputBox";
import { useDebounce } from "@hooks/useDebounce ";
import useScroll from "@hooks/useScroll ";

interface WalletBuyProps {
  walletId: string | null;
  setShowBuyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletBuy: React.FC<WalletBuyProps> = ({ walletId, setShowBuyModal }) => {
  const [amountPerWallets, setAmountPerWallets] = useState<string>("");
  const [tradesPerInterval, setTradesPerInterval] = useState<string>("");
  const [boosterInterval, setBoosterInterval] = useState<string>("");
  const [slippagePctg, setSlippagePctg] = useState<string>("");
  const { masterWalletId } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("");
  const [buyBtnLoading, setBuyBtnLoading] = useState<boolean>(false);
  const [buyBtn, setBuyBtn] = useState<boolean>(false);
  const [inputBoxActive, setInputBoxActive] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const debouncedFilterSearch = useDebounce(filterSearch, 500);
  const [searchNoResults, setSearchNoResults] = useState<boolean>(false);

  const isButBtnDisabled =
    !amountPerWallets ||
    !tradesPerInterval ||
    !boosterInterval ||
    !slippagePctg ||
    buyBtn;

  const loadMoreProjects = () => setPage((prevPage) => prevPage + 1);
  const containerRef = useScroll({
    loading,
    hasMore,
    onLoadMore: loadMoreProjects,
  });

  useEffect(() => {
    setProjects([]);
    setPage(1);
    setHasMore(true);
    fetchProjects(1);
  }, [debouncedFilterSearch]);

  useEffect(() => {
    if (page > 1) {
      fetchProjects(page);
    }
  }, [page]);

  const fetchProjects = async (page: number) => {
    setLoading(true);
    const limit = 10;
    const skip = page - 1;
    const params: query = { limit, skip };
    if (debouncedFilterSearch) {
      params.token = debouncedFilterSearch;
    }

    try {
      const response = await fetchProjectsService(params);
      const { projects, projectCount } = response.data;
      setTotalProjects(projectCount);
      if (projects.length === 0) {
        if (debouncedFilterSearch) {
          setSearchNoResults(true);
        } else {
          setHasMore(false);
        }
      } else {
        setProjects((prevProjects) => [...prevProjects, ...projects]);
        setSearchNoResults(false);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyBtnLoading(true);

    const payload = {
      tokenAddress: selectedTokenAddress,
      worker_wallet: walletId,
      master_wallet: masterWalletId,
      side: "out",
      amountPerWallets: amountPerWallets,
      tradesPerInterval: tradesPerInterval,
      boosterInterval: boosterInterval,
      slippagePctg: parseFloat(slippagePctg),
    };

    try {
      const response = await walletBuySell(payload);
      if (response) {
        setSelectedTokenAddress("");
        setSlippagePctg("");
        setBoosterInterval("");
        setAmountPerWallets("");
        setAmountPerWallets("");
        setBuyBtnLoading(false);
        setShowBuyModal(false);
        toast.success("Transaction successful!");
      }
    } catch (error: any) {
      setBuyBtnLoading(false);
      console.error("Error:", error);
      toast.error(error.message || "Transaction failed!");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setInputBoxActive((prev) => !prev);
  };

  const handleTokenSelect = (tokenAddress: string) => {
    setDropdownOpen(false);
    setInputBoxActive(false);
    setSelectedTokenAddress(tokenAddress);
  };

  const handleSlippageChange = (value: string) => {
    setSlippagePctg(value);
  };

  const handleTimeIntervalChange = (value: string) => {
    setBoosterInterval(value);
  };

  const handleTradesIntervalChange = (value: string) => {
    setTradesPerInterval(value);
  };

  const handleAmountChange = (value: string) => {
    setAmountPerWallets(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterSearch(e.target.value);
  };

  return (
    <div className="px-3 shadow-md rounded-lg bg-bgBlack w-[400px] mb-2 relative">
      <div className="relative w-full">
        {inputBoxActive && (
          <div className="mb-3 flex items-center gap-4">
            <InputBox
              type="text"
              id=""
              className="w-44 py-1 px-3  "
              placeholder="Enter token address..."
              value={filterSearch}
              onChange={handleInputChange}
            />
            <FaSearch className="text-gray-800" />
          </div>
        )}
        <button
          className="text-[.7rem] w-full px-4 py-2 bg-bgBlack shadow-inner shadow-black rounded-xl border-gray-800 border  text-gray-400 flex items-center gap-2 justify-between"
          onClick={toggleDropdown}
        >
          {selectedTokenAddress || "Select Token Address"}
          {dropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>

        {dropdownOpen && (
          <div
            className="absolute z-10 mt-2 w-full bg-bgBlack shadow-inner rounded-md overflow-y-auto max-h-60 hide-scrollbar"
            ref={containerRef}
          >
            {projects.map((project, index) => (
              <p
                key={index}
                className="text-xs p-2 cursor-pointer hover:bg-gray-800 text-gray-400 bg-bgBlack shadow-inner shadow-black rounded-md border-gray-800 border mt-1"
                onClick={() => handleTokenSelect(project.tokenAddress)}
              >
                {project.tokenAddress}
              </p>
            ))}
            {loading && (
              <div className="flex justify-center items-center p-2">
                <Loader />
              </div>
            )}
          </div>
        )}

        {searchResults.length > 0 && (
          <div
            className="absolute z-10 mt-2 w-full bg-bgBlack shadow-inner rounded-md overflow-y-auto max-h-60 hide-scrollbar"
            ref={containerRef}
          >
            {searchResults.map((result, index) => (
              <p
                key={index}
                className="text-xs p-2 cursor-pointer hover:bg-gray-800 text-gray-400 bg-bgBlack shadow-inner shadow-black rounded-md border-gray-800 border mt-1"
                onClick={() => handleTokenSelect(result.tokenAddress)}
              >
                {result.tokenAddress}
              </p>
            ))}
            {loading && (
              <div className="flex justify-center items-center p-2">
                <Loader />
              </div>
            )}
          </div>
        )}
        {searchNoResults && (
          <div className="absolute z-10 mt-2 w-full bg-bgBlack shadow-inner rounded-md overflow-y-auto max-h-60 hide-scrollbar">
            <div className="p-2 text-gray-400 bg-bgBlack shadow-inner shadow-black rounded-md border-gray-800 border mt-1">
              No data found
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <CustomInput
            label="Amount per wallet"
            value={amountPerWallets}
            onChange={handleAmountChange}
            placeholder="minimum 0.0035"
            icon={<SiSolana className="text-xl text-[#4B39EF]" />}
            type="text"
          />
        </div>
        <div className="mb-4">
          <CustomInput
            label="Trades Per Interval"
            value={tradesPerInterval}
            onChange={handleTradesIntervalChange}
            placeholder="minimum 1 trade"
            icon={<IoMdRefresh className="text-xl text-[#4B39EF]" />}
            type="text"
          />
        </div>
        <div className="mb-4">
          <CustomInput
            label="Time Interval"
            value={boosterInterval}
            onChange={handleTimeIntervalChange}
            placeholder="minimum 10 seconds"
            icon={<AiOutlineClockCircle className="text-xl text-[#4B39EF]" />}
            type="text"
          />
        </div>
        <div className="mb-4">
          <CustomInput
            label="Slippage"
            value={slippagePctg}
            onChange={handleSlippageChange}
            placeholder="minimum 0.0035"
            icon={<FaPercentage className="text-xl text-[#4B39EF]" />}
            type="text"
          />
        </div>

        <button
          type="submit"
          className={`rounded-full text-sm w-full py-3 font-semibold flex justify-center items-center ${
            isButBtnDisabled
              ? "rounded-full shadow-md shadow-black border-gray-800 border hover:bg-cyanDark transition cursor-not-allowed"
              : "bg-primary hover:bg-cyanDark text-black hover:text-white"
          }`}
          disabled={isButBtnDisabled}
        >
          {buyBtnLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            "Buy"
          )}
        </button>
      </form>
    </div>
  );
};

export default WalletBuy;
