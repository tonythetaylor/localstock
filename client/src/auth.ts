import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/state/api';
import bcrypt from 'bcrypt';
import axios from 'axios'

async function getUser(phone: string, password: string): Promise<User | undefined> {
  try {
    const response = await axios.post(`http://localhost:8000/auth/login`, {phone: phone, password: password}).then((res) =>{
       console.log(res.data)
       return res.data
    }).catch(function (error) {
      console.log("[ERROR] ", error);
  });;
   
    return response;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("DEBUG : ", credentials)
        const parsedCredentials = z
          .object({ phone: z.string(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { phone, password } = parsedCredentials.data;
          const user = await getUser(phone, password);
          if (!user) return null;
          console.log('USER PASSWORD', user.accessToken)
          // const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (user.accessToken) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});