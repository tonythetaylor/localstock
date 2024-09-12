'use server';
 
// import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signIn, signOut } from "@/auth"
import { db } from "@/lib/db"
import { user } from "@/lib/schema"
import { RegisterSchema } from "@/schemas/register-schema"
import axios from 'axios'
import bcryptjs from "bcryptjs"

// ...

export async function getUserFromDb(phone: string, password: string) {
  try {
    const response = await axios.post(`http://localhost:8000/auth/register`, {phone: phone, password: password}).then((res) =>{
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
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {

  // console.log("FORM DATA", formData)
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
    phone: string,
    password: string,
    confirmPassword: string
    
  )
 {
  try {
    RegisterSchema.parse({
      phone,
      password,
      confirmPassword,
    })
    // get user from db
    const existedUser = await getUserFromDb(phone, password)
    if (existedUser.success) {
      return {
        success: false,
        message: "User already exists.",
      }
    }
    const hash = await bcryptjs.hash(password, 10)

    const [insertedUser] = await db
      .insert(user)
      .values({
        phone,
        password: hash,
      })
      .returning({
        userId: user.userId,
        phone: user.phone,
      })

    return {
      success: true,
      data: insertedUser,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

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