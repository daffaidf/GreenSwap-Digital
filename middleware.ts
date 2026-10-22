import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      // /admin/* hanya untuk ADMIN
      if (path.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      // /dashboard/* untuk user yang sudah login (USER maupun ADMIN)
      if (path.startsWith("/dashboard")) {
        return !!token;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
