import { ApiResponse } from "../types/global";
import api from "@utils/apiConfig";

export const transactionHistory = async (params: any): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `/v1/api/users/wallet/transactions/all`,
      { params }
    );
    return response;
  } catch (error) {
    console.log("failed");
  }
};

export const transactionHistorySingle = async (id: string |undefined): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `/v1/api/users/wallet/transactions/single/${id}`
    );
    return response;
  } catch (error) {
    console.log("failed");
  }
};
