"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type User,
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
} from "@/lib/auth"

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
        if (isAuthenticated()) {
          const response = await getCurrentUser()
          setUser(response.data.user)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        removeAuthToken()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiLogin({ email, password })

      setAuthToken(response.data.token)
      setUser(response.data.user)
      setIsLoggedIn(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone?: string
    password: string
    password_confirmation: string
  }) => {
    try {
      setIsLoading(true)
      const response = await apiRegister(userData)

      setAuthToken(response.data.token)
      setUser(response.data.user)
      setIsLoggedIn(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    removeAuthToken()
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
