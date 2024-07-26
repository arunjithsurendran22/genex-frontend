import React, { FC } from "react";

export interface SubTabProps {
  setSubTab: React.Dispatch<React.SetStateAction<string>>;
  SubTab: string;
  Name: string;
}

const SubTab: FC<SubTabProps> = ({ setSubTab, SubTab, Name }) => {
  return (
    <div
      onClick={() => setSubTab(Name)}
      className={`${
        SubTab === Name
          ? "bg-[#39D2C0] font-semibold border border-[#249689]"
          : "bg-white border-none"
      } cursor-pointer w-fit md:px-3 px-2 py-1 rounded-full text-black md:text-md text-xs shadow-md shadow-black `}
    >
      {Name}
    </div>
  );
};

export default SubTab;
