import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { mainConfigurations } from "./src/configurations/mainConfigurations";

// Interface to define our route protection rules
interface ProtectedRouteConfig {
  path: string;
  roles?: string[];
}

// This middleware runs on the edge and handles authentication
export function middleware(request: NextRequest) {
  // Get the cookies from the request
  const bitUserCookie = request.cookies.get("bitUser");
  const bitUserDataCookie = request.cookies.get("bitUserData");
  const url = request.nextUrl.clone();

  // Define protected routes with role requirements
  const protectedRoutes: ProtectedRouteConfig[] = [
    { path: "/" },
    { path: "/greetings" },
    {
      path: "/account/my-account",
      roles: [
        mainConfigurations.user.roles.user,
        mainConfigurations.user.roles.admin,
      ],
    },
    {
      path: "/clients",
      roles: [
        mainConfigurations.user.roles.user,
        mainConfigurations.user.roles.admin,
      ],
    },
    {
      path: "/offers",
      roles: [
        mainConfigurations.user.roles.user,
        mainConfigurations.user.roles.admin,
      ],
    },
    {
      path: "/offers/new-offer",
      roles: [mainConfigurations.user.roles.user],
    },
    {
      path: "/products",
      roles: [
        mainConfigurations.user.roles.user,
        mainConfigurations.user.roles.admin,
      ],
    },
    {
      path: "/products/new-product",
      roles: [mainConfigurations.user.roles.admin],
    },
    {
      path: "/meetings",
      roles: [
        mainConfigurations.user.roles.user,
        mainConfigurations.user.roles.admin,
      ],
    },
  ];

  // Find if current path matches a protected route configuration
  const matchedRoute = protectedRoutes.find(
    (route) =>
      request.nextUrl.pathname === route.path ||
      request.nextUrl.pathname.startsWith(`${route.path}/`)
  );

  // If it's a protected route
  if (matchedRoute) {
    // No auth token, redirect to login
    if (!bitUserCookie) {
      url.pathname = "/login";
      // Add a redirect parameter to return to the original page after login
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check role authorization if roles are specified for the route
    if (
      matchedRoute.roles &&
      matchedRoute.roles.length > 0 &&
      bitUserDataCookie
    ) {
      try {
        // Parse user data from cookie
        const userData = JSON.parse(bitUserDataCookie.value);
        const userRoles = userData.user_roles || [];

        // Check if user has any of the required roles
        const hasRequiredRole = matchedRoute.roles.some((role) =>
          userRoles.includes(role)
        );

        // If not authorized, redirect to unauthorized page
        if (!hasRequiredRole) {
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      } catch (error) {
        // If there's an error parsing the cookie (corrupted, etc.)
        console.error("Error parsing user data cookie:", error);
        // Clear cookies and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("bitUser");
        response.cookies.delete("bitUserData");
        return response;
      }
    }
  }

  // If it's the login page and the user is already logged in, redirect to home
  if (
    (url.pathname === "/login" || url.pathname === "/register") &&
    bitUserCookie
  ) {
    // Check if there's a redirect parameter
    const redirectTo = url.searchParams.get("redirectTo") || "/";
    url.pathname = redirectTo;
    // Clean up the URL by removing the redirectTo parameter
    url.searchParams.delete("redirectTo");
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
     * - api routes (API endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.webp|api).*)",
  ],
};
