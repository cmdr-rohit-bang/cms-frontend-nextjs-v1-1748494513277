import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignIn } from "./sign-in";
import { User } from "@/types/types";


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        const user = await SignIn(
          credentials.email,
          credentials.password
          
        ) as User;

        if (!user.success == true) {
          throw new Error(user.message);
        }

        return { ...user, token: user.token, email: credentials.email,role:user.role};
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger == "update") {
        token.name = session.data.name;
        token.email = session.email;

        return token;
      }

      if (user) {
        return {
          ...token,
          token: user.token,
          email: user.email,
          name: user.data.name,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          token: token.token,
          email: token.email,
          name: token.name,
          role: token.role,
        },
      };
    },
  },
};
