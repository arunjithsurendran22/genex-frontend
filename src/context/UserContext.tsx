"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { initial } from "@services/user"; // assuming this is the API call to get user data?

interface User {
  _id: string;
  name: string;
  email: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MasterWallet {
  balance: number;
  isActive: boolean;
  isDeleted: boolean;
  public_key: string;
  updatedAt: string;
  user: string;
  _id: string;
}

interface UserContextType {
  loader: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  masterWallet: MasterWallet | null | any;
  setMasterWallet: (wallet: MasterWallet | null) => void;
  masterWalletId: string | undefined;
  balance: number;
  projectCount: number;
  setProjectCount: (count: number) => void;
  walletsCount: number;
  setWalletsCount: (count: number) => void;
  totalVolumeAmount: number;
  setTotalVolumeAmount: (amount: number) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loadingBalance: boolean;
  loadingProjectCount: boolean;
  loadingWalletsCount: boolean;
  loadingTotalVolumeAmount: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loader, setLoader] = useState(false);
  const [masterWallet, setMasterWallet] = useState<MasterWallet | null>(null);
  const [masterWalletId, setMasterWalletId] = useState<string | undefined>(
    undefined
  );
  const [balance, setBalance] = useState<number>(0);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [walletsCount, setWalletsCount] = useState<number>(0);
  const [totalVolumeAmount, setTotalVolumeAmount] = useState<number>(0);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingProjectCount, setLoadingProjectCount] = useState(true);
  const [loadingWalletsCount, setLoadingWalletsCount] = useState(true);
  const [loadingTotalVolumeAmount, setLoadingTotalVolumeAmount] =
    useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoader(true);
      try {
        const data = await initial();
        setUser(data?.findUser);
        setMasterWallet(data?.masterWallet);
        setMasterWalletId(data?.masterWallet?._id);
        setBalance(data?.masterWallet?.balance);
        setLoadingBalance(false);
        setProjectCount(data?.projectCount);
        setLoadingProjectCount(false);
        setWalletsCount(data?.walletsCount);
        setLoadingWalletsCount(false);
        setTotalVolumeAmount(data?.totalVolumeAmount);
        setLoadingTotalVolumeAmount(false);
        localStorage.setItem("masterWalletId", data?.masterWallet?._id);
        localStorage.setItem(
          "masterWallet",
          JSON.stringify(data?.masterWallet)
        );
        setLoader(false);
      } catch (error) {
        console.error("Failed to fetch initial data?:", error);
      } finally {
        setLoader(false);
        setLoadingBalance(false);
        setLoadingProjectCount(false);
        setLoadingWalletsCount(false);
        setLoadingTotalVolumeAmount(false);
      }
    };
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
    fetchInitialData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loader,
        user,
        setUser,
        masterWallet,
        setMasterWallet,
        masterWalletId,
        balance,
        projectCount,
        setProjectCount,
        walletsCount,
        setWalletsCount,
        totalVolumeAmount,
        setTotalVolumeAmount,
        accessToken,
        setAccessToken,
        loadingBalance,
        loadingProjectCount,
        loadingWalletsCount,
        loadingTotalVolumeAmount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
