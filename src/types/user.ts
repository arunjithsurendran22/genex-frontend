export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponse {
  response: {
    user: {
      _id: string;
      name: string;
      email: string;
      isDeleted: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      otp: number;
    };
    masterWallet: {
      _id: string;
      user: string;
      public_key: string;
      balance: number;
      isDeleted: boolean;
      isActive: boolean;
      updatedAt: string;
    };
  };
  accessToken: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      isDeleted: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      otp: number;
    };
    masterWallet: {
      _id: string;
      user: string;
      public_key: string;
      balance: number;
      isDeleted: boolean;
      isActive: boolean;
      updatedAt: string;
    };
    token: string;
  };
  token: string;
}
export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
