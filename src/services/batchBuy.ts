import axios, { AxiosResponse } from "axios";
import api from "@utils/apiConfig";
import { ApiError, ApiResponse, query } from "../types/global";

export const batchBuy = async (masterWalletId: string, params: query) => {
  try {
    const response: AxiosResponse<ApiResponse<any[]>> = await api.get(
      `/v1/api/users/wallets/worker/all/worker-wallets/${masterWalletId}`,
      {
        params,
      }
    );
    return response
  } catch (error) {
    console.error("Failed to fetch workerWallet list:", error);
    throw new Error("Failed to fetch workerWallet list");
  }
};

export const createPoolApi = async (payload: any): Promise<ApiResponse<any> | any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      "/v1/api/users/pool/create",
      payload
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};


export const bulkBatchBuy = async (payload: any): Promise<ApiResponse<any> | any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      "v1/api/users/wallets/swap/bulk-buy-sell",
      payload
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};



export const transferSolenaToWorker = async (
  payload: any
): Promise<ApiResponse<any> | any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      "v1/api/users/wallets/swap/transfer-solana",
      payload
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const transferSolenaToMaster = async (
  payload: any
): Promise<ApiResponse<any> | any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      "v1/api/users/wallet/transactions/workerToMasterwallet",
      payload
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const batchListApi = async () => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.get(
      `/v1/api/users/pool/all`
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch pool list:", error);
    throw new Error("Failed to fetch pool list");
  }
};