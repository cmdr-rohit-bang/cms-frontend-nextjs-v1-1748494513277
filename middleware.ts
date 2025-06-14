import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define root (main) domains here
const MAIN_DOMAINS = [
  "cms-v1-theta.vercel.app",
  "localhost:3001",
  "127.0.0.1:3001"
];

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle main domains
  if (MAIN_DOMAINS.includes(host)) {
    // Admin protection
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      if (token.role !== "super_admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // Handle subdomains (*.initcoders.in or *.localhost:3001)
  const isSubdomain = host.endsWith(".initcoders.in") || host.endsWith(".localhost:3001");
  if (isSubdomain) {
    let subdomain;
    if (host.endsWith(".initcoders.in")) {
      subdomain = host.replace(".initcoders.in", "");
    } else {
      subdomain = host.replace(".localhost:3001", "");
    }

    // Skip www subdomain
    if (!subdomain || subdomain === "www") {
      return NextResponse.next();
    }

    // Admin protection for tenant
    if (pathname.startsWith("/admin")) {
      if (!token) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(new URL(`/?callbackUrl=${callbackUrl}`, request.url));
      }

      if (!["owner", "manager", "admin", "editor"].includes(token.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Redirect authenticated users to dashboard
    if (pathname === "/" && token && ["owner", "manager", "admin", "editor"].includes(token.role)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if( pathname.startsWith("/admin/users") && token?.role !== "owner") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Rewrite subdomain requests to the appropriate path
    const rewrittenPath = `/s/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
