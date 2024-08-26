// import { SignInPage } from "./form"

import { SignupForm } from "../(components)/SignUpForm";
import StoreProvider from "../redux";

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LoginForm from "./form";

export default async  function SignIn() {
    const session = await auth()
    // console.log('login page ', session)
  
    if (session) {
      redirect("/dashboard")
    }
    return (
        // <StoreProvider>
            <LoginForm />
        // </StoreProvider>
    )
}

