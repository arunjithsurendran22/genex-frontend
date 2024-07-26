import axios, { AxiosResponse } from "axios";
import api from "@utils/apiConfig";
import { ApiError, ApiResponse, ProjectType, query } from "../types/global";

export const fetchProjectsService = async (params: query) => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await api.get(
      `/v1/api/users/projects/all`,
      {
        params,
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

export const addProjectsService = async (payload: ProjectType) => {
  try {
    const response: AxiosResponse<any> = await api.post(
      `/v1/api/users/wallets/worker/create-project`,
     payload
    );
    return response;
  } catch (error) {
    console.error("Failed to create projects:", error);
    throw new Error("Failed to create projects");
  }
};


export const verifyTokenService = async (token: string) => {
  try {
    const response: AxiosResponse<any> = await api.post(
      `/v1/api/users/projects/verify-token`,
     token
    );
    return response;
  } catch (error) {
    console.error("Failed to verify token:", error);
    throw new Error("Failed to verify token");
  }
};

