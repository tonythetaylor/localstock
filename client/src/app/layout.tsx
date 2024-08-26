import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./(dashboard)/dashboardWrapper";
// import { SigninForm } from "../(components)/SignInForm";
import { SessionProvider } from "next-auth/react"
// import { auth } from "@/auth";
import { auth } from "@/auth"
import { redirect } from 'next/navigation';
import Dashboard from "./page";

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
    const session = await auth()
    // console.log("SESSION: ", session)  
    // if (!session) {
    //   redirect('/login');
    // }
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                {/* <DashboardWrapper>{children}</DashboardWrapper> */}
            </body>
        </html>
    );
}
