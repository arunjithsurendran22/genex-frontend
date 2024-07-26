"use client"
import { batchListApi } from "@services/batchBuy";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
interface CreatedPoolListProps {
  setPoolId: React.Dispatch<React.SetStateAction<string>>;
}

function CreatedPoolList({ setPoolId }: CreatedPoolListProps) {
  const [poolList, setPoolList] = useState<any[]>([]);
  const [poolListDropDown, setPoolListDropDown] = useState(false);

  useEffect(() => {
    createdPoolList();
  }, []);

  const createdPoolList = async () => {
    try {
      const response: any = await batchListApi();
      if (response.data) {
        setPoolList(response.data);
      }
    } catch (error) {
      console.log("unable to fetch pool list", error);
    }
  };

  const handlePoolListId = (poolId: string) => {
    setPoolId(poolId);
    setPoolListDropDown(!poolListDropDown);
  };
  return (
    <div className="mt-5">
      <label className="text-left text-neutral-500 text-xs mt-5">
        or Select from Created Batch Lists
      </label>
      <div
        onClick={() => {
          setPoolListDropDown(!poolListDropDown);
        }}
        className="flex items-center text-center cursor-pointer"
      >
        <p className="w-full p-2 text-left  my-3 bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border">
          Batch List (
          {
            poolList.filter(
              (pool) => pool.status === "progress" && !pool.isCompleted
            ).length
          }
          )
        </p>
        {poolListDropDown ? (
          <FaChevronUp className="-ml-10" />
        ) : (
          <FaChevronDown className="-ml-10" />
        )}
      </div>
      {poolListDropDown && (
        <div className="w-full">
          <div className="max-h-[130px] w-[15.5rem] sm:w-[40rem] md:w-[44rem] lg:w-[28rem] bg-bgDarker shadow-md shadow-black rounded-xl border-gray-800 border p-3  overflow-y-auto flex flex-col gap-3 absolute hide-scrollbar">
            {poolList
              ?.filter(
                (pool) => pool.status === "progress" && !pool.isCompleted
              )
              .map((pool, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer gap-3 items-center text-[.5rem] md:text-xs flex justify-between bg-bgBlack shadow-md shadow-black rounded-md border-gray-800 border text-gray-400 hover:text-gray-200"
                >
                  <p
                    
                    onClick={() => handlePoolListId(pool._id)}
                  >
                    {pool?.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatedPoolList;
