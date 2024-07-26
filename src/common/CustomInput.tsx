// CustomInput.tsx

import React from "react";
import { FaPercentage } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { IoMdRefresh } from "react-icons/io";
import { SiSolana } from "react-icons/si";

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactElement;
  type?: "text" | "number";
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}) => {
  let selectedIcon = null;

  return (
    <div className="w-full ">
      <p className="text-left text-neutral-500 text-xs mb-1">{label}</p>
      <div className="flex border-b rounded-2xl border-indigo-800 pb-2 items-center text-center w-full">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent pl-2 text-sm placeholder:text-neutral-600 placeholder:text-xs placeholder:text-thin w-full font-semibold border-0 focus:outline-none"
        />
        {icon || selectedIcon}
      </div>
    </div>
  );
};

export default CustomInput;
