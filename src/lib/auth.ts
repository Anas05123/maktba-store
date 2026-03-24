import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/lib/env";

const demoAdminEmail = env.DEMO_ADMIN_EMAIL ?? "admin@maktba.tn";
const demoAdminPassword = env.DEMO_ADMIN_PASSWORD ?? "ChangeMe123!";
const authSecret =
  env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production"
    ? "maktba-dev-secret-change-me"
    : undefined);

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/account",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        if (
          credentials.email === demoAdminEmail &&
          credentials.password === demoAdminPassword
        ) {
          return {
            id: "demo-admin",
            email: demoAdminEmail,
            name: "Maktba Admin",
            role: "ADMIN",
          };
        }

        if (
          credentials.email === "manager@maktba.tn" &&
          credentials.password === "Manager123!"
        ) {
          return {
            id: "demo-manager",
            email: "manager@maktba.tn",
            name: "Operations Manager",
            role: "MANAGER",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "demo-user";
        session.user.role = (token.role as string | undefined) ?? "CUSTOMER";
      }
      return session;
    },
  },
  ...(authSecret ? { secret: authSecret } : {}),
};
