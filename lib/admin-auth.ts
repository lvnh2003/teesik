import { getAuthToken, getCurrentUser } from "./auth"
import { redirect } from "next/navigation"
import { getCookie } from "cookies-next"
// Check if user is admin
export async function checkAdminRole(): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) return false

    const response = await getCurrentUser()
    
    return response.data.user.role === "admin"
  } catch (error) {
    return false
  }
}

// Admin auth middleware for client components
export function useAdminAuth() {
  const checkAuth = async () => {
    const token = getCookie("auth_token")
    if (!token) {
      window.location.href = "/admin/login"
    }
  }

  return { checkAuth }
}
