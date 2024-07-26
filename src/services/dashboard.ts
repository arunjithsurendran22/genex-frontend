import { ApiResponse } from "../types/global";
import api from "@utils/apiConfig";
import { AxiosResponse } from "axios";

export const withdrawApi = async (
  payload: any
): Promise<ApiResponse<any> | any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      "/v1/api/users/wallet/transactions/withdraw-solana",
      payload
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
