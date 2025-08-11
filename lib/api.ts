import { getAuthToken } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
export async function apiRequestAdmin<T>(
    endpoint: string,
    method = "GET",
    data?: unknown,
    customHeaders: Record<string, string> = {},
  ): Promise<T> {
    const token = getAuthToken()
  
    if (!token) {
      throw new Error("Authentication required")
    }
  
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...customHeaders,
    }
  
    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }
  
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const responseData = await response.json()
  
    if (!response.ok) {
      throw new Error(responseData.message || `API request failed with status ${response.status}`)
    }
  
    return responseData
  }


export async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: unknown,
  customHeaders: Record<string, string> = {},
): Promise<T> {

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.message || `API request failed with status ${response.status}`)
  }

  return responseData
}