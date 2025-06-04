"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "./app-context"

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, markNotificationRead } = useAppContext()

  const notificationItems = [
    {
      id: 1,
      title: "New patient registered",
      message: "Emily Johnson has completed registration",
      time: "2 minutes ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Lab results ready",
      message: "Blood work results for patient #P-1236 are ready for review",
      time: "15 minutes ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "Appointment reminder",
      message: "Dr. Wilson has 3 appointments scheduled in the next hour",
      time: "30 minutes ago",
      type: "warning",
      read: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const handleMarkAsRead = (id: number) => {
    markNotificationRead()
  }

  return (
    <div className="relative">
      <Button variant="outline" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {notifications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {notifications}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notificationItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!item.read ? "bg-purple-50" : ""}`}
                  onClick={() => handleMarkAsRead(item.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(item.type)}</div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{item.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{item.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 text-center border-t">
              <Button variant="link" size="sm" className="text-purple-600 text-xs">
                View all notifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
