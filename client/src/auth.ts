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
      async authorize(credentials: any): Promise<any> {
        const { phone, password } = credentials

        const res = await getUserFromDb(phone as string, password as string)
        if (!res) return null;
        // const passwordsMatch = await bcrypt.compare(password, user.password);
        const { userId, accessToken } = res.data;
        // if (res.data.accessToken) return res.data;
        if (res.data.accessToken) {
          return {
            userId: userId,
            accessToken: accessToken,
          };
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }: any) {
      // we have to make check on user, because The arguments user, account, profile are only passed
      // the first time this callback is called on a new session, after the user signs in. In subsequent calls,
      // only token will be available.

      // here r is some random value that we want to be present in token
      if (user && user.userId) {
          token.user = user;
      }

      return token;
    },
    session({ token, session, user }: any) {
      if (session && session.user) {
        session.user = token;
      }
      return session;
    },
  },
  secret: process.env.AUTH_TOKEN,
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
