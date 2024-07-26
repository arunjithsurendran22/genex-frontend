import api from "@utils/apiConfig";
import { AxiosResponse } from "axios";

// export const withdrawApi = async (
//     payload: any
//   ): Promise<ApiResponse<any> | any> => {
//     try {
//       const response = await api.post<ApiResponse<any>>(
//         "/v1/api/users/wallet/transactions/withdraw-solana",
//         payload
//       );
  
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   };
export const withdreawApi = async (payload: any) => {
    try {
      const response: AxiosResponse<any> = await api.post(
        `/v1/api/users/wallet/transactions/withdraw-solana`,
       payload
      );
      return response;
    } catch (error) {
      console.error("Failed to withdraw:", error);
      throw new Error("Failed to withdraw");
    }
  };
  
  