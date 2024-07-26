import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: { duration: 0.1 },
    },
  };

  const modalVariants = {
    hidden: { scale: 0.75, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 20,
      },
    },
    exit: {
      scale: 0.75,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 20,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 w-full h-screen p-5 "
          aria-hidden={!isOpen}
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-transparent"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          ></motion.div>
          <motion.div
            className="relative bg-bgBlack p-4 rounded-3xl border border-gray-800 shadow-md shadow-black  "
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="modal-title" className="text-lg font-semibold text-white">
                {title}
              </h2>
              <button
                className="p-2 text-4xl text-gray-500 hover:text-gray-300"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
