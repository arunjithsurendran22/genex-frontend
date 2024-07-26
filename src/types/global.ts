export type ApiResponse<T> = {
  data: T;
  count: number;
  status: number;
  message: string;
  projectCount: number;
  projects: Project[];
};

export type ApiError = {
  message?: string;
  statusCode?: number;
  error?: any;
};

export type query = {
  limit?: number;
  skip?: number;
  name?: string;
  token?: string;
};

export type Wallet = {
  _id: string;
  name: string;
  balance: number;
};

export type Project = {
  _id: string;
  tokenAddress: string;
  user: string;
  token_supply: number;
  decimals: number;
  // Add other properties as needed
};

export type Transaction = {
  Amount: string;
  BTT: string;
  Minutes: string;
  statusMt: string;
};
export type ProjectType = {
  contractAccount: string;
  isKeepMinimumBalance: boolean;
  masterWalletId: string;
  userId: string;
  wallet_count: number;
};
