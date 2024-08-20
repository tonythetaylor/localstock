"use client";

import LoginForm from "@/app/(components)/LoginForm";
// import { FcGoogle } from "react-icons/fc";
import { useTransition, useState } from "react";
// import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
// import { handleEmailSignIn } from "@/src/lib/auth/emailSignInServerAction";
// import LoginGithub from "@/components/LoginGithub";
import React from "react";

export const SignInPage: React.FC = () => {
    return (
        <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Sign in</h1>
        <LoginForm />
        {/* <LoginGithub /> */}
      </section>
    </div>
        )
};