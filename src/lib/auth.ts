import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

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
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 8,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
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

        const normalizedEmail = credentials.email.trim().toLowerCase();

        if (
          normalizedEmail === demoAdminEmail &&
          credentials.password === demoAdminPassword
        ) {
          return {
            id: "demo-admin",
            email: demoAdminEmail,
            name: "Maktba Admin",
            role: "ADMIN",
            customerId: null,
          };
        }

        if (
          normalizedEmail === "manager@maktba.tn" &&
          credentials.password === "Manager123!"
        ) {
          return {
            id: "demo-manager",
            email: "manager@maktba.tn",
            name: "Operations Manager",
            role: "MANAGER",
            customerId: null,
          };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { role: true },
          });

          if (!user?.passwordHash || !user.isActive) {
            return null;
          }

          const isValid = await compare(credentials.password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.key,
            customerId: user.customerId,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
        token.customerId = (user as { customerId?: string | null }).customerId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "demo-user";
        session.user.role = (token.role as string | undefined) ?? "CUSTOMER";
        session.user.customerId = (token.customerId as string | null | undefined) ?? null;
      }
      return session;
    },
  },
  ...(authSecret ? { secret: authSecret } : {}),
};
