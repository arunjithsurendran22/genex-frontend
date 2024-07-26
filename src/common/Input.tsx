import React from "react";
import { AiOutlineCopy } from "react-icons/ai";

interface InputProps {
  value: string;
  onCopy: () => void;
  showCopiedNotification: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onCopy,
  showCopiedNotification,
  className,
}) => {
  return (
    <div className={`relative border-b-2 px-3 py-1 text-[#57636C] border-[#57636c] rounded-b-2xl flex items-center ${className}`}>
      <input
        disabled
        value={value}
        className="bg-transparent text-xs w-full"
      />
      <AiOutlineCopy
        className="cursor-pointer hover:text-gray-400 ml-2"
        onClick={onCopy}
      />
      {showCopiedNotification && (
        <div className="absolute left-full top-4 text-xs text-green-200 bg-black p-1 rounded-lg">
          Text copied!
        </div>
      )}
    </div>
  );
};

export default Input;
