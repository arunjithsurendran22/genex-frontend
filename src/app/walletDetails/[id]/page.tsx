"use client";

import React from "react";
import { useParams } from "next/navigation";
import WorkerListSingle from "@components/wallet/WorkerListSingle";
import Header from "@layout/Header";
import { UserProvider } from "@context/UserContext";

const WalletDetailsPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;

  return (
    <UserProvider>
      <div className="bg-secondary h-screen ">
        <Header />
        {id && <WorkerListSingle id={id} />}
      </div>
    </UserProvider>
  );
};

export default WalletDetailsPage;
