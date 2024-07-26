import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import InputBox from "./InputBox";
import { BsFileEarmarkExcel } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import Modal from "./Modal";
import TransactionSingle from "@components/trasations/TransationSingle";
import Loader from "./Loader";
import { IoClose } from "react-icons/io5";

export interface Column {
  header: string | JSX.Element;
  accessor: string;
  Cell?: ({ value }: { value: any }) => JSX.Element;
  isSortable?: boolean;
}

export interface TableProps {
  data: any[];
  columns: Column[];
  totalCount: number;
  fetchData: (pageIndex: number, searchTerm: string) => void;
  tableName: string;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isInputBox?: boolean;
  onApplyFilters: (filter1: number, filter2: number) => void;
  filterActive: boolean;
  isSelectionActive?: boolean;
  onClearFilters?: (() => void) | undefined
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  totalCount,
  fetchData,
  tableName,
  searchTerm,
  onSearchChange,
  isLoading,
  isInputBox,
  onApplyFilters,
  filterActive,
  isSelectionActive,
  onClearFilters,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filter1Value, setFilter1Value] = useState("");
  const [filter2Value, setFilter2Value] = useState("");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [applyBtn, setApplyBtn] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string | undefined>("");

  const isBtnDisabled = !filter1Value || !filter2Value || applyBtn;

  const limit = 10;

  useEffect(() => {
    fetchData(pageIndex, searchTerm);
  }, [fetchData, pageIndex, searchTerm]);

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 0 && newPageIndex < totalPages) {
      setPageIndex(newPageIndex);
    }
  };

  const filteredData = data.filter((item: Record<string, any>) =>
    Object.values(item).some(
      (value: any) =>
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilters = () => {
    const filter1Num = parseFloat(filter1Value);
    const filter2Num = parseFloat(filter2Value);
    onApplyFilters(filter1Num, filter2Num);
    handleShowFilter();
  };

  const numRowsToRender = Math.max(limit, filteredData.length);

  // Handle row click
  const handleRowClick = (row: any) => {
    if (isSelectionActive) {
      setSelectedRow(row);
      setShowModal(true);
      setShowFilter(false);
      setSelectedRowId(row._id);
    }
  };

  const clearFilters = () => {
    setFilter1Value("");
    setFilter2Value("");
    if (onClearFilters) {
      onClearFilters();
    }
    handleShowFilter();
  };
  const closeFilter: any = () => {
    setShowFilter(false);
    setFilter1Value("");
    setFilter2Value("");
  };

  return (
    <div className="p-3 bg-bgBlack shadow-lg shadow-black rounded-3xl border-gray-800  border relative">
      <div className="flex justify-between items-center mb-4">
        {filterActive && (
          <div className="flex items-center gap-10">
            <FaFilter
              className="cursor-pointer text-gray-600 hover:text-cyan"
              onClick={handleShowFilter}
            />
            <p className="uppercase ml-5 text-gray-600 text-xs md:text-[1rem]">
              {tableName}
            </p>
          </div>
        )}

        {isInputBox && (
          <div className="mb-4 flex justify-end">
            <div className="relative">
              <InputBox
                className="pl-8 pr-4 py-1 px-3"
                id=""
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={onSearchChange}
              />
            </div>
          </div>
        )}
      </div>
      {showFilter && (
        <div className="absolute rounded-3xl border border-gray-800 shadow-lg bg-bgBlack p-4 w-64 z-10">
          <div className="flex justify-end ">
            <IoClose
              className="text-gray-400 hover:text-red-600 cursor-pointer"
              onClick={closeFilter}
            />
          </div>

          <div className="mb-2 flex flex-row gap-5">
            <div className="flex flex-col items-start space-y-1">
              <label htmlFor="amount-1" className="text-gray-500 text-xs">
                Lowest
              </label>
              <input
                id="amount-1"
                type="number"
                value={filter1Value}
                onChange={(e) => setFilter1Value(e.target.value)}
                className="border rounded-md px-2 py-1 bg-secondary border-gray-800 shadow-lg w-20 text-[10px]"
                placeholder="Amount1"
                required
              />
            </div>
            <div className="flex flex-col items-start space-y-1">
              <label htmlFor="amount-2" className="text-gray-500 text-xs">
                Highest
              </label>
              <input
                id="amount-2"
                type="number"
                value={filter2Value}
                onChange={(e) => setFilter2Value(e.target.value)}
                className="border rounded-md px-2 py-1 bg-secondary border-gray-800 shadow-lg w-20 text-[10px]"
                placeholder="Amount2"
                required
              />
            </div>
          </div>

          <button
            onClick={applyFilters}
            disabled={isBtnDisabled}
            className={`rounded-full text-sm w-full py-1 font-semibold flex justify-center items-center ${
              isBtnDisabled
                ? "rounded-full shadow-md shadow-black border-gray-800 border hover:bg-cyanDark transition cursor-not-allowed"
                : "bg-primary hover:bg-cyanDark text-black hover:text-white"
            }`}
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            disabled={isBtnDisabled}
            className={`rounded-full text-sm w-full py-1 font-semibold flex justify-center items-center mt-3${
              isBtnDisabled
                ? "rounded-full shadow-md shadow-black border-gray-800 border bg-white text-black hover:bg-cyanDark transition cursor-not-allowed mt-3"
                : " hover:bg-cyanDark text-white hover:text-white"
            }`}
          >
            Clear
          </button>
        </div>
      )}
      <div className="overflow-hidden relative">
        <div className="overflow-y-auto h-96">
          <table className="rounded-lg w-full table-fixed">
            <thead className="border-b border-cyan">
              <tr>
                <th className="px-4 py-1 w-1/12 text-left text-cyan uppercase text-xs">
                  Sl No
                </th>
                {columns.map((col, index) => (
                  <th
                    key={col.accessor}
                    className="px-4 py-2 text-left text-xs text-cyan uppercase cursor-pointer"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-gray-400 text-sm no-data h-56"
                  >
                    <div className="flex items-center justify-center py-10 mt-52">
                      <div
                        className="mr-2 text-gray-400 text-2xl"
                        style={{ height: "300px " }}
                      >
                        <Loader />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-gray-400 text-sm no-data h-56"
                  >
                    <div className="flex items-center justify-center py-10 mt-52">
                      <BsFileEarmarkExcel
                        className="mr-2 text-red-800 text-5xl"
                        style={{ height: "300px " }}
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                Array.from({ length: numRowsToRender }).map((_, index) => {
                  const item = filteredData[index];
                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-800 ${
                        isSelectionActive
                          ? "hover:bg-gray-700 cursor-pointer"
                          : ""
                      }`}
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-4 py-2 text-cyan text-sm">
                        {item ? pageIndex * limit + index + 1 : "-"}
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.accessor}
                          className={`px-4 py-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-xs text-gray-400 ${
                            isSelectionActive
                              ? "hover:bg-bgBlack cursor-pointer"
                              : ""
                          }`}
                        >
                          {item
                            ? col.Cell
                              ? col.Cell({ value: item[col.accessor] })
                              : item[col.accessor]
                            : ""}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalCount > 0 && (
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
              className={`px-3 py-1 rounded-md text-xs ${
                pageIndex === 0 ? "text-gray-500" : "text-cyan"
              }`}
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
              className={`px-3 py-1 rounded-md text-xs ${
                pageIndex === 0 ? "text-gray-500" : "text-cyan"
              }`}
            >
              <IoIosArrowBack />
            </button>
            <span className="text-xs text-gray-500">
              Page {pageIndex + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages - 1}
              className={`px-3 py-1 rounded-md text-xs ${
                pageIndex === totalPages - 1 ? "text-gray-500" : "text-cyan"
              }`}
            >
              <IoIosArrowForward />
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={pageIndex === totalPages - 1}
              className={`px-3 py-1 rounded-md text-xs ${
                pageIndex === totalPages - 1 ? "text-gray-500" : "text-cyan"
              }`}
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        )}
      </div>
      {showModal && selectedRow && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <TransactionSingle rowId={selectedRowId} />
        </Modal>
      )}
    </div>
  );
};

export default Table;
