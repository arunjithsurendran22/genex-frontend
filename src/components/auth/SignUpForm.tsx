"use client";
import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import Link from "next/link";
import { signUp } from "@services/user";
import { SignUpData } from "../../types/user";
import InputBox from "@common/InputBox";
import Button from "@common/Button";
import { useRouter } from "next/navigation";
import { BsLink } from "react-icons/bs";

const SignUpForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      return;
    }

    try {
      const data: SignUpData = { name, email, password, confirmPassword };
      const response = await signUp(data);

      if (response) {
        toast.success("Sign up successful! Redirecting to sign-in page...");
        router.push("/");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to sign up:", error);
      toast.error("Failed to sign up. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errorsCopy = { ...errors };

    if (!name) {
      errorsCopy.name = "Name is required.";
      isValid = false;
    } else {
      errorsCopy.name = "";
    }

    if (!email) {
      errorsCopy.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorsCopy.email = "Invalid email format.";
      isValid = false;
    } else {
      errorsCopy.email = "";
    }

    if (!password) {
      errorsCopy.password = "Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      errorsCopy.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      errorsCopy.password =
        "Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*).";
      isValid = false;
    } else {
      errorsCopy.password = "";
    }

    if (password !== confirmPassword) {
      errorsCopy.confirmPassword = "Passwords do not match.";
      isValid = false;
    } else {
      errorsCopy.confirmPassword = "";
    }

    setErrors(errorsCopy);

    // Clear errors after 1 second (optional)
    setTimeout(() => {
      setErrors({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }, 1000);

    return isValid;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="  p-8 shadow-lg shadow-black rounded-3xl border-gray-800 border bg-bgBlack w-[28rem] ">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Sign Up
        </h2>
        <div className="mt-10 flex flex-col justify-between">
          <form onSubmit={handleSubmit}>
            <div>
              <InputBox
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2"
              />
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mt-4">
              <InputBox
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2"
              />
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mt-4">
              <InputBox
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2"
              />
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mt-4">
              <InputBox
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="mt-14">
              <button
                type="submit"
                color="primary"
                className={`w-full text-white py-2 rounded-full hover:bg-blue-900 transition duration-200 shadow-lg hover:shadow-xl ${
                  loading ? "opacity-50 cursor-not-allowed" : "bg-primary"
                }`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
              <p className="mt-6 text-center text-gray-400">
                Already have an account?{" "}
                <Link href="/" className="text-blue-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
