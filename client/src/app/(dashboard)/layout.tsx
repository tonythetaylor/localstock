import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { Suspense } from "react";
import Loading from "../loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LocalStock",
  description: "Personal item invetory",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardWrapper>
        {children}
      </DashboardWrapper>
  );
}
