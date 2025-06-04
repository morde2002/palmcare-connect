"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AppContextType {
  notifications: number
  setNotifications: (count: number) => void
  markNotificationRead: () => void
  activePatient: any | null
  setActivePatient: (patient: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  simulateAction: (actionName: string, duration?: number) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(3)
  const [activePatient, setActivePatient] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const markNotificationRead = () => {
    if (notifications > 0) {
      setNotifications(notifications - 1)
    }
  }

  // Simulate an action with loading state
  const simulateAction = async (actionName: string, duration = 1000) => {
    setIsLoading(true)
    console.log(`Simulating: ${actionName}...`)

    await new Promise((resolve) => setTimeout(resolve, duration))

    setIsLoading(false)
    console.log(`Completed: ${actionName}`)
    return
  }

  return (
    <AppContext.Provider
      value={{
        notifications,
        setNotifications,
        markNotificationRead,
        activePatient,
        setActivePatient,
        isLoading,
        setIsLoading,
        simulateAction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
