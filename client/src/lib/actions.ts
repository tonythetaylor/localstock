'use server';
 
// import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signIn, signOut } from "@/auth"

// ...
 
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