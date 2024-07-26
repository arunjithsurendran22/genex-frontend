import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Wallet, query } from "../../types/global";
import { workerWalletListProjct } from "@services/wallet";
import Loader from "src/common/Loader";
import { useUser } from "@context/UserContext";
import WalletBuy from "./components/WalletBuy";
import WalletSell from "./components/WalletSell";
import InputBox from "@common/InputBox";
import SkeltonLoaderSet from "@common/SkeltonLoaderSet";
import { useDebounce } from "@hooks/useDebounce ";
import useScroll from "@hooks/useScroll ";
import { IoClose } from "react-icons/io5";

const WorkerWalletList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const router = useRouter();
  const [filterSearch, setFilterSearch] = useState<string>("");
  const debouncedFilterSearch = useDebounce(filterSearch, 500); // Use debounce with a delay of 500ms
  const { masterWalletId } = useUser();

  const loadMoreWallets = () => setPage((prevPage) => prevPage + 1);
  const containerRef = useScroll({
    loading,
    hasMore,
    onLoadMore: loadMoreWallets,
  });

  useEffect(() => {
    setWallets([]);
    setPage(1);
    setHasMore(true);
    fetchWallets(1);
  }, [debouncedFilterSearch]); // Trigger search on debounced filter search value

  useEffect(() => {
    if (page > 1) {
      fetchWallets(page);
    }
  }, [page]);

  const fetchWallets = async (page: number) => {
    const limit = 10;
    const skip = page - 1;
    const params: query = { limit, skip };
    if (debouncedFilterSearch) {
      params.name = debouncedFilterSearch;
    }
    setLoading(true);
    try {
      if (!masterWalletId) {
        setLoading(false);
        console.error("masterWalletId is undefined");
        return;
      }
      const response = await workerWalletListProjct(masterWalletId, params);
      const workerWallets = response?.data?.getWorkerWallets || [];

      if (workerWallets.length === 0) {
        setHasMore(false);
      } else {
        setWallets((prevWallets) => [...prevWallets, ...workerWallets]);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent, walletId: string) => {
    e.stopPropagation();
    if (walletId) {
      router.push(`/walletDetails/${walletId}`);
    } else {
      console.error("walletId is undefined");
    }
  };

  const handleBuyClick = (e: React.MouseEvent, walletId: string) => {
    e.stopPropagation();
    if (walletId) {
      setSelectedWalletId(walletId);
      setShowBuyModal(true);
    } else {
      console.error("walletId is undefined");
    }
  };

  const handleSellClick = (e: React.MouseEvent, walletId: string) => {
    e.stopPropagation();
    if (walletId) {
      setSelectedWalletId(walletId);
      setShowSellModal(true);
    } else {
      console.error("walletId is undefined");
    }
  };

  return (
    <div>
      {loading && wallets.length === 0 ? (
        <SkeltonLoaderSet />
      ) : (
        <>
          <div className="flex justify-end container mx-auto w-8/12">
            <InputBox
              className="pl-8 pr-4 py-1 px-3"
              id=""
              type="text"
              placeholder="Search..."
              value={filterSearch}
              bgColor="bg-secondary"
              onChange={(e) => setFilterSearch(e.target.value)}
            />
          </div>
          {wallets.length === 0 ? (
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img
                  src="https://www.svgrepo.com/show/528574/sad-square.svg"
                  alt="No data"
                  className="w-32 h-32 mx-auto mt-20"
                />
                <p className="text-gray-500">
                  Seems like there are no wallets to show
                </p>
              </div>
            </div>
          ) : (
            <div
              className="overflow-y-auto hide-scrollbar md:w-8/12 mx-2 md:mx-auto h-[35rem]"
              ref={containerRef}
            >
              {wallets.map((wallet, index) => (
                <div
                  key={`${wallet._id}-${index}`}
                  className="bg-bgBlack shadow-md shadow-black rounded-xl border-gray-800 border my-3 p-3  m-2"
                >
                  <div className="md:grid md:grid-cols-3 items-center">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={(e) => handleClick(e, wallet._id)}
                    >
                      <img
                        className="h-6 w-6 md:h-10 md:w-10"
                        src="https://imgs.search.brave.com/MLC6uvTYddhvpJIu7RiCPMZz1EWgyLj-OWWSCy0wY-U/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9sb2dv/dHlwLnVzL2ZpbGUv/c29sYW5hLnN2Zw.svg"
                        alt="token logo"
                      />
                      <p className="text-[.7rem] md:text-[.8rem] ml-2 text-gray-400 hover:text-white">
                        {wallet.name}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center items-center text-center">
                      <p className="font-bold text-cyan">
                        {wallet.balance} SOL
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-2 py-1 text-xs hover:text-cyan drop-shadow-2xl "
                        onClick={(e) => handleBuyClick(e, wallet._id)}
                      >
                        Buy
                      </button>
                      <button
                        className="px-2 py-1 text-xs hover:text-cyan "
                        onClick={(e) => handleSellClick(e, wallet._id)}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {loading && hasMore && (
            <div className="flex justify-center items-center w-8/12 mx-auto">
              <Loader strokeWidth="2" />
            </div>
          )}
        </>
      )}

      {showBuyModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div
            className="absolute inset-0 bg-bgBlack backdrop-blur-sm opacity-50 "
            onClick={() => setShowBuyModal(false)}
          ></div>
          <div className="relative bg-bgBlack p-4 rounded-3xl border border-gray-800 shadow-md shadow-black ">
            <button
              className=" top-0 right-0  mr-2 px-2 py-1 text-white rounded-full mt-2 "
              onClick={() => setShowBuyModal(false)}
            >
              <IoClose className="" />
            </button>
            <WalletBuy
              walletId={selectedWalletId}
              setShowBuyModal={setShowBuyModal}
            />
          </div>
        </div>
      )}
      {showSellModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-bgBlack backdrop-blur-sm opacity-50"
            onClick={() => setShowSellModal(false)}
          ></div>
          <div className="relative bg-bgBlack p-4 rounded-3xl border border-gray-800 shadow-md shadow-black">
            <button
              className=" top-0 right-0 mt-2 mr-2 px-2 py-1 text-white rounded-full"
              onClick={() => setShowSellModal(false)}
            >
              <IoClose />
            </button>
            <WalletSell
              walletId={selectedWalletId}
              setShowSellModal={setShowSellModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerWalletList;
