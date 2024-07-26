import React from "react";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation"; 
import toast from "react-hot-toast";

interface SidebarProps {
  onClose: () => void; // onClose function prop
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    onClose();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("masterWalletId");
    localStorage.removeItem("masterWallet");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <div className="fixed left-0 h-full w-[200px] bg-black flex flex-col justify-between">
      {/* Close button */}
      <button
        onClick={onClose}
        className="text-white hover:bg-gray-800 rounded-full p-2 absolute top-2 right-2"
      >
        <IoMdClose size={24} />
      </button>

      {/* Sidebar content */}
      <div className="mt-10 px-4">
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 w-full rounded-lg mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
