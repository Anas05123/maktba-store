import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN",
    },
    pages: {
      signIn: "/account",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
