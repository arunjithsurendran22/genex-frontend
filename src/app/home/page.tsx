// HomePage.jsx
"use client";
import React, { useState } from "react";
import Header from "@layout/Header";
import Dashboard from "@components/dashboard/Dashboard";
import HeroSection from "@components/hero/HeroSection";
import { Provider } from "react-redux";
import store from "src/redux/store";

import Footer from "@layout/Footer";
import { UserProvider } from "@context/UserContext";
import ProtectedRoute from "@components/auth/ProtectedRoute";

const HomePage = () => {
  return (
    <ProtectedRoute>
      <Provider store={store}>
        <div className="bg-primary h-screen flex flex-col justify-start ">
          <UserProvider>
            <Header />
            <Dashboard />
            <HeroSection />
            <Footer />
          </UserProvider>
        </div>
      </Provider>
    </ProtectedRoute>
  );
};

export default HomePage;
