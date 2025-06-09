"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface HydrationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function HydrationWrapper({ children, fallback = null }: HydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
