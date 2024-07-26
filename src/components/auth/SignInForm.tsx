"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { googleSignIn, signIn } from "@services/user";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "@context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import InputBox from "@common/InputBox";
import Loader from "@common/Loader";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const data = { email, password };
      const response = await signIn(data);

      localStorage.setItem("accessToken", response.accessToken);
      if (response) {
        login();
        router.push("/home");
        setLoading(false);
        toast.success("Sign in successful!");
        const user = response.response.user;
        const masterWallet = response.response.masterWallet;
        console.log("masterWallet", masterWallet);
        const masterWalletId = response.response.masterWallet._id;
        localStorage.setItem("masterWalletId", masterWalletId);
        localStorage.setItem("masterWallet", JSON.stringify(masterWallet)); // Store as JSON string
        localStorage.setItem("user", JSON.stringify(user)); // Store as JSON string
      }
    } catch (error) {
      toast.error("Invalid credentials or network error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
      setTimeout(() => setEmailError(""), 1000);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
      setTimeout(() => setEmailError(""), 1000);
    } else if (
      !email.toLowerCase().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    ) {
      setEmailError("Email must be in lowercase letters and valid format");
      isValid = false;
      setTimeout(() => setEmailError(""), 1000);
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
      setTimeout(() => setPasswordError(""), 1000);
    } else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)"
      );
      isValid = false;
      setTimeout(() => setPasswordError(""), 1000);
    }
    return isValid;
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const token = tokenResponse.access_token;
        // Fetch user info from Google API
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;
        const picture = userInfo.picture;

        const { name, email } = userInfo;
        if (!name || !email) {
          throw new Error("Name and email are required");
        }
        const response = await googleSignIn({ name, email });

        if (response) {
          // Store tokens in localStorage
          localStorage.setItem("accessToken", response.token);
          // Store user and master wallet details
          const user = response.data.user;
          const masterWallet = response.data.masterWallet;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("masterWalletId", masterWallet._id);
          localStorage.setItem("masterWallet", JSON.stringify(masterWallet));
          login();
          router.push("/home");
          setLoading(false);
          toast.success("Sign in successful!");
        }
      } catch (error) {
        console.error("Google sign in failed", error);
        toast.error("Google sign in failed");
      }
    },
    onError: () => {
      toast.error("Google sign in failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="py-10 px-8 shadow-lg shadow-black rounded-3xl border-gray-800 border bg-bgBlack w-[28rem]">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="mt-10">
          <div>
            <InputBox
              type="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          <div className="mt-4">
            <InputBox
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2"
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>
          <div className="mt-14">
            <button
              type="submit"
              color="primary"
              className={`w-full text-white py-2 rounded-full hover:bg-blue-900 transition duration-200 shadow-lg hover:shadow-xl ${
                loading ? "opacity-50 cursor-not-allowed" : "bg-primary"
              } flex items-center justify-center`}
              disabled={loading}
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </div>
        </form>
        <div>
          <button
            onClick={() => googleLogin()}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-full flex items-center justify-center hover:bg-red-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>
          <p className="mt-6 text-center text-gray-400">
            {"Don't have an account?"}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
