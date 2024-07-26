import React, { useState, useEffect, useCallback } from "react";
import { walletTransactions } from "@services/wallet";
import Table from "@common/Table";
import dayjs from "dayjs"; // Import dayjs
import utc from "dayjs/plugin/utc"; // Import UTC plugin for dayjs

// Extend dayjs with UTC plugin
dayjs.extend(utc);

interface TransactionData {
  _id: string;
  amount: number;
  type: string;
  createdAt: string;
  signature_status: string;
  boosterInterval: string;
}

interface SingleWalletTransactionsProps {
  walletId: string | null;
}

const SingleWalletTransactions: React.FC<SingleWalletTransactionsProps> = ({
  walletId,
}) => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchNeed, setSearchNeed] = useState<boolean>(false);
  const [filterActive, setFilterActive] = useState(false);

  const limit = 10;

  const fetchData = useCallback(
    async (pageIndex: number, searchTerm: string) => {
      setLoading(true);

      try {
        const params: any = {
          limit,
          skip: pageIndex,
        };
        if (searchTerm.trim() !== "") {
          params.search = searchTerm; // Adjusted to use 'search' parameter
        }

        if (walletId !== null) {
          const response = await walletTransactions(walletId, params);
          const data = response.data;
          console.log("data", data);

          if (response.status === 200) {
            setTransactions(data.transactions);
            setTransactionCount(data.trasactionCount);
          }
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    },
    [walletId]
  );

  const columns = [
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
    { header: "Amount", accessor: "amount" },
    {
      header: "Signature Status",
      accessor: "signature_status",
      Cell: ({ value }: { value: string }) => (
        <span
          className={
            value === "progress" ? "text-yellow-700" : "text-green-500"
          }
        >
          {value}
        </span>
      ),
    },
    { header: "Booster Interval", accessor: "boosterInterval" },
  ];

  useEffect(() => {
    fetchData(0, searchKeyword);
  }, [fetchData, searchKeyword]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleApplyFilters = (filter1Value: any, filter2Value: any) => {
    const newFilterArray = [filter1Value, filter2Value];
  };
  return (
    <div>
      <Table
        data={transactions}
        columns={columns}
        totalCount={transactionCount}
        fetchData={fetchData}
        tableName="transaction history"
        searchTerm={searchKeyword}
        onSearchChange={handleSearchChange}
        isLoading={loading}
        isInputBox={searchNeed}
        onApplyFilters={handleApplyFilters}
        filterActive={filterActive}
      />
    </div>
  );
};

export default SingleWalletTransactions;
