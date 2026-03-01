import { getAuthToken, getCurrentUser } from "./auth"
import { getCookie } from "cookies-next"
// Check if user is admin
export async function checkAdminRole() {
  const token = getAuthToken()
  if (!token) return false

  try {
    const user = await getCurrentUser()
    return user.data.user.role === "admin"
  } catch {
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
