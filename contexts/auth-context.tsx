"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AuthService } from "@/services/auth"
import type { User } from "@/type"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    phone?: string
    password: string
    password_confirmation: string
  }) => Promise<void>
  updateProfile: (data: { name: string; phone?: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const response = await AuthService.getCurrentUser()
          setUser(response.data.user)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        AuthService.removeAuthToken()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await AuthService.login({ email, password })

      AuthService.setAuthToken(response.data.token)
      setUser(response.data.user)
      setIsLoggedIn(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await AuthService.register(userData)

      AuthService.setAuthToken(response.data.token)
      setUser(response.data.user)
      setIsLoggedIn(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: { name: string; phone?: string }) => {
    try {
      const response = await AuthService.updateProfile(data)
      setUser(response.data)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    AuthService.removeAuthToken()
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
