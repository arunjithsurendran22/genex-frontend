import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Table, { Column } from "@common/Table";
import { transactionHistory } from "@services/trasation";

// Extend dayjs with UTC plugin
dayjs.extend(utc);

function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [sort, setSort] = useState<"amtAsc" | "amtDsc">("amtDsc");
  const [searchNeed, setSearchNeed] = useState<boolean>(true);
  const [filterActive, setFilterActive] = useState<boolean>(true);
  const [lowestAmt, setLowestAmt] = useState<number | null>(null);
  const [highestAmt, setHighestAmt] = useState<number | null>(null);
  const [selectionActive, setSelectionActive] = useState<boolean>(true);
  const limit = 10;

  // Fetch transactions function with sorting and filters
  const fetchTransactions = useCallback(
    async (pageIndex: number, searchTerm: string) => {
      setLoading(true);

      const params: any = {
        limit,
        skip: pageIndex,
        sort,
        lowest: lowestAmt,
        highest: highestAmt,
      };

      if (searchTerm.trim() !== "") {
        const trimmedTerm = searchTerm.trim();
        const length = trimmedTerm.length;

        if (length <= 4) {
          params.type = trimmedTerm.toLowerCase();
        } else if (length <= 40 || trimmedTerm.toLowerCase().startsWith("g")) {
          params.wallet = trimmedTerm.toLowerCase();
        } else if (length > 40 && length <= 60) {
          params.project = trimmedTerm.toLowerCase();
        } else {
          params.signature = trimmedTerm.toLowerCase();
        }
      }

      try {
        const response = await transactionHistory(params);
        const { transaction, totalTransaction } = response.data;

        const formattedTransactions = transaction.map((item: any) => ({
          _id: item._id,
          amount: item.amount,
          createdAt: item.createdAt,
          type: item.type,
          masterWalletBalance: item.master_wallet_info.balance,
          updatedAt: item.master_wallet_info.updatedAt,
          amountPerWallet:
            item.token_account_info.length > 0
              ? item.token_account_info[0].amountPerWallet
              : "",
          boosterInterval:
            item.token_account_info.length > 0
              ? item.token_account_info[0].boosterInterval
              : "",
          slippagePercentage:
            item.token_account_info.length > 0
              ? item.token_account_info[0].slippagePctg
              : "",
          totalWalletCount:
            item.token_account_info.length > 0
              ? item.token_account_info[0].total_wallet_count
              : "",
          tradesPerInterval:
            item.token_account_info.length > 0
              ? item.token_account_info[0].tradesPerInterval
              : "",
          workerWalletBalance: item.worker_wallet_info.balance,
          createdBy: item.user,
          masterWalletPublicKey: item.master_wallet_info.public_key,
          workerWalletName: item.worker_wallet_info.name,
          tokenBalance: item.worker_wallet_info.token_balance,
          signature: item.signature,
        }));

        setTransactions(formattedTransactions);
        setTotalCount(totalTransaction);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    },
    [sort, lowestAmt, highestAmt, pageIndex, searchTerm]
  );

  useEffect(() => {
    fetchTransactions(pageIndex, searchTerm);
  }, [fetchTransactions, pageIndex, searchTerm, lowestAmt, highestAmt]);

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPageIndex(0); // Reset pageIndex when search term changes
  };

  // Toggle sorting direction
  const toggleSort = () => {
    const newSort = sort === "amtAsc" ? "amtDsc" : "amtAsc";
    setSort(newSort);
    setPageIndex(0);
  };

  // Handle applying filters
  const handleApplyFilters = (filter1Value: number, filter2Value: number) => {
    setLowestAmt(filter1Value);
    setHighestAmt(filter2Value);
    fetchTransactions(pageIndex, searchTerm);
    setPageIndex(0);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setLowestAmt(null);
    setHighestAmt(null);
    fetchTransactions(pageIndex, searchTerm);
    setFilterActive(true);
  };

  // Define a function to truncate text
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) {
      return "";
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  // Define table columns
  const columns: Column[] = [
    {
      header: "Date",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => (
        <span>{dayjs.utc(value).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      Cell: ({ value }: { value: string }) => (
        <span className={value === "buy" ? "text-green-500" : "text-red-500"}>
          {value}
        </span>
      ),
    },
    {
      header: (
        <div className="flex items-center">
          <div>Amount</div>
          <div className="ml-1 flex flex-col">
            <button
              className={`outline-none focus:outline-none ${
                sort === "amtAsc" ? "text-blue-500" : ""
              }`}
              onClick={toggleSort}
            >
              {sort === "amtAsc" ? "▲" : "▼"}
            </button>
          </div>
        </div>
      ),
      accessor: "amount",
      Cell: ({ value }: { value: string }) => <span>{value}</span>,
      isSortable: true,
    },
    {
      header: "Worker Wallet Name",
      accessor: "workerWalletName",
      Cell: ({ value }: { value: string }) => (
        <span>{truncateText(value, 15)}</span>
      ),
    },
    {
      header: "Master Wallet Balance",
      accessor: "masterWalletBalance",
    },
    {
      header: "Amount Per Wallet",
      accessor: "amountPerWallet",
    },
    {
      header: "Worker Wallet Balance",
      accessor: "workerWalletBalance",
    },
    {
      header: "Token Balance",
      accessor: "tokenBalance",
    },
    {
      header: "Signature",
      accessor: "signature",
      Cell: ({ value }: { value: string }) => (
        <span>{truncateText(value, 20)}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="md:w-8/12 mx-auto ">
        <Table
          data={transactions}
          columns={columns}
          totalCount={totalCount}
          fetchData={fetchTransactions}
          tableName="Transaction History"
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isLoading={loading}
          isInputBox={searchNeed}
          onApplyFilters={handleApplyFilters}
          filterActive={filterActive}
          isSelectionActive={selectionActive}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
}

export default TransactionHistory;
