import React, { useEffect, useState, useCallback } from "react";
import { walletPaymentHistory } from "@services/wallet";
import Table from "@common/Table";
import dayjs from "dayjs"; // Import dayjs
import utc from "dayjs/plugin/utc"; // Import UTC plugin for dayjs

// Extend dayjs with UTC plugin
dayjs.extend(utc);

interface PaymentData {
  _id: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  payment_status: string;
  feePerWallet: number;
}

interface SingleWalletPaymentProps {
  walletId: string | null;
}

const SingleWalletPayment: React.FC<SingleWalletPaymentProps> = ({
  walletId,
}) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchNeed, setSearchNeed] = useState<boolean>(false);
  const [filterActive, setFilterActive] = useState(false);

  const fetchPaymentHistory = useCallback(
    async (pageIndex: number, searchTerm: string) => {
      setLoading(true);
      const limit = 10;
      const params: any = {
        limit,
        skip: pageIndex,
      };
      if (searchTerm.trim() !== "") {
        params.name = searchTerm;
      }
      try {
        if (walletId !== null) {
          const response = await walletPaymentHistory(walletId, params);
          const data = response.data;
          setPaymentHistory(data.paymentHistory);
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      } finally {
        setLoading(false);
      }
    },
    [walletId]
  );

  useEffect(() => {
    fetchPaymentHistory(0, searchKeyword);
  }, [fetchPaymentHistory, searchKeyword]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };
  const handleApplyFilters = (filter1Value: any, filter2Value: any) => {
    const newFilterArray = [filter1Value, filter2Value];
  };

  const columns = [
    { header: "Total Amount", accessor: "totalAmount" },
    {
      header: "Date",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => (
        <span>{dayjs.utc(value).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value }: { value: string }) => (
        <span
          className={`px-2 py-1 rounded-lg ${
            value === "un-paid" ? " text-red-600" : " text-green-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Payment Status",
      accessor: "payment_status",
      Cell: ({ value }: { value: string }) => (
        <span
          className={`px-2 py-1 rounded-lg ${
            value === "progress" ? "text-yellow-400 " : "text-green-500 "
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "Fee Per Wallet", accessor: "feePerWallet" },
  ];

  return (
    <div>
      <Table
        data={paymentHistory}
        columns={columns}
        totalCount={totalCount}
        fetchData={fetchPaymentHistory}
        tableName="Payment History"
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

export default SingleWalletPayment;
