import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { SigninForm } from "./(components)/SignInForm";
import { SessionProvider } from "next-auth/react"
import DashboardWrapper from "./(dashboard)/dashboardWrapper";
import { Suspense } from "react";
import Loading from "./loading";
import SessionWrapper from "./(components)/SessionWrapper/SessionWrapper";
// import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LocalStock",
  description: "Personal item invetory",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
             
        {/* <DashboardWrapper>{children}</DashboardWrapper> */}
      </body>
    </html>
  );
}