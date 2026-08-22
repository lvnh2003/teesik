import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function redirectToAdminLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login/", request.url)
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`)

  const redirect = NextResponse.redirect(loginUrl)
  redirect.cookies.delete({
    name: "auth_token",
    path: "/",
  })

  return redirect
}

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/"

  // Check if the path is for admin routes
  if (path.startsWith("/admin") && path !== "/admin/login") {
    // Get the token from cookies
    const token = request.cookies.get("auth_token")?.value

    // If there's no token, redirect to login
    if (!token) {
      return redirectToAdminLogin(request)
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    try {
      const response = await fetch(`${apiUrl}/v1/admin/check`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Origin-Verify": "teesik",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        return redirectToAdminLogin(request)
      }
    } catch {
      return redirectToAdminLogin(request)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
