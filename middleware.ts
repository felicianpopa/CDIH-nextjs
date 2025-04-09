import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware runs on the edge and handles authentication
export function middleware(request: NextRequest) {
  // Get the cookie from the request
  const bitUserCookie = request.cookies.get("bitUser");
  const url = request.nextUrl.clone();

  // Define protected routes
  const protectedRoutes = [
    "/",
    "/greetings",
    "/account/my-account",
    "/clients",
    "/offers",
    "/offers/new-offer",
    "/products",
    "/products/new-product",
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => url.pathname === route || url.pathname.startsWith(`${route}/`)
  );

  // If it's a protected route and there's no cookie, redirect to login
  if (isProtectedRoute && !bitUserCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If it's the login page and the user is already logged in, redirect to home
  if (url.pathname === "/login" && bitUserCookie) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Specify which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.webp).*)",
  ],
};
