import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip middleware for auth routes and static files
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Get the user's session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle localhost:3000 (main domain - super admin routes)
  if (host === "localhost:3001" || host === "127.0.0.1:3001" ||"initcoders.in") {
    // Check if accessing admin routes
    if (pathname.startsWith("/admin")) {
      // Redirect to sign-in if not authenticated
      if (!token) {
        const callbackUrl = encodeURIComponent(
          `${request.nextUrl.pathname}${request.nextUrl.search}`
        );
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
        );
      }

      // Check if user has super admin role
      if (token.role !== "super_admin") {
        // Redirect to unauthorized page or sign-in
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    if (pathname.startsWith("/login")) {
      // If already authenticated, redirect to admin dashboard
      if (token) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    return NextResponse.next(); // Show main landing page
  }

  // Handle subdomains (demo.localhost:3000)
  const parts = host.split(".");
  if (parts.length >= 2) {
    const subdomain = parts[0];

    // Skip www subdomain
    if (subdomain === "www") {
      return NextResponse.next();
    }

    // Check if accessing admin routes on subdomain
    if (pathname.startsWith("/admin")) {
      if (!token) {
        const callbackUrl = encodeURIComponent(
          `${request.nextUrl.pathname}${request.nextUrl.search}`
        );
        return NextResponse.redirect(
          new URL(`/?callbackUrl=${callbackUrl}`, request.url)
        );
      }

      // Check if user has admin or super admin role
      if (
        token.role !== "owner" &&
        token.role !== "manager" &&
        token.role !== "admin" &&
        token.role !== "editor" 
      ) {
        // Redirect to unauthorized page
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (subdomain) {
      // If accessing root path of subdomain and user is authenticated
      if (pathname === "/" && token) {
        if (
          token.role === "owner" ||
          token.role === "manager" ||
          token.role === "admin" ||
          token.role === "editor"
        ) {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        }
      }

      if (
        (token && token.role === "owner") ||
        (token && token.role === "manager") ||
        (token && token.role === "admin") ||
        (token && token.role === "editor")
      ) {
        const rewrittenPath = `/s/${subdomain}${pathname}`;
        return NextResponse.rewrite(new URL(rewrittenPath, request.url));
      }
    }

    // Handle ticket routes redirection
    if (
      pathname.startsWith("/ticket/details") ||
      pathname.startsWith("/ticket/my-tickets") ||
      pathname.startsWith("/ticket/success")
    ) {
      return NextResponse.redirect(new URL("/ticket/new", request.url));
    }

    // Rewrite to tenant page
    const rewrittenPath = `/s/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// // Define root (main) domains here
// const MAIN_DOMAINS = ["initcoders.in", "www.initcoders.in", "localhost:3001", "127.0.0.1:3001"];

// export async function middleware(request: NextRequest) {
//   const host = request.headers.get("host") || "";
//   const pathname = request.nextUrl.pathname;

//   // Skip static files and API routes
//   if (
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon.ico")
//   ) {
//     return NextResponse.next();
//   }

//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   // ✅ 1. Handle main/root domain (initcoders.in)
//   if (MAIN_DOMAINS.includes(host)) {
//     // Admin protection
//     if (pathname.startsWith("/admin")) {
//       if (!token) {
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//       if (token.role !== "super_admin") {
//         return NextResponse.redirect(new URL("/", request.url));
//       }
//     }

//     if (pathname === "/login" && token) {
//       return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//     }

//     return NextResponse.next(); // ➡️ Allow landing page, etc.
//   }

//   // ✅ 2. Handle subdomains (like bang-ent.initcoders.in)
//   const subdomain = host.replace(".initcoders.in", "");

//   // Skip www or undefined
//   if (!subdomain || subdomain === "www") {
//     return NextResponse.next();
//   }

//   // Admin protection for tenant
//   if (pathname.startsWith("/admin")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/?callbackUrl=" + encodeURIComponent(pathname), request.url));
//     }

//     if (!["owner", "manager", "admin", "editor"].includes(token.role)) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   // Logged-in root redirection to dashboard
//   if (pathname === "/" && token && ["owner", "manager", "admin", "editor"].includes(token.role)) {
//     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//   }

//   // ✅ Rewrite all subdomain traffic to `/s/{subdomain}{original_path}`
//   const rewrittenPath = `/s/${subdomain}${pathname}`;
//   return NextResponse.rewrite(new URL(rewrittenPath, request.url));
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
// };
