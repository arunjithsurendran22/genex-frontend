export interface WorkerListSingleProps {
  id: string | null;
}

export interface WalletData {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  public_key: string;
  balance: number;
  trade: boolean;
  contract_token: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  master_wallet: {
    _id: string;
    public_key: string;
    balance: number;
    updatedAt: string;
  };
}

export interface TransactionData {
  _id: string;
  amount: number;
  amountPerWallet: number;
  boosterInterval: string;
  createdAt: string;
  master_wallet: string;
  signature: string;
  signature_status: string;
  slippagePctg: number;
  token_address: string;
  tradesPerInterval: string;
  type: string;
  updatedAt: string;
  user: string;
  worker_wallet: string;
}
