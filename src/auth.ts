import NextAuth from "next-auth"
import { CredentialsProvider } from "./app/auth.config"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
  interface User {
    accessToken?: string
  }
  interface JWT {
    accessToken?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider,
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user?.accessToken || 'dummy-token';
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
})