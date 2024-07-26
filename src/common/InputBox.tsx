import React from "react";

interface InputProps {
  type: string | number | undefined | any;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  bgColor?: string;
}

const InputBox: React.FC<InputProps> = ({
  type,
  id,
  value,
  placeholder,
  onChange,
  className,
  bgColor,
}) => {
  return (
    <div>
      <input
        type={type}
        id={id}
        value={value}
        placeholder={placeholder}
        className={`${
          bgColor ? bgColor : "bg-bgBlack"
        } text-white rounded-full  border-b border-primary focus:bg-transparent focus:outline-none  ${className}`}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default InputBox;
