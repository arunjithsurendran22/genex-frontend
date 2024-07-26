import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "solspec",
  description: "solspec",
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "default-client-id";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId="382712536940-rgtoe9ebj08uv74fsl72d88lmvo60oqc.apps.googleusercontent.com">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
