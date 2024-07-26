import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const ModalPopUp: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="   h-16"style={{border:"2px solid red"}}>
      <div className="bg-white absolute inset-x-0 top-0 h-16">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalPopUp;

