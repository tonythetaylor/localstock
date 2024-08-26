import { DrizzleAdapter } from "@auth/drizzle-adapter"
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import { encode as defaultEncode } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import Discord from "next-auth/providers/discord"
import Facebook from "next-auth/providers/facebook"
import Github from "next-auth/providers/github"
import { v4 as uuid } from "uuid"
import { db } from "./lib/db"
import { redirect } from "next/navigation"
import { getUserFromDb } from "../actions/user.actions"

const adapter = DrizzleAdapter(db)

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  accessToken: string
}

const authConfig: NextAuthConfig = {
  // adapter,
  providers: [
    // Github({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // Facebook({
    //   clientId: process.env.FACEBOOK_ID!,
    //   clientSecret: process.env.FACEBOOK_SECRET!,
    // }),
    // Discord({
    //   clientId: process.env.DISCORD_CLIENT_ID!,
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    // }),
    Credentials({
      credentials: {
        phone: {},
        password: {},
      },
      async authorize(credentials) {
        // console.log(credentials)
        const { phone, password } = credentials

        const res = await getUserFromDb(phone as string, password as string)
        if (!res) return null;
          // console.log('USER PASSWORD', res.data.accessToken)
          // const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (res.data.accessToken) return res.data;


        return null
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // console.log('authorized : ', auth)
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
        
      }
      return true;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
  },
  secret: process.env.AUTH_TOKEN,
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
