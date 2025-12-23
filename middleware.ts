import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";

/**
 * Global auth/authorization middleware.
 *
 * - Runs on every request that matches the `config.matcher` paths.
 * - Allows access to admin routes only if `userType === "admin"`.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as JWT | null;
    console.log('TTTTTT___TTTTTTT', token)
    console.log('userType_userType', token?.userType)
    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname.startsWith("/admin");

    console.log('SSSSSSS_SSSSS', pathname)

    // If this is an admin route, ensure the user is an admin.
    if (isAdminRoute) {
      if (!token || token.userType !== "admin") {
        const signInUrl = new URL("/signin", req.url);
        return NextResponse.redirect(signInUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      /**
       * This runs before our middleware function and decides whether the
       * user is at least authenticated for the matched routes.
       * We return true if there is a token; detailed checks happen above.
       */
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

/**
 * Only run this middleware for admin URLs.
 * You can add more patterns here (e.g. "/dashboard/:path*") if needed.
 */
export const config = {
  matcher: ["/admin/:path*"],
};


