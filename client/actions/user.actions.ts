"use server"

import { signIn, signOut } from "@/auth"
// import { db } from "@/lib/db"
import { user } from "@/lib/schema"

// import { eq } from "drizzle-orm"
import axios from 'axios'

import bcryptjs from "bcryptjs"
import { LoginSchema } from "../schemas/login-schema"
import { RegisterSchema } from "../schemas/register-schema"

export async function getUserFromDb(phone: string, password: string) {
  try {
    const response = await axios.post(`http://localhost:8000/auth/login`, {phone: phone, password: password}).then((res) =>{
    //    console.log(res.data)
       return res.data
    }).catch(function (error) {
      console.log("[ERROR] ", error);
  });;
   
  return {
    success: true,
    data: response,
  }
} catch (error: any) {
  return {
    success: false,
    message: error.message,
  }
}
}

export async function login({
  phone,
  password,
}: {
  phone: string
  password: string
}) {
  try {
    LoginSchema.parse({
      phone,
      password,
    })

    const formData = new FormData()
    formData.append("phone", phone)
    formData.append("password", password)

    const res = await signIn("credentials", {
      redirect: false,
      phone,
      password,
    })

    return {
      success: true,
      data: res,
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Phone or password is incorrect.",
    }
  }
}

export async function loginWithDiscord() {
  await signIn("discord", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
  })
}

export async function loginWithGithub() {
  await signIn("github", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
  })
}
export async function loginWithFacebook() {
  await signIn("facebook", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
  })
}

// export async function register({
//   phone,
//   password,
//   confirmPassword,
// }: {
//   phone: string
//   password: string
//   confirmPassword: string
// }) {
//   try {
//     RegisterSchema.parse({
//       phone,
//       password,
//       confirmPassword,
//     })
//     // get user from db
//     const existedUser = await getUserFromDb(phone, password)
//     if (existedUser.success) {
//       return {
//         success: false,
//         message: "User already exists.",
//       }
//     }
//     const hash = await bcryptjs.hash(password, 10)

//     const [insertedUser] = await db
//       .insert(user)
//       .values({
//         phone,
//         password: hash,
//       })
//       .returning({
//         userId: user.userId,
//         phone: user.phone,
//       })

//     return {
//       success: true,
//       data: insertedUser,
//     }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message,
//     }
//   }
// }

export async function logout() {
  try {
    await signOut({
      redirect: false,
    })
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}
