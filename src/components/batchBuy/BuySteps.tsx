"use client";
import React, { useState } from "react";
import CreateBatch from "./CreateBatch";
import BuyOrSell from "./BuyOrSell";
import { FaCheckCircle, FaDotCircle } from "react-icons/fa";

interface BuyStepsProps {
  selectedWallets: string[];
  setSelectedWallets: React.Dispatch<React.SetStateAction<string[]>>;
  allWallets: any[];
  zeroBalanceWallets: any[];
  setZeroWalletBalance: React.Dispatch<React.SetStateAction<string[]>>;
  value: string;
}

function BuySteps({
  selectedWallets,
  setSelectedWallets,
  allWallets,
  zeroBalanceWallets,
  setZeroWalletBalance,
  value,
}: BuyStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [side, setSide] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);

  const steps = [
    { id: 1, label: "Create Batch", done: currentStep > 1 },
    { id: 2, label: "Buy or Sell", done: currentStep > 2 },
  ];

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
        <div className="flex space-x-4 mb-4 mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center cursor-pointer relative ${
                currentStep === step.id ? "font-bold" : "text-gray-500"
              }`}
              onClick={() => {
                if (step.id === 1 ) {
               setCurrentStep(1);
                }
              }}
            >
              {currentStep === step.id ? (
                <FaDotCircle className="mr-1 text-[#249689]" />
              ) : step.done ? (
                <FaCheckCircle className="mr-1 text-green-500" />
              ) : (
                <FaDotCircle className="mr-1 text-gray-400" />
              )}
              <span>{step.label}</span>
              {/* {step.id === 2 && alert && (
                <span className="absolute left-0 top-5 bottom-0 mb-2 p-2 bg-black text-[#249689] text-xs rounded-lg text-center">
                  Create a batch to continue!!
                </span>
              )} */}
            </div>
          ))}
        </div>
        {currentStep === 1 && (
          <div>
            <CreateBatch
              selectedWallets={selectedWallets}
              setSelectedWallets={setSelectedWallets}
              allWallets={allWallets}
              zeroBalanceWallets={zeroBalanceWallets}
              setZeroWalletBalance={setZeroWalletBalance}
              onNextStep={handleNextStep}
              setSide={setSide}
              setPoolId={setPoolId}
              poolId={poolId}
              value={value}
            />
          </div>
        )}
        {currentStep === 2 && (
          <BuyOrSell
            onPreviousStep={handlePreviousStep}
            side={side}
            poolId={poolId}
          />
        )}
    </div>
  );
}

export default BuySteps;
