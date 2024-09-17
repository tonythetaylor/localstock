import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        // authorized({ auth, request: { nextUrl } }) {
        //   const isLoggedIn = !!auth?.user;
        //   const isOnDashboard = nextUrl.pathname.startsWith('/');
        //   if (isOnDashboard) {
        //     if (isLoggedIn) return true;
        //     return false; // Redirect unauthenticated users to login page
        //   } else if (isLoggedIn) {
        //     return Response.redirect(new URL('/', nextUrl));
        //   }
        //   return true;
        // },
        async jwt({ token, user, account, session }) {
          if (account?.provider === "credentials") {
            token.credentials = true
          }
          return token
        },
      },
    secret: process.env.AUTH_TOKEN,
    providers: []
} satisfies NextAuthConfig