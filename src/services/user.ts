import { SignInData, SignInResponse, SignUpData } from "../types/user";
import api from "@utils/apiConfig";

export const signIn = async (data: SignInData): Promise<SignInResponse> => {
  try {
    const response = await api.post<SignInResponse>(
      "/v1/api/users/login",
      data
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to sign in");
  }
};

export const signUp = async (data: SignUpData) => {
  try {
    const response = await api.post<SignInResponse>(
      "/v1/api/users/signup",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to sign up");
  }
};

export const initial = async (): Promise<any> => {
  try {
    const response = await api.get("/v1/api/users/initial");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch initial data");
  }
};

export const googleSignIn = async (params: { name: string; email: string }) => {
  try {
    const response = await api.post<SignInResponse>(
      "/v1/api/users/email-login",
      params 
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to sign in");
  }
};

