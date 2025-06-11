import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes
  if (path.startsWith("/admin") && path !== "/admin/login") {
    // Get the token from cookies
    const token = request.cookies.get("auth_token")?.value

    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
