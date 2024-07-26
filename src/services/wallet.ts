import { ApiResponse, query } from "../types/global";
import api from "@utils/apiConfig";

export const workerWalletListProjct = async (
  masterWalletId: string,
  params: query
): Promise<any> => {
  console.log("masterWalletId service", masterWalletId);

  try {
    const response = await api.get<ApiResponse<any>>(
      `v1/api/users/wallets/worker/all/worker-wallets/${masterWalletId}`,
      { params }
    );
    return response;
  } catch (error) {
    console.log("failed to get");
  }
};

export const workerWalletSingle = async (
  wallet_id: string
): Promise<ApiResponse<any> | any> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `/v1/api/users/wallets/worker/single/worker-wallet/${wallet_id}`
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const walletPaymentHistory = async (
  walletId: string,
  params: any
): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `/v1/api/users/wallet/transactions/worker/payment/all/${walletId}
`,
      { params }
    );
    return response;
  } catch (error) {
    console.log("failed");
  }
};

export const walletTransactions = async (
  walletId: string,
  params: any
): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `/v1/api/users/wallet/transactions/all/worker/${walletId}
`,
      { params }
    );
    return response;
  } catch (error) {
    console.log("failed");
  }
};
export const walletBuySell = async (payload: any): Promise<any> => {
  try {
    const response = await api.post(
      `/v1/api/users/wallets/swap/buy-sell`,
      payload
    );
    return response.data; // Assuming you want to return the data part of the response
  } catch (error) {
    console.error("Error in walletBuySell:", error);
    throw error; // Rethrow the error or handle it appropriately
  }
};
